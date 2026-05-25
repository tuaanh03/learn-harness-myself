# OpenAI 高級資源包

這個檔案夾把 OpenAI 那篇《Harness engineering: leveraging Codex in an
agent-first world》裡更完整、更高階的倉庫組織方式整理成可以直接參考和複製的範本。

當最小 harness 已經不夠用，而你的倉庫開始需要下面這些能力時，就該看這一套：

- 一個簡短、負責路由的 `AGENTS.md`
- 放在倉庫裡的“唯一事實來源”文檔體系
- 活躍執行計劃與已完成計劃的分層管理
- 明確的產品、可靠性、安全、前端治理檔案
- 按產品領域和架構層持續更新的質量評分
- 面向模型閱讀的參考材料目錄
- 針對架構、知識沉澱、運行驗證的標準 SOP

## 包含的目錄骨架

[`repo-template/`](./repo-template/index.md) 裡提供了一套可直接複製的起步
結構，核心佈局如下：

```text
AGENTS.md
ARCHITECTURE.md
docs/
├── design-docs/
│   ├── index.md
│   └── core-beliefs.md
├── exec-plans/
│   ├── active/
│   ├── completed/
│   └── tech-debt-tracker.md
├── generated/
│   └── db-schema.md
├── product-specs/
│   ├── index.md
│   └── new-user-onboarding.md
├── references/
│   ├── design-system-reference-llms.txt
│   ├── nixpacks-llms.txt
│   └── uv-llms.txt
├── DESIGN.md
├── FRONTEND.md
├── PLANS.md
├── PRODUCT_SENSE.md
├── QUALITY_SCORE.md
├── RELIABILITY.md
└── SECURITY.md
```

## 怎麼用

1. 如果倉庫還小，先用最小資源包。
2. 一旦進入多模塊、多輪會話、長期演化階段，就把
   [`repo-template/`](./repo-template/index.md) 裡的骨架複製到你的倉庫。
3. 保持 `AGENTS.md` 很短，把深層規則拆到 `docs/` 裡。
4. 把質量文檔、可靠性文檔、執行計劃當成日常開發的一部分，而不是事後補寫。
5. 把生成物和外部參考材料明確收進倉庫，避免 agent 依賴聊天上下文或人的記憶。

## SOP 資料庫

[`sops/`](./sops/index.md) 把文章裡的幾張關鍵圖，整理成可以逐步執行的標準流程：

- 分層領域架構搭建 SOP
- 把不可見知識編碼進倉庫的 SOP
- 本地可觀測性棧與反饋迴路 SOP
- 用 Chrome DevTools 做 UI 驗證閉環的 SOP

## 設計原則

- 短入口，深鏈接
- 倉庫就是唯一事實來源
- 機械約束優先於口頭約定
- 計劃、質量和技術債都和代碼一起版本化
- 清理與 harness 簡化是常規工作，不是臨時救火

這套資源包是有傾向性的範本，不是必須逐字照抄。最好的用法是把它當成一套高質量起點，再按你的項目改造。
