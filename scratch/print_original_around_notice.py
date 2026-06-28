with open("scratch/original_list_full.html", "r", encoding="utf-8") as f:
    original = f.read()

pos = original.find('module="board_notice_8"')
if pos != -1:
    print(original[pos-100:pos+3000])
else:
    print("Could not find board_notice_8")
