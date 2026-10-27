import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Badge } from "./badge-BU2yALto.mjs";
import { n as STATUS_LABEL } from "./editorial-vWKBtm1t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-pill-B-GtU5eO.js
var import_jsx_runtime = require_jsx_runtime();
var DOT = {
	draft: "bg-subtle",
	submitted: "bg-cyan",
	under_review: "bg-violet",
	changes_requested: "bg-warn",
	approved: "bg-violet",
	rejected: "bg-danger",
	published: "bg-ok",
	archived: "bg-subtle"
};
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `size-1.5 rounded-full ${DOT[status]}`,
		"aria-hidden": true
	}), STATUS_LABEL[status]] });
}
//#endregion
export { StatusPill as t };
