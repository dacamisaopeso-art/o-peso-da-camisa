# OPC Jogos Oficial — Android

Aplicativo com nove jogos do O Peso da Camisa, interface móvel própria e bases locais. `prepare.cjs` copia os motores e dados sem alterar as páginas do site. A versão instalada é definida em `app/build.gradle`; a versão distribuída está em `app-release.json` no portal.

## Identidade de atualização

- Nome: OPC Jogos Oficial.
- Pacote: `br.com.opesodacamisa.jogos.oficial`.
- Certificado SHA-256: `82e768255953f1c5b0549690bc374671a3e80a70674179841c8d5b23ab2262dc`.
- Toda atualização oficial precisa do mesmo pacote, certificado e versionCode maior. Nunca publicar APK de teste como atualização oficial. A chave permanente e a senha ficam fora do repositório e dos artefatos de CI.

## Uso e limites

Os nove jogos e as bases estão no pacote. Solo, bots, local e treino funcionam sem internet; salas do Jogo da Velha, FutDraw e DrafTeam precisam de conexão e usam o mesmo serviço do site. Favoritos e progresso são locais, com exportação/importação seletiva de backup sem credenciais. Desinstalar apaga dados locais: atualize a edição oficial sem desinstalar.

PNG e backups usam o seletor de documentos do Android, sem permissão ampla de armazenamento. Convites usam endereços públicos do site e compartilhamento nativo. Ainda não há links Android verificados. Imagens externas e fontes exigem conexão. Nenhum anúncio ou rastreador é incluído no aplicativo.

## Compilar e verificar

Android 8+ e WebView/Chrome 111+. JDK 17, Gradle 8.11.1 e SDK/Build Tools 35.

1. `node _projetos/opc-android/app.test.cjs` prepara e confere o pacote.
2. Na pasta deste projeto, `gradle assembleDebug assembleDebugAndroidTest assembleRelease lintDebug lintRelease`.
3. O workflow Android executa testes de jogos, acessibilidade, exportação e navegação no emulador. O release de CI sai sem assinatura e deve ser assinado localmente com a identidade oficial.
4. Antes da distribuição, verificar certificado, integridade, atualização da edição anterior sem duplicar o app e preservação de favoritos. APK de desenvolvimento é somente para testes.

## Segurança e direitos

WebViewAssetLoader HTTPS local; acesso a file/content e acesso universal de arquivos desativados; HTTP misto bloqueado; Safe Browsing ativo; depuração somente em builds de teste. Ponte nativa aceita apenas o quadro principal da origem local. Navegações externas exigem confirmação e abrem o navegador. Apenas INTERNET é solicitada. Não há chave Supabase de serviço no pacote.

Inter e Barlow Condensed são incluídas sob SIL OFL 1.1 com suas licenças. As imagens e identificações originais mantêm os créditos do portal. Esta proteção técnica não é garantia jurídica integral: fotografias, nomes, símbolos e marcas têm condições próprias.

## Revisão 0.7

Textos maiores na central, favoritos preservando foco, controles de cor com 44 px, diálogos identificados para leitores de tela, DrafTeam nomeado na barra e saída pela central executando a saída da sala. Mesma identidade visual e mesmos motores/bases da 0.6.
