import os
import re

def fix_mypay():
    filepath = r"d:\kiaan\Hero_Logistic\Hero-Logistic-Clone\frontend\src\components\DriverDashboard\MyPay.jsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace variable.property with variable?.property
    content = re.sub(r'\bytdSummary\.', 'ytdSummary?.', content)
    content = re.sub(r'\bcurrentPeriod\.', 'currentPeriod?.', content)
    content = re.sub(r'\btotalSummary\.', 'totalSummary?.', content)
    content = re.sub(r'\bcurrentPayBreakdown\.', 'currentPayBreakdown?.', content)
    content = re.sub(r'\bytdEarningsBreakdown\.', 'ytdEarningsBreakdown?.', content)
    
    # Also handle nested properties for nextPayment, earnings, deductions
    content = re.sub(r'\bcurrentPeriod\?\.nextPayment\.', 'currentPeriod?.nextPayment?.', content)
    content = re.sub(r'\bcurrentPayBreakdown\?\.earnings\.', 'currentPayBreakdown?.earnings?.', content)
    content = re.sub(r'\bcurrentPayBreakdown\?\.deductions\.', 'currentPayBreakdown?.deductions?.', content)

    # To prevent "undefined" showing in UI, we might need a fallback, but React handles undefined smoothly by rendering nothing (except in string concatenation if any).
    # Since it's jsx, {ytdSummary?.totalEarnings} will render empty if ytdSummary is null, which is fine!

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed MyPay.jsx optional chaining!")

if __name__ == "__main__":
    fix_mypay()
