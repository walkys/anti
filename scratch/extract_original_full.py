import json

log_path = "/Users/walky/.gemini/antigravity/brain/5b04f1c9-7a40-48de-ab9f-32b8b7303ce2/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            tool_calls = data.get("tool_calls", []) or []
            is_view = False
            for tc in tool_calls:
                if tc.get("name") == "view_file" and "list.html" in str(tc.get("arguments", "")):
                    is_view = True
                    break
            if is_view and data.get("status") == "DONE":
                content = data.get("content", "")
                if content and "board_notice_8" in content:
                    print(f"Found original list.html at step {data.get('step_index')}")
                    # Write to a file
                    with open("scratch/original_list_full_untruncated.html", "w", encoding="utf-8") as out:
                        out.write(content)
                    print("Wrote to scratch/original_list_full_untruncated.html")
                    break
        except Exception as e:
            pass
