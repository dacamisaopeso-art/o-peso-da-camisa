# Adivinhe pela Carreira — O Peso da Camisa

Jogo original, independente dos demais, em `adivinhe-pela-carreira.html`. Identidade OPC preta e dourada, linha do tempo vertical, modo livre com jogadores e treinadores, universos Brasileirão e futebol mundial e três faixas editoriais de dificuldade. Brasileirão é a opção inicial.

## Regras implementadas

Uma passagem revelada dá direito a um palpite. Erro ou salto avança um card e uma tentativa, preservando os anteriores. O último card ainda tem seu palpite: só um erro ou salto nessa tentativa encerra a rodada. Acerto revela a carreira completa. Não é possível reutilizar um palpite errado; nomes inexistentes, ambíguos e de outro modo não gastam tentativa.

Autocomplete aceita acentos e aliases, incluindo nomes conhecidos e apelidos; homônimos recebem idade e posição quando disponíveis. Uma identidade que tenha sido jogador e treinador possui dois registros independentes. Estatísticas, rodada pendente e nomes já usados ficam no navegador. Não há repetição dentro do universo escolhido até esgotá-lo; reiniciar a lista é uma ação explícita e preserva o placar. Trocar modo encerra a exibição da rodada atual, mantendo o nome consumido na sessão.

Pontuação: 1.000 no primeiro acerto; 250 no último; posições intermediárias interpoladas pela fração de passagens reveladas, sem somar bônus por quantidade de clubes. Uma passagem única vale 500 pontos. Vitória aumenta sequência; derrota zera a sequência. Salto e erro de palpite têm contadores próprios, sem registrar uma derrota por cada card.

Compartilhar usa o menu nativo quando disponível; caso contrário copia texto ou o exibe para copiar. O resultado compartilhado contém a resposta e informa isso pelo conteúdo; não é um desafio secreto nem um ranking global.

## Base desta edição

**2.236 jogadores e 40 treinadores**, totalizando **2.276 carreiras**. O universo Brasileirão tem **651 jogadores**; o mundial, **1.851**. **266 atletas** aparecem nos dois, sem duplicação de identidade. Há **2.038 registros com foto licenciada** e **238 com alternativa de iniciais** (uma pessoa nos dois modos pode compartilhar um retrato). Todos os clubes usam iniciais OPC, sem imagens. Distribuição editorial: 145 fáceis, 1.354 médias e 777 difíceis. **252 trajetórias selecionadas foram rejeitadas** por informações incompletas ou ambíguas.

Biografias, identidades e licenças consultadas em **11/10/2026**. A seleção reaproveita as identidades e a notoriedade editorial da base do Jogo da Velha, mas usa históricos cronológicos próprios, consultados novamente. Não modifica a base, as grades, o bot ou o checkpoint daquele jogo.

O universo selecionado privilegia jogadores com presença documentada em seleções, atuação significativa e/ou conquistas, somando nomes brasileiros e os exemplos do pedido. Não é um inventário de todos os profissionais e a notoriedade é editorial. A carreira precisa alcançar 1990 ou um ano posterior. Passagens mais antigas do mesmo profissional continuam visíveis.

Somente times principais: base, reservas e equipes B/C/II não entram. Em jogadores, as passagens exibidas precisam ter atuação positiva informada na ficha profissional. Empréstimos aparecem e retornos ao mesmo clube continuam separados. Se uma passagem tem participação ou datas incompletas, o atleta fica fora do sorteio em vez de exibir uma carreira artificialmente truncada. Para treinadores, excluem-se assistentes, diretores e equipes juvenis; clubes e seleções principais e interinidades explícitas entram.

Dados anuais não permitem inventar meses ou uma data precisa de retorno de empréstimo. Um vínculo abrangente aparece com aviso de que inclui empréstimos, e as passagens emprestadas aparecem em ordem de início. Isso representa vínculo e atuação sem afirmar que o atleta jogou simultaneamente pelos dois times. Dois períodos no mesmo ano podem corresponder a passagens distintas, inclusive interinidades.

“Atual” significa período aberto na biografia consultada nesta edição; não é deduzido de contrato futuro. Atualização não é automática. Cada pessoa possui um link para sua biografia no resultado; `carreira-dados.js` contém o histórico, período e identidade usados. Lacunas e registros rejeitados permanecem no material local de revisão.

Fontes oficiais complementares para a seleção brasileira: [trajetória de Bruno Henrique](https://www.flamengo.com.br/flamengo/noticias/futebol/bruno-henrique-alcanca-600-jogos-na-carreira-nunca-imaginei), [Fred e os ídolos do Fluminense](https://www.fluminense.com.br/sobre/idolos) e [Cano no Fluminense](https://fluminense.com.br/noticia/cano-ultrapassa-fred-e-se-torna-o-maior-artilheiro-do-fluminense-no-novo-maracana).

Exemplos de verificação oficial complementar: [saída de Guardiola do Manchester City em 2026](https://www.mancity.com/news/mens/pep-guardiola-official-announcement-63915039) e [retorno de Ancelotti aos trabalhos da Seleção](https://www.cbf.com.br/selecao-brasileira/noticias/noticias/a/ancelotti-retorna-ao-brasil-e-faz-reuniao-com-a-comissao-tecnica). Não se transforma o vencimento de um contrato em ano de atuação futura.

## Universos e notoriedade

**Brasileirão** reúne jogadores de qualquer nacionalidade com passagem profissional documentada por clubes brasileiros no recorte de 1990 em diante. Ídolos locais, atletas marcantes de elencos e estrangeiros reconhecidos pelo público brasileiro entram sem precisar de fama mundial. **Mundial** inclui jogadores reconhecidos em competições internacionais e em clubes conhecidos. Há sobreposição para nomes como Ronaldo, Ronaldinho, Kaká e Neymar. A trajetória completa continua incluindo os clubes de todos os países, mesmo ao escolher Brasileirão. Autocomplete e validação de palpites respeitam o universo escolhido; treinador mantém sua própria seleção.

A ampliação combina a curadoria de notoriedade preexistente, participação documentada em seleções/títulos, passagens expressivas (150 ou mais jogos de liga somados em clubes conhecidos, acompanhadas de outros sinais de relevância) e inclusões editoriais explícitas. Uma passagem curta isolada em um clube grande não garante inclusão. Campanhas históricas permitem nomes de reconhecimento mais específico, como campeões pelo Leicester em 2016; os menos conhecidos podem ficar no nível difícil. Vardy, Kanté, Sterling, Mahrez, Fabinho, Di María, Enzo Fernández, Paredes, De Paul, Cucurella, Pedro Porro e Rodri têm identidades próprias e trajetórias conferidas. Isso não atribui a eles títulos que não conquistaram: o jogo mostra carreiras, não pistas de troféus.

A divisão entre fama mundial e reconhecimento brasileiro é editorial e usa também atuação significativa no exterior e seleção principal, não apenas nacionalidade. A dificuldade considera notoriedade, extensão da carreira e raridade do primeiro clube; nomes amplamente conhecidos receberam revisão explícita, de modo que Vardy e Kanté não ficam no nível difícil. Não há garantia de que todos os participantes reconhecerão todos os nomes.

## Imagens e atribuição

Imagens pessoais são aceitas apenas com autoria e licença livre verificáveis na Wikimedia Commons: CC BY, CC BY-SA, CC0 ou domínio público. Créditos e links de origem/licença acompanham o resultado. Não se reutilizam fotografias da imprensa nem arquivos identificados apenas como “disponíveis na internet”. Imagens podem ser de outra época ou de seleção; não determinam a carreira e só aparecem ao revelar a resposta.

Fotos ausentes ou indisponíveis usam um retrato gráfico original com iniciais, explicitamente identificado. Todos os clubes usam emblemas gráficos OPC com iniciais, sem foto ou escudo oficial. O padrão é igual para todos, independentemente de haver imagem disponível. O acervo de escudos anteriormente consultado permanece arquivado localmente e não é carregado pelo jogo. Marcas são usadas apenas para identificar a trajetória, sem relação de patrocínio. O navegador carrega imagens aprovadas diretamente da Wikimedia; o jogo continua funcional se o serviço de imagens estiver indisponível.

Nacionalidade futebolística prioriza a última seleção principal representada; cidadania é usada quando não há atuação em seleção documentada. Isso evita confundir, por exemplo, o país de nascimento de Hakimi com a seleção de Marrocos.

## Motor, validação e continuidade

`carreira-core.js` separa sorteio, filtro, estado, busca e pontuação da interface. Um gerador determinístico está disponível para evolução futura de desafio diário. Não há botão de diário ou ranking sem implementação. Atualizações preservam o placar e identidades já usadas; somente a rodada pendente precisa ser da mesma versão para ser retomada. O jogo atual funciona integralmente sem backend.

`node tests/carreira.test.cjs` valida dados, licenças, cronologia, retornos, jogador/treinador, última tentativa, perda, acerto, aliases, pontuação proporcional e sorteio sem repetição. Sintaxe e navegação real em computador/celular complementam a verificação.
