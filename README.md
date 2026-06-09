# thesis_demo

簡短說明
---
`thesis_demo` 是一個示範型的網站專案，用於展示以 YOLO（ONNX / TensorFlow.js）為基礎的物件偵測範例。專案包含前端 demo、管理介面與簡單的後端伺服器（[server.py](server.py)），並收納了多種模型格式（ONNX、tfjs）。

主要功能
---
- 前端即時或離線推論（tfjs / ONNX）
- 範例頁面：登入與主畫面（位於 `templates/` 與 `static/`）
- 模型檔案集中於 `models/` 與 `docs/models/`

線上展示
---
- [GitHub Pages Demo](https://sagkgkgyukyg.github.io/thesis_demo/)

快速上手
---
需求：
- Node.js（用於前端建置）
- Python 3（用於啟動 [server.py](server.py)）

安裝與建置：

```bash
# 安裝前端相依套件
npm install

# 建置靜態檔（專案中已有 script: `build:docs`）
npm run build:docs
```

啟動伺服器：

```bash
# 使用 Python 啟動後端伺服器
python server.py
```

啟動後，於瀏覽器開啟 http://localhost:5000 （若不確定實際埠號，請查看 [server.py](server.py) 的設定）。

專案結構重點
---
- `src/`：React/前端原始碼（JSX）
- `static/`：已編譯的靜態檔（html、js、css、images）
- `templates/`：伺服器端渲染的 HTML 範本（[templates/main.html](templates/main.html)）
- `models/`：原始模型檔（ONNX 與 tfjs 目錄）
- `docs/`：靜態文件輸出與展示用的檔案
- `server.py`：簡易後端伺服器

注意事項
---
- 若希望改用別的埠或設定，請檢查並修改 [server.py](server.py) 與 `set.conf`。
- 模型檔通常較大，請注意版本與相依（ONNX / tfjs 權重與 metadata）。

授權與貢獻
---
本專案包含 [LICENSE](LICENSE)。歡迎開 pull request 與 issue。

聯絡
---
如需協助或有疑問，請在專案中開 issue。祝開發順利！
