import json

log_path = "/Users/walky/.gemini/antigravity/brain/5b04f1c9-7a40-48de-ab9f-32b8b7303ce2/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            data = json.loads(line)
            content = data.get("content", "") or ""
            if "board_list_8" in content and "xans-record-" in content:
                # print first match that is a VIEW_FILE or replacement content
                if data.get("type") in ["VIEW_FILE", "CODE_ACTION"]:
                    print(f"Step {data.get('step_index')} ({data.get('type')}):")
                    # Find where board_list_8 starts in the content and print 1000 characters around it
                    pos = content.find("board_list_8")
                    if pos != -1:
                        print(content[max(0, pos-200):min(len(content), pos+800)])
                        print("="*60)
        except Exception as e:
            pass
