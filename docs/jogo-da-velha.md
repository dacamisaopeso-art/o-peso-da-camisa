# Jogo da Velha Futebol — OPC

Jogo original estático em `jogo-da-velha.html`. Usa o cruzamento de duas categorias para ocupar uma casa, com vitória em linha, coluna ou diagonal. Não copia código, imagens, layout ou marcas do jogo de referência. Camisas, troféus, bola e chuteira são ilustrações simbólicas originais; fotos reais possuem créditos próprios.

## Publicação jogável

- Contra o bot e duas pessoas no mesmo aparelho.
- Premier League, LaLiga, Serie A italiana, Bundesliga, Ligue 1, Brasileirão e Europa combinada, chamada Champions no menu. Esse nome representa o universo das cinco ligas; não comprova participação na Champions.
- 225 jogadores atuais/históricos com foto reutilizável. Europa: 200; Brasil: 63. Há atletas nos dois universos. Pools individuais: Inglaterra 81, Espanha 61, Itália 65, Alemanha 46, França 52.
- 1.120 grades pré-validadas: 80 por modo/dificuldade. Normal exige pelo menos 3 respostas por casa; difícil exige pelo menos 2 e uma casa com exatamente 2.
- Todas as grades têm uma atribuição possível de nove nomes diferentes às nove casas. A base usada para avaliar os mínimos é a mesma do autocomplete e da validação.
- Total fixo de 1, 2, 3 ou 5 rodadas, ou primeiro a 1, 2, 3 ou 5 vitórias. No total fixo, empates contam como rodada; no primeiro a vitórias, não contam como ponto. O placar final compara os pontos de toda a série.
- Roubo opcional: até duas casas adversárias por pessoa/rodada, com nomes novos. O nome de uma casa roubada continua consumido. Não se substitui uma casa própria. Uma grade cheia sem vencedor ou 40 ações é empate.
- Erro e passar vez transferem o turno. Seleção inválida de nome/casa não altera o estado. Autocomplete com teclado e acentos, fotos nas casas corretas, dono indicado por símbolo e cor, respostas/fontes disponíveis ao fim da rodada.
- A cada rodada alterna quem começa e mudam as seis posições dos critérios. O motor prefere seis categorias diferentes da grade anterior quando possível. Pode reaparecer categoria em outra posição.
- Bot usa respostas válidas e prioriza vencer, bloquear, centro e roubos. Conhece a base; não simula desconhecimento humano. A dificuldade altera os cruzamentos, não o conhecimento do bot.
- Partida local salva no navegador; pode ser retomada. Reinício/saída cancela a ação pendente do bot. Sem anúncios, analytics ou chamadas de serviço durante partidas locais.

## Curadoria e limitações

Snapshot 10/10/2026. Elencos atuais e identificadores vieram da base ESPN já auditada do Quem Sou Eu; identidades foram cruzadas pelo Wikidata e nascimento. A nova base combina atletas dessa coleta com lendas e perfis históricos. **Passagens por clubes e títulos/prêmios estão limitados aos fatos conferidos até 2025**, explicitamente indicado na configuração e nas categorias. Novas transferências/títulos de 2026 exigem revisão própria antes de inclusão. Isso evita usar notícias de contratação ou temporadas recentes ainda sem conferência suficiente como histórico confirmado.

Para clube, foi consultada a ficha profissional do atleta, com pelo menos uma atuação; times de base/reserva e empréstimos sem atuação não entram. Clubes que aparecem nas categorias pertencem às primeiras divisões representadas na coleta (temporadas europeias 2026/27 e Brasil 2026). Não são sorteados clubes de outros países ou divisões naquele modo. Elegibilidade histórica de liga usa passagens profissionais conferidas em clubes tradicionais daquela primeira divisão; a lista é conservadora, não um catálogo completo de todos os clubes promovidos/rebaixados e temporadas. A nacionalidade segue cidadania da fonte, não necessariamente a seleção defendida. Os grupos de posição herdam a curadoria detalhada do Quem Sou Eu, quando disponível.

Títulos foram conferidos em listas de honrarias dos perfis, com distinção entre campeão, vice, terceiro, indicação e vencedor de prêmio. Temporadas encerradas após 2025 não foram usadas. Bola de Ouro e Copa do Mundo receberam revisão explícita de vencedores; premiações adicionais/retrospectivas de Romário não são tratadas como Ballon d’Or oficial. O título da Copa do Mundo considera membro do elenco campeão, inclusive reserva, e não exige presença na final. “Jogou com” tem critério diferente: atuação simultânea comprovada em partida da equipe principal. Não é inferido apenas de anos de contrato ou convocação.

Categorias de companheiros incluídas: Messi, Cristiano Ronaldo, Neymar, Ronaldo, Ronaldinho e Romário. Cobertura parcial: não se presume que os nomes não listados jamais tenham jogado juntos. Artilharia significa gols de uma edição, incluindo empate na liderança. As categorias só entram na grade se há respostas suficientes no pool; por isso exemplos como Remo/Chapecoense ou algumas nacionalidades podem não aparecer nesta primeira base. Não se inventam respostas para alcançar o mínimo.

Evidências estão em `jogo-da-velha-fontes.json`, com atleta, categoria, fonte, método e temporadas quando disponíveis. Perfis Wikipedia fornecem fichas históricas e referências; ESPN fornece a coleta factual atual; conferências adicionais usam publicadores oficiais:

- [FIFA: Brasil de 2002](https://inside.fifa.com/es/news/el-brasil-de-2002-en-cifras-2925832), [DFB: final 2002 e atuações](https://datencenter.dfb.de/datencenter/weltmeisterschaft/2002-in-japan-suedkorea/finale/deutschland-brasilien-137420).
- [FFF: escalação da final de 2022](https://www.fff.fr/article/9089-argentine-france-les-compositions.html), [relatório FIFA](https://fdp.fifa.org/assetspublic/ce44/r2864/pdf/FullTimeMatchReport-English.pdf).
- [FPF: Portugal–Irlanda 2024](https://www.fpf.pt/pt/selecoes/futebol-masculino/selecao-a/jogos/ficha-de-jogo/match/2103363).
- [PSG: Bayern–PSG 2023](https://en.psg.fr/teams/first-team/content/paris-knocked-out-in-the-last-16-match-report-paris-saint-germain-fc-bayern-munich-psg-ucl-22-23).
- [CBF: Brasil–Coreia 2022](https://www.cbf.com.br/futebol-brasileiro/jogos/amistoso/selecao-brasileira/2022/431525/coreia-do-sul-x-brasil/822681?view=escalacao), [relatório FIFA das oitavas](https://www.fifatrainingcentre.com/media/native/world-cup-2022/report_128073.pdf).
- [CBF: artilharia 2024](https://www.cbf.com.br/futebol-brasileiro/noticias/detalhes/competicoes-campeonato-brasileiro-serie-a/alerrandro-e-yuri-alberto-ganham-o-trofeu-roberto-dinamite), [Atlético: Paulinho 2023](https://atletico.com.br/pelo-galo-paulinho-lidera-ranking-no-futebol-brasileiro/), [Barcelona: Romário e artilharias](https://players.fcbarcelona.com/en/player/759-romario-romario-souza-faria), [CBF: Cano/Gabigol](https://www.cbf.com.br/futebol-brasileiro/noticias/jogadores-imortais/a/kaio-jorge-e-artilheiro-do-brasileirao-e-da-copa-do-brasil-e-repete-marca-historica).

Fotos podem ser de qualquer época e traje, conforme autorização específica do usuário para este novo jogo. Isso **não altera** a regra de clube atual e cinco anos do Quem Sou Eu. Reutilização de fotografias da base anterior preserva a licença e os créditos; novas fotografias históricas tiveram identidade conferida visualmente e licença do arquivo consultada no Commons. As imagens incorporadas são do Wikimedia Commons, incluindo fotografias originadas em Flickr e publicadores brasileiros, com CC BY/CC BY-SA/CC0/domínio público individuais. Não se afirma que todas sejam domínio público. `jogo-da-velha-fotos.json` e a página de créditos preservam autor, licença e origem; redimensionamento WebP e enquadramento são informados. Não foram importadas fotos de Getty, Transfermarkt ou clubes sem autorização.

## Online preparado, ainda não conectado

O GitHub Pages hospeda os arquivos estáticos. Salas entre aparelhos e busca pública dependem de um serviço compartilhado, que o usuário ainda não possui. A interface informa essa situação e não inicia uma espera falsa. A integração Supabase está preparada, mas **não foi ativada nem testada contra um projeto real**. O modo local e o bot não dependem dela.

Quando o usuário decidir ativar:

1. Criar um projeto Supabase e habilitar **Anonymous Sign-Ins** em Authentication. Não é necessário pedir e-mail ao jogador.
2. Executar `online/velha-schema.sql` no SQL Editor; depois `online/velha-catalogo.sql`.
3. Colocar a Project URL e a chave **pública/publishable ou anon** em `velha-online-config.js`. Nunca colocar chave secret/service_role no site.
4. Publicar esse arquivo e validar com dois navegadores/aparelhos: criar/entrar pelo código, duas pessoas na fila, turnos, erro, roubo, próxima rodada, placar final, saída, interrupção e expiração. Testar também tentativa de acesso por uma terceira identidade e jogadas com versão/turno incorretos antes de abrir ao público.

Referências oficiais: [acesso anônimo](https://supabase.com/docs/guides/auth/auth-anonymous), [proteção por RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

Servidor: catálogo privado, tabelas com RLS e acesso direto revogado. Apenas o RPC autorizado aceita ações. Identidade é obtida do JWT, não enviada como dono pelo cliente. Bloqueio de linha e versão impedem duas jogadas simultâneas; respostas, posse, limites de roubo e placar são calculados no servidor. Código de 10 caracteres; duas pessoas por sala; espera de 15 minutos e limpeza de salas antigas após 24 horas em chamadas subsequentes. Pareamento serializado e com configurações fixas: Europa, normal, sem roubo, primeiro a três. Consulta periódica substitui necessidade de publicar tabelas via Realtime. Durante atualização de catálogo, partidas de versão diferente são recusadas e precisam ser reiniciadas.

## Manutenção e validação

Não há coleta ou publicação automática desta curadoria histórica. Para ampliar, conferir identidade/foto/licença, passagem profissional, título ou partida de companheiros; registrar a evidência; atualizar jogador/categorias e gerar novas grades com os mínimos e nove respostas distintas. Bump de versão em dados e URLs de assets evita caches antigos; atualizar também o catálogo online. `scripts/gerar-velha-online.cjs` gera o catálogo SQL a partir da base publicada.

`node tests/velha.test.cjs` verifica todas as interseções e atribuições, oito linhas de vitória, turnos, erros, roubos/limites/reutilização, empates, rodízio dos seis critérios, séries e bot, incluindo partidas simuladas. Há casos factuais contra indicação à Bola de Ouro, confusão de Copa América/Confederações e Copa do Mundo/colocação, além dos exemplos Flamengo–Fluminense e Real Madrid–brasileiro. Sintaxe dos arquivos JavaScript, decodificação de todas as imagens e apresentação pública em computador/celular também são conferidas na publicação.
