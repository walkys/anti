from html.parser import HTMLParser

class JSParserSim(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_raw_board_wrap = False
        self.rows = []
        self.current_row = None
        self.in_description = False
        self.in_json_data = False
        self.json_data_content = []
        self.tags_stack = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        self.tags_stack.append((tag, attrs_dict))
        
        if tag == 'div' and attrs_dict.get('id') == 'machuda-raw-board-wrap':
            self.in_raw_board_wrap = True
            
        if self.in_raw_board_wrap:
            if tag == 'li':
                # Start of a row
                self.current_row = {
                    'attrs': attrs_dict,
                    'images': [],
                    'description': None,
                    'json_data': None
                }
                self.rows.append(self.current_row)
                
            elif self.current_row:
                if tag == 'img' and 'src' in attrs_dict:
                    self.current_row['images'].append(attrs_dict['src'])
                
                if tag == 'div' and 'class' in attrs_dict:
                    classes = attrs_dict['class'].split()
                    if 'description' in classes:
                        self.current_row['description'] = attrs_dict
                        self.in_description = True
                    elif 'machuda-json-data' in classes:
                        self.in_json_data = True
                        self.json_data_content = []

    def handle_data(self, data):
        if self.in_json_data:
            self.json_data_content.append(data)

    def handle_endtag(self, tag):
        if self.tags_stack:
            self.tags_stack.pop()
            
        if tag == 'div' and self.in_raw_board_wrap:
            # Check if we exited raw wrap
            # Simple check: if stack has no div with id machuda-raw-board-wrap
            in_wrap = False
            for t, a in self.tags_stack:
                if t == 'div' and a.get('id') == 'machuda-raw-board-wrap':
                    in_wrap = True
                    break
            self.in_raw_board_wrap = in_wrap
            
        if tag == 'div':
            if self.in_description:
                self.in_description = False
            if self.in_json_data:
                self.in_json_data = False
                if self.current_row:
                    self.current_row['json_data'] = "".join(self.json_data_content)

def run_simulation():
    with open("scratch/live_board_2.html", "r", encoding="utf-8") as f:
        html = f.read()
        
    parser = JSParserSim()
    parser.feed(html)
    
    print(f"Number of rows found in raw board wrap: {len(parser.rows)}")
    
    parsed_cards = []
    for idx, row in enumerate(parser.rows):
        desc = row['description']
        if not desc:
            # print(f"Row {idx+1}: no description block found")
            continue
            
        # Parse attributes
        prodId = desc.get('data-prod-id') or 'tee30'
        prodName = desc.get('data-prod-name') or desc.get('data-subject') or '커스텀 단체복'
        category = desc.get('data-category') or ''
        image = desc.get('data-image') or ''
        
        def isValidPortfolioImage(src):
            if not src: return False
            lower = src.lower()
            if any(x in lower for x in ['ico_', 'icon_', 'clear.gif', 'spacer', 'attachment', 'btn_', 're.gif', '198x198']):
                return False
            if lower.endswith('.gif') and any(x in lower for x in ['lock', 'new', 'hot', 'reply']):
                return False
            return True
            
        if not isValidPortfolioImage(image):
            # Fallback to images inside row
            image = ''
            for img in row['images']:
                if isValidPortfolioImage(img):
                    image = img
                    break
        if not image:
            image = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
            
        parsed_cards.append({
            'prodId': prodId,
            'prodName': prodName,
            'category': category,
            'image': image
        })
        
    print(f"Parsed {len(parsed_cards)} cards successfully!")
    for idx, card in enumerate(parsed_cards[:5]):
        print(f"Card {idx+1}: {card}")

run_simulation()
