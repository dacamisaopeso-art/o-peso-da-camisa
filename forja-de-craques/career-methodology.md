# Forja de Craques — motor de carreira OPC v2

Jogo original de entretenimento. As identidades dos 512 atletas vêm do banco histórico OPC e suas fontes individuais estão em athletes-sources.json. Atributos, força dos clubes, probabilidades, transferências, títulos e resultados são estimativas de jogo, não estatísticas oficiais ou previsões de temporadas reais. O universo começa em 2026 e permanece fictício: não reproduz mudanças futuras de divisão, elencos ou regulamentos.

O overall inicial usa pesos diferentes nas nove posições. A carreira começa aos 16 anos, cresce até 25, mantém o auge até 30 e declina progressivamente depois. Aposentadoria: 35–40 anos, com até dois anos adicionais para goleiros. O desenvolvimento aplica a mesma curva à ficha inicial; não existe treinamento manual.

Partidas consideram overall, disputa por vaga, idade e variação de disponibilidade. Gols e assistências usam posição, finalização, passe e força da liga. Goleiros têm gols zerados e jogos sem sofrer gols. Limites: 60 jogos, 55 gols e 30 assistências por temporada. Temporadas nacionais e copas são resumidas; as finais têm acontecimentos, gols, resultado e eventual disputa de pênaltis revelados progressivamente.

O catálogo de transferências contém 55 clubes em 11 ligas, incluindo destinos europeus, sul-americanos, norte-americanos e asiáticos. As propostas começam após quatro temporadas, respeitam intervalos, overall, desempenho recente e reputação acumulada. Na fase final há alternativas fora da Europa e possibilidade de retornar ao clube de origem. Nenhuma transferência acontece sem aceitar uma proposta.

Competições disponíveis por continente: liga, copa nacional, Champions League ou Europa League, Libertadores ou Sul-Americana, Concachampions, Liga dos Campeões da Ásia. Copa do Mundo em ciclos de quatro anos, apenas para jogadores adultos de alto overall. Classificação e acesso continental são abstrações do motor, não reprodução integral dos torneios reais.

Bola de Ouro exige overall alto e temporada excepcional. Chuteira de Ouro exige gols; Luva de Ouro exige jogos sem sofrer gols. Os concorrentes são personagens fictícios de cada temporada futura, identificados na cerimônia. Nenhum prêmio é automático. Títulos importantes e Bolas de Ouro valem mais no legado; os patamares superiores exigem também quantidade mínima de Bolas de Ouro. O FENÔMENO exige 9.000 pontos, sete Bolas, duas Copas do Mundo e auge de pelo menos 96.

O gerador FNV/Mulberry32 é determinístico. Fast e Completa só mudam o tempo de apresentação. A mesma seed, configuração, escolhas de atributos e decisões de transferência reproduzem os resultados. O link de carreira guarda atributos e decisões no fragmento do endereço, e a importação reconstrói e verifica os resultados. Rankings geral, semanal (últimos sete dias), por posição, ritmo e dificuldade são locais ao navegador. Não existe ranking global nem backend.

Emblemas dos clubes são símbolos originais tipográficos OPC, sem escudos oficiais, fotografias ou arte do jogo de referência. Compartilhamento exporta uma imagem PNG original e um link reproduzível. Armazenamento usa localStorage; navegação privada ou limpeza do navegador pode apagar o histórico.
