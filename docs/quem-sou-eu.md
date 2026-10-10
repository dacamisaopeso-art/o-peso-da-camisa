# Quem Sou Eu? / Guess the Player

Jogo original OPC, executado no navegador, sem backend, anúncios, cookies ou chamadas externas durante a rodada. Desafio das Lendas e Desafio da Champions foram preservados. A identidade visual e o retrato SVG são originais; as quatro capturas de referência foram usadas apenas para entender a mecânica de pistas.

## Cobertura em 10 de outubro de 2026

| Primeira divisão | Clubes | Jogadores completos e jogáveis |
| --- | ---: | ---: |
| Premier League 2026/27 | 20 | 93 |
| LaLiga 2026/27 | 20 | 93 |
| Serie A italiana 2026/27 | 20 | 96 |
| Bundesliga 2026/27 | 18 | 80 |
| Ligue 1 2026/27 | 18 | 79 |
| Brasileirão Série A 2026 | 20 | 133 |
| Total | 116 | 574 |

A coleta consultou todos os 116 clubes e 3.774 registros dos elencos da ESPN, inclusive jovens listados. Conforme a preferência do usuário, **somente os 574 atletas com todas as categorias completas** foram conservados na base distribuída e disponibilizados tanto para sorteio quanto para chutes. Todos os 116 clubes continuam representados, mas seus elencos jogáveis são parciais. Europa combinada: 441 atletas de 96 clubes. Não é uma certificação de todos os atletas registrados em cada federação. Não inclui seleções, segundas divisões ou Brasil no modo Europa.

Fonte factual: serviço público de elencos do próprio publicador ESPN. Endpoint de clubes `https://site.api.espn.com/apis/site/v2/sports/soccer/{liga}/teams?limit=100`; endpoint de elenco `https://site.api.espn.com/apis/site/v2/sports/soccer/{liga}/teams/{id}/roster`. Códigos: `eng.1`, `esp.1`, `ita.1`, `ger.1`, `fra.1`, `bra.1`. Cada clube guarda endpoint e temporada; cada atleta guarda ID estável, ficha de origem, clube, data de nascimento, cidadania e camisa. Nenhuma fotografia, biografia, marca gráfica ou texto editorial da ESPN foi reproduzido.

Conferências adicionais em fontes primárias de clubes/competição:

- [Real Madrid](https://www.realmadrid.com/en-US/football/first-team/players)
- [Inter](https://www.inter.it/en/teams/first-team)
- [PSG](https://www.psg.fr/football-masculin/effectif)
- [Bayern / Bundesliga](https://www.bundesliga.com/en/bundesliga/clubs/fc-bayern-muenchen/squad)
- [Flamengo](https://www.flamengo.com.br/futebol/elenco)
- [Arrascaeta: idade e camisa](https://www.flamengo.com.br/en/futebol/atleta/de-arrascaeta)
- [Manchester City: relacionados em 2026](https://www.mancity.com/news/mens/fa-cup-final-chelsea-may-2026-team-news-tactics-63914526)

Estas conferências são pontuais, não uma auditoria individual de todos os jogadores.

## Qualidade, posições e imagens

117 registros sem nascimento, 128 sem cidadania e 50 sem camisa na coleta. 3.175 não possuíam função detalhada na fonte/curadoria. As contagens de ausência podem se sobrepor; todos esses registros foram excluídos da base jogável. Idade é calculada na data da base; não muda diariamente enquanto a base não é atualizada. A cidadania da fonte não necessariamente equivale à seleção nacional do atleta.

O serviço fornece grupos G/D/M/F. G é convertido em GOL; as funções ZAG, LE, LD, VOL, MC, MEI, PD, PE e ATA de uma seleção de atletas conhecidos recebem curadoria editorial por ID estável em `docs/quem-sou-eu-posicoes.json`. Essa função é uma simplificação de jogo, não uma afirmação de que o atleta só joga ali. Registros sem função detalhada são excluídos; DEF/MEIO/ATQ nunca são oferecidos no jogo. A cobertura contém 422 goleiros e 152 jogadores de linha, pois a fonte identifica diretamente a função dos goleiros. Ampliar posições verificadas é necessário para tornar a distribuição mais equilibrada.

Foram encontrados dois IDs duplicados entre ligas. A [contratação de Arthur Chaves pelo Botafogo](https://botafogo.com.br/noticias/bem-vindo-arthur-chaves) resolve o registro antigo do Hoffenheim; ele ainda fica fora da base jogável por ausência de função detalhada na curadoria. O ID de Moussa Diarra aparece em Málaga e Lens com identidade conflitante; ambos os registros são excluídos até revisão. Correções confirmadas constam em `docs/quem-sou-eu-correcoes.json` e expiram na coleta de outro dia, exigindo revisão.

Não foram encontradas/verificadas licenças individuais para uma coleção completa de fotos. Portanto, todos usam um fallback SVG original genérico (silhueta, iniciais e camisa), claramente rotulado como ilustração e nunca como foto real. Blur decrescente torna essas pistas legíveis, mas não oferece reconhecimento facial. Não há download ou hotlink de fotos, nem cópia de código/imagens do jogo de referência.

## Mecânica

- Sete modos, três dificuldades, 3–20 tentativas ajustáveis (padrão 5 individual, 10 combinado).
- Todas as dificuldades usam todos os nomes do modo. Fácil começa com cidadania e posição disponíveis, normal sem pistas iniciais, difícil usa blur maior e desativa dicas.
- Busca de nomes com normalização de acentos, lista com ícone da posição, clube para distinguir homônimos, navegação por teclado, seleção obrigatória e rejeição de chute repetido.
- Comparação de cidadania, clube, posição detalhada, idade e camisa; liga somente no combinado. Verde/✓ para igualdade, cinza/≠ para diferença, setas indicam o sentido do valor procurado. Texto acompanha cores para acessibilidade. Nenhuma categoria ausente é oferecida no sorteio ou na busca.
- Dicas revelam um campo disponível ainda não conhecido; não consomem tentativa. Nenhum anúncio ou promessa de recompensa.
- Vitória por ID do atleta, derrota no limite; resposta e fonte reveladas em ambos. Reiniciar evita repetir o alvo anterior; trocar modo retorna à configuração.
- Layout com grades adaptadas a 800 e 600 px, controles de pelo menos 48 px, autocomplete acessível e redução de animação conforme preferência do sistema.

## Atualização e testes

`python scripts/atualizar-quem-sou-eu.py` coleta novamente todos os clubes/elencos e filtra obrigatoriamente todas as categorias completas antes de gravar a base; falhas ou elenco vazio abortam antes de substituir a base. Conflitos de clube são documentados e excluídos, não resolvidos por suposição. Revise temporada, transferências, campos ausentes, contagens e curadoria antes de publicar. O script não publica automaticamente nem garante que o serviço continuará disponível.

`node tests/quem-sou-eu.test.cjs` testa cobertura, identidade, filtros, comparação numérica, dados ausentes, aniversário, dicas, tentativa inválida/repetida, vitória, derrota, reinício e blur. Verificação de sintaxe: `node --check quem-sou-eu.js` e `node --check quem-sou-eu-dados.js`.
