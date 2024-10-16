import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";

import indexPage from "./routes/index";
import projectPage from "./routes/projects";
import writeupPage from "./routes/writeups";
import { no_cache } from "./no_cache";

const app = new Elysia()
    .use(staticPlugin())
    .use(staticPlugin({ assets: "js", prefix: "js" }))
    .use(html({ autoDetect: true }))
    .use(
        no_cache({
            envTrigger: "NODE_ENV",
            envTriggerValue: "production",
            envTriggerOpt: "not",
            routes: [],
        }),
    )
    .get("/", ({ html }) => html(indexPage))
    .get("/projects", ({ html }) => html(projectPage))
    .get("/writeups", ({ html }) => html(writeupPage))
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
