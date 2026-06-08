const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const templatesDir = path.join(projectRoot, 'templates');
const staticDir = path.join(projectRoot, 'static');
const docsDir = path.join(projectRoot, 'docs');

// create docs dir
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.mkdirSync(docsDir, { recursive: true });

// read main template and adjust asset paths
const mainTpl = path.join(templatesDir, 'main.html');
if (!fs.existsSync(mainTpl)) {
  console.error('templates/main.html not found');
  process.exit(1);
}
let html = fs.readFileSync(mainTpl, 'utf8');
// replace references to ../static/... with static/...
html = html.replace(/\.\.\/static\//g, 'static/');
// write to docs/index.html
fs.writeFileSync(path.join(docsDir, 'index.html'), html, 'utf8');
console.log('Wrote docs/index.html');

// copy static folder into docs/static
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(staticDir, path.join(docsDir, 'static'));
console.log('Copied static/ to docs/static/');

// copy favicon folder if exists
const faviconSrc = path.join(projectRoot, 'favicon');
if (fs.existsSync(faviconSrc)) {
  copyRecursive(faviconSrc, path.join(docsDir, 'favicon'));
  console.log('Copied favicon/ to docs/favicon/');
}

// copy models directory so github pages can serve model files
const modelsSrc = path.join(projectRoot, 'models');
if (fs.existsSync(modelsSrc)) {
  copyRecursive(modelsSrc, path.join(docsDir, 'models'));
  console.log('Copied models/ to docs/models/');
} else {
  console.warn('models/ not found at project root; skipping models copy');
}

console.log('prepare_docs completed.');
