# Adivinhe pela Carreira — O Peso da Camisa

Jogo original, independente dos demais, em `adivinhe-pela-carreira.html`. Identidade OPC preta e dourada, linha do tempo vertical, modo livre com jogadores e treinadores e três faixas editoriais de dificuldade.

## Regras implementadas

Uma passagem revelada dá direito a um palpite. Erro ou salto avança um card e uma tentativa, preservando os anteriores. O último card ainda tem seu palpite: só um erro ou salto nessa tentativa encerra a rodada. Acerto revela a carreira completa. Não é possível reutilizar um palpite errado; nomes inexistentes, ambíguos e de outro modo não gastam tentativa.

Autocomplete aceita acentos e aliases, incluindo nomes conhecidos e apelidos; homônimos recebem idade e posição quando disponíveis. Uma identidade que tenha sido jogador e treinador possui dois registros independentes. Estatísticas, rodada pendente e nomes já usados ficam no navegador. Não há repetição dentro do universo escolhido até esgotá-lo; reiniciar a lista é uma ação explícita e preserva o placar. Trocar modo encerra a exibição da rodada atual, mantendo o nome consumido na sessão.

Pontuação: 1.000 no primeiro acerto; 250 no último; posições intermediárias interpoladas pela fração de passagens reveladas, sem somar bônus por quantidade de clubes. Uma passagem única vale 500 pontos. Vitória aumenta sequência; derrota zera a sequência. Salto e erro de palpite têm contadores próprios, sem registrar uma derrota por cada card.

Compartilhar usa o menu nativo quando disponível; caso contrário copia texto ou o exibe para copiar. O resultado compartilhado contém a resposta e informa isso pelo conteúdo; não é um desafio secreto nem um ranking global.

## Base desta edição

**542 jogadores e 40 treinadores**, totalizando **582 carreiras**. Há 565 registros de carreira com foto licenciada (a mesma pessoa nos dois modos pode compartilhar um retrato), 17 com alternativa gráfica e 66 clubes/seleções com escudo aprovado. Outros clubes usam emblema OPC. Distribuição editorial: 117 fáceis, 355 médias e 110 difíceis. 25 trajetórias selecionadas foram rejeitadas por informações incompletas ou ambíguas.

Biografias, identidades e licenças consultadas em **11/10/2026**. A seleção reaproveita as identidades e a notoriedade editorial da base do Jogo da Velha, mas usa históricos cronológicos próprios, consultados novamente. Não modifica a base, as grades, o bot ou o checkpoint daquele jogo.

O universo selecionado privilegia jogadores com presença documentada em seleções, atuação significativa e/ou conquistas, somando nomes brasileiros e os exemplos do pedido. Não é um inventário de todos os profissionais e a notoriedade é editorial. A carreira precisa alcançar 1990 ou um ano posterior. Passagens mais antigas do mesmo profissional continuam visíveis.

Somente times principais: base, reservas e equipes B/C/II não entram. Em jogadores, as passagens exibidas precisam ter atuação positiva informada na ficha profissional. Empréstimos aparecem e retornos ao mesmo clube continuam separados. Se uma passagem tem participação ou datas incompletas, o atleta fica fora do sorteio em vez de exibir uma carreira artificialmente truncada. Para treinadores, excluem-se assistentes, diretores e equipes juvenis; clubes e seleções principais e interinidades explícitas entram.

Dados anuais não permitem inventar meses ou uma data precisa de retorno de empréstimo. Um vínculo abrangente aparece com aviso de que inclui empréstimos, e as passagens emprestadas aparecem em ordem de início. Isso representa vínculo e atuação sem afirmar que o atleta jogou simultaneamente pelos dois times. Dois períodos no mesmo ano podem corresponder a passagens distintas, inclusive interinidades.

“Atual” significa período aberto na biografia consultada nesta edição; não é deduzido de contrato futuro. Atualização não é automática. Cada pessoa possui um link para sua biografia no resultado; `carreira-dados.js` contém o histórico, período e identidade usados. Lacunas e registros rejeitados permanecem no material local de revisão.

Exemplos de verificação oficial complementar: [saída de Guardiola do Manchester City em 2026](https://www.mancity.com/news/mens/pep-guardiola-official-announcement-63915039) e [retorno de Ancelotti aos trabalhos da Seleção](https://www.cbf.com.br/selecao-brasileira/noticias/noticias/a/ancelotti-retorna-ao-brasil-e-faz-reuniao-com-a-comissao-tecnica). Não se transforma o vencimento de um contrato em ano de atuação futura.

## Imagens e atribuição

Imagens pessoais e escudos são aceitos apenas com autoria e licença livre verificáveis na Wikimedia Commons: CC BY, CC BY-SA, CC0 ou domínio público. Créditos e links de origem/licença acompanham o resultado. Não se reutilizam fotografias da imprensa nem arquivos identificados apenas como “disponíveis na internet”. Imagens podem ser de outra época ou de seleção; não determinam a carreira e só aparecem ao revelar a resposta.

Fotos ausentes ou indisponíveis usam um retrato gráfico original com iniciais, explicitamente identificado. Escudos sem arquivo aprovado usam emblemas gráficos OPC com iniciais, sem alegar ser o escudo oficial. Marcas são usadas apenas para identificar a trajetória, sem relação de patrocínio. O navegador carrega imagens aprovadas diretamente da Wikimedia; o jogo continua funcional se o serviço de imagens estiver indisponível.

## Motor, validação e continuidade

`carreira-core.js` separa sorteio, filtro, estado, busca e pontuação da interface. Um gerador determinístico está disponível para evolução futura de desafio diário. Não há botão de diário ou ranking sem implementação. Os dados de versão invalidam saves incompatíveis. O jogo atual funciona integralmente sem backend.

`node tests/carreira.test.cjs` valida dados, licenças, cronologia, retornos, jogador/treinador, última tentativa, perda, acerto, aliases, pontuação proporcional e sorteio sem repetição. Sintaxe e navegação real em computador/celular complementam a verificação.
