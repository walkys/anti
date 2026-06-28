from html.parser import HTMLParser

class Cafe24HTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_raw_wrap = False
        self.raw_wrap_depth = 0
        self.li_depth = 0
        self.in_li = False
        self.in_desc = False
        self.current_desc_attrs = None
        self.li_count = 0
        self.parsed_items = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        
        # Track #machuda-raw-board-wrap
        if tag == 'div' and attr_dict.get('id') == 'machuda-raw-board-wrap':
            self.in_raw_wrap = True
            self.raw_wrap_depth = 0
            
        if self.in_raw_wrap:
            if tag == 'div':
                self.raw_wrap_depth += 1
            
            # Find li inside
            if tag == 'li':
                self.in_li = True
                self.li_depth = 0
                self.li_count += 1
                
            if self.in_li:
                if tag != 'li':
                    self.li_depth += 1
                
                # Check for description
                if tag == 'div' and 'description' in attr_dict.get('class', ''):
                    self.in_desc = True
                    self.current_desc_attrs = attr_dict

    def handle_endtag(self, tag):
        if self.in_raw_wrap:
            if tag == 'div':
                if self.raw_wrap_depth == 0:
                    self.in_raw_wrap = False
                else:
                    self.raw_wrap_depth -= 1
            
            if self.in_li:
                if tag == 'div' and self.in_desc:
                    self.in_desc = False
                    self.parsed_items.append(self.current_desc_attrs)
                    
                if tag == 'li':
                    if self.li_depth == 0:
                        self.in_li = False
                    else:
                        self.li_depth -= 1

def test_parse():
    with open("scratch/live_board_2.html", "r", encoding="utf-8") as f:
        html = f.read()
        
    parser = Cafe24HTMLParser()
    parser.feed(html)
    
    print(f"Total li tags found inside #machuda-raw-board-wrap: {parser.li_count}")
    print(f"Total description blocks successfully parsed: {len(parser.parsed_items)}")
    
    for idx, item in enumerate(parser.parsed_items[:5]):
        print(f"Item {idx+1}:")
        print(f"  subject : {item.get('data-subject')}")
        print(f"  category: {item.get('data-category')}")
        print(f"  image   : {item.get('data-image')}")

test_parse()
