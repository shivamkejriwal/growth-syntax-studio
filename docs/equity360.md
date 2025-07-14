# 📑 Financial Data Documentation

A comprehensive, structured overview of key financial datasets sourced from Nasdaq, covering company fundamentals, financial statements, classification details, and equity actions.

---

## 📊 1. Statistics (NDAQ/STAT)

Snapshot metrics capturing recent performance, trading behavior, and valuation ratios.

| Column Name       | Example           | Description                                                                 |
|-------------------|-------------------|------------------------------------------------------------------------------|
| symbol            | MSFT              | Company ticker symbol                                                        |
| figi              | BBG000BPH459      | Bloomberg-assigned global identifier                                        |
| marketcap         | 2,057,318.4       | Market capitalization = shares × previous close price                       |
| high52week        | 315.95            | Highest adjusted trading price in past 52 calendar weeks                    |
| high52week_date   | 2023-01-06        | Date of highest price observation                                           |
| low52week         | 213.431           | Lowest adjusted trading price in past 52 calendar weeks                     |
| low52week_date    | 2023-01-06        | Date of lowest price observation                                            |
| avgvolume1m       | 31,694,057.76     | Average volume over last 1 calendar month                                   |
| avgvolume3m       | 31,999,344.81     | Average volume over last 3 calendar months                                  |
| divyield          | 0.011             | Dividend yield = dividend per share ÷ price                                 |
| dividendpershare  | 0.68              | Dividends per share, adjusted for splits/spinoffs                           |
| nextdividenddate  | null              | Expected ex-dividend date for next payout                                   |
| exdividenddate    | 2023-02-15        | Ex-dividend date for most recent dividend                                   |
| nextearningsdate  | null              | Expected date of next earnings report                                       |
| pe                | 30.5              | Price-to-earnings ratio                                                     |
| epsdil            | 2.2               | Earnings per diluted share                                                  |
| eps               | 2.2               | Basic earnings per share                                                    |
| pe1               | 26.588            | Alternative PE based on price ÷ EPS                                         |
| pb                | 26.588            | Price-to-book ratio                                                         |
| freefloat         | 0.9996            | Public float as a percentage of total shares outstanding                    |

---

## 📘 2. Fundamental Summary (NDAQ/FS)

| Column Name      | Example          | Description                                           |
|------------------|------------------|------------------------------------------------------|
| calendardate     | 2022-12-31       | Calendar-aligned reporting date                      |
| symbol           | MSFT             | Company ticker symbol                                |
| figi             | BBG000BPH459     | Bloomberg Global Identifier                          |
| reportperiod     | 2022-06-30       | Fiscal period end date                               |
| dimension        | MRY              | Annual time view                                     |
| revenue          | 198.27B          | Recognized total revenue                             |
| netmargin        | 0.367            | Net income margin                                    |
| roa              | 0.21             | Return on assets                                     |
| roe              | 0.454            | Return on equity                                     |
| ros              | 0.433            | Return on sales                                      |
| gp               | 135.62B          | Gross profit                                         |
| opinc            | 83.38B           | Operating income                                     |
| ebitda           | 100.24B          | EBITDA                                               |
| currentratio     | 1.785            | Current assets / current liabilities                 |
| de               | 1.191            | Debt-to-equity ratio                                 |
| bvps             | 22.217           | Book value per share                                 |
| tbvps            | 38.156           | Tangible book value per share                        |
| fcfps            | 8.691            | Free cash flow per share                             |
| pe               | 26.408           | Price-to-earnings ratio                              |
| ps               | 9.688            | Price-to-sales ratio                                 |
| evebit           | 22               | Enterprise value / EBIT                              |
| evebitda         | 18.73            | Enterprise value / EBITDA                            |

---

## 📊 3. Fundamental Details (NDAQ/FD)

| Column Name     | Example           | Description                                           |
|-----------------|-------------------|-------------------------------------------------------|
| revenue         | 38.03B            | Total revenue                                         |
| gp              | 25.69B            | Gross profit                                          |
| grossmargin     | 0.676             | Gross margin                                          |
| ebitda          | 17.61B            | EBITDA                                                |
| ebit            | 14.11B            | EBIT                                                  |
| opinc           | 13.4B             | Operating income                                      |
| netinc          | 11.2B             | Net income                                            |
| eps             | 1.48              | Earnings per share                                    |
| freecashflow    | 13.93B            | Free cash flow                                        |
| ncfo            | 18.67B            | Operating cash flow                                   |
| capex           | -4.74B            | Capital expenditures                                  |
| equity          | 118.3B            | Total equity                                          |
| liabilities     | 183B              | Total liabilities                                     |
| tangibles       | 250.9B            | Tangible assets                                       |
| intangibles     | 50.39B            | Intangible assets                                     |
| ev              | 1.48T             | Enterprise value                                      |
| pe1             | 34.967            | Alternative PE ratio                                  |
| divyield        | 0.01              | Dividend yield                                        |
| dps             | 0.51              | Dividend per share                                    |

---

## 💰 4. Balance Sheet (NDAQ/BS)

| Column Name     | Example           | Description                                           |
|-----------------|-------------------|-------------------------------------------------------|
| assets          | 364.84B           | Total assets                                          |
| assetsc         | 169.68B           | Current assets                                        |
| assetsnc        | 195.16B           | Non-current assets                                    |
| cashneq         | 104.76B           | Cash and equivalents                                  |
| investments     | 6.89B             | Total investments                                     |
| receivables     | 44.26B            | Trade and non-trade receivables                       |
| inventory       | 3.74B             | Inventory expected for sale/use                       |
| ppnenet         | 87.55B            | Net fixed assets                                      |
| intangibles     | 78.82B            | Intangible assets and goodwill                        |
| tangibles       | 286.02B           | Tangible assets (assets - intangibles)               |
| liabilities     | 198.3B            | Total liabilities                                     |
| debt            | 61.27B            | Total debt                                            |
| deferredrev     | 48.41B            | Deferred revenue                                      |
| taxliabilities  | 30.37B            | Outstanding tax liabilities                           |
| equity          | 166.54B           | Shareholder equity                                    |
| retearn         | 84.28B            | Retained earnings                                     |
| bvps            | 22.217            | Book value per share                                  |

---

## 💸 5. Cash Flow Statement (NDAQ/CF)

| Column Name     | Example           | Description                                           |
|-----------------|-------------------|-------------------------------------------------------|
| ncfo            | 185.38M           | Operating cash flow                                   |
| capex           | -96.03M           | Capital expenditures                                  |
| fcf             | 89.35M            | Free cash flow                                        |
| ncfi            | -82.17M           | Investing cash flow                                   |
| ncff            | -100.56M          | Financing cash flow                                   |
| sbcomp          | 8.27M             | Stock-based compensation                              |
| depamor         | 96.65M            | Depreciation and amortization                         |
| opex            | 147.16M           | Operating expenses                                    |

---

## 📈 6. Income Statement (NDAQ/IS)

| Column Name     | Example           | Description                                           |
|-----------------|-------------------|-------------------------------------------------------|
| revenue         | 2.37B             | Total recognized revenue                              |
| cor             | 1.56B             | Cost of revenue                                       |
| gp              | 813.61M           | Gross profit                                          |
| opex            | 581.49M           | Operating expenses                                    |
| opinc           | 232.13M           | Operating income                                      |
| ebitda          | 636.62M           | EBITDA                                                |
| netinc          | 155.46M           | Net income                                            |
| eps             | 1.45              | Earnings per share                                    |
| dps             | 1.235             | Dividends per share                                   |
| shareswa        | 105.25M           | Weighted average shares                               |
| shareswadil     | 106.1M            | Weighted average diluted shares                       |

---

## 🏢 7. Reference Data (NDAQ/RD)

Company identifiers and classification metadata used for regulatory filings, sector exposure, and investor analysis.

| Column Name     | Example                          | Description                                                                 |
|-----------------|----------------------------------|------------------------------------------------------------------------------|
| symbol          | AMD                              | Company ticker symbol                                                        |
| figi            | BBG000BBQCY0                     | Bloomberg global identifier                                                  |
| exchange        | NASDAQ                           | Listed exchange (e.g., NASDAQ, NYSE, NYSEARCA, BATS)                         |
| category        | Domestic Common Stock            | Type of equity instrument                                                    |
| cusips          | 007903107                        | Security identifier (space-delimited if multiple)                           |
| name            | ADVANCED MICRO DEVICES INC       | Full legal company name                                                      |
| industry        | Semiconductors                   | SIC-based industry classification                                            |
| sector          | Technology                       | Sector grouping based on SIC/GICS approximation                              |
| sector_1        | Utilities & Energy               | Primary sector exposure (TIIC Level 1)                                       |
| sector_2        | Electronics & IT                 | Secondary sector exposure (TIIC Level 1)                                     |
| companysite     | [amd.com](http://www.amd.com)    | Company’s official website                                                   |
| secfilings      | [SEC Filings](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000002488) | Link to U.S. SEC filings |
| siccode         | 3674                             | Standard Industrial Classification (SIC) code                                |
| location        | California, U.S.A                | Registered headquarters per SEC                                              |
