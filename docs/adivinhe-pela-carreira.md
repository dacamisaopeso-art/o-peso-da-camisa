# Adivinhe pela Carreira — O Peso da Camisa

Jogo original, independente dos demais, em `adivinhe-pela-carreira.html`. Identidade OPC preta e dourada, linha do tempo vertical, modo livre com jogadores e treinadores, universos Brasileirão e futebol mundial e três faixas editoriais de dificuldade. Brasileirão é a opção inicial.

## Regras implementadas

Uma passagem revelada dá direito a um palpite. Erro ou salto avança um card e uma tentativa, preservando os anteriores. O último card ainda tem seu palpite: só um erro ou salto nessa tentativa encerra a rodada. Acerto revela a carreira completa. Não é possível reutilizar um palpite errado; nomes inexistentes, ambíguos e de outro modo não gastam tentativa.

Autocomplete aceita acentos e aliases, incluindo nomes conhecidos e apelidos; homônimos recebem idade e posição quando disponíveis. Uma identidade que tenha sido jogador e treinador possui dois registros independentes. Estatísticas, rodada pendente e nomes já usados ficam no navegador. Não há repetição dentro do universo escolhido até esgotá-lo; reiniciar a lista é uma ação explícita e preserva o placar. Trocar modo encerra a exibição da rodada atual, mantendo o nome consumido na sessão.

Pontuação: 1.000 no primeiro acerto; 250 no último; posições intermediárias interpoladas pela fração de passagens reveladas, sem somar bônus por quantidade de clubes. Uma passagem única vale 500 pontos. Vitória aumenta sequência; derrota zera a sequência. Salto e erro de palpite têm contadores próprios, sem registrar uma derrota por cada card.

Compartilhar usa o menu nativo quando disponível; caso contrário copia texto ou o exibe para copiar. O resultado compartilhado contém a resposta e informa isso pelo conteúdo; não é um desafio secreto nem um ranking global.

## Base desta edição

O acervo integral continua com **2.236 jogadores e 40 treinadores**, totalizando **2.276 carreiras**, preservado em `carreira-dados.js`. A página agora usa **561 jogadores selecionados e os mesmos 40 treinadores**. O Brasileirão tem **260 jogadores jogáveis** e o mundial, **442**; **141** aparecem nos dois universos. Os jogadores selecionados se dividem em **125 fáceis, 311 normais e 125 difíceis**. A classificação dos treinadores foi mantida.

O arquivo leve `carreira-jogaveis.js` contém apenas os registros disponíveis para jogar e sugerir. Sua igualdade com o acervo selecionado é testada; o arquivo integral não foi apagado ou modificado. Fotos e trajetórias dos nomes aprovados continuam iguais às originais. A data de nascimento de Pepe foi corrigida na camada de curadoria para 26/02/1983, com comprovação da [Federação Portuguesa de Futebol](https://www.fpf.pt/Jogadores/Pepe/contextId/172).

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

A divisão entre fama mundial e reconhecimento brasileiro é editorial e usa também atuação significativa no exterior e seleção principal, não apenas nacionalidade. Desde 14/10/2026, o elenco exige inclusão explícita na curadoria: ter jogado por um clube grande, sozinho, não aprova ninguém. Fácil reúne estrelas e ídolos amplamente reconhecidos; Normal usa nomes conhecidos do futebol brasileiro e mundial; Difícil exige mais memória sobre trajetórias de nomes reconhecíveis, sobretudo históricos, sem recorrer a desconhecidos apenas por terem muitos clubes. Brasileirão e Fácil são as opções iniciais. Vardy e Kanté continuam fora do Difícil. Não há garantia de que todos os participantes reconhecerão todos os nomes.

## Imagens e atribuição

Imagens pessoais são aceitas apenas com autoria e licença livre verificáveis na Wikimedia Commons: CC BY, CC BY-SA, CC0 ou domínio público. Créditos e links de origem/licença acompanham o resultado. Não se reutilizam fotografias da imprensa nem arquivos identificados apenas como “disponíveis na internet”. Imagens podem ser de outra época ou de seleção; não determinam a carreira e só aparecem ao revelar a resposta.

Fotos ausentes ou indisponíveis usam um retrato gráfico original com iniciais, explicitamente identificado. Todos os clubes usam emblemas gráficos OPC com iniciais, sem foto ou escudo oficial. O padrão é igual para todos, independentemente de haver imagem disponível. O acervo de escudos anteriormente consultado permanece arquivado localmente e não é carregado pelo jogo. Marcas são usadas apenas para identificar a trajetória, sem relação de patrocínio. O navegador carrega imagens aprovadas diretamente da Wikimedia; o jogo continua funcional se o serviço de imagens estiver indisponível.

Nacionalidade futebolística prioriza a última seleção principal representada; cidadania é usada quando não há atuação em seleção documentada. Isso evita confundir, por exemplo, o país de nascimento de Hakimi com a seleção de Marrocos.

## Motor, validação e continuidade

`carreira-core.js` separa sorteio, filtro, estado, busca e pontuação da interface. Um gerador determinístico está disponível para evolução futura de desafio diário. Não há botão de diário ou ranking sem implementação. Atualizações preservam o placar e identidades já usadas; rodadas anteriores de nomes ainda selecionados também podem ser retomadas. Rodadas de nomes removidos da seleção não são retomadas, mas acertos, pontos e recordes locais são preservados. O jogo atual funciona integralmente sem backend.

`node tests/carreira.test.cjs` valida dados, licenças, cronologia, retornos, jogador/treinador, última tentativa, perda, acerto, aliases, pontuação proporcional e sorteio sem repetição. Sintaxe e navegação real em computador/celular complementam a verificação.

## Equilíbrio de sorteio — 14/10/2026

O gerador `scripts/curar-carreira.cjs` mantém uma lista explícita de identidades, com data de nascimento quando há homônimos, em `dados/carreira-curadoria.json`. Nomes fora dela não aparecem como resposta misteriosa nem como sugestão. A base do Jogo da Velha e os outros jogos não são alterados.

Os nomes com atuação registrada de 2015 em diante recebem peso 3; históricos recebem peso 1. No Misturado, os pesos adicionais são 3 para Fácil, 2 para Normal e 1 para Difícil. Nenhum sorteio repete um nome consumido. Ao esgotar o elenco, todos os aprovados terão aparecido; os pesos apenas mudam a ordem provável. Fama e dificuldade são uma decisão editorial voltada ao público brasileiro, não uma estatística oficial.

Testes: `node tests/carreira.test.cjs` e `node tests/carreira-equilibrio.test.cjs`. A segunda suíte esgota todas as combinações de universo/dificuldade, confere exclusões e nomes preservados, igualdade da versão leve, e 6.000 sorteios por universo para verificar preferência por recentes e dificuldades acessíveis.

Checkpoint anterior: `2257ad74c43f859f33fdaceab5494fff19a71c9d`.
