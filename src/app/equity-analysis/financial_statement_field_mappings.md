# Financial Statement Field Mappings

This document outlines the mapping between source CSV labels and the corresponding JSON fields for the three financial reports: Income Statement, Cash Flow Statement, and Balance Sheet.

---

## 📄 1. Income Statement

| JSON Field      | CSV Label                                                                      |
|------------------|----------------------------------------------------------------------------------|
| `symbol`         | Manually set (`PII`)                                                            |
| `calendardate`   | From year column (`YYYY-03-31`)                                                 |
| `revenue`        | `Total Revenue`                                                                 |
| `cor`            | `Cost of Revenue`                                                               |
| `opinc`          | `Operating Income`                                                              |
| `eps`            | `Earnings Per Share` or `Basic EPS`                                             |
| `ebitda`         | `Earnings Before Interest, Taxes, Depreciation, and Amortization`              |
| `ebit`           | `Earnings Before Interest and Taxes`                                            |
| `gp`             | `Gross Profit`                                                                  |
| `rnd`            | `Research and Development`                                                      |
| `sgna`           | `Selling, General & Administrative`                                             |
| `opex`           | `Operating Expenses`                                                            |
| `taxexp`         | `Income Tax Expense`                                                            |
| `netinc`         | `Net Income`                                                                    |
| `shareswa`       | `Weighted Average Shares Outstanding`                                           |
| `reporttype`     | `"AR"`                                                                          |
| `currency`       | `"USD"`                                                                         |

---

## 💸 2. Cash Flow Statement

| JSON Field      | CSV Label                                                                      |
|------------------|----------------------------------------------------------------------------------|
| `symbol`         | Manually set (`PII`)                                                            |
| `calendardate`   | From year column (`YYYY-03-31`)                                                 |
| `ncfo`           | `Net Cash Flow from Continuing Operating Activities, Indirect`                 |
| `capex`          | `Purchase of Property, Plant and Equipment` (stored as **negative**)           |
| `fcf`            | Calculated: `ncfo - capex`                                                      |
| `ncff`           | `Cash Flow from Continuing Financing Activities`                                |
| `ncfi`           | `Cash Flow from Continuing Investing Activities`                                |
| `sbcomp`         | `Stock-Based Compensation, Non-Cash Adjustment`                                 |
| `depamor`        | `Depreciation and Amortization, Non-Cash Adjustment`                            |
| `ncfcommon`      | `Issuance of/Payments for Common Stock, Net`                                    |
| `ncfinv`         | `Purchase/Sale of Equity Investments`                                           |
| `opex`           | `null` (not available in cash flow)                                             |
| `reporttype`     | `"AR"`                                                                          |
| `currency`       | `"USD"`                                                                         |

---

## 🧾 3. Balance Sheet

| JSON Field      | CSV Label                                                                      |
|------------------|----------------------------------------------------------------------------------|
| `symbol`         | Manually set (`PII`)                                                            |
| `calendardate`   | From year column (`YYYY-03-31`)                                                 |
| `debt`           | Calculated: `Total Current Liabilities + Total Non-Current Liabilities`        |
| `equity`         | `Total Equity`                                                                  |
| `assets`         | `Total Assets`                                                                  |
| `liabilities`    | `Total Liabilities`                                                             |
| `bvps`           | `(Equity - Preferred Equity) / Weighted Average Shares Outstanding`            |
| `cashneq`        | `Cash, Cash Equivalents and Short Term Investments`                             |
| `investmentsnc`  | `Total Long Term Investments`                                                   |
| `receivables`    | `Trade/Accounts Receivable, Current`                                            |
| `inventory`      | `Inventories`                                                                   |
| `ppnenet`        | `Net Property, Plant and Equipment`                                             |
| `intangibles`    | `Net Intangible Assets`                                                         |
| `tangibles`      | Calculated: `assets - intangibles`                                              |
| `reporttype`     | `"AR"`                                                                          |
| `currency`       | `"USD"`                                                                         |
