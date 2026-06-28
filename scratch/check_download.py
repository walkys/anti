import re

def check_html(path, board_name):
    print(f"=== Checking {board_name} ===")
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Let's search for "machuda-raw-data-table"
    pos = html.find("machuda-raw-data-table")
    if pos == -1:
        print("machuda-raw-data-table not found!")
        return
        
    print("Found machuda-raw-data-table. Context:")
    print(html[pos:pos+1500])
    print("=" * 60)

check_html("scratch/live_board_2.html", "board_2")
check_html("scratch/live_board_4.html", "board_4")
