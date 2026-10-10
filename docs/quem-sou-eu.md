# Quem Sou Eu? / Guess the Player

Jogo original OPC, executado no navegador, sem backend, anúncios, cookies ou chamadas externas durante a rodada. Desafio das Lendas e Desafio da Champions foram preservados. A identidade visual e o banner SVG são originais; as quatro capturas de referência foram usadas apenas para entender a mecânica de pistas. Todas as fotos do jogo são fotografias reais com licenças individuais verificadas do Wikimedia Commons.

## Cobertura em 10 de outubro de 2026

| Primeira divisão | Clubes com atletas elegíveis | Jogadores completos, com foto e jogáveis |
| --- | ---: | ---: |
| Premier League 2026/27 | 15 | 34 |
| LaLiga 2026/27 | 7 | 31 |
| Serie A italiana 2026/27 | 8 | 24 |
| Bundesliga 2026/27 | 8 | 22 |
| Ligue 1 2026/27 | 7 | 23 |
| Brasileirão Série A 2026 | 8 | 28 |
| Total | 53 | 162 |

A coleta consultou todos os 116 clubes e 3.774 registros dos elencos da ESPN, inclusive jovens listados. 574 atletas tinham todas as categorias factuais; destes, 162 tiveram foto licenciada e identidade verificadas. Conforme a preferência explícita do usuário, **somente atletas com todas as categorias e foto reutilizável** foram conservados na base distribuída e disponibilizados tanto para sorteio quanto para chutes. Portanto, a base final não contém todos os jogadores nem todos os clubes: contém 162 atletas de 53 clubes, com cobertura parcial. Europa combinada: 134 atletas de 45 clubes. Não é uma certificação de todos os atletas registrados em cada federação. Não inclui seleções, segundas divisões ou Brasil no modo Europa.

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

O serviço fornece grupos G/D/M/F. G é convertido em GOL; as funções ZAG, LE, LD, VOL, MC, MEI, PD, PE e ATA de uma seleção de atletas conhecidos recebem curadoria editorial por ID estável em `docs/quem-sou-eu-posicoes.json`. Essa função é uma simplificação de jogo, não uma afirmação de que o atleta só joga ali. Registros sem função detalhada são excluídos; DEF/MEIO/ATQ nunca são oferecidos no jogo. Ampliar posições verificadas e fotos licenciadas é necessário para ampliar a cobertura.

Foram encontrados dois IDs duplicados entre ligas. A [contratação de Arthur Chaves pelo Botafogo](https://botafogo.com.br/noticias/bem-vindo-arthur-chaves) resolve o registro antigo do Hoffenheim; ele ainda fica fora da base jogável por ausência de função detalhada na curadoria. O ID de Moussa Diarra aparece em Málaga e Lens com identidade conflitante; ambos os registros são excluídos até revisão. Correções confirmadas constam em `docs/quem-sou-eu-correcoes.json` e expiram na coleta de outro dia, exigindo revisão.

## Fotografias e créditos

As 162 fotografias foram vinculadas aos atletas pela propriedade ESPN FC ID (`P3681`) do Wikidata, com a data de nascimento (`P569`) igual à da ficha da base. A imagem (`P18`) aponta para o Wikimedia Commons. Cinco resultados sem nascimento coincidente foram descartados, sem tentar resolver por semelhança de nome ou rosto. As 162 restantes tiveram licença, autoria, URL do arquivo e página de origem verificadas via `imageinfo/extmetadata` do Commons e foram incorporadas localmente. Todas as imagens foram decodificadas e inspecionadas em folhas de conferência.

Cada imagem mantém sua própria licença CC BY ou CC BY-SA indicada no manifesto `docs/quem-sou-eu-fotos.json`; não existe licença única aplicada por suposição. Autoria, link da licença e página do arquivo aparecem junto à foto em todas as etapas da rodada. A página [Créditos das fotografias](../creditos-quem-sou-eu.html) também preserva nome, foto, autor, licença, origem e identidade. As miniaturas fornecidas pelo Commons foram otimizadas em WebP, mantendo a licença original da imagem; a apresentação faz enquadramento e blur progressivos. A conversão e as mudanças de apresentação são informadas nos créditos e no manifesto.

Fotos podem ser antigas, usar uniforme de outra equipe ou mostrar o jogador em ação. Portanto, roupa, aparência e idade visual não representam os dados atuais de clube/idade. A identidade e os dados factuais são independentes da época da foto. Não há fotos copiadas do site de referência nem de galerias de clubes/ESPN sem licença. Atletas sem foto reutilizável verificável foram excluídos, conforme escolha do usuário; não há fallback gráfico de jogador.

Fontes de reutilização e metadados: [Wikimedia Commons — reuse](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia), [CommonsMetadata](https://www.mediawiki.org/wiki/Extension:CommonsMetadata) e [créditos de mídia](https://attribution.wikimedia.org/attribution-signals/license.html).

## Mecânica

- Sete modos, três dificuldades, 3–20 tentativas ajustáveis (padrão 5 individual, 10 combinado).
- Todas as dificuldades usam todos os nomes do modo. Fácil começa com cidadania e posição disponíveis, normal sem pistas iniciais, difícil usa blur maior e desativa dicas.
- Busca de nomes com normalização de acentos, lista com ícone da posição, clube para distinguir homônimos, navegação por teclado, seleção obrigatória e rejeição de chute repetido.
- Comparação de cidadania, clube, posição detalhada, idade e camisa; liga somente no combinado. Verde/✓ para igualdade, cinza/≠ para diferença, setas indicam o sentido do valor procurado. Texto acompanha cores para acessibilidade. Nenhuma categoria ausente é oferecida no sorteio ou na busca.
- Dicas revelam um campo disponível ainda não conhecido; não consomem tentativa. Nenhum anúncio ou promessa de recompensa.
- Vitória por ID do atleta, derrota no limite; resposta e fonte reveladas em ambos. Reiniciar evita repetir o alvo anterior; trocar modo retorna à configuração.
- Layout com grades adaptadas a 800 e 600 px, controles de pelo menos 48 px, autocomplete acessível e redução de animação conforme preferência do sistema.

## Atualização e testes

`python scripts/atualizar-quem-sou-eu.py` coleta novamente todos os clubes/elencos e filtra obrigatoriamente todas as categorias completas e a presença de foto licenciada no manifesto/localmente antes de gravar a base; falhas ou elenco vazio abortam antes de substituir a base. Conflitos de clube são documentados e excluídos, não resolvidos por suposição. Revise temporada, transferências, campos ausentes, contagens, curadoria e licenças antes de publicar. Ampliar a galeria exige verificar identidade, autoria e licença individual e incorporar a foto antes de disponibilizar o atleta. O script não publica automaticamente nem garante que o serviço continuará disponível.

`node tests/quem-sou-eu.test.cjs` testa cobertura, identidade, filtros, comparação numérica, dados ausentes, aniversário, dicas, tentativa inválida/repetida, vitória, derrota, reinício e blur. Verificação de sintaxe: `node --check quem-sou-eu.js` e `node --check quem-sou-eu-dados.js`.
