import "dotenv/config";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { todosTable } from "./db/schema.js";
import type { InferSelectModel } from "drizzle-orm";
import assert from "assert";

assert(process.env.DATABASE_URL, "DATABASE_URL is required");

const db = drizzle(process.env.DATABASE_URL);

const app = new Hono();

const Layout: FC = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Demo — Instagres</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css"
        />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>{props.children}</body>
    </html>
  );
};

const TodoList = ({
  todos,
}: {
  todos: InferSelectModel<typeof todosTable>[];
}) => {
  return (
    <Layout>
      <div>
        <h1>Todos:</h1>
        {todos.length ? (
          <ul>
            {todos.map(({ id, todo }) => {
              return <li key={id}>{todo}</li>;
            })}
          </ul>
        ) : (
          <p>
            <em>No todos, add the first one below</em> ⬇️
          </p>
        )}
        <form method="post">
          <input type="text" name="todo" autofocus />
          <button type="submit">Add to list</button>
        </form>
      </div>
    </Layout>
  );
};

app.get("/", async (c) => {
  const todos = await db.select().from(todosTable);
  return c.html(<TodoList todos={todos} />);
});

app.post("/", async (c) => {
  const todo = (await c.req.formData()).get("todo")?.toString();
  if (todo) await db.insert(todosTable).values({ todo });
  return c.redirect(c.req.url);
});

app.use("/css/*", serveStatic({ root: "./src" }));

const port = 3000;
serve({
  fetch: app.fetch,
  port,
});
console.log(`Server is running on http://localhost:${port}`);
