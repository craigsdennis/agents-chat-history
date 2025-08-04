import { Hono } from "hono";
import { agentsMiddleware } from "hono-agents";
import { ChatAgent } from "./agents/chat";

export { ChatAgent };

const app = new Hono<{ Bindings: Env }>();

app.use(agentsMiddleware());

app.get("/hello", async (c) => {
  return c.json({ hello: "world" });
});

export default app;
