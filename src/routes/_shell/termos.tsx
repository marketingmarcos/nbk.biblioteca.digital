import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/legal";

export const Route = createFileRoute("/_shell/termos")({
  head: () => ({ meta: [{ title: "Termos · Nebbook" }] }),
  component: () => (
    <Legal title="Termos de uso">
      <p>Este texto é um modelo inicial da Nebbook. Não é parecer jurídico e deve ser revisto antes de uma operação pública.</p>
      <p>A Nebbook oferece leitura gratuita e um caminho para autores independentes submeterem originais. Criar uma conta não garante publicação.</p>
      <p>Você se compromete a não enviar obra de terceiros sem autorização, a não tentar alterar o próprio papel para editor ou administrador, e a não contornar os limites de envio.</p>
      <p>A equipe pode recusar, pedir ajustes ou arquivar uma obra. A aprovação editorial não torna a obra pública. Só a ação explícita de publicação faz isso.</p>
      <p>O serviço pode mudar, pausar ou encerrar funcionalidades. Contas podem ser suspensas em caso de abuso, violação de direitos ou tentativa de escalar privilégio.</p>
    </Legal>
  ),
});
