# Busca de jogadores — checkpoint de 12/10/2026

Checkpoint anterior: `a201b204d9a422334da98f41c4ce057a6b4c6439`. Nome de restauração: **antes-busca-jogadores-2026-10-12**. Reverter somente os arquivos desta melhoria quando solicitado, preservando trabalhos posteriores.

A busca prioriza nome exato, alternativa exata, começo do nome e palavras completas, antes de correspondências internas. O limite de 30 sugestões é aplicado depois da ordenação. Liga, nomes já usados, identificadores e validação das jogadas permanecem iguais. Idades e posições continuam distinguindo homônimos; os nomes exibidos não mudam.

10.399 atletas possuem alternativas de nome. Os nomes completos do catálogo complementar Transfermarkt são vinculados somente quando o identificador da ficha e a data de nascimento coincidem com a identidade já cadastrada. Cada registro em `velha-busca-nomes.js` conserva sua fonte. A cobertura é parcial; não acrescenta jogadores nem novos fatos esportivos.

Apelidos são acrescentados manualmente, com fontes explícitas; não há associação automática com termos como bruxo ou ET:

- Fred Guedes / Frederico Chaves Guedes: [ídolos do Fluminense](https://www.fluminense.com.br/sobre/idolos) e [comunicado do clube](https://www.fluminense.com.br/noticia/nota-oficial-fred-guedes-se-despede-do-fluminense).
- Rodri Hernández / Rodrigo Hernández Cascante: [Manchester City](https://www.mancity.com/news/first-team/first-team-news/2019/july/manchester-city-rodrigo-12-facts-need-to-know).
- R9 / Ronaldo Fenômeno / Ronaldo Nazário: [Nike](https://about.nike.com/en-GB/magazine/r9-on-becoming-your-heroes).
- CR7 / Cristiano Ronaldo dos Santos Aveiro: [site oficial do atleta](https://www.cristianoronaldo.com/latest) e [Real Madrid](https://www.realmadrid.com/en-US/the-club/history/football-legends/cristiano-ronaldo-dos-santos-aveiro/).

Testes: `node tests/velha-busca.test.cjs`. Incluem correspondência exata antes de substrings, sobrenomes, códigos, acentos, restrições por modo e exclusão de nomes utilizados. O arquivo de alternativas serve apenas para a pesquisa local, inclusive nas partidas online; não altera o serviço de validação.
