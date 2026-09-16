## 📁 1. 專案結構與模組說明

```text
c:\Users\user\Desktop\DIC\
├── index.html       # 語意化 HTML5 骨架、動態時鐘 Hero 卡片、個人檔案與彈窗模態框
├── style.css        # CSS Custom Properties、深色毛玻璃、光影動畫與響應式系統
├── app.js           # 高精度時鐘引擎、時區計算、單一狀態樹與 LocalStorage 同步
├── README.md        # 課堂實作報告與部署文件
└── .gitignore       # Git 版本控制忽略設定
```

| 檔案 | 角色與技術重點 |
| :--- | :--- |
| **`index.html`** | **結構層**：HTML5 語意化標籤、SVG 向量圖標、時間格式切換鈕、Hero 時鐘展示區、個人識別卡片、世界時鐘網格、身分自訂 Modal 與 Toast 提示。 |
| **`style.css`** | **樣式層**：CSS Variables 設計代碼系統、`backdrop-filter` 磨砂毛玻璃質感、三套主題（Aurora / Cyber / Sunset）、環境微光懸浮動畫、無障礙與全響應式（RWD）設計。 |
| **`app.js`** | **行為層**：精準秒級動態時鐘循環、12H/24H 時間格式轉換、時段感知問候邏輯、當日進度計算、跨時區城市時間換算、個人身分自訂與 `localStorage` 狀態雙向持久化。 |

---

## ⚙️ 2. 核心功能與工程亮點

### 1. 動態高精度時鐘（Hero Timekeeper）
- **即時數位時鐘**：毫秒級輪詢即時更新小時、分鐘與秒數（`HH:MM:SS`），搭配跳動冒號動畫與等寬數字排版（`font-feature-settings: 'tnum'`），避免數字跳動造成版面位移。
- **時段感知問候**：依據當前小時（$05\sim 11$ 晨光、$12\sim 16$ 午後、$17\sim 21$ 傍晚、$22\sim 04$ 深夜）動態切換問候語與專屬圖標，並自動帶入學生姓名（如：*Good Evening, Wilber*）。
- **12H / 24H 雙軌切換**：支援即時 AM/PM 徽章顯示與 24 小時制無縫轉換，設定自動持久化於瀏覽器。
- **當日時間進度條（Day Progress Meter）**：精確計算當天已過秒數佔整日的百分比（$0.0\% \sim 100.0\%$），並以動態漸層進度條呈現。
- **世界主要城市時鐘（World Clocks）**：透過原生 `Intl.DateTimeFormat` 動態計算紐約（EDT）、倫敦（BST）、東京（JST）與雪梨（AEST）的即時時間。

### 2. 即時個人識別與行內自訂（Live Identity Customizer）
- **預設身分展示**：預設載入 **Wilber WEN**，包含身分標籤（*Creative Technologist & Explorer*）與技術標籤（*Developer, Designer, Coffee & Code*）。
- **即時彈窗自訂**：點擊編輯按鈕、頭像或姓名即可開啟毛玻璃互動模態框，可自訂顯示姓名、職稱與個人簡介。
- **動態頭像縮寫**：依據輸入姓名即時計算縮寫（如 `Wilber WEN` $\rightarrow$ `WW`），並賦予漸層光暈與線上狀態呼吸指示燈。
- **本地持久化儲存**：所有資料與偏好即時同步至 `localStorage`，重新整理或重啟瀏覽器依然完整保留。

### 3. 現代深色毛玻璃設計系統（Modern Dark Glassmorphism）
- **環境微光（Ambient Glow Orbs）**：以純 CSS 搭配 `filter: blur(100px)` 打造三顆多層次懸浮動態極光光球，帶來沉浸式科技氛圍。
- **三套主題一鍵切換**：
  - `Aurora Violet`：預設 AIoT 科技極光暗黑風格（紫粉漸層光暈）
  - `Cyber Cyan`：賽博龐克藍綠高對比科技風
  - `Sunset Amber`：暮光暖橘與熱帶暖紅色調
- **極致排版**：採用 Google Fonts（[Outfit](https://fonts.google.com/specimen/Outfit) 標題字體、[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) 時鐘數字、[Inter](https://fonts.google.com/specimen/Inter) 內文字體）。

### 4. 便捷交互與靈感小語（Utilities & Focus Quotes）
- **一鍵時間複製**：點擊時鐘右上角複製按鈕，即可將格式化時間戳複製至剪貼簿，並伴隨底部玻璃 Toast 動畫提示。
- **靈感小語輪播**：收錄專注與時間管理哲學名言，支援一鍵點擊切換。

---

## ⌨️ 3. 鍵盤快捷鍵（Keyboard Shortcuts）

| 快捷鍵 | 功能說明 |
| :---: | :--- |
| <kbd>T</kbd> | 切換 12 小時制（AM/PM）/ 24 小時制 |
| <kbd>C</kbd> | 複製當前格式化時間戳至剪貼簿（附 Toast 提示） |
| <kbd>ESC</kbd> | 關閉身分自訂彈窗模態框 |

---

## 🚀 4. 本機執行與快速啟動

本專案為純原生靜態網頁，無需安裝任何 `node_modules`。使用任何本機伺服器即可啟動：

```powershell
# 在專案目錄（c:\Users\user\Desktop\DIC）下執行
python -m http.server 8080
```

開啟瀏覽器前往：[http://localhost:8080](http://localhost:8080)

---

## 🌐 5. GitHub 與 GitHub Pages 部署指南

### 步驟 1：初始化並推送至 GitHub
若您已在 GitHub 建立空的儲存庫（Repository），於專案目錄執行：

```powershell
# 1. 初始化 Git 儲存庫
git init

# 2. 加入所有檔案並提交
git add .
git commit -m "feat: DIC-1 personal portal & live clock for Wilber WEN"

# 3. 設定主分支為 main
git branch -M main

# 4. 關聯至您的 GitHub 遠端儲存庫（請將 YOUR_USERNAME 與 REPO_NAME 替換為實際名稱）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 5. 推送至 GitHub
git push -u origin main
```

### 步驟 2：啟用 GitHub Pages 無伺服器發布
1. 前往 GitHub 儲存庫頁面 $\rightarrow$ 點選上方 **Settings**。
2. 於左側側邊欄選擇 **Pages**。
3. 在 **Build and deployment** $\rightarrow$ **Source** 選擇 **Deploy from a branch**。
4. **Branch** 選擇 `main`，資料夾選擇 `/ (root)`，點選 **Save**。
5. 等待約 1 分鐘後，即可透過專屬網址在全球任何裝置上存取您的動態時鐘入口網站！

---

## 🎯 6. 課堂學習檢核點（Learning Verification Checklist）

- [x] **語意化結構**：使用標準 HTML5 語意化標籤（`<header>`、`<main>`、`<section>`、`<footer>`）與無障礙 ARIA 標籤。
- [x] **CSS 設計系統**：運用 CSS 自訂屬性（Variables）建構支援三套主題切換的現代深色毛玻璃介面。
- [x] **動態時間運算**：使用現代 JavaScript 實現高精度動態時鐘、時段問候、當日進度條與跨時區時間轉換。
- [x] **狀態持久化**：實踐狀態樹與 `localStorage` 雙向同步，在重新載入後完整保存使用者名稱與偏好設定。
- [x] **零相依設計**：全站無外部框架與建構依賴，原生相容各現代瀏覽器並支援響應式行動裝置。

---
*Created with precision for AIoT-DA Lecture 2 (DIC-1) • Wilber WEN*
