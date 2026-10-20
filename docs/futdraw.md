# FutDraw — O Peso da Camisa

Jogo original de desenho de futebol em salas por convite, para 2 a 8 participantes. Universo brasileiro ou cinco ligas europeias, com quatro categorias independentes: clubes, jogadores, estádios e treinadores. Nomes históricos e recentes de reconhecimento amplo; não é um catálogo completo de elencos atuais. Não usa fotos ou escudos. As ilustrações da interface são originais.

## Como jogar

Crie a sala, marque as categorias, escolha 1, 2, 3 ou 5 rodadas e 60, 90 ou 120 segundos por desenho. Cada rodada dá uma vez a cada participante. O botão **Compartilhar link** abre o compartilhamento nativo quando disponível ou copia o convite; **Copiar link** está sempre disponível. Quem abre `futdraw.html?sala=ABC123` vê a entrada simplificada: basta informar o apelido e tocar em **Entrar na sala**, sem redigitar o código ou as regras. O visitante não entra automaticamente sem escolher seu apelido. Espere ao menos duas pessoas e inicie. Quem desenha escolhe entre três opções em até 20 segundos; sem escolha, entra a primeira. Os demais enviam palpites, com acentos, espaços e variantes cadastradas normalizados. Os acertos não exibem a resposta no chat. A resposta só é revelada ao encerrar a vez.

Acerto: `floor((500 + 500 × fração de tempo restante + max(0,150 − 25 × ordem)) × max(0,45,1 − 0,15 × dicas))`. Ordem começa em zero. Cada acerto único concede 100 pontos a quem desenha. Não há pontos fora do prazo, por tentativa repetida ou para quem desenha adivinhar seu próprio nome.

A primeira dica mostra o tamanho das palavras. A segunda mostra as letras iniciais, a terceira e quarta mostram mais uma posição. O limite é `min(4,1 + floor(max(0,número de letras − 3)/4))`. Portanto um nome curto não é inteiramente revelado. Quem desenha decide quando ajudar; dicas diminuem o valor dos acertos posteriores. Tempo, ordem e contagem de dicas são validados no servidor.

Pincel, borracha branca, 16 cores prontas, seletor de cor, espessura, desfazer por gesto e limpar. O balde preenche a região conectada à cor tocada; um contorno completamente fechado limita o preenchimento. A tela lógica é sempre 960 × 600 para reproduzir o mesmo preenchimento em todos os tamanhos. Paleta e traços funcionam por toque e mouse.

Os nomes não se repetem até esgotar a seleção. Em uma partida longa com apenas uma categoria, o repertório é renovado quando restarem menos de três nomes.

## Integração e privacidade

O mesmo projeto Supabase do Jogo da Velha identifica sessões anônimas, com **tabelas e funções próprias do FutDraw**. O único endpoint público autenticado é `opc_futdraw(payload jsonb)`; as tabelas têm RLS e não concedem leitura ou escrita direta ao navegador. Os auxiliares não podem ser executados pelos papéis de cliente. A resposta do servidor omite a palavra e as opções dos demais participantes, inclusive os IDs de palavras já usadas. A palavra escolhida fica em `secret`, não em estado público de sala.

O botão **Editar nome** funciona na sala de espera, durante a partida e no resultado, preservando identificação, lugar e pontuação. O servidor valida o tamanho do apelido e recusa nomes já usados por outro participante ativo. Mensagens anteriores conservam o nome exibido no momento em que foram enviadas.

Traços são enviados em lotes de até 16 operações e recebidos incrementalmente. Há atualização aproximada de 0,85 segundo, com envio de traços a cada 0,4 segundo. Isso é sincronização por consultas curtas, não WebSocket. Custo e latência dependem da conexão e do plano Supabase. São aceitas até 2.400 operações por desenho; cada operação admite no máximo 64 pontos e coordenadas limitadas à tela. Há limites de tamanho de requisição, intervalo entre palpites e criação de salas por sessão. Não é um sistema contra abuso em grande escala: CAPTCHA/moderação e limites de infraestrutura podem ser necessários se houver crescimento significativo.

Salas expiram três horas após a criação e são removidas, com seus participantes e desenhos, na criação de uma nova sala. Quem sai ou fica ausente por mais de 90 segundos perde a participação ativa. O anfitrião é transferido ao próximo participante ativo; uma sala vazia expira. Não há pareamento público nesta versão. Não são usados contas pessoais, e-mail, senha, ranking global, anúncios ou imagens externas.

## Implantação

1. Preservar o checkpoint anterior, sem alterar as estruturas `opc_velha_*`.
2. Executar `online/futdraw-schema.sql` uma vez no SQL Editor do projeto Supabase já conectado.
3. Executar `online/futdraw-catalogo.sql` para carregar o catálogo.
4. Publicar a página e os recursos. A chave já presente em `velha-online-config.js` é pública; não colocar chave de serviço no site.
5. Validar duas sessões distintas: criar, entrar, iniciar, escolher, transmitir desenho, acertar, dar dica, alternar e encerrar.

`Treinar desenho` funciona localmente mesmo se a integração estiver indisponível. Não simula adversários nem distribui pontos fictícios.

## Testes

`node tests/futdraw.test.cjs` cobre nomes/variantes, filtros de categorias, dicas, pontuação, preenchimento de região fechada, desfazer e contratos de segurança. O teste de integração em PostgreSQL (`tests/futdraw-db.integration.cjs`) exige `@electric-sql/pglite` como dependência de desenvolvimento; ele não é entregue ao navegador. Exercita três participantes, proteção da palavra, acertos, passagem de turno, tentativas após tempo, saída, escrita indevida e bloqueio de leitura direta. O pacote pode ser instalado fora do site e passado em `FUTDRAW_PGLITE_MODULE`.
