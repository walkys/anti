import re
from html.parser import HTMLParser

class Cafe24HTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags_stack = []
        self.gallery_lists = []
        self.xans_records = []
        self.machuda_raw_board_wrap = False
        self.machuda_raw_data_table = False
        self.html_active = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        self.tags_stack.append((tag, attrs_dict))
        
        if tag == 'html':
            if 'class' in attrs_dict and 'machuda-portfolio-active' in attrs_dict['class']:
                self.html_active = True
                
        if 'id' in attrs_dict:
            if attrs_dict['id'] == 'machuda-raw-board-wrap':
                self.machuda_raw_board_wrap = True
            elif attrs_dict['id'] == 'machuda-raw-data-table':
                self.machuda_raw_data_table = True
                
        if 'class' in attrs_dict:
            classes = attrs_dict['class'].split()
            if 'gallery_list' in classes:
                # Store it and its parent tag if any
                parent = self.tags_stack[-2] if len(self.tags_stack) > 1 else (None, {})
                self.gallery_lists.append((tag, attrs_dict, parent))
                
            for cls in classes:
                if cls.startswith('xans-record-'):
                    parent = self.tags_stack[-2] if len(self.tags_stack) > 1 else (None, {})
                    grandparent = self.tags_stack[-3] if len(self.tags_stack) > 2 else (None, {})
                    self.xans_records.append((tag, attrs_dict, parent, grandparent))

    def handle_endtag(self, tag):
        if self.tags_stack:
            self.tags_stack.pop()

def analyze_board(file_path, name):
    print(f"=== Analyzing {name} ({file_path}) ===")
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()
    
    parser = Cafe24HTMLParser()
    parser.feed(html)
    
    print(f"Found #machuda-raw-board-wrap: {parser.machuda_raw_board_wrap}")
    print(f"Found #machuda-raw-data-table: {parser.machuda_raw_data_table}")
    print(f"html class active: {parser.html_active}")
    print(f"Found {len(parser.gallery_lists)} gallery_list elements:")
    for idx, (tag, attrs, parent) in enumerate(parser.gallery_lists):
        print(f"  gallery_list {idx+1}: tag={tag}, attrs={attrs}, parent_tag={parent[0]} parent_attrs={parent[1]}")
        
    print(f"Found {len(parser.xans_records)} xans-record- elements:")
    for idx, (tag, attrs, parent, grandparent) in enumerate(parser.xans_records[:5]):
        print(f"  Record {idx+1}: tag={tag}, attrs={attrs}")
        print(f"    parent: tag={parent[0]} attrs={parent[1]}")
        print(f"    grandparent: tag={grandparent[0]} attrs={grandparent[1]}")
    if len(parser.xans_records) > 5:
        print(f"  ... and {len(parser.xans_records) - 5} more records")

analyze_board("scratch/live_board_2.html", "Board 2 (Portfolio)")
analyze_board("scratch/live_board_4.html", "Board 4 (Photo Review)")
