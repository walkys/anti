import re

def check_structure(filepath, name):
    print(f"\n{'='*60}")
    print(f"=== {name} 현재 서버 HTML 구조 분석 ===")
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    # 1. Check if latest list.html code is on the server
    print("\n[1] 최신 코드 반영 여부 확인:")
    if 'module="board_notice_8"' in html:
        notice_ctx = html[html.find('module="board_notice_8"')-200:html.find('module="board_notice_8"')+200]
        print(f"  board_notice_8 module 주변:\n  {notice_ctx.strip()[:300]}")
    
    # 2. Check what surrounds machuda-raw-data-table
    pos = html.find('machuda-raw-data-table')
    if pos != -1:
        print(f"\n[2] machuda-raw-data-table 주변 HTML:")
        print(html[pos-50:pos+500])
    
    # 3. Count ul.gallery_list with parent = machuda-raw-data-table
    from html.parser import HTMLParser
    class Parser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.stack = []
            self.ul_count = 0
            self.li_count = 0
            self.in_raw_data_table = False
            self.depth_raw = 0
            
        def handle_starttag(self, tag, attrs):
            a = dict(attrs)
            self.stack.append((tag, a))
            if tag == 'div' and a.get('id') == 'machuda-raw-data-table':
                self.in_raw_data_table = True
                self.depth_raw = len(self.stack)
            if self.in_raw_data_table and tag == 'ul':
                if 'gallery_list' in a.get('class', ''):
                    self.ul_count += 1
            if self.in_raw_data_table and tag == 'li':
                # Only count li directly inside ul (not deep nested)
                if len(self.stack) > 1:
                    parent = self.stack[-2]
                    if parent[0] == 'ul' and 'gallery_list' in parent[1].get('class', ''):
                        self.li_count += 1
                        
        def handle_endtag(self, tag):
            if self.stack:
                popped = self.stack.pop()
                if self.in_raw_data_table and len(self.stack) < self.depth_raw - 1:
                    self.in_raw_data_table = False
    
    p = Parser()
    p.feed(html)
    print(f"\n[3] machuda-raw-data-table 안의 ul.gallery_list 개수: {p.ul_count}")
    print(f"    ul.gallery_list 바로 아래 li 개수: {p.li_count}")
    if p.ul_count == 1 and p.li_count > 1:
        print("  ✅ 올바른 구조: 하나의 ul 안에 여러 li (그리드 가능)")
    elif p.ul_count > 1:
        print(f"  ❌ 오류 구조: ul이 {p.ul_count}개 반복됨 (리스트형 원인)")

check_structure("scratch/live_board_4.html", "Board 4 (포토후기)")
check_structure("scratch/live_board_2.html", "Board 2 (납품사례)")
