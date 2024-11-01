
//ignore TS errors since its deno and TS language server does not know.
// @ts-nocheck

import { assertEquals } from "jsr:@std/assert";
Deno.test("simple test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});