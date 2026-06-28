import re

def simulate_render(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the board_list_8 block
    match = re.search(r'<div class="gallery_list" id="machuda-raw-data-table" module="board_list_8">.*?</ul>\s*</div>', content, re.DOTALL)
    if not match:
        print("FAIL: board_list_8 module wrapper not found!")
        return False
        
    block = match.group(0)
    print("Found board_list_8 block successfully.")

    # Check that it starts with <div and ends with </div>
    if not (block.startswith('<div') and block.endswith('</div>')):
        print("FAIL: Wrapper is not a div!")
        return False

    # Extract the li inside it
    li_match = re.search(r'<li class="xans-record-">.*?</li>', block, re.DOTALL)
    if not li_match:
        print("FAIL: li.xans-record- not found inside the module block!")
        return False

    li_template = li_match.group(0)
    print("Found li template inside the module block.")

    # Simulate looping 3 posts
    mock_posts = [
        {"subject": "회사 단체복 폴로티", "category": "company", "image": "/web/upload/company_polo.jpg", "link": "/article/2/17254/"},
        {"subject": "학교 반티 후드티", "category": "school", "image": "/web/upload/school_hood.jpg", "link": "/article/2/17253/"},
        {"subject": "교회 단체티 라운드", "category": "church", "image": "/web/upload/church_round.jpg", "link": "/article/2/17252/"}
    ]

    rendered_lis = []
    for idx, post in enumerate(mock_posts):
        rendered_li = li_template
        # Replace variables
        rendered_li = rendered_li.replace("{$subject}", post["subject"])
        rendered_li = rendered_li.replace("{$category_name}", post["category"])
        rendered_li = rendered_li.replace("{$img_src|replace:gallery,}", post["image"])
        rendered_li = rendered_li.replace("{$link_board_detail}", post["link"])
        rendered_li = rendered_li.replace("{$subject|cut:12,…}", post["subject"])
        rendered_li = rendered_li.replace("{$content}", f"Content for post {idx+1}")
        rendered_lis.append(rendered_li)

    # Reconstruct the ul block
    ul_content = "\n".join(rendered_lis)
    compiled_block = f'<div class="gallery_list" id="machuda-raw-data-table" module="board_list_8">\n<ul>\n{ul_content}\n</ul>\n</div>'
    
    # Print the simulated output block
    print("\n=== Simulated Cafe24 Output ===")
    print(compiled_block)
    print("===============================\n")

    # Verify that the parsed attributes are populated
    for post in mock_posts:
        if f'data-subject="{post["subject"]}"' not in compiled_block:
            print(f"FAIL: data-subject for '{post['subject']}' not found in output!")
            return False
        if f'data-category="{post["category"]}"' not in compiled_block:
            print(f"FAIL: data-category for '{post['category']}' not found in output!")
            return False
        if f'data-image="{post["image"]}"' not in compiled_block:
            print(f"FAIL: data-image for '{post['image']}' not found in output!")
            return False
        if f'href="{post["link"]}"' not in compiled_block:
            print(f"FAIL: link href for '{post['link']}' not found in output!")
            return False

    print("SUCCESS: Cafe24 compiler simulation passed successfully!")
    return True

simulate_render("list.html")
