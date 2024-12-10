import { sql } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  todo: text().notNull(),
});
