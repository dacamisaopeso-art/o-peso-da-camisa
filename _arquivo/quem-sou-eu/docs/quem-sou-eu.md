# Quem Sou Eu? / Guess the Player

Jogo original OPC para GitHub Pages. Desafio das Lendas e Desafio da Champions preservados. Interface preta/dourada, banner original, fotos locais, sem anúncios ou chamadas externas durante a rodada.

## Cobertura em 10/10/2026

| Liga | Clubes jogáveis | Jogadores |
| --- | ---: | ---: |
| Premier League | 13 | 31 |
| LaLiga | 3 | 7 |
| Serie A italiana | 3 | 4 |
| Bundesliga (apenas Bayern e Dortmund) | 2 | 6 |
| Ligue 1 | 4 | 6 |
| Brasileirão Série A | 6 | 13 |
| Total | 31 | 67 |

Europa combinada: 54 jogadores de 25 clubes. Brasil: 13 de 6 clubes. A pesquisa abrangeu 100 clubes e 3.307 registros de elenco, com 698 jogadores completos antes do filtro fotográfico. A cobertura final é parcial: não representa todos os clubes ou atletas registrados. O corte estrito de fotos reduziu a base anterior de 162 atletas.

## Critérios obrigatórios

Sorteio e autocomplete usam exatamente a mesma base. Cada jogador possui cidadania, clube, liga, nascimento, camisa, posição detalhada e fotografia licenciada. Não são oferecidos campos desconhecidos ou posições genéricas DEF/MEIO/ATQ.

Toda fotografia foi conferida visualmente e mostra uniforme de jogo do clube atual na base. Preferência pela primeira camisa; segunda, terceira e uniforme de goleiro são alternativas permitidas. Seleções, antigos clubes, treino/aquecimento, viagem e identidade ambígua foram excluídos.

A data da fotografia deve estar entre **10/10/2021 e 10/10/2026**, inclusive, para todos os jogadores, incluindo retornos ao clube e atletas antigos. Data de upload não substitui data da foto. Quando a fonte informa apenas mês ou ano, todo o intervalo precisa caber nesses cinco anos; os créditos preservam essa precisão sem inventar um dia. Data incerta implica exclusão.

O manifesto `quem-sou-eu-fotos.json` registra autor, licença individual, origem, identidade, clube do uniforme, evidência visual, data e precisão. Creative Commons não significa ausência de direitos autorais: cada licença e suas condições permanecem nos créditos junto da imagem e na página de créditos. WebP, redimensionamento, enquadramento e blur são informados como adaptações. Não foram copiadas fotografias de Transfermarkt, ESPN ou galerias de clubes sem autorização.

## Pesquisa e fontes

Elencos e categorias factuais: ESPN, endpoints públicos `https://site.api.espn.com/apis/site/v2/sports/soccer/{liga}/teams?limit=100` e `https://site.api.espn.com/apis/site/v2/sports/soccer/{liga}/teams/{id}/roster`. Ligas: eng.1, esp.1, ita.1, ger.1, fra.1 e bra.1. A Alemanha é filtrada para IDs 132/124. Cada ficha mantém seu link factual. Temporadas europeias 2026/27 e brasileira 2026 conforme a coleta; transferências e inscrições podem mudar. Idade é calculada na data da base.

Identidades foram cruzadas pelo ID ESPN do Wikidata e nascimento; nomes adicionais exigiram correspondência única e nascimento coincidente. Posições específicas foram conferidas em Wikidata, fichas Wikipedia e perfis Transfermarkt indexados. `quem-sou-eu-revisao-fontes.json` guarda evidências; `quem-sou-eu-posicoes.json` guarda a curadoria por ID. Quando a ficha traz múltiplas funções específicas, a primeira é usada para comparação, sem afirmar exclusividade tática. Categorias amplas não foram convertidas por suposição.

A busca fotográfica incluiu Wikimedia Commons, Openverse, Flickr, Europeana, Pexels, Pixabay, PxHere e PublicDomainPictures. Disponibilidade gratuita não comprova identidade, licença, data e uniforme. Apenas imagens verificadas do Commons entraram nesta versão. Foram localizados milhares de candidatos; nem todos puderam ser inspecionados ou obtidos, inclusive por limites de acesso dos acervos. Não se afirma uma auditoria completa de todas as imagens existentes.

Fontes de reutilização: [Commons](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia), [Flickr](https://www.flickr.com/creativecommons/) e [orientação Flickr](https://www.flickrhelp.com/hc/en-us/articles/10710266545556-Using-Flickr-images-shared-by-other-members).

Conferências de uniformes: [Palmeiras dourado](https://www.palmeiras.com.br/noticias/palmeiras-e-puma-apresentam-novo-terceiro-uniforme-em-inedita-cor-dourada/), [Santos e patrocinador](https://www.santosfc.com.br/patrocinadora-master-atende-pedido-da-torcida-e-faz-mudanca-em-uniforme-do-santos-fc/), [Brentford 2026/27](https://www.brentfordfc.com/en/news/club-news-brentford-announces-indeed-new-principal-front-of-shirt-partner).

## Mecânica

Dois modos: Europa combinada e Brasileirão. Padrões de 10 e 5 tentativas, ajustáveis entre 3 e 20. Três dificuldades: fácil revela cidadania e posição; normal sem pistas iniciais; difícil aumenta blur e desativa dicas. Todas usam todos os nomes elegíveis do modo.

Autocomplete com acentos normalizados, posição, clube e teclado. Comparação de cidadania, clube, posição, idade e camisa; liga apenas na Europa. Verde/cinza acompanhados de símbolos e texto, setas para valores numéricos. Cada chute reduz blur. Dica opcional revela informação ainda não conhecida sem gastar tentativa. Vitória, derrota, resposta, reinício sem repetir o alvo anterior e troca de modo. Layout responsivo e preferência de redução de movimento.

## Atualização e validação

`python scripts/atualizar-quem-sou-eu.py` atualiza dados factuais e filtra todos os campos, licença, arquivo local, clube do uniforme e janela fotográfica. Não busca fotos automaticamente nem publica. Mudança de clube ou expiração da foto elimina o atleta até nova revisão. Falhas de coleta abortam antes da substituição; conflitos de identidade são excluídos. Revisar transferências, temporada, posições e licenças antes de publicar.

`node tests/quem-sou-eu.test.cjs` verifica dados, filtros de modos e fotos, limites de datas, comparação, aniversário, dicas, tentativas inválidas/repetidas, vitória, derrota, reinício e blur. `node --check` verifica os dois arquivos JavaScript. A publicação exige ainda conferir imagens e fluxo no navegador, incluindo celular.
