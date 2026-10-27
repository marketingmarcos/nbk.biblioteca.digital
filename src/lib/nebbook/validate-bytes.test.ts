import assert from "node:assert/strict";
import test from "node:test";
import { strToU8, zipSync } from "fflate";
import { validateUpload } from "./validate-bytes.ts";

const pdf = new TextEncoder().encode("%PDF-1.7\n1 0 obj\n<<>>\n%%EOF");
const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);

function epubBytes(): Uint8Array {
  return zipSync({
    mimetype: strToU8("application/epub+zip"),
    "META-INF/container.xml": strToU8("<container/>"),
  });
}

test("aceita PDF pelo conteúdo, não pelo nome", () => {
  const result = validateUpload({
    kind: "pdf",
    bytes: pdf,
    declaredMime: "application/octet-stream",
    filename: "sem-extensao",
  });
  assert.equal(result.ok, true);
});

test("rejeita HTML disfarçado de PDF", () => {
  const result = validateUpload({
    kind: "pdf",
    bytes: new TextEncoder().encode("<html><script>alert(1)</script></html>"),
    declaredMime: "application/pdf",
    filename: "livro.pdf",
  });
  assert.equal(result.ok, false);
});

test("rejeita extensão que não combina", () => {
  const result = validateUpload({
    kind: "pdf",
    bytes: pdf,
    declaredMime: "application/pdf",
    filename: "livro.exe",
  });
  assert.equal(result.ok, false);
});

test("aceita PNG e EPUB e recusa SVG", () => {
  assert.equal(
    validateUpload({ kind: "cover", bytes: png, declaredMime: "image/png", filename: "capa.png" }).ok,
    true,
  );
  assert.equal(
    validateUpload({
      kind: "epub",
      bytes: epubBytes(),
      declaredMime: "application/epub+zip",
      filename: "livro.epub",
    }).ok,
    true,
  );
  const svg = validateUpload({
    kind: "cover",
    bytes: new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'/>"),
    declaredMime: "image/svg+xml",
    filename: "capa.svg",
  });
  assert.equal(svg.ok, false);
});

test("MIME declarado divergente é recusado", () => {
  const result = validateUpload({
    kind: "cover",
    bytes: jpeg,
    declaredMime: "image/png",
    filename: "capa.jpg",
  });
  assert.equal(result.ok, false);
});

test("arquivo vazio e acima do limite falham", () => {
  assert.equal(
    validateUpload({ kind: "pdf", bytes: new Uint8Array(), declaredMime: "application/pdf", filename: "a.pdf" })
      .ok,
    false,
  );
  const big = new Uint8Array(8 * 1024 * 1024 + 1);
  big.set(pdf, 0);
  assert.equal(
    validateUpload({ kind: "pdf", bytes: big, declaredMime: "application/pdf", filename: "a.pdf" }).ok,
    false,
  );
});
