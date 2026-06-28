import urllib.request
import re
from html.parser import HTMLParser

class Cafe24SearchParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []
        self.current_item = None
        self.tag_stack = []
        self.main_li_depth = None
        self.in_name_link = False
        self.in_spec_list = False
        self.in_spec_item = False
        self.name_text_chunks = []
        self.description_text_chunks = []
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        self.tag_stack.append((tag, attrs_dict))
        
        # Check for item li
        if tag == 'li' and 'id' in attrs_dict and attrs_dict['id'].startswith('anchorBoxId_'):
            self.current_item = {
                'id': attrs_dict['id'].replace('anchorBoxId_', ''),
                'data-price': attrs_dict.get('data-price', ''),
                'name': '',
                'price': 0,
                'img': '',
                'desc': '',
                'link': ''
            }
            self.main_li_depth = len(self.tag_stack)
            self.items.append(self.current_item)
            
        if self.current_item:
            # Check for thumbnail / images
            # JS uses: img[id^="eListPrdImage"], img.thumb, .normal_thumb img
            is_valid_img = False
            if tag == 'img' and 'src' in attrs_dict:
                img_id = attrs_dict.get('id', '')
                img_class = attrs_dict.get('class', '')
                src_val = attrs_dict['src']
                
                # Check selector conditions
                if img_id.startswith('eListPrdImage'):
                    is_valid_img = True
                elif img_class == 'thumb':
                    is_valid_img = True
                elif len(self.tag_stack) >= 2 and self.tag_stack[-2][0] == 'div' and 'normal_thumb' in self.tag_stack[-2][1].get('class', ''):
                    is_valid_img = True
                
                # Filter out blank placeholders
                if is_valid_img and 'blank.png' not in src_val and src_val != '':
                    self.current_item['img'] = src_val

            # Check for mobile image under thumbnail / discount_rate
            if tag == 'div' and 'discount_rate' in attrs_dict.get('class', ''):
                self.current_item['data-sale'] = attrs_dict.get('data-sale', '')
                
            # Check for name link
            if tag == 'p' and 'name' in attrs_dict.get('class', ''):
                pass
            elif tag == 'a' and len(self.tag_stack) >= 2:
                parent_tag, parent_attrs = self.tag_stack[-2]
                if parent_tag == 'p' and 'name' in parent_attrs.get('class', ''):
                    self.in_name_link = True
                    self.name_text_chunks = []
                    self.current_item['link'] = attrs_dict.get('href', '')
                
            # Check for spec description
            if tag == 'ul' and any(c in attrs_dict.get('class', '') for c in ['spec', 'xans-search-listitem']):
                self.in_spec_list = True
            elif tag == 'li' and self.in_spec_list:
                self.in_spec_item = True
                self.description_text_chunks = []

    def handle_data(self, data):
        if self.in_name_link:
            self.name_text_chunks.append(data)
        if self.in_spec_item:
            self.description_text_chunks.append(data)

    def handle_endtag(self, tag):
        # We need to know stack depth before pop for closing matching
        stack_depth_before = len(self.tag_stack)
        if self.tag_stack:
            self.tag_stack.pop()
            
        if tag == 'a' and self.in_name_link:
            self.in_name_link = False
            if self.current_item:
                full_name = "".join(self.name_text_chunks).strip()
                # Clean prefix title (e.g. "상품명 : ")
                full_name = re.sub(r'^상품명\s*:\s*', '', full_name)
                full_name = re.sub(r'^:\s*', '', full_name)
                self.current_item['name'] = full_name.strip()
                
        if tag == 'li' and self.in_spec_item:
            self.in_spec_item = False
            if self.current_item and not self.current_item['desc']:
                full_desc = "".join(self.description_text_chunks).strip()
                full_desc = re.sub(r'^상품\s*간략설명\s*:\s*', '', full_desc)
                full_desc = re.sub(r'^:\s*', '', full_desc)
                self.current_item['desc'] = full_desc.strip()
                
        if tag == 'ul' and self.in_spec_list:
            self.in_spec_list = False
            
        if tag == 'li' and self.current_item and self.main_li_depth == stack_depth_before:
            # Debug log
            print(f"DEBUG: closing li. ID={self.current_item['id']}, data-price={self.current_item.get('data-price')!r}, data-sale={self.current_item.get('data-sale')!r}")
            
            # When we close the main item li, process prices
            price_val = 0
            if self.current_item.get('data-price'):
                p_str = re.sub(r'[^0-9]', '', self.current_item['data-price'])
                if p_str: price_val = int(p_str)
            
            if price_val == 0 and self.current_item.get('data-sale'):
                p_str = re.sub(r'[^0-9]', '', self.current_item['data-sale'])
                if p_str: price_val = int(p_str)
                
            self.current_item['price'] = price_val
            # Finalize img url
            img = self.current_item.get('img', '')
            if img.startswith('//'):
                self.current_item['img'] = 'https:' + img
                
            self.current_item = None
            self.main_li_depth = None

def run_test(url, user_agent=None):
    req = urllib.request.Request(url)
    if user_agent:
        req.add_header('User-Agent', user_agent)
    
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
    except Exception as e:
        print(f"Error opening URL: {e}")
        return
        
    parser = Cafe24SearchParser()
    parser.feed(html)
    
    print(f"\n--- URL: {url} ---")
    print(f"User Agent: {user_agent or 'Default'}")
    print(f"Found {len(parser.items)} items.")
    for idx, item in enumerate(parser.items[:3]):
        print(f"Item {idx+1}:")
        print(f"  ID: {item.get('id')}")
        print(f"  Name: {item.get('name')}")
        print(f"  Price: {item.get('price')} (raw: {item.get('data-price') or item.get('data-sale')})")
        print(f"  Img: {item.get('img')}")
        print(f"  Link: {item.get('link')}")
        print(f"  Desc: {item.get('desc')}")

if __name__ == '__main__':
    # Test Desktop
    run_test("https://www.machuda.com/product/search.html?keyword=%EB%B0%98%ED%8C%94")
    
    # Test Mobile User Agent
    run_test(
        "https://www.machuda.com/product/search.html?keyword=%EB%B0%98%ED%8C%94",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
    )
