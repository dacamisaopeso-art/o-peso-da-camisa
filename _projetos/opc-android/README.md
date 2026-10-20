# OPC Jogos — Android 0.1.0

Aplicativo Android independente, somente jogos. Os HTML, motores e bases são copiados do site por `node prepare.cjs`, com uma camada de navegação e CSS exclusiva para o aplicativo. Nenhum arquivo publicado do site é modificado.

## Incluído
Oito jogos, central com favoritos e último jogo, navegação de toque e confirmação ao voltar. Jogos solo, bot, modo local e treino do FutDraw têm os dados no pacote. Salas online utilizam o Supabase atual e exigem internet; imagens externas e fontes de comprovação também. Progresso local separado do site. Não há anúncios, rastreamento nem conta pessoal.

FutDraw: salvar PNG usa o seletor de documentos do Android (sem permissão ampla de armazenamento); compartilhar usa a folha nativa de compartilhamento, com convites para o endereço público do site. Os convites recebidos ainda abrem o site, não há links Android verificados nesta versão.

Compatibilidade: Android 8.0 ou superior, com Android System WebView/Chrome atualizado (versão 111 ou superior). Componentes antigos recebem uma orientação de atualização antes de abrir os jogos.

## Compilar
JDK 17, Gradle 8.11.1 e Android SDK 35 / Build Tools 35.0.0.

1. Na raiz do repositório: `node _projetos/opc-android/prepare.cjs`.
2. Na pasta deste projeto: `gradle assembleDebug`.
3. APK: `app/build/outputs/apk/debug/app-debug.apk`.

O workflow `Construir OPC Android` gera o APK de teste e executa testes em emulador. Ele não publica na Play Store. O Android precisa permitir instalação pelo navegador/gerenciador de arquivos escolhido para abrir o APK.

## Segurança
Conteúdo servido por HTTPS local com WebViewAssetLoader; acesso a file:// e content:// desativado; tráfego HTTP desativado; ponte nativa restrita à origem local e quadro principal. Navegações externas abrem no navegador com confirmação. Somente permissão INTERNET. Sem chaves de serviço Supabase. A chave pública já usada no site mantém as mesmas regras do servidor.

## Limitações desta primeira versão
APK de desenvolvimento assinado para testes; não é uma versão assinada para loja. O certificado de desenvolvimento pode mudar entre compilações de CI, exigindo desinstalação para trocar de APK (o que apaga dados locais). Antes de distribuir atualizações regulares, criar e guardar uma chave de assinatura definitiva. Não desinstalar uma versão com progresso importante sem avaliar essa limitação.

Os downloads PNG do FutDraw e dos cards da Forja passam pelo seletor de arquivos do Android. Fotos remotas podem ficar indisponíveis sem conexão; o motor e os nomes continuam locais. Não alterar o banco do site ao testar.

Tipografia Inter e Barlow Condensed incluída sob SIL OFL 1.1, com fontes e licenças originais. Assim, os jogos mantêm a tipografia mesmo sem internet.


## Versão oficial 0.2

A versão oficial usa applicationId br.com.opesodacamisa.jogos.oficial e pode coexistir com o teste 0.1.0, preservando seus dados. Novas atualizações oficiais precisam da mesma chave privada permanente, guardada apenas no computador do proprietário, fora do repositório. Não usar a chave temporária gerada pelo CI. A compilação release gera APK não assinado; a assinatura e a verificação devem ocorrer localmente antes de publicar. Nunca disponibilizar keystore ou senha como artefato público.

O arquivo app-release.json descreve a versão publicada. O aviso apenas leva à página oficial para atualização manual, sem permissões de instalação nem download automático.
