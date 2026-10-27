import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CWK-dXj2.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-[transform,background-color,opacity] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50", {
	variants: { variant: {
		primary: "bg-violet text-white hover:bg-violet/90",
		secondary: "border border-line bg-surface text-fg hover:bg-surface-2",
		ghost: "bg-transparent text-fg hover:bg-surface",
		danger: "border border-danger/40 text-fg hover:bg-danger/10"
	} },
	defaultVariants: { variant: "primary" }
});
function Button({ className, variant, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({ variant }), className),
		...props
	});
}
//#endregion
export { buttonVariants as n, Button as t };
