# Auditoria de preparação para AdSense — 16/10/2026

Repositórios: `dacamisaopeso-art/o-peso-da-camisa` (base `b1cfe3f653de6bf802c298cf6314cba123bb208c`) e `dacamisaopeso-art/dacamisaopeso-art.github.io` (base `bd4ce76`).

## Privacidade e cookies

- Não foram encontrados carregadores de anúncios ou analytics nas páginas públicas auditadas. A metatag da conta e o ads.txt do domínio principal foram preservados: não são evidência de aprovação.
- Política ampliada para abranger a raiz e o portal, apresentar políticas dos fornecedores, explicar exclusão de dados locais e distinguir a configuração atual de publicidade futura.
- Navegação institucional estática adicionada às páginas que não tinham link de privacidade, incluindo artigos e jogos. O gerador mantém esses links em novas publicações.
- Enquete continua sendo carregada apenas ao abrir sua seção, agora com aviso de serviço externo. Nenhuma votação foi enviada.
- Nenhum cookie próprio foi observado por `document.cookie` no carregamento inicial testado. Isso não significa ausência de registros técnicos dos provedores, cookies HttpOnly ou cookies de terceiros depois de interação.
- Nenhuma sala online real foi criada; comportamento do serviço remoto e seus prazos de retenção não foram auditados no servidor. Testes existentes do modo online foram executados.

## Navegação e responsividade

- 29 rotas representativas, incluindo raiz, homepage, dez páginas de publicações, artigos fixos, catálogo, sete jogos, instituições, fontes/créditos e página 404.
- Chrome em 320, 390 e 1280 px: 87 verificações sem transbordamento horizontal do documento, sem exceções JavaScript, com links de privacidade. Menu da homepage abre e fecha por Escape nos dois tamanhos mobile.
- Dois retornos `#artigos` apontavam para âncora inexistente: corrigidos para `#historias` nos artigos Kaká e Robinho.
- Domínio principal recebeu atalho de teclado para o conteúdo, respeito à preferência de movimento reduzido e área de toque ampliada nos links mobile, sem mudar identidade visual.
- Auditoria estática de 31 documentos HTML, incluindo a cópia antiga `index (1).html` e a página de verificação: nenhum destino local ou âncora ausente após correções. A página de verificação permanece intacta.

## Conteúdo editorial e links

- Pelé, Garrincha, Gre-Nal e Brasil: revisão anterior preservada. O HTML ganhou somente navegação institucional; os textos não foram reescritos.
- Kaká: referências específicas de São Paulo FC, Milan, Real Madrid e MLS acrescentadas para formação/acidente, carreira, prêmios e aposentadoria.
- Robinho: link genérico do STJ substituído pela notícia da decisão de 20/03/2024. Explicitado o recorte judicial até março de 2024 para não sugerir acompanhamento processual em tempo real. Não se afirma situação prisional atual.
- Re-Pa: PDF oficial retornava HTTP 404; substituído por `https://clubedoremo.com.br/titulos`, que registra a Série C de 2005. Convite a comentários inexistentes substituído por contato nos perfis oficiais. Data de 14/06/1914 compatível com a história oficial do Paysandu consultada.
- Fla-Flu, Remontada, torcedores e clubes centenários: examinados os textos, fontes, atribuições e enquadramento editorial. Não surgiu correção factual suficientemente confirmada que justificasse reescrever esses textos nesta rodada. Isso não equivale a uma certificação independente de cada afirmação.
- Varredura inicial de 733 URLs externas únicas: 266 respostas 200, 464 respostas 429 (todas Wikimedia Commons), uma 404 corrigida e duas inconclusivas (CBF: certificado na ferramenta; UEFA: timeout). A fonte da UEFA abriu posteriormente pela ferramenta de navegação. HTTP 200 não prova validade do conteúdo; 429 não prova link quebrado. Não houve nova varredura massiva após o limite.
- Licenças e créditos preservados; auditoria atual não substitui a documentação anterior de direitos de imagens.

## Validação e preservação

- 4 testes de blog, 7 de imagens/licenças e 3 de segurança passaram. O teste de geração inicialmente encontrou restrição no diretório temporário do ambiente; passou usando uma pasta temporária dentro do workspace.
- Todas as 20 suítes `.test.cjs` dos jogos passaram.
- Comparação de 21 páginas confirmou conteúdo idêntico à base após retirar apenas a nova navegação e normalizar finais de linha.
- Sem alterações em imagens, dados, registro de licenças ou JavaScript dos jogos; arquivos arquivados e código do protótipo preservados.
- `git diff --check` passou nos dois repositórios; bases sincronizadas antes dos commits.

## Antes de ativar anúncios futuramente

A aprovação deve ser verificada na conta AdSense. Antes da ativação, conferir as informações exigidas na política, consentimento aplicável e CMP certificada para anúncios personalizados no EEE, Reino Unido e Suíça. A política de segurança atual também deverá ser revista para os recursos estritamente necessários à integração escolhida. Nenhuma dessas integrações foi instalada nesta auditoria.

Referências oficiais consultadas:

- [Google — conteúdo obrigatório da política](https://support.google.com/adsense/answer/1348695?hl=pt-BR)
- [Google — cookies do AdSense](https://support.google.com/adsense/answer/7549925?hl=pt-BR)
- [Google — requisitos de CMP](https://support.google.com/adsense/answer/13554116?hl=pt-BR)
- [Google — conteúdo e experiência antes da revisão](https://support.google.com/adsense/answer/12176698?hl=pt-BR)

A decisão de aprovação pertence ao Google. Esta auditoria não acessou o painel da conta nem afirma aprovação ou garantia de aprovação.
