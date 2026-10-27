# Nebbook

Biblioteca digital gratuita. Cada livro é um universo.

Identidade configurável em `src/lib/nebbook/brand.ts`.

## Por que não é Next.js nem Supabase

O ambiente de execução desta aplicação é TanStack Start (React, rotas em arquivo, TypeScript, Tailwind). Postgres e autenticação já vêm ligados:

- banco Neon em produção e Postgres embutido na pré-visualização;
- contas reais por Google, X ou e-mail e senha.

Não há chave secreta no navegador. Não crie arquivo `.env`: a plataforma injeta `DATABASE_URL` e as credenciais de autenticação na publicação.

## Como roda

```bash
npm install
npm run dev
```

Verificações:

```bash
npm run typecheck
npm run build
node --experimental-strip-types --test src/lib/nebbook/editorial.test.ts src/lib/nebbook/validate-bytes.test.ts
```

As migrações em `migrations/` aplicam sozinhas na subida e no build.

## O que já é real

- Catálogo, ficha, leitor de texto com capítulos, PDF (PDF.js) e EPUB.
- Conta, perfil de autor, rascunho, confirmação de direitos e upload validado por conteúdo.
- Fila editorial com estados e transições. Aprovar não publica.
- Canal de notificação de direitos, com conta obrigatória e fila no painel. Notificar não arquiva a obra.
- O autor não publica a própria obra, mesmo se for admin.
- Papel de administrador não se autoatribui, exceto o primeiro admin de uma instalação vazia, com registro.
- Arquivos ficam na tabela `book_files`, nunca em pasta pública. Download só com a obra publicada e a opção ligada.

O acervo com a marca Demonstração é texto escrito para apresentar o produto.

## Antes de registrar a marca

Busca rápida, não é clearance jurídico. Há proximidade com NEEBO (Nebraska Book Company, livraria e e-books), NOOK, Neubook (`neubook.app`) e NeoBook. Confira INPI e os países de atuação antes de domínio ou depósito.

## Ainda não é produção

Faltam revisão jurídica do texto dos termos, exclusão de conta, antivírus de arquivo, armazenamento objeto com cota maior que 8 MB e teste de penetração. O controle de acesso está nas funções de servidor porque o papel do banco é privilegiado: RLS não protegeria essas consultas.
