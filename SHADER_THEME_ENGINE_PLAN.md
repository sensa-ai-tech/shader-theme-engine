# ShaderTheme Engine — 專案規劃文件

> **用途**：此文件作為 Claude Code plan mode 的輸入文件，涵蓋專案的商業邏輯、技術架構、市場分析與開發計劃。  
> **最後更新**：2026-02-14  
> **專案代號**：ShaderTheme Engine (暫定)

---

## 1. 專案概述

### 1.1 問題定義

目前 AI 生成的網頁 UI 普遍具有「廉價感」——千篇一律的 CSS 漸層、陰影、動畫讓人一眼就能辨識出是 AI 產出。這種「AI 味」會降低使用者的信任感與購買意願。

WebGL/GLSL Shader 效果能注入一種 AI 暫時無法複製的「人為修飾」質感（流體漸層、噪點紋理、光暈粒子等），但目前：

- 技術門檻高（需要理解 GLSL 語言、GPU 渲染管線）
- 整合複雜（SSR 相容性、效能調校、裝置適配）
- 沒有「整站主題級」的一鍵套用方案

### 1.2 產品願景

打造一個「PPT 選模板」式的 Shader 網站主題系統：

1. 使用者從預設主題庫中選擇一個風格（如：流體科技風、柔光品牌風、粒子極簡風）
2. 調整品牌色、動畫速度等參數
3. 一鍵產出完整的 Next.js 專案 / 或以 CLI 注入到現有專案中

### 1.3 目標使用者

| 使用者類型 | 需求 | 使用方式 |
|-----------|------|---------|
| 獨立開發者 | 快速提升專案質感 | CLI 工具 / npm package |
| 設計師 | 無需寫 code 就能預覽和匯出 | Web-based 模板選擇器 |
| 接案公司 | 快速交付高質感網站 | 整站模板 + 客製化參數 |
| SaaS 創業者 | Landing page 差異化 | 主題包一鍵套用 |

---

## 2. 市場分析

### 2.1 競品地圖

#### 元件級產品（只提供單一 shader 元件）

| 產品 | Stars | 特色 | 限制 |
|------|-------|------|------|
| **Paper Shaders** (paper-design/shaders) | 1,600+ | 零依賴、React/Vanilla、SSR 相容 | 只是元件，非主題系統；授權限制不可做競品 |
| **shadcn.io/shaders** | — | shadcn/ui 風格、CLI 安裝、TypeScript-first | 元件級，需自行組裝 |
| **react-shaders** (Rysana) | — | Shadertoy 語法相容、輕量 | 只提供 canvas 渲染，無佈局整合 |
| **gl-react** | — | React 元件化 WebGL、支援 React Native | 較舊、學習曲線高 |

#### 視覺化編輯器（做 shader 效果，但不做網站主題）

| 產品 | 特色 | 限制 |
|------|------|------|
| **Unicorn Studio** (unicorn.studio) | No-code WebGL 編輯器，可 embed 到任何網站 | 只做效果，不做整站主題 |
| **ShaderGradient** (shadergradient.co) | 專做漸層 shader，有 Framer/Figma plugin | 只有漸層一種效果 |
| **NodeToy** (nodetoy.co) | 視覺化 shader graph 編輯器 | 面向 3D 材質，非網頁 UI |
| **Shadertoy** (shadertoy.com) | 最大 shader 社群/分享平台 | 純 shader 沙盒，無網頁整合 |

#### 平台綁定產品（只在特定平台內可用）

| 產品 | 特色 | 限制 |
|------|------|------|
| **Shader Lab** (Framer plugin) | Scroll-driven shaders | 綁定 Framer |
| **Reveals** (reveals.cool) | WebGL 轉場效果元件 | 綁定 Framer |
| **Framer Shader Library** | GPU-optimized GLSL 效果集 | 綁定 Framer |
| **Webflow Shader Templates** | 社群製作的 shader 網站 | 綁定 Webflow |

#### 通用 shader 工具庫

| 產品 | 特色 | 限制 |
|------|------|------|
| **LYGIA** (lygia.xyz) | 多語言 GLSL 函數庫 | 底層工具，非面向終端使用者 |
| **glslify** | Node.js 風格 GLSL 模組系統 | 純工具庫 |
| **Three.js** | 最流行的 WebGL 框架 | 泛用 3D 框架，非 UI 專用 |

### 2.2 市場缺口

```
元件級                    整站主題級
(Paper Shaders,          (??? — 目前空白)
 shadcn.io/shaders)
      ↓                        ↓
  單一 shader 效果    →    完整頁面佈局 + shader 裝飾
  開發者手動整合      →    一鍵套用 / CLI 注入
  需要懂 WebGL       →    只需選模板 + 調色
  無 SSR 處理        →    內建 SSR 安全機制
```

**核心差異化**：目前沒有任何產品做到「選一個 shader 主題 → 整頁/整站套用 → 產出可用的 Next.js 專案」。

### 2.3 商業模式選項

| 模式 | 說明 | 優缺點 |
|------|------|--------|
| **開源核心 + 付費主題包** | 引擎開源、精品主題收費 | 社群增長快，但變現需要量 |
| **SaaS 訂閱制** | 月費使用線上編輯器 + 匯出 | 穩定收入，但需維護平台 |
| **一次性購買** (ThemeForest 模式) | 每套主題獨立定價 | 簡單直接，但缺乏複利效應 |
| **Freemium CLI** | 免費基礎主題、付費進階 | 開發者友善，轉換率待驗證 |

**建議初期方向**：開源核心 + 3-5 套免費主題 + 付費進階主題包，先建立社群和口碑。

---

## 3. 技術原理

### 3.1 Shader 運作原理

```
JavaScript                    WebGL API                 GPU
─────────────────────────────────────────────────────────────
canvas 元素           →    編譯 GLSL 程式碼      →    平行運算
uniform 變數          →    傳入 time/mouse/color  →    每像素獨立計算
(time, color, mouse)  →    每幀 60fps 更新       →    輸出像素顏色
```

**兩種 Shader**：
- **Vertex Shader**：決定頂點位置（形狀、幾何變形）
- **Fragment Shader**：決定每個像素的顏色（光影、漸層、噪點）

**為什麼 AI 難以複製**：
- CSS 效果是離散且可預測的（linear-gradient, box-shadow）
- Shader 效果來自連續數學函數（Perlin noise, Simplex noise, Fresnel 方程式）
- 產生的視覺複雜度在計算上是 CSS 不可能達到的

### 3.2 關鍵技術挑戰

| 挑戰 | 說明 | 解法 |
|------|------|------|
| **SSR 500 錯誤** | WebGL 依賴 `window`/`canvas`，伺服器端不存在 | `dynamic import` + `ssr: false`，或 `useEffect` guard |
| **跑版** | Canvas 不隨 parent 自適應、`display: inline` 底部空隙 | ResizeObserver 監聽 + `display: block` |
| **效能 (手機)** | 低階 GPU 跑複雜 shader 會卡頓/崩潰 | 裝置偵測 → 降級或 fallback 成 CSS |
| **WebGL context 上限** | 瀏覽器同時只允許 8-16 個 context | 共用 context 或限制同頁 shader 數量 |
| **Build 失敗** | Vercel CI 嘗試 SSR 渲染含 WebGL 頁面 | 確保所有 shader 元件標記為 client-only |

### 3.3 Shader 參數化設計

Shader 的 `uniform` 變數天然就是設計來從外部傳值的：

```glsl
// Fragment Shader 範例
uniform float u_time;       // 動畫時間
uniform vec3 u_color1;      // 品牌主色
uniform vec3 u_color2;      // 品牌副色
uniform float u_speed;      // 動畫速度
uniform float u_intensity;  // 效果強度
uniform vec2 u_resolution;  // 畫面解析度

void main() {
    // 基於 uniform 參數計算每個像素的顏色
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float noise = simplex(uv * u_intensity + u_time * u_speed);
    vec3 color = mix(u_color1, u_color2, noise);
    gl_FragColor = vec4(color, 1.0);
}
```

這些 uniform 可以直接映射為使用者介面的控制項：
- `u_color1/2` → 調色盤
- `u_speed` → 速度滑桿
- `u_intensity` → 強度滑桿

---

## 4. 系統架構

### 4.1 三層架構

```
┌─────────────────────────────────────────────────────┐
│  Layer 3: 應用層 (Application Layer)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ Web 模板     │  │ CLI 工具      │  │ API 服務     │ │
│  │ 選擇器/編輯器│  │ (npx command)│  │ (REST/SDK)  │ │
│  └─────────────┘  └──────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────┤
│  Layer 2: 主題組合層 (Theme Composition Layer)        │
│  ┌──────────────────────────────────────────────────┐│
│  │ Theme Config (JSON/YAML)                          ││
│  │ - 定義每個頁面區塊使用哪個 shader                    ││
│  │ - 定義 shader 參數（顏色、速度、強度）                ││
│  │ - 定義佈局結構（hero, navbar, card, footer）        ││
│  │ - 定義 fallback 策略（CSS 降級方案）                  ││
│  └──────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│  Layer 1: Shader 效果庫 (Shader Effect Library)       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │Mesh  │ │Noise │ │Glow  │ │Fluid │ │Parti-│     │
│  │Grad. │ │Grain │ │Orb   │ │Wave  │ │cles  │     │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │
│  每個效果：可調參數 + 效能分級 + CSS fallback           │
└─────────────────────────────────────────────────────┘
```

### 4.2 主題配置格式 (Theme Config)

```jsonc
{
  "name": "Nebula Tech",
  "version": "1.0.0",
  "description": "深色科技風格，流體漸層 + 粒子效果",
  
  "global": {
    "colors": {
      "primary": "#5100ff",
      "secondary": "#00ff80",
      "accent": "#ffcc00",
      "background": "#0a0a0a",
      "text": "#ffffff"
    },
    "performance": {
      "maxShaderInstances": 4,
      "enableOnMobile": true,
      "mobileSimplify": true,
      "fallbackStrategy": "css-gradient"
    }
  },

  "sections": {
    "hero": {
      "shader": "mesh-gradient",
      "params": {
        "colors": ["$primary", "$secondary", "$accent"],
        "distortion": 1.2,
        "swirl": 0.8,
        "speed": 0.15
      },
      "layout": "full-viewport",
      "fallback": {
        "type": "css",
        "value": "linear-gradient(135deg, $primary, $secondary)"
      }
    },
    "navbar": {
      "shader": "frosted-glass",
      "params": {
        "blur": 12,
        "opacity": 0.8,
        "tint": "$background"
      },
      "fallback": {
        "type": "css",
        "value": "backdrop-filter: blur(12px)"
      }
    },
    "cards": {
      "shader": "subtle-glow",
      "params": {
        "glowColor": "$primary",
        "intensity": 0.3,
        "radius": 200
      },
      "trigger": "hover",
      "fallback": {
        "type": "css",
        "value": "box-shadow: 0 0 20px rgba(81,0,255,0.3)"
      }
    },
    "footer": {
      "shader": "noise-grain",
      "params": {
        "density": 0.05,
        "speed": 0,
        "color": "$background"
      },
      "fallback": {
        "type": "none"
      }
    }
  }
}
```

### 4.3 技術棧

| 層級 | 技術 | 原因 |
|------|------|------|
| **框架** | Next.js 14+ (App Router) | 目標使用者最常用的框架，SSR/SSG 支援 |
| **語言** | TypeScript | 型別安全，與 shadcn 生態一致 |
| **樣式** | Tailwind CSS 4 | 與 shader 效果互補的 utility-first CSS |
| **Shader 渲染** | 原生 WebGL2 / Canvas API | 零依賴，最大相容性 |
| **UI 元件** | shadcn/ui | 與目標使用者的既有專案相容 |
| **CLI** | Node.js (commander/inquirer) | 開發者友善的互動式安裝 |
| **模板引擎** | 自建 JSON config → code generator | 靈活度最高 |
| **部署** | Vercel | 與 Next.js 生態最佳整合 |
| **套件管理** | npm / pnpm | 標準化發佈 |

### 4.4 目錄結構（產出的 Next.js 專案）

```
my-project/
├── app/
│   ├── layout.tsx              # 根佈局，包含 ShaderProvider
│   ├── page.tsx                # Landing page
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn/ui 元件
│   ├── shaders/                # Shader 元件（client-only）
│   │   ├── ShaderCanvas.tsx    # 基底 canvas 元件
│   │   ├── MeshGradient.tsx    # 流體漸層
│   │   ├── NoiseGrain.tsx      # 噪點紋理
│   │   ├── GlowOrb.tsx        # 光暈效果
│   │   ├── FluidWave.tsx       # 流體波動
│   │   └── FallbackWrapper.tsx # 降級包裝器
│   └── sections/               # 頁面區塊
│       ├── Hero.tsx
│       ├── Navbar.tsx
│       ├── Features.tsx
│       └── Footer.tsx
├── lib/
│   ├── shaders/                # GLSL 原始碼
│   │   ├── mesh-gradient.frag
│   │   ├── noise-grain.frag
│   │   └── glow-orb.frag
│   ├── shader-utils.ts         # WebGL 工具函數
│   ├── device-detect.ts        # 裝置偵測 + 效能分級
│   └── theme-config.ts         # 主題配置解析
├── themes/
│   └── nebula-tech.json        # 主題配置檔
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 5. 開發計劃

### Phase 0: 技術驗證 (PoC) — 預計 1-2 週

**目標**：驗證核心技術可行性

- [ ] 建立基底 `ShaderCanvas` 元件（WebGL2 context 管理、resize、cleanup）
- [ ] 實作 3 個基礎 shader 效果（MeshGradient, NoiseGrain, GlowOrb）
- [ ] 實作 SSR 安全機制（dynamic import + client-only guard）
- [ ] 實作 fallback 機制（WebGL 偵測 → CSS 降級）
- [ ] 實作裝置效能偵測（GPU tier 分級）
- [ ] 在 Next.js 14 App Router 中驗證一切正常運作
- [ ] 部署到 Vercel 確認 build + runtime 無問題

**產出**：一個可運作的 demo 頁面，展示 3 種 shader 效果 + fallback

### Phase 1: 主題系統 — 預計 2-3 週

**目標**：建立主題配置系統

- [ ] 設計 Theme Config JSON Schema
- [ ] 實作 ThemeProvider context（讀取 config → 分配 shader 到各區塊）
- [ ] 建立 3 套完整主題（含佈局 + shader 配置）：
  - 「Nebula Tech」— 深色科技風（流體漸層 + 粒子）
  - 「Soft Glow」— 淺色品牌風（柔光 + 微噪點）
  - 「Minimal Pulse」— 極簡風（單色脈動 + 幾何線條）
- [ ] 實作主題切換功能（runtime 動態切換）
- [ ] 實作 $variable 色彩引用系統（主題色自動套用到 shader）

**產出**：3 套可切換的完整主題 demo

### Phase 2: CLI 工具 — 預計 2 週

**目標**：開發者可用 CLI 一鍵建立或注入 shader 主題

- [ ] 建立 CLI 框架（commander + inquirer 互動式選擇）
- [ ] `npx shader-theme init` — 建立全新 Next.js + shader 專案
- [ ] `npx shader-theme add` — 注入 shader 主題到現有 Next.js 專案
- [ ] `npx shader-theme list` — 列出可用主題
- [ ] `npx shader-theme customize` — 互動式調整主題參數
- [ ] 發佈到 npm

**CLI 使用流程**：
```bash
# 全新專案
npx shader-theme init my-site
# → 互動式選擇主題 → 輸入品牌色 → 產生完整專案

# 注入到現有專案
cd my-existing-project
npx shader-theme add nebula-tech
# → 自動安裝依賴 → 複製 shader 元件 → 建立 theme config
```

### Phase 3: Web 模板選擇器 — 預計 3-4 週

**目標**：非技術使用者也能預覽和匯出

- [ ] 建立線上模板選擇器（Next.js 站點）
- [ ] 即時預覽功能（選主題 → 即時看到效果）
- [ ] 參數調整面板（色彩、速度、強度滑桿）
- [ ] 匯出功能：
  - 下載完整 Next.js 專案 .zip
  - 複製 CLI 指令
  - 一鍵 deploy 到 Vercel
- [ ] SEO + 行銷頁面

**產出**：公開網站 shadertheme.dev（暫定）

### Phase 4: 擴展與變現 — 持續進行

- [ ] 擴展 shader 效果庫（目標 15+ 種效果）
- [ ] 擴展主題庫（目標 10+ 套主題）
- [ ] 付費進階主題包
- [ ] 社群貢獻機制（使用者提交自製主題）
- [ ] Figma plugin（設計師可在 Figma 預覽 shader 效果）
- [ ] 與獸醫平台整合（自家 dogfooding）

---

## 6. 風險評估

| 風險 | 影響 | 機率 | 緩解策略 |
|------|------|------|---------|
| WebGL 相容性問題多 | 高 | 中 | 完善的 fallback 機制 + 裝置白名單 |
| 效能在低階裝置太差 | 高 | 高 | GPU tier 分級 + 自動降級 |
| Paper Shaders 授權限制 | 中 | 確定 | 自己寫 shader 效果，不 fork Paper Shaders |
| 市場需求不如預期 | 高 | 中 | Phase 0 先做 PoC 驗證，低成本試錯 |
| 維護負擔（多框架支援） | 中 | 高 | 初期只支援 Next.js，穩定後再擴展 |

---

## 7. 成功指標

### Phase 0 (PoC)
- 3 個 shader 效果在 Next.js 14 + Vercel 上穩定運行
- 手機端（iPhone 12+ / Android mid-range+）流暢度 ≥ 55fps
- Lighthouse Performance 分數 ≥ 90

### Phase 1-2 (MVP)
- GitHub stars ≥ 100（發佈後 1 個月）
- npm weekly downloads ≥ 500
- 至少 3 個外部專案採用

### Phase 3-4 (Growth)
- 線上模板選擇器 MAU ≥ 5,000
- 付費主題轉換率 ≥ 3%
- 社群貢獻主題 ≥ 5 套

---

## 8. 與現有專案的關聯

### 獸醫平台 (上弦動物生技) 適用場景

| 頁面 | 適用 Shader 效果 | 目的 |
|------|-----------------|------|
| 官網首頁 Hero | MeshGradient（暖色調流體漸層） | 建立專業信任感 |
| 服務介紹卡片 | SubtleGlow（hover 光暈） | 提升互動質感 |
| 產品頁面背景 | NoiseGrain（微噪點紋理） | 增加高級感 |
| 登入/註冊頁 | SoftPulse（柔和脈動背景） | 營造安心氛圍 |

### 技術棧相容性

- ✅ Next.js App Router — 完全相容
- ✅ Supabase — 無衝突（shader 純前端）
- ✅ TypeScript — 原生支援
- ✅ Vercel 部署 — 已驗證可行
- ✅ Tailwind CSS — 互補使用

---

## 9. 開發原則

1. **零依賴優先**：shader 核心不依賴 Three.js 或任何大型框架
2. **漸進增強**：沒有 WebGL 的環境也要有可接受的 CSS fallback
3. **效能預算**：任何 shader 效果不可讓 FPS 低於 55（手機端）
4. **SSR 安全**：所有 shader 元件必須是 client-only，永不在伺服器端執行
5. **型別安全**：完整的 TypeScript 定義，包括 theme config 的 JSON Schema
6. **可組合性**：shader 效果可自由組合疊加，不互相干擾
7. **授權乾淨**：所有 shader 效果自行撰寫或使用 MIT 授權的來源

---

## 10. 參考資源

### 學習資源
- [The Book of Shaders](https://thebookofshaders.com/) — GLSL 入門聖經
- [Shadertoy](https://www.shadertoy.com/) — shader 效果靈感庫
- [WebGL2 Fundamentals](https://webgl2fundamentals.org/) — WebGL 基礎教學

### 技術參考
- [Paper Shaders GitHub](https://github.com/paper-design/shaders) — 零依賴 shader 元件參考架構
- [shadcn.io/shaders](https://www.shadcn.io/shaders) — GPU shader 元件集合
- [shaders.com](https://shaders.com/) — WebGPU 效果元件庫 + 視覺編輯器
- [Unicorn Studio](https://www.unicorn.studio/) — No-code WebGL 編輯器參考
- [ShaderGradient](https://shadergradient.co/) — 漸層 shader 視覺化調參 UX 參考
- [LYGIA](https://lygia.xyz/) — GLSL 函數庫

### 商業參考
- [Framer Marketplace](https://www.framer.com/marketplace/) — shader plugin 的定價與包裝方式
- [shadcn/ui](https://ui.shadcn.com/) — CLI 安裝模式 + 社群增長策略參考
- [Vercel Templates](https://vercel.com/templates/next.js) — 模板分發渠道

---

## 附錄 A: Claude Code 使用指引

### 在 Plan Mode 中使用此文件

```bash
# 在 Claude Code 中開啟 plan mode
# 將此文件作為 context 傳入

# 範例 prompt:
# "根據 SHADER_THEME_ENGINE_PLAN.md，開始執行 Phase 0 的第一個任務：
#  建立基底 ShaderCanvas 元件"
```

### 推薦的開發順序

1. 先讀完 Phase 0 的所有任務
2. 從 `ShaderCanvas` 基底元件開始
3. 逐步實作每個 shader 效果
4. 每完成一個效果就做一次 Vercel 部署驗證
5. Phase 0 全部完成後再進入 Phase 1

### 每個 Phase 的 checkpoint

- Phase 0 完成 → demo 頁面可公開分享
- Phase 1 完成 → 3 套主題可在線切換展示
- Phase 2 完成 → npm 可安裝、CLI 可用
- Phase 3 完成 → 公開網站上線
