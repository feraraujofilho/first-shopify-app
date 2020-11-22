import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import koaBody from "koa-body"

import * as handlers from "./handlers/index";
import axios from "axios";
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;

const server = new Koa();
const router = new Router();

let products = []

router.get("/api/reviews", async (ctx) => {
  try {
    let data = []

    const test = await axios.get("https://openapi.etsy.com/v2/users/lyxngoap/feedback/from-buyers?api_key=u1p9defkmxo3ny0znhlzjtsv")
      .then(res => {
        data = res.data.results
      })
      .catch(err => {
        console.log(err)
      })

    ctx.body = {
      status: "success",
      data: data
    }
  } catch (error) {
    console.log(error)
  }
})


router.get("/api/products", async (ctx) => {
  try {
    ctx.body = {
      status: "success",
      data: products
    }
  } catch (err) {
    console.log(err)
  }
})

router.post("/api/products", koaBody(), async (ctx) => {
  try {
    const body = ctx.request.body;
    await products.push(body)
    ctx.body = "Item Added"
  } catch (err) {
    console.log(err)
  }
})

router.delete("/api/products", koaBody(), async (ctx) => {
  try {
    products = []
    ctx.body = "All items deleted"
  } catch (err) {
    console.log(err)
  }
})

server.use(router.allowedMethods());
server.use(router.routes());

app.prepare().then(() => {


  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.redirect("/");
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  router.get("(.*)", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });


  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});


/* router.get("/api/products", async (ctx) => {
  try {
    ctx.body = {
      status: "success",
      data: "Hello this is from the Public Api"
    }
  } catch (err) {
    console.log(err)
  }
}) */