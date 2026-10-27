import { r as getSql } from "./db-BHxKSrkD.mjs";
import { a as isStatus, i as isRole, r as canTransition } from "./editorial-vWKBtm1t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries.server-BltQr67Z.js
var AppError = class extends Error {
	status;
	constructor(message, status = 400) {
		super(message);
		this.name = "AppError";
		this.status = status;
	}
};
var CARD_SQL = `
  select
    b.id, b.slug, b.title, b.synopsis, b.language, b.status,
    b.allow_download, b.is_demonstrative, b.locked, b.editor_note,
    b.owner_user_id, b.published_at,
    coalesce((
      select json_agg(json_build_object('slug', a.slug, 'name', a.name) order by a.name)
      from book_authors ba join authors a on a.id = ba.author_id
      where ba.book_id = b.id
    ), '[]'::json) as authors,
    coalesce((
      select json_agg(json_build_object('slug', c.slug, 'name', c.name) order by c.name)
      from book_categories bc join categories c on c.id = bc.category_id
      where bc.book_id = b.id
    ), '[]'::json) as categories,
    (select f.id from book_files f where f.book_id = b.id and f.kind = 'cover' limit 1) as cover_id
  from books b
`;
function jsonList(value) {
	if (Array.isArray(value)) return value;
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
	return [];
}
function iso(value) {
	if (value == null) return null;
	if (value instanceof Date) return value.toISOString();
	const date = new Date(String(value));
	if (Number.isNaN(date.getTime())) return String(value);
	return date.toISOString();
}
function asStatus(value) {
	if (!isStatus(value)) throw new AppError("Estado editorial desconhecido.");
	return value;
}
function cardFrom(row, viewerId) {
	const status = asStatus(row.status);
	const coverUrl = status === "published" && row.cover_id ? `/api/files/${row.cover_id}` : null;
	return {
		id: row.id,
		slug: row.slug,
		title: row.title,
		synopsis: row.synopsis,
		language: row.language,
		status,
		allowDownload: Boolean(row.allow_download),
		isDemonstrative: Boolean(row.is_demonstrative),
		publishedAt: iso(row.published_at),
		authors: jsonList(row.authors),
		categories: jsonList(row.categories),
		coverUrl,
		editorNote: row.editor_note ?? "",
		locked: Boolean(row.locked),
		isOwner: Boolean(viewerId && row.owner_user_id === viewerId)
	};
}
function publicCard(row) {
	const full = cardFrom(row);
	return {
		id: full.id,
		slug: full.slug,
		title: full.title,
		synopsis: full.synopsis,
		language: full.language,
		status: full.status,
		allowDownload: full.allowDownload,
		isDemonstrative: full.isDemonstrative,
		publishedAt: full.publishedAt,
		authors: full.authors,
		categories: full.categories,
		coverUrl: full.coverUrl
	};
}
async function filesOf(sql, bookId) {
	return (await sql`
    select id, kind, mime, byte_size, sha256, original_name
    from book_files where book_id = ${bookId} order by kind
  `).map((row) => ({
		id: row.id,
		kind: row.kind,
		mime: row.mime,
		byteSize: Number(row.byte_size),
		sha256: row.sha256,
		originalName: row.original_name
	}));
}
async function chaptersOf(sql, bookId) {
	return (await sql`
    select id, position, title, body from chapters
    where book_id = ${bookId} order by position
  `).map((row) => ({
		id: row.id,
		position: Number(row.position),
		title: row.title,
		body: row.body
	}));
}
async function loadRaw(sql, where, params) {
	return (await sql.query(`${CARD_SQL} where ${where} limit 1`, params))[0] ?? null;
}
async function listCatalog(input) {
	const sql = await getSql();
	const q = input.q.trim().slice(0, 80);
	const categoria = input.categoria.trim().slice(0, 40);
	const like = `%${q.replace(/[%_\\]/g, "")}%`;
	return (await sql.query(`${CARD_SQL}
     where b.status = 'published'
       and ($1 = '' or b.title ilike $2 or b.synopsis ilike $2 or exists (
         select 1 from book_authors ba
         join authors a on a.id = ba.author_id
         where ba.book_id = b.id and a.name ilike $2
       ))
       and ($3 = '' or exists (
         select 1 from book_categories bc
         join categories c on c.id = bc.category_id
         where bc.book_id = b.id and c.slug = $3
       ))
     order by b.published_at desc nulls last, b.title`, [
		q,
		like,
		categoria
	])).map(publicCard);
}
async function listCategories() {
	return (await getSql())`
    select slug, name from categories order by name
  `;
}
async function getPublishedBook(slug) {
	const sql = await getSql();
	const raw = await loadRaw(sql, "b.slug = $1 and b.status = 'published'", [slug]);
	if (!raw) return null;
	const card = publicCard(raw);
	const [files, chapters] = await Promise.all([filesOf(sql, raw.id), chaptersOf(sql, raw.id)]);
	return {
		...card,
		editorNote: "",
		locked: false,
		isOwner: false,
		files,
		chapters
	};
}
async function roleOf(sql, userId) {
	const role = (await sql`select role from profiles where user_id = ${userId}`)[0]?.role ?? "reader";
	if (!isRole(role)) return "reader";
	return role;
}
async function adminCount(sql) {
	const rows = await sql`select count(*)::int as n from profiles where role = 'admin'`;
	return Number(rows[0]?.n ?? 0);
}
function canRead(status, isOwner, role) {
	if (status === "published") return true;
	if (isOwner) return true;
	return role === "editor" || role === "admin";
}
async function getViewerBook(userId, slug) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	const raw = await loadRaw(sql, "b.slug = $1", [slug]);
	if (!raw) return null;
	const role = await roleOf(sql, userId);
	const packed = cardFrom(raw, userId);
	if (!canRead(packed.status, packed.isOwner, role)) return null;
	const [files, chapters] = await Promise.all([filesOf(sql, raw.id), chaptersOf(sql, raw.id)]);
	const staff = role === "editor" || role === "admin" || packed.isOwner;
	return {
		...packed,
		editorNote: staff ? packed.editorNote : "",
		files,
		chapters,
		coverUrl: packed.coverUrl
	};
}
async function listAuthors() {
	return (await (await getSql())`
    select a.slug, a.name, a.bio, a.is_demonstrative,
      (select count(*)::int from book_authors ba
        join books b on b.id = ba.book_id
        where ba.author_id = a.id and b.status = 'published') as published_count
    from authors a
    where a.is_demonstrative or exists (
      select 1 from book_authors ba
      join books b on b.id = ba.book_id
      where ba.author_id = a.id and b.status = 'published'
    )
    order by a.name
  `).map((row) => ({
		slug: row.slug,
		name: row.name,
		bio: row.bio,
		isDemonstrative: Boolean(row.is_demonstrative),
		publishedCount: Number(row.published_count)
	}));
}
async function getAuthor(slug) {
	const sql = await getSql();
	const author = (await sql`
    select id, slug, name, bio, is_demonstrative from authors where slug = ${slug}
  `)[0];
	if (!author) return null;
	const books = await sql.query(`${CARD_SQL}
     join book_authors ba on ba.book_id = b.id
     where ba.author_id = $1 and b.status = 'published'
     order by b.published_at desc nulls last`, [author.id]);
	if (!author.is_demonstrative && books.length === 0) return null;
	return {
		slug: author.slug,
		name: author.name,
		bio: author.bio,
		isDemonstrative: Boolean(author.is_demonstrative),
		publishedCount: books.length,
		books: books.map(publicCard)
	};
}
async function audit(sql, entry) {
	await sql`
    insert into audit_logs (
      id, actor_id, action, entity_type, entity_id, from_status, to_status, detail
    ) values (
      ${crypto.randomUUID()}, ${entry.actorId}, ${entry.action}, ${entry.entityType},
      ${entry.entityId}, ${entry.fromStatus ?? null}, ${entry.toStatus ?? null},
      ${entry.detail ?? ""}
    )
  `;
}
async function ensureProfile(userId, intent) {
	const sql = await getSql();
	const users = await sql`select name from "user" where id = ${userId}`;
	if (!users[0]) throw new AppError("Conta não encontrada.", 401);
	const name = users[0].name.trim().slice(0, 80) || "Leitor";
	await sql`
    insert into profiles (user_id, display_name, role)
    values (${userId}, ${name}, 'reader')
    on conflict (user_id) do nothing
  `;
	if (intent === "author") {
		if ((await sql`
      update profiles set role = 'author', updated_at = now()
      where user_id = ${userId} and role = 'reader'
      returning user_id
    `).length) await audit(sql, {
			actorId: userId,
			action: "role_author",
			entityType: "profile",
			entityId: userId,
			fromStatus: "reader",
			toStatus: "author",
			detail: "Perfil de autor ativado pelo próprio usuário."
		});
		const role = await roleOf(sql, userId);
		if (role === "author" || role === "editor" || role === "admin") await ensureAuthorRow(sql, userId, name);
	}
	return roleOf(sql, userId);
}
async function ensureAuthorRow(sql, userId, name) {
	const existing = await sql`select id from authors where user_id = ${userId}`;
	if (existing[0]) return existing[0].id;
	const id = crypto.randomUUID();
	await sql`
    insert into authors (id, user_id, slug, name, bio, is_demonstrative)
    values (${id}, ${userId}, ${slugify(name)}, ${name}, '', false)
  `;
	return id;
}
function slugify(input) {
	return `${input.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "obra"}-${crypto.randomUUID().slice(0, 8)}`;
}
async function getAccount(userId) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	const profile = (await sql`
    select p.display_name, p.bio, p.role, u.email
    from profiles p join "user" u on u.id = p.user_id
    where p.user_id = ${userId}
  `)[0];
	if (!profile || !isRole(profile.role)) throw new AppError("Perfil indisponível.", 500);
	const progress = await sql`
    select b.slug, b.title, r.locator, r.progress_pct, r.updated_at
    from reading_progress r join books b on b.id = r.book_id
    where r.user_id = ${userId}
      and (b.status = 'published' or b.owner_user_id = ${userId})
    order by r.updated_at desc
  `;
	const bookmarks = await sql`
    select k.id, b.slug, b.title, k.locator, k.note, k.created_at
    from bookmarks k join books b on b.id = k.book_id
    where k.user_id = ${userId}
      and (b.status = 'published' or b.owner_user_id = ${userId})
    order by k.created_at desc
  `;
	const books = await sql`
    select slug, title, status, editor_note from books
    where owner_user_id = ${userId}
    order by updated_at desc
  `;
	return {
		displayName: profile.display_name,
		email: profile.email,
		bio: profile.bio,
		role: profile.role,
		needsBootstrap: await adminCount(sql) === 0,
		progress: progress.map((row) => ({
			slug: row.slug,
			title: row.title,
			locator: row.locator,
			progressPct: Number(row.progress_pct),
			updatedAt: iso(row.updated_at) ?? ""
		})),
		bookmarks: bookmarks.map((row) => ({
			id: row.id,
			slug: row.slug,
			title: row.title,
			locator: row.locator,
			note: row.note,
			createdAt: iso(row.created_at) ?? ""
		})),
		books: books.map((row) => ({
			slug: row.slug,
			title: row.title,
			status: asStatus(row.status),
			editorNote: row.editor_note
		}))
	};
}
async function updateProfile(userId, displayName, bio) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	const name = displayName.trim();
	const about = bio.trim();
	if (name.length < 2 || name.length > 80) throw new AppError("O nome precisa ter entre 2 e 80 caracteres.");
	if (about.length > 600) throw new AppError("A bio passa de 600 caracteres.");
	await sql`
    update profiles set display_name = ${name}, bio = ${about}, updated_at = now()
    where user_id = ${userId}
  `;
	await sql`
    update authors set name = ${name}, bio = ${about} where user_id = ${userId}
  `;
	return { ok: true };
}
async function listMyBooks(userId) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	const role = await roleOf(sql, userId);
	const rows = await sql.query(`${CARD_SQL} where b.owner_user_id = $1 order by b.updated_at desc`, [userId]);
	const books = [];
	for (const row of rows) {
		const card = cardFrom(row, userId);
		books.push({
			...publicCard(row),
			editorNote: card.editorNote,
			locked: card.locked,
			files: await filesOf(sql, row.id)
		});
	}
	return {
		role,
		books
	};
}
async function createBook(userId, input) {
	const sql = await getSql();
	await ensureProfile(userId, "author");
	if (await roleOf(sql, userId) === "reader") throw new AppError("Ative o perfil de autor antes de enviar uma obra.");
	const title = input.title.trim();
	const synopsis = input.synopsis.trim();
	const holder = input.rightsHolder.trim();
	const statement = input.rightsStatement.trim();
	if (!input.rightsConfirmed) throw new AppError("É preciso confirmar que você tem direitos sobre a obra.");
	if (title.length < 3 || title.length > 140) throw new AppError("O título precisa ter entre 3 e 140 caracteres.");
	if (synopsis.length < 40 || synopsis.length > 4e3) throw new AppError("A sinopse precisa ter entre 40 e 4000 caracteres.");
	if (holder.length < 3 || holder.length > 120) throw new AppError("Informe o titular dos direitos.");
	if (statement.length < 20 || statement.length > 2e3) throw new AppError("Descreva a situação dos direitos em pelo menos 20 caracteres.");
	const categories = await sql`
    select id from categories where slug = ${input.categorySlug}
  `;
	if (!categories[0]) throw new AppError("Categoria inválida.");
	const authorId = await ensureAuthorRow(sql, userId, (await sql`
    select display_name from profiles where user_id = ${userId}
  `)[0]?.display_name || "Autor");
	const bookId = crypto.randomUUID();
	const slug = slugify(title);
	try {
		await sql`
      insert into books (
        id, slug, title, synopsis, language, status, allow_download, owner_user_id,
        is_demonstrative, locked
      ) values (
        ${bookId}, ${slug}, ${title}, ${synopsis}, 'pt', 'draft', ${input.allowDownload},
        ${userId}, false, false
      )
    `;
		await sql`insert into book_authors (book_id, author_id) values (${bookId}, ${authorId})`;
		await sql`
      insert into book_categories (book_id, category_id) values (${bookId}, ${categories[0].id})
    `;
		await sql`
      insert into submissions (id, book_id, submitter_user_id, rights_confirmed, note)
      values (${crypto.randomUUID()}, ${bookId}, ${userId}, true, '')
    `;
		await sql`
      insert into rights_records (id, book_id, holder_name, statement, confirmed, recorded_by)
      values (${crypto.randomUUID()}, ${bookId}, ${holder}, ${statement}, true, ${userId})
    `;
	} catch (error) {
		await sql`delete from books where id = ${bookId}`;
		throw error;
	}
	await audit(sql, {
		actorId: userId,
		action: "book_draft",
		entityType: "book",
		entityId: bookId,
		toStatus: "draft",
		detail: "Rascunho criado com confirmação de direitos."
	});
	return { slug };
}
async function updateDraft(userId, input) {
	const sql = await getSql();
	const book = (await sql`
    select status, owner_user_id, locked, is_demonstrative from books where id = ${input.bookId}
  `)[0];
	if (!book || book.owner_user_id !== userId) throw new AppError("Obra não encontrada.", 404);
	if (book.locked || book.is_demonstrative) throw new AppError("Esta obra não pode ser editada.");
	if (book.status !== "draft" && book.status !== "changes_requested") throw new AppError("A ficha só pode ser editada em rascunho ou quando há ajustes pedidos.");
	const title = input.title.trim();
	const synopsis = input.synopsis.trim();
	if (title.length < 3 || title.length > 140) throw new AppError("O título precisa ter entre 3 e 140 caracteres.");
	if (synopsis.length < 40 || synopsis.length > 4e3) throw new AppError("A sinopse precisa ter entre 40 e 4000 caracteres.");
	await sql`
    update books set title = ${title}, synopsis = ${synopsis}, allow_download = ${input.allowDownload},
      updated_at = now()
    where id = ${input.bookId}
  `;
	return { ok: true };
}
async function transitionBook(userId, input) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	if (!isStatus(input.to)) throw new AppError("Estado inválido.");
	const raw = await loadRaw(sql, "b.id = $1", [input.bookId]);
	if (!raw) throw new AppError("Obra não encontrada.", 404);
	const role = await roleOf(sql, userId);
	const current = cardFrom(raw, userId);
	if (!canTransition(current.status, input.to, role, current.isOwner, current.locked)) throw new AppError("Esta transição não é permitida para a sua função.");
	const note = input.note.trim();
	if ((input.to === "changes_requested" || input.to === "rejected") && note.length < 10) throw new AppError("Escreva uma nota de pelo menos 10 caracteres para o autor.");
	const editorNote = input.to === "changes_requested" || input.to === "rejected" ? note : current.editorNote;
	await sql`
    update books set
      status = ${input.to},
      editor_note = ${editorNote},
      published_at = case when ${input.to} = 'published' then coalesce(published_at, now()) else published_at end,
      updated_at = now()
    where id = ${input.bookId}
  `;
	await sql`
    update submissions set updated_at = now() where book_id = ${input.bookId}
  `;
	await audit(sql, {
		actorId: userId,
		action: "status_transition",
		entityType: "book",
		entityId: input.bookId,
		fromStatus: current.status,
		toStatus: input.to,
		detail: note
	});
	return {
		ok: true,
		status: input.to
	};
}
async function saveProgress(userId, input) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	const raw = await loadRaw(sql, "b.slug = $1", [input.slug]);
	if (!raw) throw new AppError("Obra não encontrada.", 404);
	const role = await roleOf(sql, userId);
	const book = cardFrom(raw, userId);
	if (!canRead(book.status, book.isOwner, role)) throw new AppError("Obra não encontrada.", 404);
	const locator = input.locator.trim().slice(0, 120);
	const pct = Math.max(0, Math.min(100, Math.round(input.progressPct)));
	if (!locator) throw new AppError("Ponto de leitura inválido.");
	await sql`
    insert into reading_progress (user_id, book_id, locator, progress_pct, updated_at)
    values (${userId}, ${book.id}, ${locator}, ${pct}, now())
    on conflict (user_id, book_id) do update
      set locator = excluded.locator,
          progress_pct = excluded.progress_pct,
          updated_at = now()
  `;
	return { ok: true };
}
async function getProgress(userId, slug) {
	const rows = await (await getSql())`
    select r.locator, r.progress_pct
    from reading_progress r join books b on b.id = r.book_id
    where r.user_id = ${userId} and b.slug = ${slug}
  `;
	if (!rows[0]) return null;
	return {
		locator: rows[0].locator,
		progressPct: Number(rows[0].progress_pct)
	};
}
async function toggleBookmark(userId, input) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	const raw = await loadRaw(sql, "b.slug = $1", [input.slug]);
	if (!raw) throw new AppError("Obra não encontrada.", 404);
	const role = await roleOf(sql, userId);
	const book = cardFrom(raw, userId);
	if (!canRead(book.status, book.isOwner, role)) throw new AppError("Obra não encontrada.", 404);
	const locator = input.locator.trim().slice(0, 120);
	const note = input.note.trim().slice(0, 240);
	const existing = await sql`
    select id from bookmarks
    where user_id = ${userId} and book_id = ${book.id} and locator = ${locator}
  `;
	if (existing[0]) {
		await sql`delete from bookmarks where id = ${existing[0].id} and user_id = ${userId}`;
		return { saved: false };
	}
	await sql`
    insert into bookmarks (id, user_id, book_id, locator, note)
    values (${crypto.randomUUID()}, ${userId}, ${book.id}, ${locator}, ${note})
  `;
	return { saved: true };
}
async function claimInitialAdmin(userId) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	if (!(await sql`
    update profiles set role = 'admin', updated_at = now()
    where user_id = ${userId}
      and not exists (select 1 from profiles where role = 'admin')
    returning user_id
  `)[0]) throw new AppError("Já existe um administrador. O papel não foi alterado.");
	await audit(sql, {
		actorId: userId,
		action: "bootstrap_admin",
		entityType: "profile",
		entityId: userId,
		toStatus: "admin",
		detail: "Primeiro administrador da instalação. O caminho fecha quando já há um admin."
	});
	return { ok: true };
}
async function assignRole(actorId, targetUserId, role) {
	const sql = await getSql();
	if (!isRole(role)) throw new AppError("Função inválida.");
	if (actorId === targetUserId) throw new AppError("Você não pode alterar o próprio papel.");
	if (await roleOf(sql, actorId) !== "admin") throw new AppError("Só um administrador altera funções.", 403);
	const targets = await sql`select role from profiles where user_id = ${targetUserId}`;
	if (!targets[0] || !isRole(targets[0].role)) throw new AppError("Pessoa não encontrada.", 404);
	if (targets[0].role === "admin" && role !== "admin") {
		if (await adminCount(sql) < 2) throw new AppError("A instalação precisa manter pelo menos um administrador.");
	}
	await sql`
    update profiles set role = ${role}, updated_at = now() where user_id = ${targetUserId}
  `;
	if (role === "author" || role === "editor" || role === "admin") await ensureAuthorRow(sql, targetUserId, (await sql`
      select display_name from profiles where user_id = ${targetUserId}
    `)[0]?.display_name || "Autor");
	await audit(sql, {
		actorId,
		action: "role_assign",
		entityType: "profile",
		entityId: targetUserId,
		fromStatus: targets[0].role,
		toStatus: role
	});
	return { ok: true };
}
async function getAdminDesk(userId) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	if (await adminCount(sql) === 0) return { state: "bootstrap" };
	const role = await roleOf(sql, userId);
	if (role !== "admin" && role !== "editor") return {
		state: "forbidden",
		role
	};
	const queueRows = await sql.query(`${CARD_SQL}
     where b.status not in ('published', 'archived')
     order by b.updated_at desc`, []);
	const publishedRows = await sql.query(`${CARD_SQL}
     where b.status = 'published'
     order by b.published_at desc nulls last
     limit 24`, []);
	const readers = await sql`select count(*)::int as n from profiles`;
	const auditRows = await sql`
    select id, actor_id, action, entity_type, entity_id, from_status, to_status, detail, created_at
    from audit_logs order by created_at desc limit 40
  `;
	const team = role === "admin" ? await sql`
          select p.user_id, p.display_name, u.email, p.role
          from profiles p join "user" u on u.id = p.user_id
          order by p.created_at
        ` : [];
	return {
		state: "ready",
		role,
		counts: {
			published: publishedRows.length,
			queue: queueRows.length,
			readers: Number(readers[0]?.n ?? 0)
		},
		queue: queueRows.map((row) => {
			return { ...cardFrom(row, userId) };
		}),
		published: publishedRows.map(publicCard),
		audit: auditRows.map((row) => ({
			id: row.id,
			actorId: row.actor_id,
			action: row.action,
			entityType: row.entity_type,
			entityId: row.entity_id,
			fromStatus: row.from_status,
			toStatus: row.to_status,
			detail: row.detail,
			createdAt: iso(row.created_at) ?? ""
		})),
		notices: await listNotices(sql),
		team: team.flatMap((row) => isRole(row.role) ? [{
			userId: row.user_id,
			displayName: row.display_name,
			email: row.email,
			role: row.role
		}] : [])
	};
}
async function assertUpload(userId, bookId, kind) {
	const book = (await (await getSql())`
    select status, owner_user_id, locked, is_demonstrative from books where id = ${bookId}
  `)[0];
	if (!book || book.owner_user_id !== userId) throw new AppError("Obra não encontrada.", 404);
	if (book.locked || book.is_demonstrative) throw new AppError("Esta obra não recebe arquivos.");
	if (book.status !== "draft" && book.status !== "changes_requested") throw new AppError("Arquivos só podem ser enviados em rascunho ou quando há ajustes pedidos.");
	return { bucket: kind === "cover" ? "covers" : "library" };
}
async function storeFile(input) {
	const sql = await getSql();
	const id = crypto.randomUUID();
	await sql`delete from book_files where book_id = ${input.bookId} and kind = ${input.kind}`;
	await sql.query(`insert into book_files (
      id, book_id, kind, mime, byte_size, sha256, original_name, bucket, content
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [
		id,
		input.bookId,
		input.kind,
		input.mime,
		input.bytes.byteLength,
		input.sha256,
		input.originalName.slice(0, 180),
		input.bucket,
		Buffer.from(input.bytes)
	]);
	await audit(sql, {
		actorId: input.userId,
		action: "file_stored",
		entityType: "book_file",
		entityId: id,
		detail: `${input.kind} ${input.bytes.byteLength} bytes ${input.sha256}`
	});
	return {
		id,
		byteSize: input.bytes.byteLength,
		sha256: input.sha256
	};
}
async function loadFile(id) {
	return (await (await getSql())`
    select f.id, f.kind, f.mime, f.original_name, f.content,
           b.status, b.allow_download, b.owner_user_id
    from book_files f join books b on b.id = f.book_id
    where f.id = ${id}
  `)[0] ?? null;
}
async function roleFor(userId) {
	return roleOf(await getSql(), userId);
}
var NOTICE_STATUSES = [
	"open",
	"reviewing",
	"resolved",
	"dismissed"
];
function isNoticeStatus(value) {
	return NOTICE_STATUSES.includes(value);
}
async function listNotices(sql) {
	return (await sql`
    select n.id, b.slug as book_slug, b.title as book_title, n.claimant_name, n.contact_email,
           n.work_reference, n.statement, n.status, n.staff_note, n.created_at
    from copyright_notices n
    left join books b on b.id = n.book_id
    order by case when n.status in ('open', 'reviewing') then 0 else 1 end, n.created_at desc
    limit 40
  `).flatMap((row) => isNoticeStatus(row.status) ? [{
		id: row.id,
		bookSlug: row.book_slug,
		bookTitle: row.book_title,
		claimantName: row.claimant_name,
		contactEmail: row.contact_email,
		workReference: row.work_reference,
		statement: row.statement,
		status: row.status,
		staffNote: row.staff_note,
		createdAt: iso(row.created_at) ?? ""
	}] : []);
}
async function fileNotice(userId, input) {
	const sql = await getSql();
	await ensureProfile(userId, "reader");
	const claimant = input.claimantName.trim();
	const reference = input.workReference.trim();
	const statement = input.statement.trim();
	if (claimant.length < 2 || claimant.length > 80) throw new AppError("Informe o nome de quem reclama a titularidade.");
	if (reference.length < 4 || reference.length > 160) throw new AppError("Descreva a obra original com um pouco mais de detalhe.");
	if (statement.length < 40 || statement.length > 2e3) throw new AppError("O relato precisa ter entre 40 e 2000 caracteres.");
	const email = (await sql`select email from "user" where id = ${userId}`)[0]?.email?.trim();
	if (!email) throw new AppError("Conta sem e-mail de contato.", 401);
	let bookId = null;
	const slug = input.bookSlug.trim();
	if (slug) {
		const books = await sql`
      select id, status from books where slug = ${slug}
    `;
		if (!books[0] || books[0].status !== "published") throw new AppError("Só é possível notificar uma obra publicada.", 404);
		bookId = books[0].id;
		if ((await sql`
      select id from copyright_notices
      where reporter_user_id = ${userId}
        and book_id = ${bookId}
        and status in ('open', 'reviewing')
      limit 1
    `)[0]) throw new AppError("Você já tem uma notificação aberta para esta obra.");
	}
	const pending = await sql`
    select count(*)::int as n from copyright_notices
    where reporter_user_id = ${userId} and status in ('open', 'reviewing')
  `;
	if (Number(pending[0]?.n ?? 0) >= 5) throw new AppError("Há notificações suas ainda em análise. Aguarde a equipe antes de enviar outra.");
	const id = crypto.randomUUID();
	await sql`
    insert into copyright_notices (
      id, book_id, reporter_user_id, contact_email, claimant_name, work_reference, statement
    ) values (
      ${id}, ${bookId}, ${userId}, ${email}, ${claimant}, ${reference}, ${statement}
    )
  `;
	await audit(sql, {
		actorId: userId,
		action: "copyright_notice",
		entityType: "copyright_notice",
		entityId: id,
		detail: slug || reference
	});
	return { id };
}
async function setNoticeStatus(actorId, input) {
	const sql = await getSql();
	const role = await roleOf(sql, actorId);
	if (role !== "admin" && role !== "editor") throw new AppError("Sem permissão.", 403);
	if (!isNoticeStatus(input.status)) throw new AppError("Estado de notificação inválido.");
	const note = input.staffNote.trim().slice(0, 2e3);
	if ((input.status === "resolved" || input.status === "dismissed") && note.length < 8) throw new AppError("Registre uma nota curta antes de encerrar a notificação.");
	const current = (await sql`
    select id, status from copyright_notices where id = ${input.id}
  `)[0];
	if (!current || !isNoticeStatus(current.status)) throw new AppError("Notificação não encontrada.", 404);
	await sql`
    update copyright_notices
    set status = ${input.status}, staff_note = ${note}, updated_at = now()
    where id = ${input.id}
  `;
	await audit(sql, {
		actorId,
		action: "copyright_notice_status",
		entityType: "copyright_notice",
		entityId: input.id,
		fromStatus: current.status,
		toStatus: input.status,
		detail: note
	});
	return { ok: true };
}
//#endregion
export { assertUpload, assignRole, claimInitialAdmin, createBook, ensureProfile, fileNotice, getAccount, getAdminDesk, getAuthor, getProgress, getPublishedBook, getViewerBook, listAuthors, listCatalog, listCategories, listMyBooks, loadFile, roleFor, saveProgress, setNoticeStatus, storeFile, toggleBookmark, transitionBook, updateDraft, updateProfile };
