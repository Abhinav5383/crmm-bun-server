import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use("/*", serveStatic({ root: "./dist" }));

app.get("*", (c) => {
	return new Response(Bun.file("./dist/index.html"));
});

export default {
	port: 5500,
	fetch: app.fetch,
};
