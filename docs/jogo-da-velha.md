# Jogo da Velha Futebol — OPC

Jogo original em `jogo-da-velha.html`, com a identidade preta e dourada OPC. O cruzamento de dois critérios determina se um nome ocupa uma casa; três casas em linha, coluna ou diagonal vencem. Não usa fotografias, retratos ou imagens de atletas. As camisas e ícones são desenhos SVG originais. Peso usa uma camisa dourada com escudo simbólico; Tradição, uma camisa marfim com estrela. Ambos têm texto, forma e cor para identificar a posse.

## Cobertura da publicação

Revisão em 11/10/2026: **25.742 jogadores** atuais/históricos e **1.120 grades**, sem exigir disponibilidade de foto. Os universos se sobrepõem:

- Champions · cinco ligas: 20.439 jogadores.
- Premier League: 6.034 jogadores.
- LaLiga: 6.064 jogadores.
- Serie A italiana: 5.890 jogadores.
- Bundesliga: 3.170 jogadores.
- Ligue 1: 3.583 jogadores.
- Brasileirão Série A: 6.278 jogadores.

Há 955 grupos de nomes repetidos. Neles, busca, seleção e casa preenchida mostram idade e posição. **† indica a idade ao falecer**, calculada entre nascimento e morte, nunca a idade que o atleta teria hoje. Para vivos, a idade se atualiza pelo aniversário. Se nome, idade e posição ainda coincidirem, a busca e a casa mostram a data de nascimento completa. Homônimos sem datas/posição verificáveis ficam fora da base selecionável. Apelidos conhecidos são preservados; exemplos: Wellington Paulista, Juninho Pernambucano e Juninho Paulista. Dois IDs nunca representam o mesmo atleta.

Esta é uma base parcial, não um inventário de todo jogador da história ou de todos os elencos atuais. Clubes das categorias pertencem às primeiras divisões representadas pela coleta de 2026/27 (Brasil: 2026). O universo histórico considera passagens profissionais verificáveis em clubes tradicionais dessas ligas; não reconstrói a divisão de cada clube em cada ano. Champions no menu significa as cinco ligas combinadas e não exige participação na competição da UEFA. As restrições de fotos e clubes do Quem Sou Eu não se aplicam a esta base histórica independente.

## Critérios e fontes

Perfis históricos foram descobertos em categorias de clubes e identidades Wikidata, mas **estar numa categoria não confirma uma resposta**. A entrada exige ficha profissional com clube e ao menos uma atuação. Base, reservas/B/II e empréstimos sem atuação são excluídos. Nomes de clubes e suas formas extensas são normalizados para evitar rejeitar a mesma passagem por uma diferença de escrita.

A extração estruturada das biografias Wikipedia filtra os fatos e registra fontes por atleta/categoria em `jogo-da-velha-fontes.json.gz` (JSON completo compactado; o arquivo `.json` descreve o conteúdo e sua integridade); não é revisão manual integral de milhares de fichas. A nacionalidade vem da informação explícita do perfil, da cidadania Wikidata ou da base ESPN previamente conferida por identidade/nascimento. Não é inferida de aparência, nome, clube ou local de nascimento. Isso não constitui uma lista exclusiva de seleções nacionais defendidas. A posição usa o perfil profissional; quando a fonte informa somente um grupo amplo, não se inventa uma posição mais específica.

O recorte começa em **1960**: exige carreira profissional documentada nesse ano ou depois. Lendas que começaram antes e continuaram depois, como Pelé e Garrincha, são preservadas. Para esses atletas, passagens anteriores a 1960 continuam sendo fatos válidos de carreira. A lista é ordenada pela passagem profissional mais recente documentada, descendo para as antigas; um ano sem fim indicado não é tratado automaticamente como carreira atual. Títulos e prêmios usam somente edições encerradas até **2025**. Listas explícitas de conquistas são filtradas para excluir vice, terceiros, indicações e colocações. Honrarias de treinador são separadas das de jogador. Ausência na base significa ausência de comprovação incorporada, não uma conclusão de que o atleta jamais conquistou algo. Lacunas continuam possíveis e são uma limitação declarada da curadoria.

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

## Online conectado — 11/10/2026

GitHub Pages hospeda arquivos estáticos. Salas entre aparelhos e pareamento exigem um serviço compartilhado; o projeto Supabase foi conectado. Bot e partida local também continuam disponíveis. Salas por código e pareamento público usam identificação anônima e validação no servidor.

Para reinstalar em outro projeto:

1. Criar um projeto Supabase e habilitar Anonymous Sign-Ins em Authentication.
2. Regenerar o catálogo com `node scripts/gerar-velha-online.cjs`. Executar `online/velha-schema.sql` e depois `online/velha-catalogo.sql` no SQL Editor.
3. Preencher URL do projeto e chave **pública/publishable ou anon** em `velha-online-config.js`; nunca usar secret/service_role.
4. Publicar e testar dois aparelhos: código, fila, turnos, erro, roubo, rodadas, placar, saída, expiração e acesso indevido por terceira identidade.

Referências: [autenticação anônima](https://supabase.com/docs/guides/auth/auth-anonymous), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security). O servidor preparado valida catálogo, turno, posse, limite de roubos e placar; usa identidade JWT, bloqueio de linha e versão. Catálogo privado e acesso direto revogado. Pareamento público usa Europa, normal, sem roubo e primeiro a três. Não são criados adversários ou salas fictícias.

## Validação e manutenção

`node tests/velha.test.cjs` verifica interseções, nove respostas distintas, oito linhas de vitória, turnos, erros, roubos/limites/reutilização, empates, rodízio de critérios, séries e partidas do bot. Também verifica fatos críticos, identidades únicas, metadados dos homônimos e cálculos de idade/aniversário/morte. Verificação de sintaxe e apresentação em computador/celular completam a publicação.

Ampliações exigem dados comprováveis e regeneração das grades; o catálogo não se atualiza sozinho. `scripts/gerar-velha-online.cjs` gera o catálogo do servidor a partir da base publicada. Versões em dados e URLs de assets invalidam saves/caches antigos. Não há exigência de coletar fotos ou licenças de imagens para incluir atletas neste jogo.

## Ampliação brasileira v7

456 identidades adicionais ficaram disponíveis no universo brasileiro após incorporar passagens profissionais em todos os clubes brasileiros já representados no catálogo, além do subconjunto anterior. Clube e ao menos uma atuação continuam obrigatórios; nenhum título ou companheiro foi deduzido para aumentar cobertura. As biografias de origem e comprovações estão na consulta de fontes. A elegibilidade histórica considera passagens pelos clubes representados, não reconstrói a divisão de cada ano nem garante que cada atuação individual foi no Brasileirão. Grades brasileiras foram recalculadas, preservando os mínimos de três/dois e nove nomes distintos. Na versão v7, as grades europeias foram preservadas; na revisão v8 abaixo, todas foram recalculadas.

### Empate por acordo
Nos modos bot e duas pessoas, cada lado pode propor empate novamente após uma recusa, durante sua vez e sem outra proposta pendente. A resposta não consome jogada. Aceitar encerra a rodada sem ponto; recusar mantém a vez do proponente. Rodadas fixas contam o empate; séries por vitórias seguem até a meta. O bot aceita quando não lembra resposta e pode aceitar após seis jogadas conforme a força escolhida. O online também permite novas propostas após recusa, aceitação pelo adversário e início da próxima rodada por quem aceitou.


Após aceitar, a próxima rodada começa automaticamente, se a série ainda não terminou; quem aceitou inicia. A recusa mostra confirmação e mantém a vez do proponente.


## Revisão das seis ligas v8 — recorte de 1960

As categorias específicas de participantes de cada liga complementam as biografias e o catálogo anterior. Foi incorporado o [banco público football-datasets](https://github.com/salimt/football-datasets), com 92.671 perfis e registros individuais de atuações. Somente competições de primeira divisão (BRA1, GB1, ES1, IT1, L1 e FR1), temporada de 1960 em diante e quantidade positiva de entradas em campo habilitam a participação por esse banco. Presença no banco de reservas ou transferência não basta. A elegibilidade anterior por passagem profissional nos clubes representados continua declarada; não é comprovação automática de disputa de Série A em toda temporada.

O banco complementar é uma fotografia de 2025, não uma atualização integral dos elencos de 2026. Biografias foram consultadas em outubro de 2026. A cobertura mais antiga depende das biografias disponíveis; não se afirma cobertura completa de 1960 até hoje. Nacionalidade, nascimento e posição precisam estar informados. Identificadores Transfermarkt/Wikidata de atleta (P2446) e clube (P7223) evitam cruzar homônimos. Conflitos de nascimento e identidades ambíguas não são importados. Clubes sem cruzamento seguro mantêm identificador próprio, sem fusão por nome parecido. Base, reservas e seleções não viram categorias de clube.

Nenhuma foto, contato pessoal ou informação de empresário foi incorporada. Novas atuações não geram títulos ou categorias de companheiros por dedução. Títulos e partidas simultâneas continuam exigindo suas próprias comprovações. Todas as 1.120 grades foram recalculadas com os mesmos mínimos e nove respostas distintas. Os repertórios de 180/420/900 nomes do bot permanecem limitados; a ampliação não lhe dá conhecimento de toda a base. O relatório `jogo-da-velha-ampliacao.json` registra diferenças em relação à versão publicada anterior.

`tests/velha-ligas.test.cjs` verifica crescimento por liga, recorte de carreira, preservação das lendas brasileiras, identidades das categorias de companheiros, metadados e consistência do relatório. Os testes anteriores de grades, partidas, bot e acordo de empate também se aplicam.




## Curadoria do modo Champions — 11/10/2026

As 160 grades combinadas foram refeitas com uma seleção editorial de 39 clubes conhecidos ou de destaque recente. Le Havre e clubes menos familiares não aparecem como categorias neste modo. Normal exige cinco respostas e duas com botFame >= 40 em cada casa; difícil mantém mínimo de duas, uma casa com exatamente duas e ao menos um nome com botFame >= 30 por casa. Esse índice é uma aproximação editorial de reconhecimento, não uma medida objetiva de fama. Todas permitem nove nomes distintos. A base de jogadores, os fatos históricos e as grades das ligas individuais e do Brasil foram preservados.

Aston Villa e Bologna chegaram à Champions em 2024/25 ([UEFA](https://www.uefa.com/uefachampionsleague/news/0292-1c1785ea604f-8387507d2eed-1000--aston-villa-vs-bologna-facts/)); a seleção também contempla clubes de destaque europeu recente como Atalanta, Leverkusen e Frankfurt. A lista editorial está em `velha-champions.js`, carregado após o catálogo principal. Ao configurar o backend, regenere `online/velha-catalogo.sql` com `node scripts/gerar-velha-online.cjs` para usar as mesmas grades.


A integração foi testada em um serviço real com três identificações anônimas: código, fila, turnos, empate repetido e aceito, mudança de grade, roubo, versão obsoleta, 40 ações, saída e bloqueio de terceiros. Tabelas não permitem leitura direta pelos jogadores. A sessão e o código ficam no sessionStorage da aba: após recarregar, use Retomar sala online. Fechar a aba pode perder a identificação; não é recuperação entre aparelhos. As salas em espera expiram em 15 minutos; registros são removidos após 24 horas quando o serviço recebe outra solicitação. Atualização entre jogadores por consulta a cada 1,8 segundo; queda temporária tenta reconectar. Fila pública aguarda outra pessoa real, sem bot disfarçado. O plano e as cotas do Supabase limitam a disponibilidade; não foi feito teste de carga massivo.


## Auditoria factual de 14/10/2026

A base de 25.742 identidades recebeu uma nova revisão de títulos, companheiros e grafias de clubes. [Método, exemplos corrigidos e limitações](jogo-da-velha-auditoria-2026-10-14.md). As fontes completas e compactas foram recalculadas em conjunto. O corte de conquistas segue até 2025.
