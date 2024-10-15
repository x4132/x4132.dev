import { Context, Elysia } from "elysia";

export type no_cache_opt = {
  envTrigger: string | undefined;
  envTriggerValue: string | undefined;
  envTriggerOpt: "only" | "not";
  routes: string[] | undefined;
};

export const no_cache = ({
  envTrigger = "NODE_ENV",
  envTriggerValue = "production",
  envTriggerOpt = "not",
  routes = [],
}: no_cache_opt) => {
  let plugin = new Elysia();

  if (
    (process.env[envTrigger] === envTriggerValue && envTriggerOpt === "only") ||
    (process.env[envTrigger] !== envTriggerValue && envTriggerOpt === "not")
  ) {
    plugin = plugin.onRequest(({ set }) => {
      setNoCacheHeaders(set);
    });
  }

  routes.forEach((val) => {
    plugin = plugin.get(val, ({ set }) => {
      setNoCacheHeaders(set);
    });
  });

  return plugin;
};

export function setNoCacheHeaders(set: Context["set"]) {
  set.headers["Surrogate-Control"] = "no-store";
  set.headers["Cache-Control"] =
    "no-store, no-cache, must-revalidate, proxy-revalidate";
  // Deprecated though https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma
  set.headers["Pragma"] = "no-cache";
  set.headers["Expires"] = "0";
}
