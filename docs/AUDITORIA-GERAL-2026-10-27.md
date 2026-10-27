# Revisão geral de site e aplicativo

Checkpoint anterior: `47e3f31f3b0cfe6b20891b16e64ba08605460402`, branch local `checkpoint/antes-auditoria-geral-20261027`.

## Escopo e preservação

Nove jogos, matérias, dados, regras, identidade preta/dourada e integração online preservados. A revisão não revalida individualmente todos os fatos dos 25.742 atletas, nem certifica ausência de vulnerabilidades ou conformidade jurídica integral. Não aplica migrações de banco, novos anúncios, rastreadores ou permissões no Android.

## Problemas confirmados e correções

- App: DrafTeam ausente no mapa de títulos e no procedimento de saída da central. Agora aparece com seu nome e a saída executa o procedimento já existente de saída da sala; falhas de rede não impedem voltar à central.
- App: marcar/remover favorito reconstruía a lista e perdia o foco. O foco acompanha o botão correspondente ou volta ao filtro quando o cartão deixa de existir.
- App: diálogo de saída sem identificação acessível. Título vinculado e foco inicial em Continuar jogando, mantendo confirmação antes de sair.
- App: textos secundários pequenos e ações de ajuda sem estilo próprio. Fontes ampliadas, botões maiores e margens para a navegação fixa.
- FutDraw: cores tinham 26 px no site e 30 px no app. Controles passam a 44 px em telas pequenas, com quebra em linhas.
- Site: links de créditos, app e apoio agrupados em navegação secundária, mantendo a chamada Pix superior.
- Site/app: movimentos de navegação respeitam a preferência de movimento reduzido nas ações alteradas.
- Android: opções de acesso a arquivos locais/universal explicitamente desativadas e Safe Browsing explicitamente ativo, além das proteções já existentes.

## Verificação

Antes das alterações, passaram 32 suítes JavaScript dos jogos. As nove telas iniciais foram conferidas a 320 px sem transbordamento horizontal. As suítes afetadas de interface, instalação, FutDraw, preferências, backup, segurança e licenças passaram depois das alterações. O pacote Android mantém nove jogos e os hashes dos motores e dados de origem. Dois testes Android adicionais verificam foco de favoritos e saída do DrafTeam; a distribuição depende da compilação, análise e testes do emulador.

A varredura de 382 arquivos de código/configuração não encontrou JWT com papel service_role ou chaves privadas PEM. Isso é uma checagem limitada de padrões, não um pentest nem garantia de ausência de todo tipo de segredo. As chaves públicas Supabase permanecem públicas por definição; as regras do servidor continuam necessárias.

## Imagens e direitos

Nenhuma imagem, fotografia, escudo, áudio ou código de terceiros foi adicionado nesta revisão. Registros individuais, hashes de fotografias locais, licenças comerciais e atribuição passaram pelos testes existentes. Fontes locais mantêm OFL. Nomes e artes de identificação não significam afiliação oficial; licenças de imagem não eliminam direitos de marca ou de personalidade. Não há declaração de aprovação jurídica universal.

## Próximas melhorias sugeridas

1. Monitorar erros reais reportados pelos jogadores antes de expandir a interface ou criar novos jogos.
2. Ampliar curadoria factual por lotes com fontes e casos de regressão, priorizando os critérios mais usados.
3. Evoluir convites Android com links verificados quando houver domínio e associação de aplicativos configurados.
4. Configurar a gestão de consentimento publicitário antes de veicular nas condições que a exigem. A revisão AdSense permanece decisão do Google.
5. Um histórico visível e compacto de versões e correções ajuda o usuário a reconhecer atualizações oficiais sem poluir as telas dos jogos.

## Referências

- https://developer.android.com/privacy-and-security/risks/webview-unsafe-file-inclusion
- https://developer.android.com/privacy-and-security/risks/unsafe-uri-loading
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum
