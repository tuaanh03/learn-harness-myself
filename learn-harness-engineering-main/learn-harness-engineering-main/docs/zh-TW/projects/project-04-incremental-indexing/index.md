# Project 04. 用運行反饋修正 agent 的行為

> 相關講義：[L07. 為什麼 agent 會多做或少做](./../../lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) · [L08. 為什麼功能清單是 harness 原語](./../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
> 本篇範本檔案：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh-TW/resources/templates/)

## 你要做什麼

前三個項目關注的是"讓 agent 把活幹完"。這個項目關注的是"出了問題怎麼修"——而且不是你修，是讓 agent 自己通過運行時信號來修。

你要做兩件事。第一，給知識庫應用加上運行時可觀測性：啟動日誌、導入和索引的日誌、問答失敗時的用戶可見錯誤狀態。第二，在倉庫裡編碼架構約束，讓 agent 不可能靜默地跨層違規（main / preload / renderer / services 之間的邊界）。

然後你會在代碼裡埋一個運行時 bug，讓 agent 去修。跑兩次：一次不給日誌和約束，看 agent 怎麼修；一次給好日誌和架構規則，看差別。

## 使用倉庫內建專案

倉庫路徑：[`projects/project-04/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-04)

| 目錄 | 內容 | 比較什麼 |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-04/starter) | Project 03 代碼，但診斷較弱；存在一個種子缺陷，可能導致大文件 chunking/索引失敗；也沒有架構檢查腳本。 | 沒有運行時信號時，定位根因需要多久、改動是否擴散。 |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-04/solution) | 結構化 logger、架構邊界文檔與腳本、修復 chunking/索引邏輯，並補齊 [`clean-state-checklist.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-04/solution/clean-state-checklist.md)。 | 有日誌與邊界檢查後，修復是否更快、更可控、可復現。 |

## 用什麼工具

- Claude Code 或 Codex
- Git
- Node.js + Electron
- 日誌庫（如 `electron-log` 或簡單的 console 封裝）
- 結構化檢查工具（ESLint 自定義規則、guard 腳本、或測試）

## 具體步驟

### 準備工作

1. 基於 P03 完成後的代碼，從同一個 commit 出發。
2. 創建兩個分支：`p04-baseline` 和 `p04-improved`。
3. 在兩個分支中埋入同一個運行時 bug（比如：索引時 chunk 大小讀取錯誤導致問答返回空結果）。
4. 記錄 bug 的位置和表現，但不要告訴 agent bug 在哪。

### 第一次運行（弱 harness）

切到 `p04-baseline` 分支。

1. 啟動 agent，告訴它"問答功能返回空結果，請修復"。
2. 倉庫裡沒有運行時日誌，沒有架構約束檔案。
3. 記錄 agent 花了多久找到根因、怎麼確認修復的、修復過程中是否引入了新的層邊界違規。
4. 修復後重啟應用，確認是否能幹淨啟動。

### 第二次運行（強 harness）

切到 `p04-improved` 分支。在啟動 agent 之前，先在倉庫裡準備好：

- **運行時日誌**：啟動時打印初始化步驟，導入時打印檔案數量和 chunk 結果，索引時打印進度，問答失敗時打印錯誤原因。
- **架構約束**：在 `AGENTS.md` 裡明確寫 Electron 四層邊界（main / preload / renderer / services），說明哪些調用路徑是允許的。用 ESLint 規則或 guard 腳本檢查違規。
- **乾淨狀態要求**：最終交付前必須能幹淨重啟。

然後啟動 agent：

1. 先讓 agent 加上日誌和結構化檢查（這是任務的一部分）。
2. 然後告訴它"問答功能返回空結果，請修復"。
3. 這次 agent 有日誌可以看，有架構規則可以參照。
4. 記錄診斷速度、修復質量、是否引入了邊界違規。
5. 修復後重啟應用，確認乾淨啟動。

## 怎麼衡量結果

| 指標 | 說明 |
|------|------|
| 根因定位時間 | 從開始到 agent 準確描述 bug 原因 |
| 修復確認時間 | 從定位到驗證修復成功 |
| 邊界違規數 | 修復過程中引入的跨層違規次數 |
| 日誌有用性 | 日誌是否直接指向了失敗原因 |
| 乾淨重啟 | 修復後是否能幹淨重啟、無報錯 |

## 要交什麼

- 弱 harness 的調試記錄：診斷過程、修復 diff、啟動證據
- 強 harness 的調試記錄：同上，加上日誌和架構約束檔案
- 結構化檢查產物（lint 規則、guard 腳本、或測試檔案）
- 一份對比筆記：重點比較診斷速度和修復健壯性

## 對應講義

- [Lecture 11 — 為什麼可觀測性屬於 harness 的一部分](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md)
- [Lecture 12 — 為什麼每個會話都必須留下乾淨狀態](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
