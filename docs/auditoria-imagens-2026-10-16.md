# Auditoria das imagens — 16/10/2026

Base sincronizada: `d76db804df4b9cc7295b686f9dd5db9dbba58b80`. A verificação do Google adicionada nessa base foi preservada. Sem implementação de AdSense.

## Cobertura e evidências

Foram catalogados os 277 arquivos de imagem locais existentes antes da revisão, incluindo 206 arquivos aposentados em `_arquivo`, os 151 escudos incorporados como data URI, as imagens de fundo/miniaturas, as bandeiras dinâmicas e os SVGs/identificações produzidos pelo código dos jogos. Foram consultados individualmente 2.135 registros do Commons, abrangendo tanto as imagens realmente exibidas quanto referências legadas em dados e documentação. 2.134 retornaram metadados; `File:Enzo Scifo-Torino.jpg`, apenas em referência não utilizada, estava indisponível e não está liberada para reutilização.

`docs/auditoria-imagens-2026-10-16.json` contém fonte, autoria declarada, licença, condições, hash da fonte, número/data da revisão e referências de cada registro, além dos hashes de cada arquivo local anterior. A marcação `active` desse inventário é uma fotografia das referências encontradas na base; para uso depois das correções, consulte o registro de produção `dados/licencas-imagens.json` e as decisões de substituição. O registro de produção tem 912 entradas: 595 referências de fotografias, 202 artes originais, 92 bandeiras, 20 fotografias locais legadas sem uso nos jogos atuais e três arquivos de marca própria.

A declaração de uma licença na página individual é uma evidência de autorização, não prova absoluta de titularidade. Nenhuma licença foi inferida apenas do domínio Wikimedia. Nos casos de domínio público, a declaração e o fundamento específico consultado foram registrados separadamente. A cadeia de autoria anterior da marca própria não foi comprovada nesta revisão.

## Decisões principais

| Imagem/grupo | Origem e autoria | Decisão e condições |
| --- | --- | --- |
| Foto anterior de Pelé | Walter Firmo / Acervo IMS; [registro institucional](https://ims.com.br/por-dentro-acervo/pele-no-coracao-do-brasil/) | Nenhuma autorização comercial para essa cópia foi localizada. Removida da versão publicada; sem alegação de que seria livre por ser antiga. |
| Nova foto de Pelé | [Marcello Casal Jr./Agência Brasil, África do Sul, 10/06/2010](https://commons.wikimedia.org/wiki/File:Pel%C3%A9_%C3%81frica_do_Sul_2010_2.jpg) | CC BY 3.0 Brasil, anterior à mudança de política da agência em 2017. Hash SHA-1 idêntico à fonte; crédito, licença e data/contexto corretos. Não é fotografia da carreira de Pelé em campo. |
| Garrincha e o povo | [Fotógrafo não identificado / Acervo Arquivo Nacional](https://commons.wikimedia.org/wiki/File:Garrincha_e_o_povo.jpg), 1962 | Mantida. Registro específico usa `Arquivo Nacional PD-license|URAA`, que remete a `PD-Brazil-URAA`. Crédito corrigido para distinguir acervo de autoria; não foi inventado nome de fotógrafo. O código individual do item no acervo não consta da fonte consultada. |
| Re-Pa 1951 | [Fotógrafo não identificado; publicado em O Liberal em 13/11/1951; Hemeroteca/BN](https://commons.wikimedia.org/wiki/File:Re-Pa_1951.jpg) | A fonte declara `PD-Brazil-media`. O prazo brasileiro não demonstra sozinho a situação em outros países, inclusive quanto à [restauração URAA](https://www.copyright.gov/circs/circ38b.pdf). Substituição preventiva por capa vetorial OPC; não se afirma que a foto seja necessariamente ilícita. |
| Laranjeiras | [Alexandre Magno Barreto Berwanger, 21/07/2018](https://commons.wikimedia.org/wiki/File:Est%C3%A1dio_de_Laranjeiras_21_07_2018_4.jpg) | Mantida, CC BY-SA 4.0, cópia local conferida pelo hash. Crédito e licença junto à imagem. |
| Fla-Flu | [André Borges/Agência Brasília, 21/02/2016](https://commons.wikimedia.org/wiki/File:Campeonato_Carioca_-_Fluminense_x_Flamengo_(25087481991).jpg) | Mantida, CC BY 2.0. Registro inclui fonte Flickr e revisão de licença. |
| Gre-Nal | [Guilherme Testa/Editorial J, 02/12/2012](https://commons.wikimedia.org/wiki/File:GRENAL_(8248126822).jpg) | Mantida, CC BY-SA 2.0. Nome do fotógrafo preservado, além da conta de publicação. |
| La Remontada | [Hugo Pérez Marsol](https://commons.wikimedia.org/wiki/File:Bar%C3%A7a_6_-_PSG_1%3B_Dimecres_8_de_mar%C3%A7_de_2017_-_33185087512.jpg) | Mantida, CC BY 2.0; crédito inclui arquivo e licença. A versão de origem contém correção de cores registrada no histórico. |
| Torcedores | [Marcello Casal Jr./ABr, 03/06/2010](https://commons.wikimedia.org/wiki/File:Spectators_watching_Brazil_national_football_team_train_at_Dobsonville_Stadium_2010-06-03_4.jpg) | Mantida, CC BY 3.0 Brasil; uso comercial com atribuição. |
| Seleção de 1970 | [El Gráfico; fotógrafo não identificado](https://commons.wikimedia.org/wiki/File:Brazil_national_team_1970.jpg) | Mantida sob a fundamentação específica `PD-AR-Photo` e `PD-1996|Argentina` da fonte. Crédito distingue publicação e fotógrafo; não é descrita como licença mundial irrestrita. |
| 581 fotos da Carreira e 11 fontes de estádios | Arquivos individuais em `dados/licencas-imagens.json` | Registros atuais conferidos com a fonte; nenhuma divergência de nome de licença encontrada nos registros ativos. CC BY, CC BY-SA, CC0 ou declaração específica de domínio público. Correção do link de domínio público da Vila Belmiro, antes apontado indevidamente como CC0. |
| 151 escudos da Champions | Biblioteca UEFA incorporada no código | [Termos da UEFA](https://www.uefa.com/termsconditions/) não concedem autorização comercial geral ao site. Substituídos por 151 identificações geométricas OPC, sem reprodução de escudos. Elencos, clubes, temporadas e regras intactos. |
| Oito miniaturas estáticas de vídeos | `img.youtube.com`; autoria dos elementos internos não documentada | Substituídas por oito capas vetoriais originais. Os seis Shorts, os documentários e seus links foram preservados. Não se presume que poder abrir uma miniatura autorize a fotografia nela contida. |
| Banner raster das Lendas | Histórico do projeto sem documentação suficiente da criação | Substituído por ilustração vetorial original com estádio, troféu genérico e bola. Paleta preto/dourado preservada. |
| Bandeiras atuais | [FlagCDN/Flagpedia](https://flagpedia.net/download/icons) | Fornecedor declara domínio público e permite uso comercial. 88 códigos catalogados; resoluções podem variar por jogo. Restrições próprias de símbolos de Estado continuam independentes. |
| Bandeiras históricas | Registros individuais de URSS, Alemanha Oriental, Iugoslávia e Zaire; tricolor própria para Sérvia e Montenegro | Fontes e condições registradas. Reproduções de símbolos estatais, não uma licença sobre uso oficial dos símbolos. |
| Logo e ícones OPC | Identidade fornecida para o próprio site, commit `24589b73` | Preservados para cumprir a identidade visual. Não declarados como CC nem liberados a terceiros. Comprovação de autoria/cessão anterior continua pendente com o titular. |
| Acervo aposentado | 205 fotos com referências individuais e um banner SVG próprio em `_arquivo` | Inventariado e preservado, sem reativar o jogo. Não é servido pelo GitHub Pages, mas continua acessível no repositório e no histórico do GitHub. Uma conferência específica será necessária antes de nova utilização. |

## Implementação

- Créditos completos junto às capas dos artigos; os cartões do blog apontam para a licença correspondente.
- Página `creditos-imagens.html` com autoria, fonte, licença e condições. Ela não recarrega todas as fotografias. Acesso pelo rodapé e pelos créditos dos artigos.
- Gerador consulta um registro explícito de direitos. Capas desconhecidas, sem uso comercial conferido ou sob licenças NC/ND não são aceitas por padrão. A recusa de ND é uma decisão editorial de evitar ambiguidades de recorte, não afirmação de proibição absoluta de reprodução comercial por toda licença ND.
- Rotina de publicação regenera créditos e blog e roda testes de licenças antes de salvar os artefatos.
- Sitemap inclui a página de créditos, mantendo as URLs anteriores.
- Ilustrações originais têm identificação própria e não são apresentadas como fotografias históricas. Não se atribuiu uma licença Creative Commons que o titular não concedeu.

## Condições e riscos restantes

[CC BY](https://creativecommons.org/licenses/by/4.0/) e [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/) permitem uso comercial com suas condições. Atribuição, fonte, licença e alterações precisam continuar acessíveis. Adaptações da fotografia CC BY-SA ficam sob a mesma licença ou uma compatível; isso não transforma automaticamente o site inteiro em CC BY-SA. O enquadramento visual responsivo é informado nos créditos.

Domínio público depende do fundamento e do território; documentos históricos não se tornam livres apenas por sua idade. Algumas fotografias esportivas foram disponibilizadas por seus autores mediante declaração de domínio público/PDM no Flickr. Essas declarações foram registradas, mas não eliminam dúvidas territoriais ou direitos de terceiros. A [Lei 9.610/1998](https://www.planalto.gov.br/ccivil_03/leis/l9610.htm), a situação do país de origem e eventuais direitos nos EUA não são intercambiáveis.

Persistem: cadeia de titularidade da marca própria; fotógrafo/código arquivístico não identificado no caso de Garrincha; alcance territorial das obras em domínio público; eventuais direitos de imagem, marcas presentes incidentalmente nas fotografias e condições de acesso a locais/eventos. A licença de uma foto não concede automaticamente esses outros direitos nem deve sugerir apoio dos retratados ao site. A auditoria das capas não comprova os direitos internos dos vídeos e documentários do YouTube.

A revisão reduz riscos das imagens; não é garantia de aprovação pelo AdSense. As [políticas do Google](https://support.google.com/adsense/answer/10502938) abrangem o conteúdo completo das páginas. Anúncios continuam desativados.

## Validação

Quatro testes do blog, três de segurança e sete de licenças, além das 20 suítes dos jogos. Comparação dos nove posts confirmou preservação do texto editorial, exceto antigas legendas de capa substituídas pelos créditos conferidos. Os dados dos jogos e o arquivo de verificação do Google foram preservados.

Navegador local: 26 URLs do sitemap em 390 e 1280 px, total de 52 verificações sem rolagem horizontal; pesquisa, 11 cartões e páginas de Pelé/Re-Pa; nenhum erro JavaScript. Os testes móveis são em tamanho de celular no navegador, não em aparelho físico. A publicação e a validação pública estão registradas no relatório final entregue no chat.
