import json

log_path = "/Users/walky/.gemini/antigravity/brain/5b04f1c9-7a40-48de-ab9f-32b8b7303ce2/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            # Find the step index where a VIEW_FILE tool call output is returned for list.html
            # And it contains original default cafe24 list markup
            if data.get("type") == "VIEW_FILE" and "list.html" in data.get("content", ""):
                content = data.get("content", "")
                if "board_notice_8" in content and "board_title_8" in content:
                    # Let's verify it has no machuda additions yet
                    if "machuda-portfolio-active" not in content:
                        print(f"Found original list.html at step {data.get('step_index')}")
                        with open("scratch/original_list_full_v2.html", "w", encoding="utf-8") as out:
                            out.write(content)
                        print("Wrote to scratch/original_list_full_v2.html")
                        break
        except Exception as e:
            pass
