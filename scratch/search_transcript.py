import json

log_path = "/Users/walky/.gemini/antigravity/brain/5b04f1c9-7a40-48de-ab9f-32b8b7303ce2/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            data = json.loads(line)
            if data.get("type") == "VIEW_FILE" and "Desktop/list.html" in data.get("content", ""):
                print(f"Step {data.get('step_index')}: Desktop/list.html")
                print(data.get("content")[:3000])
                print("="*60)
        except Exception as e:
            pass
