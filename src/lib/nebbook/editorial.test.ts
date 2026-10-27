import assert from "node:assert/strict";
import test from "node:test";
import { canTransition } from "./editorial.ts";

test("autor envia rascunho e não publica", () => {
  assert.equal(canTransition("draft", "submitted", "author", true, false), true);
  assert.equal(canTransition("approved", "published", "author", true, false), false);
  assert.equal(canTransition("under_review", "approved", "author", true, false), false);
});

test("aprovação não é publicação", () => {
  assert.equal(canTransition("approved", "published", "editor", false, false), true);
  assert.equal(canTransition("under_review", "published", "admin", false, false), false);
  assert.equal(canTransition("submitted", "published", "admin", false, false), false);
});

test("dono não aprova a própria obra, mesmo sendo admin", () => {
  assert.equal(canTransition("under_review", "approved", "admin", true, false), false);
  assert.equal(canTransition("approved", "published", "editor", true, false), false);
  assert.equal(canTransition("draft", "submitted", "admin", true, false), true);
});

test("leitor não move a fila", () => {
  assert.equal(canTransition("draft", "submitted", "reader", true, false), false);
  assert.equal(canTransition("submitted", "under_review", "reader", false, false), false);
});

test("editor que não é dono revisa e publica", () => {
  assert.equal(canTransition("submitted", "under_review", "editor", false, false), true);
  assert.equal(canTransition("under_review", "changes_requested", "editor", false, false), true);
  assert.equal(canTransition("changes_requested", "submitted", "author", true, false), true);
  assert.equal(canTransition("published", "archived", "admin", false, false), true);
  assert.equal(canTransition("archived", "published", "admin", false, false), true);
});

test("obra travada não muda", () => {
  assert.equal(canTransition("published", "archived", "admin", false, true), false);
});

test("transição inexistente falha", () => {
  assert.equal(canTransition("published", "draft", "admin", false, false), false);
  assert.equal(canTransition("rejected", "published", "admin", false, false), false);
});
