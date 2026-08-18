import os

def fix_backend_controller():
    c_path = r"d:\kiaan\Hero_Logistic\Hero-Logistic-Clone\backend\src\controllers\DriverPortalController.js"
    with open(c_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update sendSuccess in getActiveRun
    old_run = "return sendSuccess(res, { run: responseData });"
    new_run = """return sendSuccess(res, { 
      run: responseData,
      currentLoad: load ? {
        id: load.loadRef || load.id,
        loadNumber: load.loadRef,
        origin,
        destination,
        status: load.status,
        loadType: load.type
      } : null
    });"""
    if old_run in content:
        content = content.replace(old_run, new_run)

    # 2. Cut off the duplicate routes added at the bottom
    cut_marker = "// --- Phase 1: Driver Dashboard Cleanup Routes ---"
    if cut_marker in content:
        content = content.split(cut_marker)[0].strip() + "\n"

    with open(c_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Cleaned DriverPortalController.js successfully!")

def fix_add_expense():
    fe_path = r"d:\kiaan\Hero_Logistic\Hero-Logistic-Clone\frontend\src\components\DriverDashboard\AddExpense.jsx"
    with open(fe_path, 'r', encoding='utf-8') as f:
        fe_content = f.read()

    # Replace hardcoded truck/trailer/load details
    fe_content = fe_content.replace('<div className="font-black text-slate-900 text-xs">TRK-101</div>', '<div className="font-black text-slate-900 text-xs">{runData?.vehicle?.truck || \'Unassigned\'}</div>')
    fe_content = fe_content.replace('<div className="text-[11px] text-slate-500">MAN TGX 26.580</div>', '<div className="text-[11px] text-slate-500">--</div>')
    fe_content = fe_content.replace('<div className="font-black text-slate-900 text-xs">TRL-305</div>', '<div className="font-black text-slate-900 text-xs">{runData?.vehicle?.trailer || \'Unassigned\'}</div>')
    fe_content = fe_content.replace('<div className="font-black text-indigo-900 text-xs">LD-3987</div>', '<div className="font-black text-indigo-900 text-xs">{runData?.id || \'No Active Load\'}</div>')
    fe_content = fe_content.replace("{runData?.id || 'LD-3987'}", "{runData?.id || 'No Active Load'}")
    fe_content = fe_content.replace("{runData?.origin || 'Melbourne VIC'}", "{runData?.origin || '--'}")
    fe_content = fe_content.replace("{runData?.destination || 'Sydney NSW'}", "{runData?.destination || '--'}")
    fe_content = fe_content.replace("Trip Expense Analytics Report (LD-3987)", "Trip Expense Analytics Report ({runData?.id || 'No Active Load'})")

    with open(fe_path, 'w', encoding='utf-8') as f:
        f.write(fe_content)
    print("Cleaned AddExpense.jsx successfully!")

if __name__ == "__main__":
    fix_backend_controller()
    fix_add_expense()
