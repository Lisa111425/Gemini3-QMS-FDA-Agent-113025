import { Theme } from './types';

export const FLOWER_THEMES: Theme[] = [
  { name: "Sakura", primary: "#ff9aae", secondary: "#ffe4ec", accent: "#ff6b9d" },
  { name: "Rose", primary: "#c21f3a", secondary: "#ffe3e8", accent: "#ff6f91" },
  { name: "Lavender", primary: "#8e7cc3", secondary: "#f3ecff", accent: "#b4a7d6" },
  { name: "Sunflower", primary: "#f1c232", secondary: "#fff5cc", accent: "#f6b26b" },
  { name: "Lotus", primary: "#ff99cc", secondary: "#ffe6f2", accent: "#ff66b3" },
  { name: "Orchid", primary: "#b565a7", secondary: "#f7d9ff", accent: "#e066ff" },
  { name: "Peony", primary: "#e06666", secondary: "#fde3e3", accent: "#cc0000" },
  { name: "Camellia", primary: "#d9534f", secondary: "#fbe4e2", accent: "#c9302c" },
  { name: "Magnolia", primary: "#f6b26b", secondary: "#fff2e5", accent: "#e69138" },
  { name: "Hydrangea", primary: "#6fa8dc", secondary: "#e3f2fd", accent: "#3c78d8" },
  { name: "Cherry Blossom", primary: "#ffb3c6", secondary: "#ffe6f0", accent: "#ff6f91" },
  { name: "Gardenia", primary: "#a4c2f4", secondary: "#ecf3ff", accent: "#6d9eeb" },
  { name: "Jasmine", primary: "#f9cb9c", secondary: "#fff5e6", accent: "#f6b26b" },
  { name: "Iris", primary: "#674ea7", secondary: "#efe5ff", accent: "#8e7cc3" },
  { name: "Poppy", primary: "#e06666", secondary: "#ffe0e0", accent: "#cc0000" },
  { name: "Daisy", primary: "#ffd966", secondary: "#fff9e6", accent: "#f1c232" },
  { name: "Marigold", primary: "#f6b26b", secondary: "#fff0de", accent: "#e69138" },
  { name: "Bluebell", primary: "#6d9eeb", secondary: "#e5f1ff", accent: "#3c78d8" },
  { name: "Tulip", primary: "#e06666", secondary: "#ffe2e2", accent: "#cc0000" },
  { name: "Wisteria", primary: "#b4a7d6", secondary: "#f3ecff", accent: "#8e7cc3" },
];

export const FOLLOW_UP_QUESTIONS_EN = [
  "How does the identified non-conformity impact patient safety directly?",
  "What is the root cause analysis method used for this observation?",
  "Can you trace this batch record back to the raw material supplier?",
  "Is this a systemic issue or an isolated incident?",
  "How does this finding align with ISO 13485:2016 Clause 7.3?",
  "What preventative actions are proposed to avoid recurrence?",
  "Has this risk been captured in the Risk Management File (ISO 14971)?",
  "Are the personnel training records up to date for this procedure?",
  "When was the last internal audit conducted on this subsystem?",
  "Does the CAPA plan include a realistic timeline for closure?",
  "How will the effectiveness of the corrective action be verified?",
  "Are there similar gaps in other product lines?",
  "Does this affect the current CE marking validity?",
  "What statistical techniques were used to validate this process?",
  "Is the software validation documentation complete (IEC 62304)?",
  "How are suppliers monitored for performance quality?",
  "Was the environmental monitoring data within limits during production?",
  "Are the sterilization validation reports current?",
  "How is customer feedback integrated into the post-market surveillance?",
  "What is the financial impact of this quality gap?"
];

export const FOLLOW_UP_QUESTIONS_ZH = [
  "此不符合事項如何直接影響病患安全？",
  "針對此觀察事項使用了何種根本原因分析方法？",
  "能否將此批次記錄追溯至原材料供應商？",
  "這是系統性問題還是單一偶發事件？",
  "此發現如何對應 ISO 13485:2016 第 7.3 條款？",
  "提出了哪些預防措施以避免再次發生？",
  "此風險是否已記錄在風險管理檔案 (ISO 14971) 中？",
  "執行此程序的人員培訓記錄是否為最新？",
  "上次針對此子系統進行內部稽核是什麼時候？",
  "CAPA 計畫是否包含合理的結案時間表？",
  "將如何驗證矯正措施的有效性？",
  "其他產品線是否存在類似缺口？",
  "這是否影響目前的 CE 標誌有效性？",
  "使用了哪些統計技術來驗證此過程？",
  "軟體驗證文件是否完整 (IEC 62304)？",
  "如何監控供應商的績效品質？",
  "生產期間的環境監測數據是否在限值內？",
  "滅菌驗證報告是否為最新版本？",
  "客戶反饋如何整合到上市後監督中？",
  "此品質缺口的財務影響為何？"
];

export const DEFAULT_TEMPLATE = `
# Audit Report / 稽核報告

## 1. Scope / 範圍
[Description of audit scope]

## 2. Observations / 觀察事項
| ID | Type | Description | Clause |
|----|------|-------------|--------|
| 01 | NC   | [Detail]    | 8.2.1  |

## 3. Conclusion / 結論
[Summary of findings]
`;

export const DEFAULT_OBSERVATIONS = `
- Observed missing signature on batch record #B-123.
- Temperature log for warehouse shows excursion on 2023-10-15.
- Training matrix does not include new version of SOP-QA-005.
`;