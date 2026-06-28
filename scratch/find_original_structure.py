import re

with open("scratch/original_list_full.html", "r", encoding="utf-8") as f:
    original = f.read()

matches = re.findall(r'<[^>]*module=["\'][^"\']*["\'][^>]*>', original, re.IGNORECASE)
print("=== All Modules in Original HTML ===")
for m in matches:
    print(m)
