# AGENTS.md

這個倉庫面向長時運行的 coding-agent 工作流。保持這個檔案簡短，把它當成“唯一事實來源”文檔的入口和路由層，而不是一個不斷膨脹的大說明書。

## 開工流程

改代碼前先做這些事：

1. 用 `pwd` 確認倉庫根目錄。
2. 讀取 `ARCHITECTURE.md`，理解當前系統地圖和硬性依賴規則。
3. 讀取 `docs/QUALITY_SCORE.md`，先知道最弱的產品領域和架構層。
4. 讀取 `docs/PLANS.md`，再打開當前要執行的 active plan。
5. 讀取相關的 `docs/product-specs/` 規格文檔。
6. 跑這個倉庫約定的 bootstrap 與驗證路徑。
7. 如果基礎驗證先失敗，先修 baseline，再加新範圍。

## 路由地圖

- `ARCHITECTURE.md`：領域地圖、分層模型、依賴規則
- `docs/design-docs/index.md`：設計決策與核心信念
- `docs/product-specs/index.md`：當前產品行為與驗收目標
- `docs/PLANS.md`：計劃生命週期與執行計劃規則
- `docs/QUALITY_SCORE.md`：產品領域與架構層健康度
- `docs/RELIABILITY.md`：運行信號、benchmark、重啟要求
- `docs/SECURITY.md`：密鑰、沙箱、數據和外部動作規則
- `docs/FRONTEND.md`：UI 約束、設計系統規則、可訪問性檢查

## 工作約定

- 一次只圍繞一個有邊界的計劃或功能切片工作。
- 不能只靠讀代碼就宣佈完成，必須有可運行證據。
- 只要改了行為，就同步更新對應的產品、計劃或可靠性文檔。
- 如果某類 review feedback 反覆出現，把它升級成機械規則、檢查或 linter，不要一直在聊天裡重複解釋。
- 生成物放進 `docs/generated/`，外部 reference 放進 `docs/references/`。
- 需要更多細節時，優先補小而新的文檔，而不是繼續把這個檔案寫長。

## 完成定義

一個改動只有在以下條件都滿足時才算完成：

- 目標行為已實現
- 要求的驗證真的跑過
- 證據已經掛到相關 plan 或質量文檔裡
- 受影響的文檔仍然是最新的
- 倉庫能按標準啟動路徑乾淨重啟

## 收尾

結束會話前：

1. 更新當前 active execution plan。
2. 如果產品領域或架構層有明顯變化，更新 `docs/QUALITY_SCORE.md`。
3. 如果有延期處理的債務，記到 `docs/exec-plans/tech-debt-tracker.md`。
4. 已完成的計劃及時移到 `docs/exec-plans/completed/`。
5. 保證倉庫可重啟，並留下清晰的下一步動作。
