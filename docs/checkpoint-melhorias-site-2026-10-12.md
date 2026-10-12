# Checkpoint e revisão do site — 12/10/2026

Checkpoint anterior: **antes-melhorias-site-2026-10-12**, commit `1cc7ef347e9665e77031c92cbaf7894eaee1310e`. Esse commit imutável preserva o site completo, incluindo jogos, dados e configuração online. Restaurar somente quando solicitado. Reverter o conjunto de mudanças desta revisão, preservando futuros trabalhos independentes.

## Experiência

- Inicial com Jogo da Velha, Adivinhe pela Carreira e destaque diário alternando Lendas, Champions e Forja. Sem carrossel animado.
- Três Shorts e quatro matérias recentes; expansão mantém acesso a todos os itens. Pesquisa e categorias pesquisam o acervo inteiro. Enquete recolhida e carregada ao abrir.
- Catálogo mantém os cinco jogos, anuncia o online e informa formatos sem inventar duração em minutos.
- Ilustração original própria para Champions; identidade preto/dourado conservada.
- Jogo da Velha inicia com configurações recomendadas; personalização conserva modos, bot, roubo, rodadas e salas online.
- Duas sugestões discretas ao terminar matérias; uma leitura no fim dos jogos Lendas, Champions, Velha e Adivinhe pela Carreira.
- Acesso administrativo removido dos rodapés revisados; CMS e configuração editorial preservados. Template das futuras matérias inclui as sugestões de leitura.

## Carregamento e dados

Original `velha-dados.js`: 23.460.732 bytes. Novo catálogo `velha-jogadores.js`: 4.680.158 bytes, redução de 80,1% antes da compressão. O arquivo de alternativas para pesquisa passa de 1.960.221 para 527.504 bytes. Isso mede arquivos, não tempo de rede.

Os 25.742 atletas, IDs, modos, critérios, datas, posições e conhecimento do bot são idênticos. Identidades são armazenadas como linhas e categorias como índices, reconstruídos na inicialização. URLs das fontes compartilham prefixos, reconstruídos sem alterar os endereços. Evidências/fontes são separadas em dez arquivos em `dados/velha-fontes-*.json`, solicitados ao abrir as respostas da rodada encerrada. Originais completos continuam preservados. Nenhuma atualização factual ou mudança no serviço Supabase.

Atualizações futuras da base devem regenerar os dois catálogos derivados e os dez arquivos de fontes a partir da mesma versão. Não atualizar somente um deles. `tests/site-melhorias.test.cjs` confere equivalência de todas as identidades, critérios, fontes e nomes alternativos.

## Desafio diário

Uma grade brasileira normal por dia, contra bot equilibrado, uma rodada, sem roubo. Data em America/Sao_Paulo; grade e decisões do bot derivam da data e do estado da partida. Mesmas decisões reproduzem o mesmo resultado. O primeiro resultado concluído do dia vale; repetições servem como treino. Histórico e sequência ficam no navegador, com cópia de texto do resultado. Não existe ranking global nem proteção contra manipulação do armazenamento local.

## Verificação

Testes de equivalência nos sete modos, busca, empate e cliente online; sintaxe JavaScript e template editorial. Prévia no navegador: expansão de Shorts e matérias, busca Garrincha, início local, busca Rodri, empate, fontes sob demanda, desafio diário e layout estreito sem overflow da página.

Novos estilos de jogo permanecem para uma próxima etapa.

## Regra adicional dos critérios
Campeão/artilheiro do Brasileirão, campeão da Copa do Brasil e da Libertadores são restritos às grades brasileiras. Os fatos individuais permanecem intactos. Europa League tem peso 0,2 no Brasileirão e 1 nos demais modos. Frequência no primeiro sorteio brasileiro: normal 1,3%; difícil 4,4%. Próximas rodadas também consideram mudança dos seis critérios. Mesma regra na função online opc_velha_pick; catálogo e permissões preservados. Partidas em andamento conservam a grade atual; a nova regra vale nas próximas grades.

