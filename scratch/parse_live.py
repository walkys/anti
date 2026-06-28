import re

html_path = "/Users/walky/.gemini/antigravity/brain/5b04f1c9-7a40-48de-ab9f-32b8b7303ce2/.system_generated/steps/2367/content.md"

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

post_ids = ['17254', '17253', '17252', '17251']
for pid in post_ids:
    matches = [m.start() for m in re.finditer(pid, content)]
    print(f"Post {pid} found {len(matches)} times:")
    for idx, pos in enumerate(matches):
        print(f"Match {idx+1} at position {pos}:")
        print(content[max(0, pos-100):min(len(content), pos+200)])
        print("-" * 50)
