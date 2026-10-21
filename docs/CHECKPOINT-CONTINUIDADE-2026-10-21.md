# Continuidade, dados e atualização Android

Base de retorno: `1291e25febd9f74f056cc0f3ae127cca6673c69b` (app 0.3.0). Área Pix publicada separadamente, preservar essa publicação ao revisar as melhorias.

Itens autorizados: 1, 4, 5, 7, 8.
- Novas salas: vaga reservada por 5 minutos sem inventar pontos. Relógios do FutDraw seguem; sair explicitamente encerra participação. Retomada preserva identidade anônima, excluída dos backups.
- Pareamento moderno da Velha separado da fila antiga, mesmo padrão primeiro a três, com prontidão e votação.
- Tutorial de três passos, dispensável, sem bloquear botões ou relógios.
- Exportação/importação local confirmada de dados pessoais, allowlist de chaves, sem credenciais, limite de tamanho e validação/rollback.
- Identidade Android travada em identity.json: `br.com.opesodacamisa.jogos.oficial`, nome `OPC Jogos Oficial`, mesma chave permanente das versões oficiais 0.2 e 0.3. Código 4 / versão 0.4.0. Não mudar identificador nem assinatura para atualizar.
- Verificação de versão instalada, novidades e necessidade de atualização online, sem instalar automaticamente nem solicitar novas permissões.

Migração `salas-continuidade-2026-10-21.sql` testada em PostgreSQL e aplicada em produção após autorização explícita do proprietário. Mantém tabelas protegidas e protocolos antigos. Não apagar salas ou tabelas para reverter UI.

Pix: chave fornecida pelo proprietário, cópia direta, pagamento realizado no banco. A página não confirma recebimentos nem recolhe dados financeiros.

O fluxo de atualização oficial tem teste em emulador com dois APKs assinados: instalar 0.3.0, favoritar um jogo, instalar versão nova com atualização e conferir que existe um aplicativo e o favorito permanece. Chave privada nunca entra no GitHub/CI.
