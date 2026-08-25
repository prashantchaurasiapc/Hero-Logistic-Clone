import os

def fix_trailer_swap():
    filepath = r"d:\kiaan\Hero_Logistic\Hero-Logistic-Clone\frontend\src\components\DriverDashboard\TrailerSwap.jsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace hardcoded driver info
    content = content.replace('<div className="font-black text-slate-900">John Smith</div>', '<div className="font-black text-slate-900">{driverInfo?.name || \'--\'}</div>')
    content = content.replace('<div className="text-[10.5px] font-mono text-slate-400">Driver ID: DRV-1021</div>', '<div className="text-[10.5px] font-mono text-slate-400">Driver ID: {driverInfo?.driverCode || \'--\'}</div>')

    # Replace hardcoded truck info in Left Sidebar
    content = content.replace('<div className="font-black text-slate-900 text-xs">TRK-101</div>', '<div className="font-black text-slate-900 text-xs">{truckInfo?.id || \'--\'}</div>')
    content = content.replace('<div className="text-[11px] text-slate-500">MAN TGX 26.580</div>', '<div className="text-[11px] text-slate-500">{truckInfo?.make || \'--\'}</div>')

    # Replace hardcoded truck info in Main Column
    content = content.replace('<div className="font-black text-slate-900">TRK-101</div>', '<div className="font-black text-slate-900">{truckInfo?.id || \'--\'}</div>')
    content = content.replace('<div className="text-[11px] text-slate-500 font-semibold">MAN TGX 26.580</div>', '<div className="text-[11px] text-slate-500 font-semibold">{truckInfo?.make || \'--\'}</div>')
    content = content.replace('<div className="text-[10px] font-mono text-slate-400">Rego: YQ-45CD • VIN: WMA34XZZJPT123456</div>', '<div className="text-[10px] font-mono text-slate-400">Rego: {truckInfo?.rego || \'--\'} • VIN: {truckInfo?.vin || \'--\'}</div>')

    # Replace hardcoded sync date
    content = content.replace('Last sync: 29 May 2025, 10:15 AM', 'Last sync: {syncTime}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed TrailerSwap.jsx successfully!")

if __name__ == "__main__":
    fix_trailer_swap()
