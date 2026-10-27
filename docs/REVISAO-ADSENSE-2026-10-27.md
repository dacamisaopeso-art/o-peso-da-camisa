# Revisão após aviso de conteúdo de baixo valor

## Evidência e limites

Nas capturas enviadas, ads.txt está Autorizado e o site está Requer atenção por Conteúdo de baixo valor. O Google não identifica uma URL específica. Esta revisão corrige problemas observáveis; não prova a causa da recusa nem garante aprovação. O aviso de informações de pagamento é uma pendência separada da qualidade do conteúdo.

Checkpoints anteriores: portal `bf6c6937b3852f8dd3b24179e2dfd83618264b4b`; domínio principal `aec647584c513102ee33add0e8a96fdcfecd9797`. Há também a branch local `checkpoint/antes-revisao-adsense-20261026`.

## Correções

- Carregador AdSense restrito às matérias completas; excluídos os dois catálogos de entrada, contato, sobre, privacidade e créditos. Jogos, aplicativo e apoio continuam sem o carregador. A metatag de identificação da conta permanece nas entradas; ads.txt não foi alterado.
- Nas 11 matérias geradas: assinatura editorial com link, data original, estimativa de leitura, duas recomendações estáticas e acesso ao canal de correções. Metadados de compartilhamento e BlogPosting para todas, preservando a data de publicação.
- Sobre: identificação do projeto, distinção entre registros/relatos/interpretações, critérios de rankings, limites dos jogos/simuladores, créditos e correções. Contato: instruções concretas para reportar um erro.
- Privacidade atualizada para descrever o escopo real do carregador. Interface preta/dourada, conteúdos, fontes, imagens, licenças, dados e lógica dos jogos preservados.
- Ajustes de quebra de texto, tabelas roláveis e links de leitura em telas pequenas; sem pop-ups, novos rastreadores ou textos adicionados para inflar a quantidade de artigos.

## Verificação

26 testes Python: publicidade (11), geração do blog (5), segurança (3), licenças (7). A geração é repetível, os links locais resolvem e as 11 matérias mantêm integralmente seus corpos anteriores. A suíte site-melhorias também passou, verificando preservação da base e dos modos. A publicação deve ser confirmada no Pages e nas páginas públicas antes de ser comunicada como concluída.

## O que não foi feito

Não foi enviada uma declaração de correção ou solicitação de revisão à conta AdSense. Não foram inseridos dados pessoais de pagamento, nem ativada publicidade em jogos. A CMP certificada mencionada na política de privacidade continua pendente antes de veiculação nas condições que a exigem; esta revisão não declara conformidade integral nem aprovação da conta.

## Referências oficiais consultadas

- https://support.google.com/adsense/answer/81904?hl=pt-BR
- https://support.google.com/publisherpolicies/answer/11112688?hl=pt-BR
- https://support.google.com/publisherpolicies/answer/11190248?hl=pt-BR

Não existe nesta revisão uma quantidade mínima de artigos ou prazo prometido como condição suficiente para aprovação. Continuar a curadoria e a publicação de conteúdo original útil é parte da manutenção do projeto.
