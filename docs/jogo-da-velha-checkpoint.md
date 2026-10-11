# Checkpoint — Jogo da Velha OPC

Pausa solicitada pelo usuário em 11/10/2026. Versão: `2026-10-11-v8-revisao-ligas`.

A ampliação já coletada foi consolidada, revisada e publicada. O banco complementar de atuações contempla as seis ligas; não representa cobertura histórica completa. O recorte inclui carreiras profissionais com passagem documentada de 1960 em diante, preservando Pelé, Garrincha e outros que começaram antes.

## Ponto de retomada

- Revisões de categorias e biografias concluídas nesta coleta: Brasil, Inglaterra, Espanha e Itália.
- Alemanha: categorias coletadas e biografias parcialmente coletadas. Respostas concluídas estão salvas; faltam biografias e conferência dos metadados restantes.
- França: importação do banco de atuações concluída; a revisão histórica adicional das categorias e biografias ainda está pendente.
- Não ampliar a pesquisa nem reiniciar a coleta até nova instrução do usuário.

## Dados e ferramentas preservados localmente

Na pasta de trabalho deste projeto, `work/data/velha/` contém os perfis, biografias, identidades verificadas, participação por liga e o catálogo final não compactado `catalog-v8.json`. `league-review/` guarda cada resposta concluída, permitindo retomar sem repetir consultas. `transfermarkt-open/` guarda o banco público de perfis e atuações, os vínculos de identidade e o relatório de importação.

O coletor retomável é `work/scripts/velha-ligas-revisar.py`. A consolidação local sem consultas é `velha-checkpoint.py`; a compilação é `velha-gerar.py`, seguida de `velha-ligas-finalizar.cjs` e `velha-publicacao-finalizar.cjs`. Estas ferramentas permanecem locais; os fatos e fontes publicados estão no catálogo e na documentação do site.

## Limitações e regras mantidas

Registros do banco complementar vão até 2025; biografias foram consultadas em outubro de 2026. Títulos e categorias de companheiros não são inferidos a partir de transferências. Identidades ambíguas são excluídas. O jogo continua sem fotos de atletas, com nomes completos, distinção de homônimos e identidade preta/dourada. Bot limitado por dificuldade, acordo de empate e início da rodada por quem aceitou o empate foram preservados. Integração online continua dependendo de configuração externa; nenhum ranking ou pareamento global é simulado como real.
