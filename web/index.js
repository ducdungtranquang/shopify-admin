// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

// @ts-ignore
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  // @ts-ignore
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());
app.use(express.json());

app.get("/api/products/get/all", async (_req, res) => {
  // console.log('aaaaa');
  const countData = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData)
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});



// 
app.post("/api/page/create", async (req, res) => {
  const session = await res.locals.shopify.session
  let status = 200;
  let error = null;

  try {
    // await productCreator(res.locals.shopify.session);
    // @ts-ignore
    const page = new shopify.api.rest.Page({ session: session });
    page.title = req.body.title;
    page.body_html = req.body.body;
    page.template_suffix = req.body.template_suffix;
    page.published = req.body.published;
    page.handle = req.body.handle;

    await page.save({
      update: true,
    });
    // console.log("=====================", res.data)
  } catch (e) {
    console.log(`Failed ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.put("/api/update/:id", async (req, res) => {
  const session = await res.locals.shopify.session
  let status = 200;
  let error = null;

  try {
    const page = new shopify.api.rest.Page({ session: session });
    page.title = req.body.title;
    page.body_html = req.body.body;
    page.template_suffix = req.body.template_suffix;
    page.published = req.body.published;
    (page.id = req.body.id),
      await page.save({
        update: true,
      });
    // console.log("=====================", res.data)
  } catch (e) {
    console.log(`Failed ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.get("/api/pages/get/all", async (req, res) => {
  const session = await res.locals.shopify.session;

  try {
    const res1 = await shopify.api.rest.Page.all({
      session: session,
    });
    console.log("get", res1)
    res.status(201).json(res1);
  } catch (e) {
    console.log(`Failed ${e.message}`);
  }
});

app.get("/api/get/:id", async (req, res) => {
  const session = await res.locals.shopify.session
  // let status = 200;
  // let error = null;

  try {
    const data = await shopify.api.rest.Page.find({
      session: session,
      id: req.params.id,
    });
    console.log("get", data)
    res.status(201).json(data);
  } catch (e) {
    console.log(`Failed ${e.message}`);
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  const session = await res.locals.shopify.session;

  try {
    const res1 = await shopify.api.rest.Page.delete({
      session: session,
      id: req.params.id,
    });
    res.status(201).json(res1);
  } catch (e) {
    console.log(`Failed ${e.message}`);
  }
});


app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
