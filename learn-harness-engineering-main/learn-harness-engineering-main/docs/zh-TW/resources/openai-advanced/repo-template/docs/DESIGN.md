# DESIGN.md

這份檔案是設計文檔入口。保持簡短，把更細的內容路由到
`docs/design-docs/` 裡的具體檔案。

## 目的

記錄那些應該跨越單次聊天、單個 sprint、單個 reviewer 記憶而持續存在的產品與系統設計決策。

## 什麼時候先看它

- 你需要理解當前的設計哲學
- 你準備引入新模式
- 你要判斷哪些設計已經定了，哪些還在開放狀態

## 核心設計文檔

- `docs/design-docs/index.md`：accepted / proposed / deprecated 文檔索引
- `docs/design-docs/core-beliefs.md`：項目級 agent-first 核心信念

## 設計規則

- 設計文檔要小而新。
- 一個決策領域儘量對應一份文檔。
- 某個改動依賴設計文檔時，要在 plan 和 spec 裡顯式鏈接它。
- 如果某條設計規則已經變成運行上的硬要求，就把它升級成自動化檢查或更新到 `ARCHITECTURE.md`。
