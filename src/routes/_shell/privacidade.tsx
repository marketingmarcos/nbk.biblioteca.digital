import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/legal";

export const Route = createFileRoute("/_shell/privacidade")({
  head: () => ({ meta: [{ title: "Privacidade · Nebbook" }] }),
  component: () => (
    <Legal title="Privacidade">
      <p>Modelo inicial, não revisado por advogado. A Nebbook guarda o mínimo para a conta funcionar.</p>
      <p>Conta: nome, e-mail e identificador da sessão, via Google, X ou e-mail e senha. A senha fica só no servidor, com o mecanismo de autenticação da plataforma.</p>
      <p>Leitura: ponto de leitura e marcas, ligados à sua conta. Preferência de tamanho de letra fica no aparelho, sem ir ao servidor.</p>
      <p>Obras: ficha, confirmação de direitos e arquivos. PDF, EPUB e capa ficam no banco, com acesso decidido no servidor. Manuscritos não vão para endereço público.</p>
      <p>A equipe editorial vê a fila, as notas e o registro das ações administrativas. Não vendemos esses dados. Não há anúncio dentro do leitor nesta versão.</p>
      <p>Você pode pedir a correção do nome e da bio na própria conta. Exclusão completa de conta e arquivos ainda depende de um processo operacional, descrito nos próximos passos.</p>
    </Legal>
  ),
});
