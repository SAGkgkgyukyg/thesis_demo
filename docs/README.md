# Demo for GitHub Pages

此資料夾含本專案用於 GitHub Pages 的靜態 Demo 頁面，檔案：

- `index.html`：靜態 Demo 頁面
- `.nojekyll`：避免 GitHub Pages 使用 Jekyll 處理

發佈步驟（選擇其一）：

1) 使用 `main` 分支的 `docs/` 資料夾

   - 在 GitHub repository 頁面，前往 **Settings → Pages**
   - 在 **Source** 選擇 **Branch: main**，資料夾選擇 `/docs`，按 Save

2) 或使用 `gh-pages` 分支

   ```bash
   git checkout -b gh-pages
   git rm -r --cached .
   git add docs
   git commit -m "Publish demo to gh-pages"
   git push -u origin gh-pages
   ```

備註：GitHub Pages 只會部署靜態內容；如果你的專案需要後端或 WebSocket，請保留原本的部署方式，本 Pages demo 只提供靜態展示。
