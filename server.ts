import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

// Middleware to serve static files with clean URLs (e.g. /tools -> /tools.html)
app.use((req, res, next) => {
  // Ignore requests with extensions like .js, .css, etc.
  if (path.extname(req.path)) {
    return next();
  }

  // Determine path to HTML file
  let normalizedPath = req.path;
  if (normalizedPath === "/" || normalizedPath === "") {
    normalizedPath = "/index";
  }

  const htmlPath = path.join(process.cwd(), `${normalizedPath}.html`);
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    next();
  }
});

// Serve assets and other static files
app.use(express.static(process.cwd()));

// SPA fallback for dev server (redirects to home if no route matches)
app.use((req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
