-- Nebbook: estante, fila editorial, arquivos e leitura.
--
-- Acesso: o driver da aplicação é privilegiado (Neon ou PGLite). Políticas RLS
-- no Postgres não restringiriam esse papel, então seriam teatro. O contrato
-- abaixo é aplicado nas funções de servidor, com o user id verificado pela
-- sessão — nunca com um id enviado pelo navegador, e nunca com chave secreta
-- no cliente.
--
-- Leitura pública: livros com status published (ficha, texto, PDF/EPUB inline).
-- Download: só se allow_download e status published.
-- Arquivos de obras não publicadas: somente o autor dono ou editor/admin.
-- Capas públicas: somente de obras published, via rota de servidor.
-- Bytes ficam na tabela book_files (bucket lógico covers | library).
-- Não há bucket público. /public não recebe manuscritos.
-- Papel: o próprio usuário não altera o seu role para editor ou admin.
-- O primeiro admin só existe enquanto a instalação não tem nenhum (claim único).
-- Autor pode pedir o papel author. Autor não publica. Aprovar não publica.

create table if not exists profiles (
  user_id text primary key references "user" (id) on delete cascade,
  display_name text not null,
  role text not null default 'reader' check (role in ('reader', 'author', 'editor', 'admin')),
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists authors (
  id text primary key,
  user_id text unique references "user" (id) on delete set null,
  slug text not null unique,
  name text not null,
  bio text not null default '',
  is_demonstrative boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id text primary key,
  slug text not null unique,
  name text not null unique
);

create table if not exists books (
  id text primary key,
  slug text not null unique,
  title text not null check (char_length(trim(title)) > 0),
  synopsis text not null,
  language text not null default 'pt',
  status text not null check (status in (
    'draft', 'submitted', 'under_review', 'changes_requested',
    'approved', 'rejected', 'published', 'archived'
  )),
  allow_download boolean not null default false,
  owner_user_id text references "user" (id) on delete set null,
  is_demonstrative boolean not null default false,
  locked boolean not null default false,
  editor_note text not null default '',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists book_authors (
  book_id text not null references books (id) on delete cascade,
  author_id text not null references authors (id) on delete cascade,
  primary key (book_id, author_id)
);

create table if not exists book_categories (
  book_id text not null references books (id) on delete cascade,
  category_id text not null references categories (id) on delete cascade,
  primary key (book_id, category_id)
);

create table if not exists book_files (
  id text primary key,
  book_id text not null references books (id) on delete cascade,
  kind text not null check (kind in ('pdf', 'epub', 'cover')),
  mime text not null,
  byte_size integer not null check (byte_size > 0 and byte_size <= 8388608),
  sha256 text not null,
  original_name text not null,
  bucket text not null check (
    (kind = 'cover' and bucket = 'covers')
    or (kind in ('pdf', 'epub') and bucket = 'library')
  ),
  content bytea not null,
  created_at timestamptz not null default now(),
  unique (book_id, kind)
);

create table if not exists chapters (
  id text primary key,
  book_id text not null references books (id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  body text not null check (char_length(body) > 0),
  unique (book_id, position)
);

create table if not exists submissions (
  id text primary key,
  book_id text not null unique references books (id) on delete cascade,
  submitter_user_id text not null references "user" (id) on delete cascade,
  rights_confirmed boolean not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (rights_confirmed)
);

create table if not exists rights_records (
  id text primary key,
  book_id text not null references books (id) on delete cascade,
  holder_name text not null,
  statement text not null,
  confirmed boolean not null,
  recorded_by text references "user" (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists reading_progress (
  user_id text not null references "user" (id) on delete cascade,
  book_id text not null references books (id) on delete cascade,
  locator text not null,
  progress_pct integer not null check (progress_pct between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

create table if not exists bookmarks (
  id text primary key,
  user_id text not null references "user" (id) on delete cascade,
  book_id text not null references books (id) on delete cascade,
  locator text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id text primary key,
  actor_id text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  from_status text,
  to_status text,
  detail text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on profiles (role);
create index if not exists books_status_idx on books (status);
create index if not exists books_owner_idx on books (owner_user_id);
create index if not exists books_published_idx on books (published_at desc) where status = 'published';
create index if not exists book_files_book_idx on book_files (book_id);
create index if not exists chapters_book_idx on chapters (book_id, position);
create index if not exists submissions_user_idx on submissions (submitter_user_id);
create index if not exists rights_book_idx on rights_records (book_id);
create index if not exists progress_user_idx on reading_progress (user_id);
create index if not exists bookmarks_user_idx on bookmarks (user_id, book_id);
create index if not exists audit_created_idx on audit_logs (created_at desc);

insert into categories (id, slug, name) values
  ('c_ficcao', 'ficcao', 'Ficção'),
  ('c_poesia', 'poesia', 'Poesia'),
  ('c_ensaio', 'ensaio', 'Ensaio'),
  ('c_cronica', 'cronica', 'Crônica'),
  ('c_juvenil', 'juvenil', 'Juvenil')
on conflict (id) do nothing;

insert into authors (id, user_id, slug, name, bio, is_demonstrative) values
  (
    'a_luna', null, 'luna-vertice',
    $t$Luna Vértice$t$,
    $t$Autora fictícia do acervo demonstrativo. Os textos existem para mostrar a estante, não como obra de uma pessoa real.$t$,
    true
  ),
  (
    'a_caio', null, 'caio-meridiano',
    $t$Caio Meridiano$t$,
    $t$Autor fictício do acervo demonstrativo. Não possui conta e não recebe submissões.$t$,
    true
  ),
  (
    'a_nara', null, 'nara-quilha',
    $t$Nara Quilha$t$,
    $t$Autora fictícia do acervo demonstrativo, criada para a primeira versão da Nebbook.$t$,
    true
  )
on conflict (id) do nothing;

insert into books (
  id, slug, title, synopsis, language, status, allow_download, owner_user_id,
  is_demonstrative, locked, editor_note, published_at
) values
  (
    'b_cartas', 'cartas-da-orbita-silenciosa',
    $t$Cartas da Órbita Silenciosa$t$,
    $t$Uma navegadora escreve para quem ficou no planeta, enquanto a nave aprende a ficar quieta.$t$,
    'pt', 'published', false, null, true, true, '', '2026-03-01T15:00:00Z'
  ),
  (
    'b_mares', 'manual-das-mares-de-poeira',
    $t$Manual das Marés de Poeira$t$,
    $t$Um ensaio curto sobre o que a poeira de uma estante guarda quando ninguém termina o livro.$t$,
    'pt', 'published', false, null, true, true, '', '2026-04-01T15:00:00Z'
  ),
  (
    'b_farol', 'o-farol-que-nao-piscou',
    $t$O Farol que Não Piscou$t$,
    $t$Numa terça-feira o farol ficou aceso, sem intervalo, e a cidade teve de decidir o que fazer com a luz parada.$t$,
    'pt', 'published', false, null, true, true, '', '2026-05-01T15:00:00Z'
  ),
  (
    'b_atlas', 'atlas-das-constelacoes-menores',
    $t$Atlas das Constelações Menores$t$,
    $t$Poemas de mapas pequenos: a xícara, o bilhete, as estrelas que não servem para navegar.$t$,
    'pt', 'published', false, null, true, true, '', '2026-06-01T15:00:00Z'
  ),
  (
    'b_diario', 'diario-de-um-porto-sem-nome',
    $t$Diário de um Porto sem Nome$t$,
    $t$Notas de quem chegou a um cais que saiu do mapa e ainda assim sabe receber barco.$t$,
    'pt', 'published', false, null, true, true, '', '2026-07-01T15:00:00Z'
  ),
  (
    'b_biblioteca', 'a-biblioteca-que-orbita',
    $t$A Biblioteca que Orbita$t$,
    $t$Ensaio sobre uma estante que não pousa: ler sem possuir, e publicar só com uma segunda mão.$t$,
    'pt', 'published', false, null, true, true, '', '2026-08-01T15:00:00Z'
  ),
  (
    'b_fila', 'manuscrito-de-orbita',
    $t$Manuscrito de órbita$t$,
    $t$Peça demonstrativa da fila editorial. Não está publicada. Serve para exercer a revisão de verdade.$t$,
    'pt', 'submitted', false, null, true, false, '', null
  )
on conflict (id) do nothing;

insert into book_authors (book_id, author_id) values
  ('b_cartas', 'a_luna'),
  ('b_mares', 'a_caio'),
  ('b_farol', 'a_nara'),
  ('b_atlas', 'a_luna'),
  ('b_diario', 'a_caio'),
  ('b_biblioteca', 'a_nara'),
  ('b_fila', 'a_luna')
on conflict do nothing;

insert into book_categories (book_id, category_id) values
  ('b_cartas', 'c_ficcao'),
  ('b_mares', 'c_ensaio'),
  ('b_farol', 'c_cronica'),
  ('b_atlas', 'c_poesia'),
  ('b_diario', 'c_ficcao'),
  ('b_biblioteca', 'c_ensaio'),
  ('b_fila', 'c_ficcao')
on conflict do nothing;

insert into chapters (id, book_id, position, title, body) values
  ('ch_cartas_1', 'b_cartas', 1, $t$A primeira carta$t$, $t$A nave não faz barulho quando dá certo. Eu só percebo o motor porque a xícara treme um pouco, como se o universo pigarreasse. Daqui, a órbita da Terra é um risco azul, e eu escrevo devagar para não gastar o dia inteiro numa frase.

Você me pediu notícias concretas. A concreta é esta: o silêncio cabe na cabine. Eu conto as voltas em vez de contar os dias. Na terceira, deixei de procurar a sua janela. Não por esquecimento. Por precisão.$t$),
  ('ch_cartas_2', 'b_cartas', 2, $t$O que a nave aprendeu$t$, $t$Hoje o painel mostrou uma estrela que não estava no mapa e, mesmo assim, não piscou alarme. Pensei que fosse defeito. Era só uma estrela pequena, dessas que a gente só vê quando para de exigir grandeza.

Se esta carta chegar, leia em voz baixa. As coisas orbitam melhor quando ninguém grita com elas. Eu volto quando a volta inteira fizer sentido. Até lá, deixo a luz da cozinha acesa aqui dentro.$t$),
  ('ch_mares_1', 'b_mares', 1, $t$Poeira não é sujeira$t$, $t$Poeira de biblioteca é um arquivo mal encadernado. Cada grão já foi fibra, pele, capa, luz. Este manual não ensina a limpar. Ensina a ler o que assentou.

Quando uma estante fica tempo demais fechada, a poeira organiza o abandono em camadas. A de cima é recente: gente que passou e não ficou. A de baixo é teimosa. É a que guarda o formato do livro que ninguém terminou.$t$),
  ('ch_mares_2', 'b_mares', 2, $t$Como observar uma maré$t$, $t$Abra a janela só o bastante para o ar entrar sem levar os papéis. Acenda uma luz baixa, de lado. Não use o flash: ele mente, achata, transforma partícula em mancha.

Anote três coisas: de onde veio o vento, que livro estava aberto, e se a poeira pousou primeiro na margem ou no meio da frase. O meio da frase é quase sempre o lugar em que o leitor desistiu. A margem é onde ele ainda pensava em voltar.$t$),
  ('ch_farol_1', 'b_farol', 1, $t$A noite em que o hábito falhou$t$, $t$O farol da ponta tinha um jeito de gente teimosa. Piscou a vida inteira no mesmo intervalo, e a cidade dormia contando com isso, como quem dorme contando com o próprio pulso.

Na terça, ele não piscou. Não apagou de vez. Ficou aceso, parado, uma agulha de luz espetada no mar. Os barcos ficaram educados demais. Ninguém quer ser o primeiro a dizer que um hábito quebrou.$t$),
  ('ch_farol_2', 'b_farol', 2, $t$O que a gente fez com a luz parada$t$, $t$De manhã, o faroleiro disse que a lâmpada estava inteira. O defeito era no tempo. O mecanismo que ensinava a luz a descansar tinha parado, e ela, sem instrução, escolheu continuar.

A cidade discutiu se consertava. Uma parte gostou da claridade sem intervalo. Outra sentiu falta do escuro, porque era nele que o piscar fazia sentido. No fim, consertaram. Eu ainda olho para o intervalo e penso: até a luz precisa de um lugar para não estar.$t$),
  ('ch_atlas_1', 'b_atlas', 1, $t$Constelação da Xícara$t$, $t$Três estrelas no canto da cozinha.
Uma é a asa, duas são a boca.
Ninguém navega por elas.
Servem só para quem acorda cedo
e precisa de um mapa pequeno
entre a chaleira e a janela.

Não pedem nome científico.
Pedem que a gente não derrame.$t$),
  ('ch_atlas_2', 'b_atlas', 2, $t$Constelação do Bilhete$t$, $t$Fica atrás da porta,
onde a luz do corredor não chega inteira.
Quatro pontos, um mais fraco,
como letra que a caneta falhou.

É a constelação de quem ia dizer
e deixou o papel dobrado.
Quem souber ler, que não leia alto.
Tem estrela que só funciona em voz baixa.$t$),
  ('ch_diario_1', 'b_diario', 1, $t$Cheguei sem bandeira$t$, $t$O porto não está no aplicativo. O homem do cais diz que o nome saiu de licença e esqueceu de voltar. Enquanto isso, os barcos encostam do mesmo jeito, como gente que acha a casa pela cor da porta, não pela placa.

Anotei o cheiro antes da paisagem: corda molhada, laranja, ferrugem doce. Se um dia eu precisar voltar, é por aí que eu reconheço. Nome é atalho. Cheiro é endereço.$t$),
  ('ch_diario_2', 'b_diario', 2, $t$O que se troca aqui$t$, $t$Trocam peça de motor, receita, silêncio. Ninguém me pediu documento. Pediram se eu sabia esperar a maré sem inventar pressa. Eu disse que estava aprendendo. Foi o bastante para ganhar um prato de sopa e um banco que não era meu, mas coube.

À noite escrevo este diário com a luz do poste, que pisca fora de ritmo. Um porto sem nome também é um tipo de órbita: a gente volta mesmo sem saber como se chama o lugar.$t$),
  ('ch_bib_1', 'b_biblioteca', 1, $t$A hipótese$t$, $t$Imagine uma biblioteca que não pousa. Ela circula devagar, e cada prateleira é uma janela para um livro diferente. Não é metáfora de anúncio. É um modo de organizar a atenção: você não entra para possuir. Entra para visitar.

Nesta hipótese, o leitor é um viajante de passagem curta e volta livre. O livro não diminui quando é lido. Diminui quando é trancado, ou quando alguém finge que publicar é o mesmo que aprovar um carimbo.$t$),
  ('ch_bib_2', 'b_biblioteca', 2, $t$A regra da porta$t$, $t$A porta abre para quem chega sem empurrar o autor para fora do próprio texto. O autor envia o universo. Uma equipe lê. Se disser sim, ainda falta uma segunda mão, a que acende a luz da vitrine. Sem essa segunda mão, o livro continua inteiro, só que do lado de dentro.

É assim que uma biblioteca fica honesta. Não promete que todo original vira estrela. Promete que nenhuma estrela entra no céu por acidente.$t$),
  ('ch_fila_1', 'b_fila', 1, $t$Página um$t$, $t$Este manuscrito existe para a fila editorial. Ele não deve ser confundido com uma obra já aceita. Está aqui para que uma pessoa com função de editora possa movê-lo de estado em estado, com registro, sem fingir que um ensaio de botão é uma publicação.

Se você está lendo isto antes da publicação, a sua conta tem permissão de equipe — ou alguém publicou de propósito.$t$),
  ('ch_fila_2', 'b_fila', 2, $t$Página dois$t$, $t$O texto é curto de propósito. O que importa nesta peça é o caminho: enviado, em revisão, ajustes ou aprovação, e só então publicação. Aprovar não acende a estante. Publicar acende.

Quando a equipe terminar o teste, o livro pode ser arquivado. O acervo demonstrativo já publicado permanece travado para a estante não esvaziar por acidente.$t$)
on conflict (id) do nothing;

insert into rights_records (id, book_id, holder_name, statement, confirmed, recorded_by)
select
  'rr_' || b.id,
  b.id,
  $t$Acervo demonstrativo Nebbook$t$,
  $t$Texto original escrito para demonstrar a plataforma. Não é cessão de um autor externo nem publicação comercial.$t$,
  true,
  null
from books b
where b.is_demonstrative
on conflict (id) do nothing;
