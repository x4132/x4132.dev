import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";

import indexPage from "./routes/index";

const app = new Elysia()
  .use(staticPlugin())
  .use(html({ autoDetect: true }))
  .get("/", ({ html }) => (html(indexPage)))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
