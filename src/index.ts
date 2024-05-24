import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const backendUrl = process.env.BACKEND_URL || "http://localhost:5500";

const app = new Hono();

app.use("/*", serveStatic({ root: "./dist" }));

app.get("/api/*", async (c) => {
	try {
		const url = c.req.url;
		const headers = c.req.raw.headers.toJSON();

		return fetch(url.replace(frontendUrl, backendUrl), {
			headers: headers,
		});
	} catch (e) {
		return c.json({
			success: false,
			message: "Internal server error",
		});
	}
});

app.post("/api/*", async (c) => {
	try {
		const url = c.req.url;
		const headers = c.req.raw.headers.toJSON();
		const body = await c.req.json();

		return fetch(url.replace(frontendUrl, backendUrl), {
			method: "POST",
			headers: headers,
			body: JSON.stringify(body),
		});
	} catch (e) {
		return c.json({
			success: false,
			message: "Internal server error",
		});
	}
});

app.get("*", (c) => {
	return new Response(Bun.file("./dist/index.html"));
});

export default {
	port: 3000,
	fetch: app.fetch,
};
