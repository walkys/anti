import json

log_path = "/Users/walky/.gemini/antigravity/brain/5b04f1c9-7a40-48de-ab9f-32b8b7303ce2/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            data = json.loads(line)
            content = data.get("content", "") or ""
            # Look for the first time list.html is read
            if "board_list_8" in content and "xans-record-" in content:
                print(f"Step {data.get('step_index')} (type: {data.get('type')}): length {len(content)}")
                # Print a snippet
                print(content[:500])
                print("..." if len(content) > 500 else "")
                print("="*60)
        except Exception as e:
            pass
