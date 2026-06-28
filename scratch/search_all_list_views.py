import json

log_path = "/Users/walky/.gemini/antigravity/brain/5b04f1c9-7a40-48de-ab9f-32b8b7303ce2/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            data = json.loads(line)
            content = data.get("content", "") or ""
            tool_calls = data.get("tool_calls", []) or []
            tool_calls_str = str(tool_calls)
            
            # Check if this is a view_file call for list.html
            is_view = False
            for tc in tool_calls:
                if tc.get("name") == "view_file" and "list.html" in str(tc.get("arguments", "")):
                    is_view = True
                    break
            
            # Or if it's the output of such a tool call
            if is_view or ("list.html" in content and "module=\"board_list_8\"" in content and "xans-record-" not in content):
                print(f"Step {data.get('step_index')} (type: {data.get('type')}, role: {data.get('source')}): length {len(content)}")
                # Show first 200 chars and last 200 chars of content
                if content:
                    print(content[:300])
                    print("...")
                    print(content[-300:])
                print("="*80)
        except Exception as e:
            pass
