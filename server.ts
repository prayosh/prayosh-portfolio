import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve API or health first (if any)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Use custom middleware mode to control clean routing manually
    });
  }

  // Rewrite clean URLs like /about to about.html, /contact to contact.html etc.
  app.get("*", async (req, res, next) => {
    const url = req.path;
    
    // Ignore paths with extensions (like .css, .js, .png)
    if (path.extname(url)) {
      return next();
    }
    
    // Match clean URLs to corresponding html files
    let pageName = url === "/" ? "index" : url.substring(1);
    
    // Clean trailing slashes or subdirectories
    if (pageName.endsWith("/")) {
      pageName = pageName.slice(0, -1);
    }
    if (pageName === "") pageName = "index";

    const localHtmlFile = path.join(process.cwd(), `${pageName}.html`);

    if (fs.existsSync(localHtmlFile)) {
      if (process.env.NODE_ENV !== "production") {
        try {
          let html = fs.readFileSync(localHtmlFile, "utf-8");
          // Apply Vite HTML transforms (injects HMR, scripts etc.)
          html = await vite.transformIndexHtml(req.originalUrl || req.url, html);
          res.setHeader("Content-Type", "text/html");
          return res.status(200).send(html);
        } catch (e) {
          if (vite && vite.ssrFixStacktrace) {
            vite.ssrFixStacktrace(e);
          }
          return next(e);
        }
      } else {
        const prodHtmlFile = path.join(process.cwd(), "dist", `${pageName}.html`);
        if (fs.existsSync(prodHtmlFile)) {
          return res.sendFile(prodHtmlFile);
        }
      }
    }
    
    next();
  });

  if (process.env.NODE_ENV !== "production") {
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      // Direct SPA fallback should serve index.html if file has no extension
      if (!path.extname(req.path)) {
        res.sendFile(path.join(distPath, "index.html"));
      } else {
        next();
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
