import os
import re

def clean_conflict_markers(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    # Remove standard conflict blocks keeping HEAD
    pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]*\n', re.DOTALL)
    content, count = pattern.subn(r'\1\n', content)
    
    # Force remove any standalone markers that might be left
    content = re.sub(r'<<<<<<< HEAD\n', '', content)
    content = re.sub(r'=======\n', '', content)
    content = re.sub(r'>>>>>>> [^\n]*\n', '', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned conflict markers in {filepath}")

def main():
    src_dir = r"d:\kiaan\Hero_Logistic\Hero-Logistic-Clone\frontend\src"
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                filepath = os.path.join(root, file)
                clean_conflict_markers(filepath)

if __name__ == "__main__":
    main()
