# Formato da Copa das Lendas

A estrutura segue a Copa do Mundo de 2026: 48 participantes, 12 grupos de quatro (A–L), três rodadas, classificação dos dois primeiros de cada grupo e dos oito melhores terceiros. O mata-mata tem fase de 32, oitavas, quartas, semifinais, final e disputa de terceiro lugar. Uma campanha completa simula 104 partidas.

Os cruzamentos da fase de 32 usam as 495 combinações do Anexo C, e as rodadas seguintes seguem os caminhos dos artigos 12.7 a 12.11. `formato-copa-2026.js` contém a tabela por conjunto de grupos classificados, com adversários nas colunas 1A, 1B, 1D, 1E, 1G, 1I, 1K e 1L. Nenhum terceiro enfrenta uma equipe do próprio grupo nessa fase.

Fonte: regulamento oficial FIFA, maio de 2026, artigos 12–13 e Anexo C: https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf

No grupo, equipes empatadas em pontos são comparadas pelos confrontos entre elas (pontos, saldo e gols), reaplicando esses critérios aos subconjuntos ainda empatados. Depois são usados saldo total, gols totais e ordem do sorteio. Entre os terceiros, são usados pontos, saldo, gols e ordem do sorteio. A simulação continua sem cartões ou ranking FIFA; a ordem do sorteio substitui os critérios finais. Também preserva a decisão direta por pênaltis em empates do mata-mata.

A derrota na semifinal permite continuar disputando o terceiro lugar. Os resultados finais distinguem campeão, vice, terceiro e quarto colocados. Dificuldade, ritmo, elencos históricos e cartas permanecem disponíveis.

Validação: `node tests/formato-copa-2026.test.cjs` verifica as 495 combinações, os participantes únicos e os caminhos do mata-mata.
