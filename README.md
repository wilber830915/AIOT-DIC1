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

### 1. 動態高精度時鐘引擎（Precision Clock Engine）
- **雙頻分流輪詢機制（Dual-Frequency Polling Architecture）**：
  - **高頻秒級更新（500ms）**：採用 `setInterval(updateClock, 500)` 高靈敏度週期輪詢，消除整秒切換時的視覺延遲，確保時鐘與秒數跳動無延遲感。
  - **低頻靜態元資料更新（60,000ms）**：日期、時區及年份獨立交由一分鐘週期的 `setInterval(updateStaticMeta, 60000)` 執行，有效避免高頻運算浪費瀏覽器主執行緒資源。
- **DOM 差異防重繪優化（Selective DOM Repainting / Diffing）**：
  - 在更新時鐘時，嚴格比對文字節點是否改變（如 `if (el.hours.textContent !== hoursStr)`），僅在數值產生實質變更時觸發 DOM 寫入，大幅降低瀏覽器 Reflow 與 Repaint 次數。
- **防抖排版與等寬視覺對齊**：
  - 數字顯示採用專業工程字體 [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)，搭配 CSS `font-feature-settings: 'tnum'`（Tabular Numbers）與 JavaScript 雙位數補零（`padStart(2, '0')`），消除時間變換時字元寬度抖動造成的版面位移。
- **12H / 24H 雙軌格式切換**：
  - 提供頂部導覽列滑塊切換開關，支援 AM/PM 徽章顯示與 24 小時制無縫轉換；格式偏好自動儲存至 `localStorage`（`pref_time_format`），並即時連動全站主時鐘與世界城市時鐘。
- **時段感知智能問候（Context-Aware Dynamic Greetings）**：
  - 根據系統當前小時數動態劃分四時段問候與情境圖標：
    - `05:00 ~ 11:59`：🌅 **Good Morning**（晨光）
    - `12:00 ~ 16:59`：☀️ **Good Afternoon**（午後）
    - `17:00 ~ 21:59`：🌆 **Good Evening**（傍晚）
    - `22:00 ~ 04:59`：🌙 **Night Owl Hours**（夜貓時段）
  - 智能解析使用者姓名並提取 First Name（預設帶入 `Wilber`，若為空則自動降級為 `Friend`），營造具備溫度的人性化介面。
- **當日進度百分比計量器（Day Elapsed Progress Meter）**：
  - 精確計算當天自午夜起已消耗秒數佔全日（86,400 秒）的百分比：`((secondsToday / 86400) * 100).toFixed(1)`。
  - 即時動態渲染漸層進度條（`.progress-bar`）寬度與百分比文字（如 `42.5% completed`）。
- **原生系統時區與本地化日期偵測**：
  - 利用原生 `Intl.DateTimeFormat().resolvedOptions().timeZone` 自動探測客戶端時區，並精確計算 UTC 偏移量（如 `Asia/Taipei (UTC+8)`）。
  - 搭配 `toLocaleDateString` 自動本地化輸出包含星期、月份與日期的完整日期字串。

### 2. 原生跨時區世界城市時鐘（World Clocks Widget）
- **純原生時區轉換（Zero-Dependency Timezone Engine）**：
  - 完全不依賴 moment.js 或 date-fns 等第三方重型函式庫，純粹調用瀏覽器原生 `toLocaleTimeString('en-US', { timeZone, hour12 })` 實現毫秒級無損跨時區運算。
- **四大全球金融與科技中樞時間**：
  - 紐約（New York，`America/New_York` / EDT）
  - 倫敦（London，`Europe/London` / BST）
  - 東京（Tokyo，`Asia/Tokyo` / JST）
  - 雪梨（Sydney，`Australia/Sydney` / AEST）
- **全域格式連動與異常安全防護**：
  - 世界時鐘之顯示格式與主時鐘 12H/24H 設定全域同步連動。
  - 內建 `try...catch` 優雅降級（Graceful Fallback）機制，防止在缺乏特定時區資料庫的極端執行環境下引發主腳本異常。

### 3. 即時個人檔案與互動自訂模態框（Identity Customizer & Modal Dialog）
- **個人形象展示與特質標籤**：
  - 預設載入 **Wilber WEN**（HTML 骨架相容「温偉成」繁體中文標籤），包含角色定位（*Creative Technologist & Explorer*）與個人座右銘（*Building thoughtful digital experiences...*）。
  - 整合多枚風格特質膠囊標籤（💻 Developer、🎨 Designer、☕ Coffee & Code、✨ Open to Ideas [帶有微光外框]）與社群外鏈（GitHub、LinkedIn、Contact 快速聯繫）。
- **多觸發點互動模態框（Interactive Modal Dialog）**：
  - 支援點擊「頭像卡片」、「使用者姓名標題」或「鉛筆編輯圖示」等多重入口快速開啟自訂彈窗。
  - 具備 150ms 延遲平滑自動聚焦（Auto-focus）、點擊半透明遮罩背景（Backdrop Click）、取消按鈕、關閉叉叉按鈕以及鍵盤 <kbd>ESC</kbd> 快捷鍵關閉機制。
- **動態頭像縮寫演算法（Smart Initials Algorithm）**：
  - 內建 `getInitials(name)` 智慧縮寫解析演算法：單詞名稱自動提取前兩字元，多詞名稱自動抓取首字與尾字首字母並大寫化（如 `Wilber WEN` $\rightarrow$ `WW`）。
  - 頭像採用多色漸層背景，並附帶在線狀態綠色呼吸燈（`.avatar-online-badge`）。
- **單一狀態樹與本地持久化雙向同步**：
  - 採用集中式 `state` 狀態樹管理 `profile` 物件，輸入欄位具備最大字元防溢限制（姓名 32 字、職稱 48 字、簡介 140 字）。
  - 表單送出後即時雙向同步寫入 `localStorage`（`profile_name`、`profile_role`、`profile_bio`），重新整理頁面依然永久留存，並立即連動 Hero 時鐘問候語。

### 4. 現代深色毛玻璃設計系統（Modern Dark Glassmorphism Design System）
- **CSS Custom Properties 設計代碼系統**：
  - 集中定義全域設計代碼（Design Tokens），包含色彩、毛玻璃背景（`--bg-card`）、半透明描邊（`--border-glass`）、陰影層次（`--card-shadow`）、圓角階層（`--radius-sm/md/lg/full`）與精準貝茲動畫曲線（`cubic-bezier(0.16, 1, 0.3, 1)`）。
- **三套切換式主題（Three Dynamic Themes）**：
  - 🟣 `Aurora Violet`（預設極光紫）：AIoT 科技極光暗黑風格，紫粉漸層光暈與深邃夜空底色。
  - 🔵 `Cyber Cyan`（賽博青藍）：賽博龐克高對比霓虹科技風格，青藍強光與深海暗底。
  - 🟠 `Sunset Amber`（暮光琥珀）：暮光溫暖夕陽橘紅漸層色調。
  - 主題切換器支援即時色票預覽，選擇偏好自動儲存至 `localStorage('pref_theme')`，重載頁面無縫還原。
- **多層次光影與膠片噪點微紋理（Layered Ambient Glow & Noise Texture）**：
  - **動態極光光球（Ambient Glow Orbs）**：以純 CSS 打造 3 顆半徑達 400px~550px 的懸浮光球，搭配 `filter: blur(80px ~ 110px)` 與 `@keyframes pulse-glow` 呼吸位移動畫。
  - **SVG 微噪點覆蓋層（Noise Texture Overlay）**：內嵌 `feTurbulence` 噪點濾鏡，有效消除現代螢幕在深色大面積漸層下的色階斷層（Color Banding），呈現如膠片般的高級磨砂質感。
  - **磨砂毛玻璃卡片（Glass Panels）**：全站卡片採用 `backdrop-filter: blur(20px)`、半透明磨砂面、發光外邊框與微內陰影（Inset Shadow），營造出懸浮於光暈之上的立體層次。
- **極致專業字體排印（Modern Typography System）**：
  - 標題選用 Google Fonts [Outfit](https://fonts.google.com/specimen/Outfit)（現代幾何幾何無襯線字型）。
  - 內文選用 Google Fonts [Inter](https://fonts.google.com/specimen/Inter)（清晰易讀的無障礙內文字體）。
  - 時鐘數字選用 Google Fonts [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)（工程等寬數字排版）。

### 5. 便捷交互小工具與回饋系統（Utilities, Quotes & Feedback System）
- **一鍵完整格式化時間戳複製（Async Clipboard API）**：
  - 點擊時鐘右上角複製按鈕，即可將格式化時間戳完整匯出至剪貼簿（包含時間、本地星期與年月日、時區資訊，例如：`14:30:25 (Thursday, September 17, 2026 • Asia/Taipei (UTC+8))`）。
  - 呼叫原生 `navigator.clipboard.writeText`，並具備非同步異常防護與文字備援降級機制。
- **靈感名言輪播系統（Mindset & Focus Quotes）**：
  - 內建 6 則專注、時間管理與創造力哲學名言（涵蓋 William Penn、Mahatma Gandhi、Austin Freeman、Benjamin Franklin、John Wooden、Albert Einstein）。
  - 點擊刷新按鈕可觸發 200ms 的平滑淡入淡出（Opacity Fade Transition）輪播切換。
- **自訂毛玻璃 Toast 即時通知系統（Custom Debounced Toast）**：
  - 純原生 JavaScript 與 CSS 打造之底部置中毛玻璃膠囊通知，具備彈性滑入與滑出轉場動畫。
  - 內建定時器清理防抖機制（`clearTimeout(toastTimer)`），於切換時制、切換主題、複製時間、更新身分與點擊聯絡資訊時提供一致且優雅的視覺反饋。
- **全響應式與無障礙設計（RWD & Accessibility）**：
  - 採用 CSS Grid 與 Flexbox 彈性排版，設置多道自適應響應斷點（900px 平板雙欄轉單欄、540px 行動裝置緊湊排版）。
  - 具備完備的 HTML5 語意化標籤（`<header>`、`<main>`、`<section>`、`<footer>`）與 `aria-label`、`aria-live` 無障礙屬性。

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
