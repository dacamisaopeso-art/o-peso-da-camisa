# Checkpoint anterior ao FutDraw

Repositório: `dacamisaopeso-art/o-peso-da-camisa`.

Commit anterior: `1e829c7e9dd8eaeec60aaa4549e17dbc19a76d5d`.

O FutDraw acrescenta sua página, seus recursos, catálogo e estruturas `opc_futdraw_*`. Os jogos anteriores, suas bases de jogadores, salas e regras são preservados. O cartão é acrescentado à aba Jogos, e o sitemap e a política de privacidade passam a mencionar o novo jogo. Não introduz anúncios.

Antes de instalar o servidor, foi conferido que `public.opc_futdraw_rooms` não existia e que o catálogo do Jogo da Velha estava em `2026-10-14-v10-fatos-online`. As novas tabelas não concedem acesso direto aos clientes. O acesso ao novo RPC é restrito a sessões autenticadas anônimas, com validação de participação na sala.

Para retirar o FutDraw da navegação, reverta apenas os arquivos desta entrega, mantendo as estruturas e sessões existentes até uma decisão sobre sua retenção. Não restaurar ou remover dados de outros jogos.
