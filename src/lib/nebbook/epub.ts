import { unzipSync } from "fflate";

const DROP = new Set(["script", "style", "iframe", "object", "embed", "link", "meta", "base", "form", "svg"]);
const ALLOW = new Set([
  "p", "div", "span", "h1", "h2", "h3", "h4", "blockquote", "em", "strong", "i", "b",
  "ul", "ol", "li", "br", "hr", "a", "img", "figure", "figcaption", "section", "article",
  "sub", "sup", "small", "pre", "code",
]);

export type OpenEpub = {
  title: string;
  titles: string[];
  render: (index: number) => { html: string; urls: string[] };
};

export function openEpub(buffer: ArrayBuffer): OpenEpub {
  const packed = unzipSync(new Uint8Array(buffer));
  const map = new Map<string, Uint8Array>();
  for (const [key, value] of Object.entries(packed)) map.set(normalize(key), value);
  const container = text(map, "META-INF/container.xml");
  if (!container) throw new Error("Este EPUB não tem o container padrão.");
  const containerDoc = parseXml(container);
  const opfPath = containerDoc.querySelector("rootfile")?.getAttribute("full-path");
  if (!opfPath) throw new Error("Este EPUB não indica o pacote.");
  const opfKey = normalize(opfPath);
  const opfXml = text(map, opfKey);
  if (!opfXml) throw new Error("O pacote do EPUB não foi encontrado.");
  const opf = parseXml(opfXml);
  const title = opf.querySelector("title")?.textContent?.trim() || "EPUB";
  const opfDir = opfKey.includes("/") ? opfKey.slice(0, opfKey.lastIndexOf("/") + 1) : "";
  const manifest = new Map<string, { href: string; type: string }>();
  opf.querySelectorAll("item").forEach((item) => {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href");
    if (!id || !href) return;
    manifest.set(id, { href: resolvePath(opfDir, href), type: item.getAttribute("media-type") || "" });
  });
  const titles: string[] = [];
  const hrefs: string[] = [];
  opf.querySelectorAll("itemref").forEach((ref) => {
    const item = manifest.get(ref.getAttribute("idref") || "");
    if (!item) return;
    const html = item.type.includes("html") || /\.x?html?$/.test(item.href);
    if (!html) return;
    hrefs.push(item.href);
    titles.push(`Trecho ${titles.length + 1}`);
  });
  if (!hrefs.length) throw new Error("Este EPUB não tem capítulos legíveis.");

  return {
    title,
    titles,
    render(index: number) {
      const href = hrefs[Math.max(0, Math.min(hrefs.length - 1, index))]!;
      const raw = text(map, href);
      const urls: string[] = [];
      if (!raw) return { html: "<p>Capítulo vazio.</p>", urls };
      const source = parseMaybeHtml(raw);
      const clean = document.implementation.createHTMLDocument("");
      const root = source.body || source.documentElement;
      const base = href.includes("/") ? href.slice(0, href.lastIndexOf("/") + 1) : "";
      if (root) copyChildren(root, clean.body, clean, map, base, urls);
      return { html: clean.body.innerHTML, urls };
    },
  };
}

function copyChildren(
  source: Node,
  target: Node,
  doc: Document,
  map: Map<string, Uint8Array>,
  base: string,
  urls: string[],
) {
  source.childNodes.forEach((node) => {
    const next = cleanNode(node, doc, map, base, urls);
    if (next) target.appendChild(next);
  });
}

function cleanNode(
  node: Node,
  doc: Document,
  map: Map<string, Uint8Array>,
  base: string,
  urls: string[],
): Node | null {
  if (node.nodeType === Node.TEXT_NODE) return doc.createTextNode(node.textContent || "");
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  if (DROP.has(tag)) return null;
  if (tag === "img") {
    const key = resolvePath(base, element.getAttribute("src") || "");
    const bytes = key ? map.get(key) : undefined;
    if (!bytes) return null;
    const copy = new Uint8Array(bytes.byteLength);
    copy.set(bytes);
    const url = URL.createObjectURL(new Blob([copy], { type: sniff(bytes) }));
    urls.push(url);
    const image = doc.createElement("img");
    image.alt = element.getAttribute("alt") || "";
    image.src = url;
    return image;
  }
  if (!ALLOW.has(tag)) {
    const fragment = doc.createDocumentFragment();
    copyChildren(element, fragment, doc, map, base, urls);
    return fragment;
  }
  const copy = doc.createElement(tag);
  if (tag === "a") {
    const href = element.getAttribute("href") || "";
    if (href.startsWith("#") || href.startsWith("https://") || href.startsWith("http://")) {
      copy.setAttribute("href", href);
      copy.setAttribute("rel", "noreferrer");
      if (href.startsWith("http")) copy.setAttribute("target", "_blank");
    }
  }
  copyChildren(element, copy, doc, map, base, urls);
  return copy;
}

function parseXml(source: string) {
  const doc = new DOMParser().parseFromString(source, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("XML do EPUB está danificado.");
  return doc;
}

function parseMaybeHtml(source: string) {
  const xml = new DOMParser().parseFromString(source, "application/xhtml+xml");
  if (!xml.querySelector("parsererror")) return xml;
  return new DOMParser().parseFromString(source, "text/html");
}

function text(map: Map<string, Uint8Array>, key: string) {
  const bytes = map.get(normalize(key));
  if (!bytes) return null;
  return new TextDecoder("utf-8").decode(bytes);
}

function normalize(path: string) {
  const parts: string[] = [];
  for (const part of decodeURIComponent(path).split(/[/\\]/)) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}

function resolvePath(base: string, href: string) {
  const clean = href.split("#")[0]?.split("?")[0] ?? "";
  if (!clean || clean.startsWith("data:") || clean.startsWith("javascript:")) return "";
  return normalize(clean.startsWith("/") ? clean.slice(1) : base + clean);
}

function sniff(bytes: Uint8Array) {
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (bytes.length > 12 && String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF") return "image/webp";
  return "application/octet-stream";
}
