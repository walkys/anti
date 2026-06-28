import re

with open("scratch/live_board_4.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find the skin CSS to understand existing gallery styles
pos = html.find('/skin-skin110/ind-script/optimizer.php')
if pos != -1:
    print("=== Skin CSS URL ===")
    print(html[pos:pos+300])

# Find the structure of a single gallery item completely
pos = html.find('machuda-raw-data-table')
if pos != -1:
    # Get a full div block
    section = html[pos:pos+900]
    print("\n=== Single gallery item structure ===")
    print(section)

# Check if there's any existing inline style on the parent div
pos2 = html.find('id="machuda-raw-data-table"')
if pos2 != -1:
    print("\n=== machuda-raw-data-table tag ===")
    print(html[pos2:pos2+100])
