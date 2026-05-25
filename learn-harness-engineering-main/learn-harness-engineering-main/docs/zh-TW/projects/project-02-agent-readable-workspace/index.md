# Project 02. 讓 agent 看懂項目、接住上次的工作

> 相關講義：[L03. 讓代碼倉庫成為唯一的事實來源](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [L04. 為什麼一個巨大的指令檔案會失敗](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> 本篇範本檔案：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh-TW/resources/templates/)

## 你要做什麼

P01 證明了準備規則有用。但 P01 的任務一次會話就幹完了。真實開發不是這樣的——你昨天干了一半，今天開新會話，agent 得從倉庫狀態裡搞清楚"做了什麼、沒做什麼、接下來幹什麼"。

這個項目要求你給倉庫加上"可讀性"：讓一個全新的 agent 打開倉庫後，能快速理解項目結構、知道當前進度、接手上次的工作。具體任務是給知識庫應用加上三個功能：文檔導入、文檔詳情頁、導入後的本地持久化。這些功能必須跨至少兩個 agent 會話完成。

你需要跑兩次。第一次不給 agent 任何幫助，看它在第二個會話裡要花多久才能"接上"。第二次提前放好 `ARCHITECTURE.md`、`PRODUCT.md`、`session-handoff.md`，讓它快速對齊上下文。

## 使用倉庫內建專案

倉庫路徑：[`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| 目錄 | 內容 | 比較什麼 |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | 基於 Project 01 solution 的代碼，但導入/詳情/持久化仍未完整；文檔更薄，且缺少 `session-handoff.md`。 | 新開會話時，agent 需要做多少重新探索才能接上進度。 |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | 同一產品切片已完成，並在 [`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) 下補齊核心文檔（以及 [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json)、[`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md)）等可接手產物。 | 只依靠倉庫狀態，能否快速續寫而不靠口頭上下文。 |

## 用什麼工具

- Claude Code 或 Codex（和 P01 保持一致）
- Git
- Node.js + Electron
- 文本編輯器（寫文檔用）

## 具體步驟

### 準備工作

1. 基於 P01 完成後的代碼，從同一個 commit 出發。
2. 創建兩個分支：`p02-baseline` 和 `p02-improved`。
3. 列出要實現的三個功能：文檔導入流程、文檔詳情視圖、文檔持久化。兩條分支任務範圍完全一致。

### 第一次運行（弱 harness）

切到 `p02-baseline` 分支。

**會話 A：**

1. 啟動 agent，只給任務描述，不給架構文檔，不給進度檔案。
2. 故意在功能完成之前停止會話（比如只完成文檔導入）。
3. 不寫任何交接檔案。直接結束。

**會話 B：**

1. 開一個全新的 agent 會話。
2. 只說"繼續開發"，不給額外上下文。
3. 記錄 agent 花了多久才做出第一個有意義的代碼修改。
4. 記錄 agent 哪些時候在"重新發現"本來已經知道的東西。

### 第二次運行（強 harness）

切到 `p02-improved` 分支。在第一個會話之前，先在倉庫裡準備好：

- `ARCHITECTURE.md`：描述項目結構、Electron 各層職責、數據流
- `PRODUCT.md`：描述產品功能範圍和當前階段目標
- `AGENTS.md`：啟動命令、工作規則、驗證方式
- `init.sh`：一鍵恢復可運行狀態

**會話 A：**

1. 啟動 agent，讓它開始工作。
2. 同樣在功能完成之前停止。
3. **這次要求 agent 更新 `session-handoff.md`**：記錄做了什麼、沒做什麼、下一步是什麼。

**會話 B：**

1. 開一個全新的 agent 會話。
2. 讓 agent 讀 `session-handoff.md` 和 `feature_list.json`，然後繼續。
3. 同樣記錄接手速度和重複工作比例。

## 怎麼衡量結果

| 指標 | 說明 |
|------|------|
| 會話 B 接手時間 | 從開始到第一個有效代碼修改的時間 |
| 重新發現次數 | agent 重新瞭解架構、命令、狀態等已有信息的次數 |
| 交接檔案質量 | 交接記錄是否完整、準確、可操作 |
| 重複工作比例 | 會話 B 中有多少工作量是在重複會話 A 已做過的事 |
| 最終完成狀態 | 三個功能是否全部完成 |

## 要交什麼

- 弱 harness 的會話 A + B 日誌/對話記錄
- 強 harness 的會話 A + B 日誌/對話記錄
- 兩次運行中產生的交接檔案
- 一份對比筆記：重點比較接手速度和上下文恢復質量

## 對應講義

- [Lecture 03 — 為什麼倉庫必須成為唯一事實來源](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md)
- [Lecture 04 — 為什麼一個大而全的指令檔案不行](../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
- [Lecture 05 — 為什麼長任務會丟失連續性](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md)
