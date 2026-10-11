# Jogo da Velha Futebol — OPC

Jogo original em `jogo-da-velha.html`, com a identidade preta e dourada OPC. O cruzamento de dois critérios determina se um nome ocupa uma casa; três casas em linha, coluna ou diagonal vencem. Não usa fotografias, retratos ou imagens de atletas. As camisas e ícones são desenhos SVG originais. Peso usa uma camisa dourada com escudo simbólico; Tradição, uma camisa marfim com estrela. Ambos têm texto, forma e cor para identificar a posse.

## Cobertura da publicação

Coleta em 10/10/2026: **9,742 jogadores** atuais/históricos e **1,120 grades**, sem exigir disponibilidade de foto. Os universos se sobrepõem:

- Champions · cinco ligas: 5,688 jogadores.
- Premier League: 3,674 jogadores.
- LaLiga: 1,478 jogadores.
- Serie A italiana: 790 jogadores.
- Bundesliga: 210 jogadores.
- Ligue 1: 317 jogadores.
- Brasileirão Série A: 4,389 jogadores.

Há 495 grupos de nomes repetidos. Neles, busca, seleção e casa preenchida mostram idade e posição. **† indica a idade ao falecer**, calculada entre nascimento e morte, nunca a idade que o atleta teria hoje. Para vivos, a idade se atualiza pelo aniversário. Se nome, idade e posição ainda coincidirem, a busca e a casa mostram a data de nascimento completa. Homônimos sem datas/posição verificáveis ficam fora da base selecionável. Apelidos conhecidos são preservados; exemplos: Wellington Paulista, Juninho Pernambucano e Juninho Paulista. Dois IDs nunca representam o mesmo atleta.

Esta é uma base parcial, não um inventário de todo jogador da história ou de todos os elencos atuais. Clubes das categorias pertencem às primeiras divisões representadas pela coleta de 2026/27 (Brasil: 2026). O universo histórico considera passagens profissionais verificáveis em clubes tradicionais dessas ligas; não reconstrói a divisão de cada clube em cada ano. Champions no menu significa as cinco ligas combinadas e não exige participação na competição da UEFA. As restrições de fotos e clubes do Quem Sou Eu não se aplicam a esta base histórica independente.

## Critérios e fontes

Perfis históricos foram descobertos em categorias de clubes e identidades Wikidata, mas **estar numa categoria não confirma uma resposta**. A entrada exige ficha profissional com clube e ao menos uma atuação. Base, reservas/B/II e empréstimos sem atuação são excluídos. Nomes de clubes e suas formas extensas são normalizados para evitar rejeitar a mesma passagem por uma diferença de escrita.

A extração estruturada das biografias Wikipedia filtra os fatos e registra fontes por atleta/categoria em `jogo-da-velha-fontes.json`; não é revisão manual integral de milhares de fichas. A nacionalidade vem da informação explícita do perfil, da cidadania Wikidata ou da base ESPN previamente conferida por identidade/nascimento. Não é inferida de aparência, nome, clube ou local de nascimento. Isso não constitui uma lista exclusiva de seleções nacionais defendidas. A posição usa o perfil profissional; quando a fonte informa somente um grupo amplo, não se inventa uma posição mais específica.

Passagens profissionais incluem a coleta de outubro de 2026. Títulos e prêmios usam somente edições encerradas até **2025**. Listas explícitas de conquistas são filtradas para excluir vice, terceiros, indicações e colocações. Honrarias de treinador são separadas das de jogador. Ausência na base significa ausência de comprovação incorporada, não uma conclusão de que o atleta jamais conquistou algo. Lacunas continuam possíveis e são uma limitação declarada da curadoria.

Copa do Mundo considera o elenco campeão, inclusive reservas. Bola de Ouro significa o Ballon d’Or da France Football/fase FIFA, não o melhor jogador de uma Copa, Bola de Prata ou prêmios retrospectivos. Artilharia significa liderar os gols de uma edição, inclusive empate. “Jogou com” exige atuação juntos em uma partida da equipe principal ou seleção principal; não é deduzido apenas de contratos ou convocações sobrepostos. A cobertura dessa categoria permanece menor, com comprovações para Messi, Cristiano Ronaldo, Neymar, Ronaldo, Ronaldinho e Romário.

Conferências adicionais e exemplos de fontes primárias:

- [Real Madrid: Dumfries, carreira e partidas em 2026](https://www.realmadrid.com/en-US/football/first-team/players/denzel-dumfries).
- [Fortaleza: passagem de Wellington Paulista](https://fortaleza1918.com.br/comunicado-oficial-wellington-paulista/).
- [Vasco: Juninho Pernambucano na final do Brasileiro de 1997](https://vasco.com.br/futebol/tricampeonato-brasileiro-do-vasco-completa-18-anos/).
- [FIFA: Brasil de 2002](https://inside.fifa.com/es/news/el-brasil-de-2002-en-cifras-2925832), [DFB: final e atuações](https://datencenter.dfb.de/datencenter/weltmeisterschaft/2002-in-japan-suedkorea/finale/deutschland-brasilien-137420).
- [FFF: final de 2022](https://www.fff.fr/article/9089-argentine-france-les-compositions.html), [FIFA: relatório da final](https://fdp.fifa.org/assetspublic/ce44/r2864/pdf/FullTimeMatchReport-English.pdf).
- [FPF: Portugal–Irlanda 2024](https://www.fpf.pt/pt/selecoes/futebol-masculino/selecao-a/jogos/ficha-de-jogo/match/2103363), [PSG: Bayern–PSG 2023](https://en.psg.fr/teams/first-team/content/paris-knocked-out-in-the-last-16-match-report-paris-saint-germain-fc-bayern-munich-psg-ucl-22-23).
- [CBF: artilharia de 2024](https://www.cbf.com.br/futebol-brasileiro/noticias/detalhes/competicoes-campeonato-brasileiro-serie-a/alerrandro-e-yuri-alberto-ganham-o-trofeu-roberto-dinamite), [Atlético: Paulinho em 2023](https://atletico.com.br/pelo-galo-paulinho-lidera-ranking-no-futebol-brasileiro/).

`fontes-jogo-da-velha.html` permite buscar os nomes e consultar comprovações. O endereço antigo de créditos redireciona para essa consulta sem imagens. Arquivos fotográficos antigos não integram este jogo; outros jogos mantêm seus próprios critérios e créditos.

## Regras e equilíbrio

Bot e duas pessoas no mesmo aparelho são jogáveis. Cada modo/dificuldade tem 80 grades. Normal exige pelo menos três nomes por casa; difícil exige pelo menos dois e ao menos uma casa com exatamente dois. Todas as grades permitem nove nomes distintos. Os mínimos usam a mesma base do autocomplete e da validação. Critérios só entram no sorteio se cumprem essas condições; nunca são inventadas respostas para aumentar cobertura.

Pode-se escolher 1, 2, 3 ou 5 rodadas, ou primeiro a 1, 2, 3 ou 5 vitórias. Empates contam como rodada no total fixo, sem pontuar. Quem inicia alterna e as seis posições dos critérios mudam na rodada seguinte; o motor prefere seis categorias novas quando possível.

Roubo opcional: dois por pessoa/rodada, com outro nome ainda não usado. O nome da casa roubada continua consumido. Não se troca uma casa própria. Grade cheia sem vencedor ou 40 ações é empate. Erro e passar transferem o turno; seleção inválida não altera a partida. A força do bot é independente da grade: Tranquilo (180 nomes, 28% de hesitação, 45% de decisão tática), Equilibrado (420 nomes, 15%, 72%) e Desafiador (900 nomes, 5%, 92%). A lembrança de cada nome é fixa por rodada e varia com o perfil (70%, 85%, 95%). Sem resposta lembrada, passa. Prioriza até cinco nomes mais familiares por casa e pode deixar de bloquear ou finalizar uma linha. Familiaridade é um parâmetro editorial, baseado em atuações documentadas, seleções, conquistas e identidades revisadas, não uma medição objetiva de fama. Nenhum perfil conhece automaticamente toda a base.

Partidas locais são salvas no navegador e podem ser retomadas. Sair/reiniciar cancela a ação pendente do bot. Sem anúncios ou esperas falsas.

## Online preparado, aguardando serviço

GitHub Pages hospeda arquivos estáticos. Salas entre aparelhos e pareamento exigem um serviço compartilhado; a integração Supabase está preparada, sem projeto conectado. Bot e partida local funcionam sem ele. Não foi validada contra um serviço real.

Para ativar posteriormente:

1. Criar um projeto Supabase e habilitar Anonymous Sign-Ins em Authentication.
2. Executar `online/velha-schema.sql` e depois `online/velha-catalogo.sql` no SQL Editor.
3. Preencher URL do projeto e chave **pública/publishable ou anon** em `velha-online-config.js`; nunca usar secret/service_role.
4. Publicar e testar dois aparelhos: código, fila, turnos, erro, roubo, rodadas, placar, saída, expiração e acesso indevido por terceira identidade.

Referências: [autenticação anônima](https://supabase.com/docs/guides/auth/auth-anonymous), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security). O servidor preparado valida catálogo, turno, posse, limite de roubos e placar; usa identidade JWT, bloqueio de linha e versão. Catálogo privado e acesso direto revogado. Pareamento público usa Europa, normal, sem roubo e primeiro a três. Não são criados adversários ou salas fictícias.

## Validação e manutenção

`node tests/velha.test.cjs` verifica interseções, nove respostas distintas, oito linhas de vitória, turnos, erros, roubos/limites/reutilização, empates, rodízio de critérios, séries e partidas do bot. Também verifica fatos críticos, identidades únicas, metadados dos homônimos e cálculos de idade/aniversário/morte. Verificação de sintaxe e apresentação em computador/celular completam a publicação.

Ampliações exigem dados comprováveis e regeneração das grades; o catálogo não se atualiza sozinho. `scripts/gerar-velha-online.cjs` gera o catálogo do servidor a partir da base publicada. Versões em dados e URLs de assets invalidam saves/caches antigos. Não há exigência de coletar fotos ou licenças de imagens para incluir atletas neste jogo.

## Ampliação brasileira v7

456 identidades adicionais ficaram disponíveis no universo brasileiro após incorporar passagens profissionais em todos os clubes brasileiros já representados no catálogo, além do subconjunto anterior. Clube e ao menos uma atuação continuam obrigatórios; nenhum título ou companheiro foi deduzido para aumentar cobertura. As biografias de origem e comprovações estão na consulta de fontes. A elegibilidade histórica considera passagens pelos clubes representados, não reconstrói a divisão de cada ano nem garante que cada atuação individual foi no Brasileirão. Grades brasileiras foram recalculadas, preservando os mínimos de três/dois e nove nomes distintos. Grades europeias foram preservadas.

### Empate por acordo
Nos modos bot e duas pessoas, cada lado pode propor empate uma vez por rodada durante sua vez. A resposta não consome jogada. Aceitar encerra a rodada sem ponto; recusar mantém a vez do proponente. Rodadas fixas contam o empate; séries por vitórias seguem até a meta. O bot aceita quando não lembra resposta e pode aceitar após seis jogadas conforme a força escolhida. A integração online ainda não oferece esse acordo.


Após aceitar, a próxima rodada começa automaticamente, se a série ainda não terminou; quem aceitou inicia. A recusa mostra confirmação e mantém a vez do proponente.
