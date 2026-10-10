# Seleções das Copas de 1950 a 2026

`selecoes-copas.js` contém 493 combinações de seleção/edição e 11.307 inscrições de jogadores, nas 20 Copas masculinas de 1950 a 2026. Um mesmo jogador pode ter participado de várias edições; o quarto elemento de cada registro é seu identificador FIFA, usado para impedir que seja escalado duas vezes no mesmo time.

## Fonte dos elencos

- Coleta de Matt Stiles: https://github.com/stiles/world-cup
- Revisão utilizada: `2f03bbdc443bdc923cc1ed02eafb7be6c017e1b3`.
- Arquivos de entrada: `data/processed/<ano>/teams.csv` e `players.csv`.
- Origem declarada: API pública da FIFA, endpoints `competitions/teams/{season}` e `teams/{idTeam}/squad`.
- Licença da coleta: MIT; aviso integral em `licenca-base-copas.txt`.
- Confirmação oficial dos 48 elencos de 2026: https://ipt.fifa.com/organisation/media-releases/world-cup-2026-48-squads-confirmed

Os nomes das seleções foram traduzidos para português. As posições oficiais foram convertidas nos grupos do jogo: Goalkeeper → GOL, Defender → DEF, Midfielder → MEI e Striker → ATA. Foram preservadas as notas e funções dos 625 registros que já existiam no jogo, reconciliando variações de grafia. Os identificadores FIFA impedem duplicatas entre edições, mesmo quando o nome é escrito de forma diferente. Os novos registros usam as estimativas padrão já empregadas pelo jogo: GOL/ATA 85, DEF 83 e MEI 84. As notas não são avaliações oficiais da FIFA. A grafia incorreta “Jorge Olarticoechea” foi corrigida para “Julio Olarticoechea”.

Validação da base: `node tests/selecoes-copas.test.cjs`.

## Bandeiras

As bandeiras atuais continuam vindo do FlagCDN. As seleções extintas usam arquivos locais em `imagens/bandeiras/`:

- União Soviética: https://commons.wikimedia.org/wiki/File:Flag_of_the_Soviet_Union.svg (domínio público).
- Alemanha Oriental: https://commons.wikimedia.org/wiki/File:Flag_of_East_Germany.svg (domínio público).
- Iugoslávia até 1990: https://commons.wikimedia.org/wiki/File:Flag_of_Yugoslavia_(1946-1992).svg (domínio público).
- Zaire: https://commons.wikimedia.org/wiki/File:Flag_of_Zaire_(1971%E2%80%931997).svg (Moyogo; domínio público).
- Iugoslávia em 1998 e Sérvia e Montenegro em 2006: tricolor azul/branco/vermelho sem estrela, reproduzida em SVG.
- Tchecoslováquia: a mesma bandeira utilizada atualmente pela Tchéquia.

## Cobertura por edição

| Edição | Seleções | Registros de jogadores |
| --- | ---: | ---: |
| 1950 | 13 | 270 |
| 1954 | 16 | 350 |
| 1958 | 16 | 351 |
| 1962 | 16 | 352 |
| 1966 | 16 | 352 |
| 1970 | 16 | 349 |
| 1974 | 16 | 352 |
| 1978 | 16 | 352 |
| 1982 | 24 | 526 |
| 1986 | 24 | 528 |
| 1990 | 24 | 530 |
| 1994 | 24 | 528 |
| 1998 | 32 | 705 |
| 2002 | 32 | 736 |
| 2006 | 32 | 736 |
| 2010 | 32 | 736 |
| 2014 | 32 | 739 |
| 2018 | 32 | 736 |
| 2022 | 32 | 831 |
| 2026 | 48 | 1.248 |
