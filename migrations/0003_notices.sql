-- Canal formal de notificação de direitos.
-- Quem envia precisa de conta. A equipe (editor ou admin) muda o estado.
-- Notificar não tira a obra do ar: arquivar continua sendo uma ação editorial à parte.

create table if not exists copyright_notices (
  id text primary key,
  book_id text references books (id) on delete set null,
  reporter_user_id text not null references "user" (id) on delete cascade,
  contact_email text not null,
  claimant_name text not null,
  work_reference text not null,
  statement text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  staff_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notices_status_idx on copyright_notices (status, created_at desc);
create index if not exists notices_reporter_idx on copyright_notices (reporter_user_id);
