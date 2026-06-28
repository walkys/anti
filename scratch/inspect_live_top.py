with open("scratch/live_board_4.html", "r", encoding="utf-8") as f:
    html = f.read()

print("=== LIVE HTML TOP 1000 CHARACTERS ===")
print(html[:1000])

print("=== LIVE HTML BOTTOM 1000 CHARACTERS ===")
print(html[-1000:])
