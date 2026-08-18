import os

def fix_trailer_swap():
    filepath = r"d:\kiaan\Hero_Logistic\Hero-Logistic-Clone\frontend\src\components\DriverDashboard\TrailerSwap.jsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # currentTrailer
    content = content.replace('currentTrailer.name', 'currentTrailer?.name || "Unknown"')
    content = content.replace('currentTrailer.rego', 'currentTrailer?.rego || "N/A"')
    content = content.replace('currentTrailer.vin', 'currentTrailer?.vin || "N/A"')
    
    # selectedTargetTrailer
    content = content.replace('selectedTargetTrailer.name', 'selectedTargetTrailer?.name || "Unknown"')
    content = content.replace('selectedTargetTrailer.rego', 'selectedTargetTrailer?.rego || "N/A"')
    content = content.replace('selectedTargetTrailer.id}', 'selectedTargetTrailer?.id || "N/A"}')
    content = content.replace('selectedTargetTrailer.id)', 'selectedTargetTrailer?.id)')
    content = content.replace('selectedTargetTrailer.id ===', 'selectedTargetTrailer?.id ===')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed TrailerSwap.jsx missing optional chaining")

if __name__ == "__main__":
    fix_trailer_swap()
