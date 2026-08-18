import os

def fix_messages():
    filepath = r"d:\kiaan\Hero_Logistic\Hero-Logistic-Clone\frontend\src\components\DriverDashboard\Messages.jsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add api import
    if "import api from" not in content:
        content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport api from '../../services/api';")

    # Replace hardcoded vehicle & load
    content = content.replace('<div className="font-black text-slate-900 text-xs">TRK-101</div>', '<div className="font-black text-slate-900 text-xs">{vehicleData?.truck || \'Unassigned\'}</div>')
    content = content.replace('<div className="text-[11px] text-slate-500">MAN TGX 26.580</div>', '<div className="text-[11px] text-slate-500">{vehicleData?.make || \'--\'}</div>')
    content = content.replace('<div className="font-black text-slate-900 text-xs">TRL-305</div>', '<div className="font-black text-slate-900 text-xs">{vehicleData?.trailer || \'Unassigned\'}</div>')
    content = content.replace('<div className="font-black text-indigo-900 text-xs">LD-3987</div>', '<div className="font-black text-indigo-900 text-xs">{activeLoadData?.loadRef || activeLoadData?.id || \'No Active Load\'}</div>')
    content = content.replace('Last sync: 29 May 2025, 10:15 AM', 'Last sync: {syncTime}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed Messages.jsx!")

def fix_mypay():
    filepath = r"d:\kiaan\Hero_Logistic\Hero-Logistic-Clone\frontend\src\components\DriverDashboard\MyPay.jsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add api import
    if "import api from" not in content:
        content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport api from '../../services/api';")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed MyPay.jsx!")

if __name__ == "__main__":
    fix_messages()
    fix_mypay()
