import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-Ck8v77W-.mjs";
import { i as signIn, t as authClient } from "./client-CwpVfGGi.mjs";
import { n as useCurrentUserState } from "./use-current-user-Ix_f21xD.mjs";
import { t as Button } from "./button-CWK-dXj2.mjs";
import { t as Input } from "./input-EZyWdFM6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-GJhc0ufc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("entrar");
	const [author, setAuthor] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		setError("");
		const data = new FormData(event.currentTarget);
		const email = String(data.get("email") || "").trim().toLowerCase();
		const password = String(data.get("password") || "");
		const name = String(data.get("name") || "").trim();
		if (!email.includes("@") || password.length < 8) {
			setError("Use um e-mail válido e uma senha com pelo menos 8 caracteres.");
			return;
		}
		if (mode === "criar" && name.length < 2) {
			setError("Diga como você quer ser chamado.");
			return;
		}
		sessionStorage.setItem("nebbook-intent", author ? "author" : "reader");
		setPending(true);
		const result = mode === "criar" ? await authClient.signUp.email({
			email,
			password,
			name,
			callbackURL: "/conta"
		}) : await authClient.signIn.email({
			email,
			password,
			callbackURL: "/conta"
		});
		setPending(false);
		if (result.error) {
			sessionStorage.removeItem("nebbook-intent");
			setError(result.error.message || "Não foi possível entrar.");
			return;
		}
		await navigate({ to: "/conta" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex w-full max-w-md flex-col px-4 py-14 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-medium tracking-tight",
				children: mode === "criar" ? "Criar conta" : "Entrar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "A conta é real. Não há usuário de demonstração."
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-11 animate-pulse rounded-md bg-surface" }) : null,
			!isPending && user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm",
				children: ["Você já está na conta. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/conta",
					className: "text-cyan",
					children: "Ir para a área do leitor"
				})]
			}) : null,
			null,
			!user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: tab(mode === "entrar"),
						onClick: () => setMode("entrar"),
						children: "Entrar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: tab(mode === "criar"),
						onClick: () => setMode("criar"),
						children: "Criar conta"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-4 space-y-3",
					children: [
						mode === "criar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Nome", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "name",
								autoComplete: "name",
								className: "mt-1",
								required: true
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["E-mail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "email",
								type: "email",
								autoComplete: "email",
								className: "mt-1",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Senha", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "password",
								type: "password",
								autoComplete: mode === "criar" ? "new-password" : "current-password",
								className: "mt-1",
								required: true,
								minLength: 8
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: author,
								onChange: (event) => setAuthor(event.target.checked)
							}), "Quero enviar obras como autor"]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							role: "alert",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: pending,
							className: "w-full",
							children: pending ? "Aguarde…" : mode === "criar" ? "Criar conta" : "Entrar"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-6 flex items-center gap-3 text-xs text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
						"ou",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						className: "w-full",
						onClick: () => {
							sessionStorage.setItem("nebbook-intent", author ? "author" : "reader");
							signIn(provider.providerId, { callbackURL: "/conta" });
						},
						children: ["Continuar com ", provider.label]
					}, provider.providerId))
				})
			] }) : null
		]
	});
}
function tab(active) {
	return `min-h-11 rounded-full text-sm ${active ? "bg-surface-2 text-fg" : "text-muted"}`;
}
//#endregion
export { LoginPage as component };
