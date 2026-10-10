# Desafio da Champions

Dados consultados em 9 de outubro de 2026. O jogo reúne os participantes da fase principal das 28 edições de 1999/2000 a 2026/27: 908 elencos e 151 clubes. Qualificatórias não entram no sorteio de jogadores.

## Elencos e escudos

Fonte primária: serviços públicos da UEFA e biblioteca de imagens dos clubes.

- Partidas e participantes: `https://match.uefa.com/v5/matches?competitionId=1&seasonYear=2027&limit=500&offset=0`, filtrando a fase `TOURNAMENT`.
- Elenco registrado: `https://comp.uefa.com/v2/competitions/1/seasons/2027/teams/50051/squad` (exemplo do Real Madrid).
- Temporadas sem elenco registrado disponível: união dos jogadores relacionados nos jogos da fase principal, usando `https://match.uefa.com/v5/matches/{matchId}/lineups`. Estes elencos são identificados por `source: "match-squads"`; não se afirma que incluam jogadores nunca relacionados.
- Posições: grupo do elenco daquela edição; na ausência deste dado, posição do registro do jogador, posição da seleção ou outro registro oficial da mesma pessoa. Os 78 registros de ex-jogadores sem posição preenchida na API receberam curadoria de função geral (goleiro, defesa, meio ou ataque), para não excluir nomes como Zidane e Frank de Boer. Funções específicas disponíveis são preservadas em cada registro. Exemplos conferidos em fontes primárias: [Pavel Hapal](https://www.uefa.com/news-media/news/025d-0f8e78eb7339-cebdd75303c3-1000--international-midfielders-become-latest-champions-teachers/), [Theo Lucius](https://www.uefa.com/uefachampionsleague/news/01b0-0e6d33a9cf30-a33c7ce4c9f4-1000--unwanted-rematch-for-hiddink/) e [Mihael Mikić](https://www.uefa.com/news-media/news/01b7-0f848b787ff4-6068a408b36b-1000--ia-appoint-twins-to-top-job/).
- Escudos: URL `mediumLogoUrl` de cada clube retornada pela UEFA, otimizada em WebP e incorporada em `escudos-champions.js`, permitindo que as cartas funcionem sem depender de chamadas externas. Os escudos identificam os clubes; não são uma coleção de versões de cada época.

O identificador oficial do jogador impede que a mesma pessoa seja escalada duas vezes, inclusive em clubes ou temporadas diferentes. Clube, temporada e escudo são copiados para o jogador escolhido, independentemente de sorteios posteriores. Cada edição usa somente seu próprio elenco. A temporada 2026/27 é um retrato dos registros disponíveis na data de coleta, sujeito a alterações posteriores.

Os códigos antigos do serviço de partidas usam o ano inicial da temporada até 2006/07; a partir de 2007/08 usam o ano final. As datas das partidas foram conferidas para evitar deslocar os elencos em um ano. O identificador 2007 vazio da API não representa uma edição ausente.

## Competição

Regulamento primário da UEFA 2026/27:

- [Artigo 16: sorteio da liga](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-16-Draw-system-league-phase-Online).
- [Artigo 17: 36 clubes, oito adversários, classificação](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-17-Match-system-league-phase-Online).
- [Artigo 18: desempates da liga](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-18-Equality-of-points-league-phase-Online).
- [Artigo 19: posições e caminhos do mata-mata](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-19-Draw-system-knockout-phase-Online).
- [Artigo 20: ida e volta](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-20-Match-system-knockout-phase-Online).
- [Artigo 21: agregado, prorrogação e pênaltis](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-21-Knockout-system-extra-time-and-penalty-shoot-outs-Online).
- [Artigo 22: final](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-22-Match-system-final-Online).

Cada campanha tem o esquadrão do usuário e 35 clubes distintos, com uma edição histórica por clube. Há quatro potes de nove, dois adversários de cada pote, um como mandante e um como visitante, sem adversário da mesma associação e com no máximo dois adversários da mesma associação. O esquadrão misto do usuário não possui associação. As oito rodadas têm 18 partidas cada.

1º ao 8º avançam diretamente às oitavas; 9º ao 24º jogam playoffs; 25º ao 36º são eliminados. Os confrontos dos playoffs seguem os pares 9/10 × 23/24, 11/12 × 21/22, 13/14 × 19/20 e 15/16 × 17/18. O chaveamento das oitavas respeita os caminhos desses pares e separa os primeiros e segundos colocados em lados opostos. A posição de cabeça de chave é herdada por quem elimina o clube naquele caminho, incluindo a volta em casa nas quartas e semifinais. Final em jogo único; sem disputa de terceiro lugar. Gols fora não desempatarão o mata-mata.

Adaptações explícitas de entretenimento: os potes e o último desempate utilizam força histórica estimada, em vez do coeficiente UEFA de clubes pertencentes a temporadas diferentes. Fair play permanece empatado, pois cartões não são simulados. As notas são estimativas, não dados oficiais: base pela fase alcançada, destaques individuais e ajuste de idade. Dificuldade aplica −6/0/+6 à força dos adversários; velocidade altera apenas a duração da animação. A campanha termina quando o usuário é eliminado; o jogo não afirma simular uma edição histórica real.

## Verificação

`node tests/formato-champions.test.cjs` confere 30 sorteios completos, potes, mandos, associações, ausência de confrontos repetidos, caminhos dos playoffs/oitavas, herança de posição, agregado sem gols fora, prorrogação, pênaltis e critérios de desempate.

`node tests/clubes-champions.test.cjs` confere a cobertura das edições, identidade dos clubes e jogadores, escudos e composição dos elencos.
