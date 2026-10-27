import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cover-PwaIfe7Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function hash(seed) {
	let value = 0;
	for (const char of seed) value = value * 33 + char.charCodeAt(0) >>> 0;
	return value;
}
function Cover({ title, seed, category, imageUrl, framed = true, className }) {
	const [broken, setBroken] = (0, import_react.useState)(false);
	const n = hash(seed);
	const shift = 8 + n % 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-2", className),
		children: [imageUrl && !broken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: imageUrl,
			alt: "",
			className: "absolute inset-0 h-full w-full object-cover",
			onError: () => setBroken(true)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 200 300",
			className: "absolute inset-0 h-full w-full text-fg",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "200",
					height: "300",
					fill: "var(--color-surface)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "100",
					cy: 110 + n % 30,
					rx: 70 + n % 18,
					ry: 28 + n % 10,
					fill: "none",
					stroke: n % 2 === 0 ? "var(--color-cyan)" : "var(--color-violet)",
					strokeWidth: "1.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: 40 + n % 80,
					cy: 48 + n % 20,
					r: "2.2",
					fill: "var(--color-cyan)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: 140 + n % 30,
					cy: "70",
					r: "1.4",
					fill: "var(--color-fg)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: shift + 54,
					y: "118",
					width: "46",
					height: "64",
					rx: "2",
					fill: "none",
					stroke: "var(--color-fg)",
					strokeWidth: "1.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: `M${shift + 76} 118h8v64`,
					stroke: "var(--color-violet)",
					strokeWidth: "1.4"
				})
			]
		}), framed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent p-3 pt-12",
			children: [category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-cyan uppercase",
				children: category
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 line-clamp-3 font-medium leading-tight text-fg",
				children: title
			})]
		}) : null]
	});
}
//#endregion
export { Cover as t };
