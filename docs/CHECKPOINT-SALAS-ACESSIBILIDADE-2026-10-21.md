# Checkpoint — salas e acessibilidade

Base anterior: `68e36d3e134c8978730e54f5bc8808b2d0242066`.

Escopo: sugestões 1, 2, 5, 6 e 7. Oito jogos, dados, regras e identidade OPC preservados.

- Salas novas por código: confirmação de prontidão, participantes, anfitrião remove na espera/fim; revanche por votos dos participantes ativos.
- Salas antigas e pareamento público mantêm protocolo anterior, para compatibilidade com aplicativos anteriores. Não há votação anunciada nesses casos.
- Preferências locais: três tamanhos de texto, redução de movimento, sinais além da cor e bloqueio opcional de imagens/fontes externas a partir da próxima navegação. Não interrompe partida nem bloqueia Supabase.
- Ajuda para os oito jogos, contexto dos critérios na Velha, relógios continuam ativos.
- Android 0.3.0, código 3, mesmo identificador oficial e assinatura permanente da 0.2.0. Atualizar sem desinstalar.

Migração `online/salas-social-2026-10-21.sql`: aplicada ao Supabase após autorização explícita do proprietário. Compatível com clientes antigos, tabelas continuam protegidas e auxiliares sem execução pública. Reverter apenas o front-end para a base anterior é compatível com o esquema atualizado; não apagar tabelas nem salas para voltar o visual.

Verificações: suites de jogos, integração PostgreSQL (legado, prontidão, votos, expulsão, controle de acesso), construção e testes da Forja; pacote Android preserva fontes e dados dos oito jogos. Publicação e APK devem ser confirmados por execução e hash antes de anunciar disponibilidade.
