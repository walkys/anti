import re

def search_file(filepath):
    print(f"=== Searching {filepath} ===")
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return
        
    matches = [m.start() for m in re.finditer(r"board_list", content, re.IGNORECASE)]
    print(f"Found {len(matches)} matches")
    for idx, pos in enumerate(matches):
        print(f"Match {idx+1} at position {pos}:")
        print(content[max(0, pos-200):min(len(content), pos+1500)])
        print("=" * 80)

search_file("scratch/original_list_html.txt")
search_file("scratch/original_list_full.html")
search_file("list.html")
