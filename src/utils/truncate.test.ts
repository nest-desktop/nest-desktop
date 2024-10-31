// truncate.test.ts

import { expect, test } from "vitest";

import { truncate } from "./truncate";

test("Truncate long text.", () => {
  expect(truncate("Lorem ipsum")).toBe("Lorem ");
  expect(truncate("Lorem ipsum", 8)).toBe("Lorem ip");
});
