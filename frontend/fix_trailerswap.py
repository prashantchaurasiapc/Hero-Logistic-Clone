import os

def fix_trailer_swap():
    filepath = r"d:\kiaan\Hero_Logistic\Hero-Logistic-Clone\frontend\src\components\DriverDashboard\TrailerSwap.jsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace currentTrailer.id with currentTrailer?.id safely
    # Also replace selectedTargetTrailer.id with selectedTargetTrailer?.id just in case
    content = content.replace('currentTrailer.id ===', 'currentTrailer?.id ===')
    content = content.replace('{currentTrailer.id}', '{currentTrailer?.id || "N/A"}')
    content = content.replace('currentTrailer.id,', 'currentTrailer?.id,')
    content = content.replace('currentTrailer.id)', 'currentTrailer?.id)')
    
    # Just a general safe replacement for display
    content = content.replace('{selectedTargetTrailer.id}', '{selectedTargetTrailer?.id || "N/A"}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed TrailerSwap.jsx")

if __name__ == "__main__":
    fix_trailer_swap()
