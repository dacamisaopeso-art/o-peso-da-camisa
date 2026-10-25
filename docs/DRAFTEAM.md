# DrafTeam — arquitetura, cobertura e entrega

## Checkpoint de origem

Antes deste jogo: `d257a10c0365e59874d8da48938c5a76315545ed` (OPC Jogos Oficial 0.4.0). Os oito jogos, suas bases e seus motores ficam preservados. Para desfazer, reverta somente os commits DrafTeam; não restaure o checkout inteiro por cima de trabalho posterior.

## Auditoria do projeto

O site é estático no GitHub Pages. Jogos usam motores JavaScript independentes; a Forja tem fontes React/TypeScript e uma distribuição compilada. `velha-dados.js` reúne 25.742 atletas, categorias positivas e referências; Carreira e Escalação possuem projeções específicas. Forja tem atributos de simulação, que não são estatísticas históricas para este jogo. Reutilizados: busca exata/sobrenomes/apelidos, favoritos, acessibilidade, ajuda, tutorial, backup e layout do catálogo. O APK é uma WebView com arquivos empacotados: publicar o site não atualiza o APK instalado.

## Adaptador de dados

`scripts/gerar-drafteam.cjs` gera `drafteam-dados.js` e o catálogo de servidor a partir da base existente. Não há coleta independente nem alteração dos fatos usados pelos outros jogos. Seleção inicial: fama OPC >= 35, identidade única e pelo menos uma cidadania registrada. Resultado inicial: 2.708 atletas e 53 cartas de contratação. Clubes e conquistas exigem evidência positiva com URL na base de origem. Cada carta tem pelo menos 15 respostas no catálogo original e, em tempo de execução, pelo menos três ainda disponíveis; faltando respostas, o motor recorre a uma contratação livre válida.

A base é uma cobertura editorial, não um censo de toda a carreira. Nacionalidade significa cidadania registrada, não seleção defendida, e cidadanias históricas podem aparecer. Critérios regionais contam uma passagem **registrada**, no conjunto explícito de clubes do gerador, uma vez por atleta. Ausência de passagem comprovada não é afirmada como ausência histórica. As fontes do atleta ficam acessíveis nas sugestões.

## Objetivos suportados

Mais brasileiros, argentinos, europeus, sul-americanos, cidadanias diferentes e atletas com passagens registradas por clubes de Rio de Janeiro, São Paulo, Sul, Nordeste e Sudeste. Os dez objetivos possuem definições finitas dentro da cobertura. Diversidade conta a união das cidadanias; demais critérios contam um ponto por atleta elegível, sem repetir por clube.

**Indisponíveis:** contagem total de títulos ou de títulos por competição, gols e partidas de carreira, estaduais, Sul-Americana, rebaixamentos, finais perdidas, atuação após 35 anos e exclusividade de um clube. A base não comprova cobertura completa desses campos. Categorias positivas como campeão da Libertadores podem gerar uma carta de contratação, mas nunca são tratadas como quantidade de troféus. Valores ausentes não viram zero.

## Motor e regras

`drafteam-core.js` é compartilhado pelos modos offline e pelo servidor. PRNG determinístico, cinco possibilidades, embaralhamento com identidade preservada, votação com desempate por sorteio, duas formações diferentes por participante, ordem serpentina e exclusividade global. Rápido: cinco contratações e três cartas; Clássico: onze e cinco; Insano: vinte turnos mistos e regularização. Sempre um goleiro na formação, mas improvisações são permitidas sem penalidade. Primeira fase e regularização bloqueiam substituições. Regularização é só contratação e garante elencos completos.

Efeitos implementados: troca forçada, vermelho, demissão, imunidade, revolução tática, escolha entre três nomes, mercado aberto, goleiro no ataque, defensor no ataque, atacante na defesa e coringa. Cartas impossíveis são convertidas em contratações válidas. A formação sem defensores não recebe a carta de atacante na defesa. Imunidade individual absorve uma tentativa; a vítima recebe proteção coletiva até seu próximo turno. A troca transfere atletas e encerra proteções das vagas trocadas.

Os exemplos de mercado dois por um, bloqueio de contratação, dupla contratação e segunda chance não fazem parte deste baralho inicial. Foram mantidos fora para não introduzir excedentes e contratos ambíguos. O baralho é expansível. O coringa tem chance de 2,5% por compra, contratação livre e uma pista verdadeira compatível com pelo menos duas possibilidades ou uma pista mais genérica. Não permite ultrapassar o elenco.

Bots com quatro níveis usam as cinco possibilidades, disponibilidade e heurísticas. Não leem o objetivo selecionado, a ordem escondida nem os desempates. Os quatro níveis mudam a amplitude da busca de candidatos; não mudam sorteios ou pontuação. As medalhas usam mil elencos de referência determinísticos por tamanho/objetivo, com patamares próprios. A avaliação secundária mostra contratações confirmadas, sem alterar o vencedor. Empate no objetivo usa os dois critérios sorteados previamente; persistindo, há vencedores compartilhados.

Solo e diário salvam replay de ações, não uma pontuação arbitrária. Retomada reconstrói a partida pelo motor e rejeita replay inválido ou de outra versão da base. No diário, data de Brasília, formato Rápido sem bots e sem relógio. Os recordes são locais, sem ranking global fictício. Como qualquer jogo totalmente offline, o estado local é inspecionável; sigilo contra inspeção técnica é garantido apenas no modo de servidor.

## Interface

Página própria, arte SVG original sem fotografias, paleta OPC preto/dourado e cores por carta, campo com vagas e abas de adversários, busca compartilhada, detalhes e fontes, cartas virando/embaralhando, histórico público, resultado por atleta, compartilhamento de texto e PNG. Movimento reduzido respeita o aparelho e as preferências OPC. Botões são acionáveis por toque e teclado. Nos modos solo, o relógio pausa com a aba oculta; online, relógio de servidor e jogada automática ao expirar.

## Online

O Supabase existente é reutilizado para autenticação anônima. A Edge Function `drafteam` executa o mesmo motor; `online/drafteam-service.cjs` gerencia salas de dois a cinco, nomes, prontidão, votos privados, formação, ações, reconexão e revanche. A função valida a identidade com a API de autenticação; nunca usa UID enviado pelo navegador. Código da sala de oito caracteres, limite de três criações por anfitrião por hora e expiração lógica após 24h sem atividade. O cliente não recebe seed, PRNG, ordem do baralho, votos individuais, objetivo ou desempates antes do resultado. A pista do coringa só aparece para quem o comprou.

`online/drafteam-schema.sql` cria apenas duas tabelas isoladas e uma função de armazenamento, com RLS e sem permissão para `anon` ou `authenticated`. Somente `service_role`, usado no servidor, executa o armazenamento. Atualização otimista por versão impede aplicar duas ações sobre o mesmo estado. A chave privada permanece nas variáveis injetadas pelo Supabase; nenhum segredo é colocado no site/APK. Não alterar as tabelas ou RPCs de Velha/FutDraw.

Para preparar a função, executar `node scripts/empacotar-drafteam-online.cjs`: gera `outputs/drafteam-online/index.ts`. Aplicar o esquema e importar `online/drafteam-catalogo.sql`; implantar o bundle no editor de Edge Functions como `drafteam`. A verificação JWT legada pode permanecer ligada se aceitar os JWTs de usuário do projeto; a função também verifica a sessão com `/auth/v1/user`. Não desligar mecanismos de segurança sem antes verificar compatibilidade e obter a autorização pertinente. Não é preciso criar/copiar chaves privadas: o Supabase injeta as variáveis de servidor.

Somente após os testes reais, habilitar `drafteam-online-config.js` e os rótulos multiplayer do catálogo. Até lá, a interface informa explicitamente a pendência e não simula salas. Após cinco minutos sem presença, o servidor assume o time com o mesmo bot; o retorno fora do prazo é recusado. O servidor avança cartas por timeout mediante consultas ativas, sem exigir serviço agendado. Salas totalmente abandonadas não precisam continuar executando; tornam-se inacessíveis após a expiração. Não há pareamento público nesta proposta, apenas código/convite.

## Android

Fontes ajustadas para 0.5.0, versionCode 5. Identidade oficial preservada: `br.com.opesodacamisa.jogos.oficial`, OPC Jogos Oficial e certificado permanente já existente. O novo catálogo possui nove jogos; os antigos não são removidos. Backup passa a incluir replay e recordes DrafTeam, excluindo sessão/recibo online. O gerador copia os assets locais. É necessário compilar, testar, assinar com a chave privada existente e publicar o novo APK antes de atualizar o link de download: não declarar a versão instalada atualizada só por mudar o site.

## Validação e pendências da publicação

Suítes: `tests/drafteam.test.cjs` (105 partidas completas, 1–5 times e três formatos); `tests/drafteam-online.test.cjs` (2–5 participantes, limite, sigilo, versão e timeout); `tests/drafteam-db.integration.cjs` (PostgreSQL real em PGlite, privilégios, idempotência e CAS). A execução mais recente e a publicação devem ser registradas no checkpoint de entrega, com verificação pública e APK efetivamente entregue. Não confundir testes com armazenamento em memória com multiplayer implantado.

## Ativação de produção — 25/10/2026

A função `drafteam` e as tabelas privadas foram implantadas no projeto existente. O limite do editor SQL exigiu importação por lotes em `staging`, com troca atômica para `data` somente após validar 2.708 atletas. A função mantém a verificação JWT legada ligada e também valida a sessão pela API de autenticação. A partida QA `5E42602A` usou cinco identidades anônimas de teste, chegou ao resultado, aceitou revanche por unanimidade e registrou a saída de todos. Não foram acessadas salas reais de usuários. Configuração online habilitada somente após esses testes.

Antes da publicação, foram preservados os commits editoriais `c13a9bc` e `feb7d1c`; o pai da entrega passa a ser `feb7d1c542d6b888504388f2e5699a6db351c17c`. O checkpoint inicial 0.4.0 continua válido como referência da versão do app, não como ordem para apagar publicações posteriores.

## Verificação de entrega — 25/10/2026

Código publicado a partir de `83086e2`, com geração reproduzível corrigida em `6faa322` e concorrência corrigida em `e8a2fbb`. A revisão pública de uma jogada acompanha fase/turno; consultas de presença não a invalidam. O armazenamento continua usando CAS e repete apenas conflitos anteriores à gravação, com limite de oito tentativas; uma jogada de turno encerrado continua recusada. Testes incluem confirmações simultâneas dos cinco membros.

Passaram 31 suítes locais de jogos, 105 drafts completos, testes do serviço/Edge/PostgreSQL e os 11 testes no emulador Android 15 (execução `40228397538`, zero falhas). O teste Android completa e restaura um draft, mede a largura durante as jogadas e abre os nove jogos sem rede. A sala pública QA `FCF02CF8` confirmou criação, entrada, prontidão, votação, formação e contratação sincronizada em duas abas; ambas as identidades saíram. A sala QA `B1CBAB44` completou 56 ações com cinco identidades reais, resultado e revanche unânime após a correção; todos saíram.

O APK 0.5.0 foi assinado localmente com o certificado permanente; SHA-256 `76153dd1bea1ac182c5648a2ee16a54cbfdf0100f0920942d2b62a8fa55034af`. A distribuição automática usa somente o APK público assinado em `_releases/android`, nunca a chave privada. O arquivo público é transportado em treze partes binárias; o fluxo recompõe o APK e verifica a soma completa antes de qualquer instalação. Nenhuma parte é oferecida como instalador. O fluxo de publicação instala sobre 0.4.0 em emulador, confirma certificado/pacote/favorito/instalação única e somente então cria a versão pública. O download e o manifesto do site só devem anunciar 0.5.0 após esse fluxo passar.

A execução `40229226811` passou: atualização assinada de 0.4.0 para 0.5.0, mesmo certificado e pacote, favorito preservado e uma única instalação. A versão `android-v0.5.0` foi publicada sem pré-lançamento, com APK de 13.193.774 bytes e a soma indicada acima, confirmada também pelo digest do asset no GitHub. O manifesto e a página de download passam a anunciar 0.5.0 somente após essa confirmação.
