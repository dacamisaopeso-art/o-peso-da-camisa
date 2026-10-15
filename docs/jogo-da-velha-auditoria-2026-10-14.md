# Revisão de fatos — 14/10/2026

Checkpoint anterior: `20d0603ed2a153f3c3787993687591e4941011b2`. Mantém o acervo de 25.742 identidades e os demais jogos. A atualização corrige relações e conquistas; não depende de fotografias.

## Casos relatados

Neymar, Gustavo Scarpa, Thiago Silva, Roger Machado e Vampeta passam pelo cruzamento **jogou com Ronaldinho + campeão da Copa do Brasil**. As duas condições têm comprovações separadas:

| Jogador | Partida com Ronaldinho incorporada | Copa do Brasil confirmada |
| --- | --- | --- |
| Neymar | Brasil–Argentina, 28/09/2011; relato da FIFA | Santos, 2010; CBF |
| Gustavo Scarpa | Fluminense–Grêmio, 01/08/2015; CBF e Rádio Nacional/EBC | Palmeiras, edição 2020; arquivo do clube |
| Thiago Silva | Milan–Udinese, 12/02/2010; arquivo do Milan | Fluminense, 2007; arquivo do clube |
| Roger Machado | Grêmio–Internacional, 20/06/1999; reportagem contemporânea do Correio do Povo preservada em arquivo | Grêmio, 1997; arquivo do clube |
| Vampeta | Brasil–México, 04/08/1999; ficha da DFB | Corinthians, 2002; CBF |

Rodinei já estava na base. Sua Copa do Brasil de 2022 tem confirmação da FERJ. Isso não lhe atribui automaticamente uma partida com Ronaldinho: as duas passagens pelo Flamengo ocorreram em épocas diferentes.

Scarpa **não foi titular** no jogo de 01/08/2015: entrou por Osvaldo ainda no primeiro tempo e atuou simultaneamente com Ronaldinho no segundo. A auditoria registra um intervalo comum, sem inventar uma escalação inicial.

## O que foi conferido

- Reextração de conquistas nas **14.305 biografias disponíveis com seção de honrarias**: competição, contexto de atleta, edição e distinção individual separados. Indicação, vice, terceiro/quarto, seleção do torneio e troféu de treinador não contam como título de jogador.
- Cruzamento dos títulos de seleções com o país campeão da edição em registros da FIFA, UEFA e CONMEBOL. Nacionalidade/cidadania não prova atuação por seleção. Ser reserva de um elenco campeão pode dar título sem uma partida pela seleção naquele ano; Euro 2020 foi disputada em 2021.
- Ballon d’Or conferido pelo palmarès anual completo divulgado pela UEFA/France Football. Não conta Bola de Ouro de Copa, indicação ou revisão retrospectiva.
- Ampliação de artilheiros por edição, com identidade exata. Na artilharia, empates em gols contam; artilharia interna de um clube não basta.
- Novas relações “jogou com” obtidas de **22 registros de partidas**, incluindo campanhas já documentadas na Escalação Histórica. Não se conclui que dois atletas jogaram juntos apenas porque estiveram no mesmo elenco ou clube em anos próximos.
- Normalização de sete grafias históricas de clubes brasileiros, sem unir homônimos como Santos da África do Sul, Vitória de Setúbal ou Cruzeiro feminino aos clubes brasileiros masculinos correspondentes.
- Recálculo das 1.120 grades, suas contagens e nove respostas distintas; substituição de grades que deixaram de atender ao mínimo. O modo Champions conserva clubes conhecidos, mínimo de cinco respostas no normal e os critérios brasileiros separados.
- Base completa, carga compacta, fontes adiadas e catálogo online são gerados juntos e comparados nos testes.

## Evidências e reprodução

`dados/velha-auditoria-2026-10-14.json` registra as alterações por identidade, fontes, anos e testemunhos de partidas. `docs/velha-titulos-extraidos-2026-10-14.json.gz` conserva os fatos e as rejeições da extração, sem distribuir as biografias inteiras. `docs/jogo-da-velha-auditoria-2026-10-14.json` contém os totais efetivamente aplicados e as grades substituídas.

Para reaplicar: `node scripts/revisar-velha-fatos.cjs`, depois `node scripts/gerar-velha-online.cjs`. Para conferir o site: `node scripts/testar-jogos.cjs`. A publicação automática só salva os artefatos gerados depois que os testes passam. O catálogo do Supabase precisa acompanhar a mesma versão; isso altera apenas os dados públicos do jogo, não permissões, funções ou partidas dos usuários.

## Limites honestos

Esta revisão **não é uma conferência manual de todas as fichas de 25 mil atletas**, nem garante que já foram incorporados todos os companheiros e títulos de toda a história. A extração estruturada foi revisada e os exemplos relatados receberam investigação individual. A cobertura de partidas compartilhadas continua parcial. A ausência de um vínculo ainda não documentado não demonstra que ele nunca aconteceu.

O corte de conquistas continua em edições encerradas até **2025**. Atualizações de 2026 não são presumidas. Uma futura ampliação deve incorporar evidências e recalcular as grades, mantendo o mesmo procedimento nos modos local e online.

### Fontes principais

- [FIFA: Neymar, Ronaldinho e Lucas em 2011](https://inside.fifa.com/en/news/ten-moments-from-neymar-s-ten-brazil-years).
- [Milan: partida de 12/02/2010](https://www.acmilan.com/it/news/articoli/storia/2024-10-17/time-machine-milan-udinese).
- [Fluminense: Copa do Brasil de 2007](https://www.fluminense.com.br/noticia/relembre-titulo-do-fluminense-na-copa-do-brasil-de-2007).
- [Palmeiras: campanha campeã de 2020 e Scarpa](https://www.palmeiras.com.br/noticias/detalhes-imagens-e-curiosidades-da-caminhada-rumo-ao-titulo-da-copa-do-brasil/).
- [CBF: títulos de Vampeta](https://www.cbf.com.br/selecao-brasileira/noticias/selecao-masculina/a/pentacampeao-em-2002-vampeta-comemora-51-anos-nesta-quinta-feira).
- [DFB: Brasil–México de 1999](https://datencenter.dfb.de/en/data-center/fifa-confederations-cup/1999-in-mexico/final/mexico-brazil-437592).
- [UEFA: vencedores do Ballon d’Or](https://www.uefa.com/ballondor/news/0287-195e642735da-0594342b9554-1000--history-of-the-ballon-d-or-all-the-winners/).
- [FIFA: campeões mundiais](https://www.fifa.com/en/member-associations/france/articles/watch-match-highlights-full-replays-previous-fifa-world-cup-finals), [UEFA: finais da Euro](https://www.uefa.com/uefaeuro/history/news/0259-0e5e039dd8b6-ac24fc62a240-1000--all-the-euro-finals-scores-scorers-lineups-and-venues/), [CONMEBOL: campeões da Copa América](https://copaamerica.com/es/novedades/todas-ediciones-conmebol-copa-america-campeones-sedes-mejores-jugadores).
