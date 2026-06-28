with open("scratch/live_board_4.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find the machuda-raw-data-table section and print more context
pos = html.find('machuda-raw-data-table')
if pos != -1:
    section = html[pos:pos+5000]
    print("=== Board 4 raw data table ===")
    print(section)
