with open("scratch/live_board_2.html", "r", encoding="utf-8") as f:
    html = f.read()

keywords = [
    "machuda-raw-board-wrap",
    "machuda-raw-data-table",
    "machuda-portfolio-tabs",
    "machuda-portfolio-grid",
    "gallery_list",
    "board_list_8"
]

for kw in keywords:
    pos = html.find(kw)
    if pos != -1:
        print(f"Keyword '{kw}' FOUND at position {pos}:")
        print(html[pos-100:pos+300])
        print("="*60)
    else:
        print(f"Keyword '{kw}' NOT FOUND")
