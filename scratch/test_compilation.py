import re

def check_html():
    with open("list.html", "r", encoding="utf-8") as f:
        html = f.read()
        
    print("=== Compilation validation ===")
    
    # 1. Check module attributes are on div elements
    notice_match = re.search(r'<div[^>]*module=["\']board_notice_8["\'][^>]*>', html)
    fixed_match = re.search(r'<div[^>]*module=["\']board_fixed_8["\'][^>]*>', html)
    list_match = re.search(r'<div[^>]*module=["\']board_list_8["\'][^>]*>', html)
    
    if notice_match and fixed_match and list_match:
        print("PASS: Modules are on div elements.")
        print("Notice module:", notice_match.group(0))
        print("Fixed module:", fixed_match.group(0))
        print("List module:", list_match.group(0))
    else:
        print("FAIL: One or more modules not on div elements!")
        print("Notice:", notice_match)
        print("Fixed:", fixed_match)
        print("List:", list_match)
        
    # 2. Check no custom attributes are on the module divs
    # E.g. class="gallery_list" is fine, but id="machuda-raw-data-table" should be separate.
    if 'id="machuda-raw-data-table"' in list_match.group(0):
        print("FAIL: id='machuda-raw-data-table' is placed on the module div itself!")
    else:
        print("PASS: id='machuda-raw-data-table' is NOT on the module div.")
        
    # 3. Check that the immediate child of module div is ul
    list_block_match = re.search(r'<div[^>]*module=["\']board_list_8["\'][^>]*>.*?<ul>.*?<li>.*?</li>.*?</ul>.*?</div>', html, re.DOTALL)
    if list_block_match:
        print("PASS: The module div correctly wraps ul and li tags.")
    else:
        print("FAIL: Incorrect nesting under board_list_8 module div!")
        
    # 4. Check no class="xans-record-" on source li tags
    if 'xans-record-' in list_block_match.group(0):
        print("FAIL: 'xans-record-' found in template source! Cafe24 should generate it automatically.")
    else:
        print("PASS: No manual 'xans-record-' in source li template.")
        
check_html()
