# Melhorias de continuidade e retorno

Checkpoint anterior: `ad29c827783b50b82fae4ed195b0c14785cc0083`.

- Salas: identidade anônima preservada quando a renovação falha; 401 permite renovar a credencial, sem repetir jogadas por erro de rede; retorno de aba/aplicativo consulta o estado atual. Consultas com falhas usam espera progressiva. A retomada não envia saída da mesma sala.
- Convites: FutDraw e Jogo da Velha compartilham link, código e orientação para quem usa APK. O convidado confirma seu apelido. O link abre o site; no APK, entra-se pelo código.
- Site: favoritos e retorno ao último jogo, armazenados somente no navegador. O filtro não remove nenhum dos oito jogos.
- Intruso do Dia: dez rodadas brasileiras, dificuldade normal, sem relógio. Dia definido por America/Sao_Paulo; seed inclui dia e versão do catálogo. Progresso validado pelo mesmo motor antes de retomar. Compartilhamento não inclui respostas. Não há ranking global nem validação competitiva de pontuações locais.
- Relatos: formulário local com contexto público da questão. A pessoa copia e envia ao Instagram oficial. Nenhuma mensagem é enviada automaticamente e não há backend de relatos inventado.
- Android: pacote oficial separado do APK de teste inicial, para manter o aplicativo antigo e seus dados intactos. Nova identidade de instalação `br.com.opesodacamisa.jogos.oficial`. Assinatura de produção feita localmente; nenhuma chave privada deve ser publicada ou enviada à integração contínua. Versão pública e aviso de atualização usam app-release.json, sem baixar ou instalar automaticamente.

## Monetização

O usuário ainda não possui conta/link de recebimento. Não há cobrança, encurtadores, anúncios de teste apresentados como reais nem botão de apoio sem destino. A ativação de apoio, patrocínios ou anúncios depende de conta e configuração autorizadas. O APK continua sem SDK de publicidade.

## Limites

O servidor segue sendo a autoridade das salas. Após expiração, saída explícita ou encerramento pelo outro participante, a sala pode não ser retomável. O relógio das partidas online continua no servidor durante a ausência. Não existe sincronização de recordes locais entre site e APK.
