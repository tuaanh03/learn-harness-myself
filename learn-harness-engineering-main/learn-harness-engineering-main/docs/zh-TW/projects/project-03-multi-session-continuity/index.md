# Project 03. 讓 agent 關掉再打開還能接著幹

> 相關講義：[L05. 為什麼長時任務會丟失上下文](./../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) · [L06. 為什麼初始化需要單獨一個階段](./../../lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
> 本篇範本檔案：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh-TW/resources/templates/)

## 你要做什麼

P02 解決了"接手"的問題，但 agent 接手之後能不能把活幹完、幹對了，又是另一回事。這個項目要你給 agent 加上範圍控制和驗證關卡。

你要實現的知識庫功能是：文檔分塊、元數據提取、索引進度顯示、帶引用的問答流程。這些功能比前兩個項目複雜，agent 更容易跑偏——要麼多做了不該做的，要麼說做完了但其實沒通過驗證。

你需要一個 `feature_list.json`，每個功能有明確的狀態（failing / passing）。規則很簡單：一次只做一個功能，沒有可運行的驗證證據就不能標成 passing。跑兩次，一次不給這些約束，一次嚴格執行，看結果差多少。

## 使用倉庫內建專案

倉庫路徑：[`projects/project-03/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-03)

| 目錄 | 內容 | 比較什麼 |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-03/starter) | Project 02 代碼基礎上，索引與 grounded QA 尚未完善；有初版 [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-03/starter/feature_list.json)，但缺少最終的重啟/交接與乾淨狀態產物。 | 多次重啟/多功能任務下，agent 是否漂移、是否丟狀態。 |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-03/solution) | 完整的 chunking、metadata、indexing status、citation-based QA，並補齊 [`init.sh`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-03/solution/init.sh)、[`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-03/solution/session-handoff.md)、[`claude-progress.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-03/solution/claude-progress.md)、[`clean-state-checklist.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-03/solution/clean-state-checklist.md)。 | 是否能做到“一次只做一個功能”，且每個功能都有可執行證據才標記通過。 |

## 用什麼工具

- Claude Code 或 Codex
- Git
- Node.js + Electron
- `feature_list.json`（範本參考 `docs/zh-TW/resources/templates/feature_list.json`）

## 具體步驟

### 準備工作

1. 基於 P02 完成後的代碼，從同一個 commit 出發。
2. 創建兩個分支：`p03-baseline` 和 `p03-improved`。
3. 定義四個功能：文檔分塊、元數據提取、索引進度 UI 顯示、帶引用的問答。兩條分支的功能定義完全一致。

### 第一次運行（弱 harness）

切到 `p03-baseline` 分支。

1. 啟動 agent，給一段模糊的任務提示詞。
2. 不提供 `feature_list.json`，沒有狀態追蹤。
3. 不限制 agent 一次做幾個功能。
4. 沒有明確的驗證標準——agent 自己說"完成了"就算。
5. 運行結束後，手動檢查每個功能是否真的能用。
6. 記錄哪些功能 agent 聲稱完成但實際沒通過驗證。

### 第二次運行（強 harness）

切到 `p03-improved` 分支。在啟動 agent 之前：

- 在倉庫根目錄放好 `feature_list.json`，四個功能全部標為 `failing`。
- 在 `AGENTS.md` 裡寫明規則：一次只做一個功能；狀態只能從 `failing` 切到 `passing`，且必須有驗證證據。
- 準備好 `init.sh`。

然後啟動 agent：

1. agent 開始工作，每完成一個功能必須更新 `feature_list.json` 並附上驗證證據（截圖、測試輸出等）。
2. 至少要有一個功能展示從 `failing` 到 `passing` 的完整轉換過程。
3. 問答功能的驗證必須檢查引用是否存在、引用是否相關，不能只看有沒有輸出。
4. 運行結束後歸檔所有驗證證據。

## 怎麼衡量結果

| 指標 | 說明 |
|------|------|
| 範圍漂移次數 | agent 做了功能清單之外的事的次數 |
| 虛假完成率 | agent 聲稱完成但驗證不通過的功能比例 |
| 驗證覆蓋率 | 有明確驗證證據的功能佔總功能的百分比 |
| 問答質量 | 引用是否存在、引用是否相關 |
| 重試次數 | 從開始到所有功能 passing 總共重試了幾次 |

## 要交什麼

- 弱 harness 運行記錄：提示詞、日誌、驗證結果
- 強 harness 運行記錄：`feature_list.json` 變更歷史、日誌、驗證證據
- 至少一個功能從 `failing` 到 `passing` 的轉換證據
- 一份對比筆記：重點看範圍紀律和完成準確度

## 對應講義

- [Lecture 07 — 為什麼 agent 總是做過頭、做不完](../../lectures/lecture-07-why-agents-overreach-and-under-finish/index.md)
- [Lecture 08 — 為什麼 feature list 是 harness 的基礎原語](../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
- [Lecture 09 — 為什麼 agent 總是過早宣佈勝利](../../lectures/lecture-09-why-agents-declare-victory-too-early/index.md)
- [Lecture 10 — 為什麼端到端測試能改變結果](../../lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
