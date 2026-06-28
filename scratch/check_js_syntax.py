def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        
    stack = []
    lines = content.split('\n')
    
    in_string = False
    string_char = None
    in_comment = False
    in_multiline_comment = False
    
    for line_num, line in enumerate(lines, 1):
        i = 0
        while i < len(line):
            char = line[i]
            
            # Handle comments
            if not in_string:
                if not in_comment and not in_multiline_comment:
                    if line[i:i+2] == '//':
                        break  # rest of the line is a comment
                    elif line[i:i+2] == '/*':
                        in_multiline_comment = True
                        i += 2
                        continue
                if in_multiline_comment:
                    if line[i:i+2] == '*/':
                        in_multiline_comment = False
                        i += 2
                    else:
                        i += 1
                    continue
            
            # Handle strings
            if not in_comment and not in_multiline_comment:
                if in_string:
                    if char == string_char and (i == 0 or line[i-1] != '\\'):
                        in_string = False
                    i += 1
                    continue
                else:
                    if char in ["'", '"', '`']:
                        in_string = True
                        string_char = char
                        i += 1
                        continue
            
            # Handle braces
            if char in ['{', '[', '(']:
                stack.append((char, line_num, i+1))
            elif char in ['}', ']', ')']:
                if not stack:
                    print(f"Error: Unmatched closing character '{char}' at line {line_num}, col {i+1}")
                    return False
                opening_char, op_line, op_col = stack.pop()
                matching = {'}': '{', ']': '[', ')': '('}
                if opening_char != matching[char]:
                    print(f"Error: Mismatched character. Found '{char}' at line {line_num}, col {i+1} matching '{opening_char}' from line {op_line}, col {op_col}")
                    return False
            i += 1
            
    if stack:
        print(f"Error: {len(stack)} unmatched opening characters left in stack:")
        for char, line, col in stack[:5]:
            print(f"  '{char}' at line {line}, col {col}")
        return False
        
    print("Success: All brackets/braces/parentheses match correctly!")
    return True

check_braces("machuda-portfolio.js")
