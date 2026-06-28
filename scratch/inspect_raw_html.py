with open("scratch/live_board_4.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's find the start of the machuda-raw-data-table div
start_idx = html.find('id="machuda-raw-data-table"')
if start_idx != -1:
    print("Found id=\"machuda-raw-data-table\"")
    # Print 5000 characters from here
    print(html[start_idx:start_idx+10000])
else:
    print("Could not find id=\"machuda-raw-data-table\"")
