import json

log_path = "/Users/walky/.gemini/antigravity/brain/5b04f1c9-7a40-48de-ab9f-32b8b7303ce2/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            if 2360 <= step_idx <= 2525:
                role = data.get("source")
                stype = data.get("type")
                content = data.get("content") or ""
                t_calls = data.get("tool_calls", []) or []
                
                print(f"Step {step_idx} ({role} - {stype})")
                if stype == "USER_INPUT":
                    print(f"  User: {content.strip()}")
                elif stype == "PLANNER_RESPONSE":
                    print(f"  Agent: {content[:300].strip()}...")
                elif t_calls:
                    for tc in t_calls:
                        print(f"  Tool: {tc.get('name')} with args: {str(tc.get('args'))[:200]}")
                print("-" * 50)
        except Exception as e:
            pass
