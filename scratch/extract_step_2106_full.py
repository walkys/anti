import json

log_path = "/Users/walky/.gemini/antigravity/brain/5b04f1c9-7a40-48de-ab9f-32b8b7303ce2/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get("step_index") == 2106:
                content = data.get("content", "")
                with open("scratch/original_list_full.html", "w", encoding="utf-8") as out:
                    out.write(content)
                print("Extracted successfully!")
                break
        except Exception as e:
            pass
