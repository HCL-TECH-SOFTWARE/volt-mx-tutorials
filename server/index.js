/* ========================================================================== *
 *                 Copyright (c) 2021 HCL America, Inc.                       *
 *                            All rights reserved.                            *
 * ========================================================================== *
 * Licensed under the  Apache License, Version 2.0  (the "License").  You may *
 * not use this file except in compliance with the License.  You may obtain a *
 * copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.       *
 *                                                                            *
 * Unless  required  by applicable  law or  agreed  to  in writing,  software *
 * distributed under the License is distributed on an  "AS IS" BASIS, WITHOUT *
 * WARRANTIES OR  CONDITIONS OF ANY KIND, either express or implied.  See the *
 * License for the  specific language  governing permissions  and limitations *
 * under the License.                                                         *
 * ========================================================================== */

const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const next = require("next");
const helmet = require("helmet");
const favicon = require("serve-favicon");
const routes = require("../routes");
const settings = require("../src/config/settings.json");
const fs = require("fs");

// Dynamic Sitemap XML script
const generateDynamicSitemap = require("./sitemap-script");

const dev =
  process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "testing";
const port = settings.PORT || 3200;
const app = next({ dev });

const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(
    helmet({
      frameguard: false,
    })
  );
  server.use(compression());
  server.use(cookieParser());
  server.use(
    favicon(
      path.join(__dirname, "../static", "dist", "images", "basecampFavIcon.png")
    )
  );

  const staticPath = path.join(__dirname, "../static");
  server.use(
    "/static",
    express.static(staticPath, {
      immutable: true,
    })
  );
  server.use(
    "/_next",
    express.static(staticPath, {
      immutable: true,
    })
  );
  server.use(
    "/.next",
    express.static(staticPath, {
      immutable: true,
    })
  );

  server.get("/sitemap.xml", (req, res) => {
    res.contentType("application/xml");
    res.sendFile(path.join(__dirname, "sitemap.xml"));
  });

  server.get("/robots.txt", (req, res) => {
    res.contentType("text/plain");
    res.sendFile(path.join(__dirname, "robots.txt"));
  });

  server.get("/generate-sitemap", async (req, res) => {
    const result = await generateDynamicSitemap();
    res.json(result);
  });

  server.get("*", (req, res) => handler(req, res));
  server.post("*", (req, res) => handler(req, res));

  const checkPrerequisites = () => {
    const exportDir = "./export";
    const tempDir = "./public/temp";

    // check if export directory exists
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
      console.log("export directory has been created.");
      fs.mkdirSync(`${exportDir}/assets`);
      console.log("export/assets directory has been created.");
    }

    // check if temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
      console.log("public/temp directory has been created.");
      fs.mkdirSync(`${tempDir}/assets`);
      console.log("public/temp/assets directory has been created.");
    }
  };

  function startServer() {
    server.listen(port, () => {
      checkPrerequisites();
      console.log(`> Ready on http://localhost:${port}`);
    });
  }

  startServer();
});
