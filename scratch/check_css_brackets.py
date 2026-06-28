def check_css_brackets(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        
    stack = []
    lines = content.split('\n')
    
    in_comment = False
    in_string = False
    string_char = None
    
    for line_num, line in enumerate(lines, 1):
        i = 0
        while i < len(line):
            char = line[i]
            
            # Handle comments
            if not in_string:
                if not in_comment:
                    if line[i:i+2] == '/*':
                        in_comment = True
                        i += 2
                        continue
                else:
                    if line[i:i+2] == '*/':
                        in_comment = False
                        i += 2
                        continue
                    else:
                        i += 1
                        continue
                        
            if in_comment:
                i += 1
                continue
                
            # Handle strings
            if in_string:
                if char == string_char and (i == 0 or line[i-1] != '\\'):
                    in_string = False
                i += 1
                continue
            else:
                if char in ["'", '"']:
                    in_string = True
                    string_char = char
                    i += 1
                    continue
            
            # Handle braces
            if char == '{':
                stack.append(('{', line_num, i+1))
            elif char == '}':
                if not stack:
                    print(f"Error: Unmatched closing brace '}}' at line {line_num}, col {i+1}")
                    return False
                opening, op_line, op_col = stack.pop()
            i += 1
            
    if stack:
        print(f"Error: {len(stack)} unmatched opening braces left:")
        for char, line, col in stack[:5]:
            print(f"  '{{' at line {line}, col {col}")
        return False
        
    print("Success: CSS file brackets match correctly!")
    return True

check_css_brackets("machuda-portfolio.css")
