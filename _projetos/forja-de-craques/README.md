# Forja de Craques — OPC

Jogo original em React, TypeScript, Tailwind CSS e Framer Motion. Preto/dourado, oito giros, nove posições, modos Amador/Pro e Fast/Completa, 512 atletas reais, overall ponderado e carreira completa até a aposentadoria.

## Etapas 3 a 6

- Card final e botão para iniciar aos 16 anos.
- Temporadas com curva de crescimento, auge e declínio; aposentadoria variável; overall, partidas, gols, assistências, nota, classificação e jogos sem sofrer gols para goleiros.
- Mercado com 55 clubes, propostas espaçadas, permanência, destinos alternativos e retorno ao clube de origem.
- Ligas e copas nacionais; Champions/Europa League, Libertadores/Sul-Americana, Concachampions, torneio asiático e Copa do Mundo.
- Finais com acontecimentos, cronômetro, placar progressivo, pênaltis e celebração; premiações com candidatos e suspense. Os concorrentes das temporadas futuras são fictícios e identificados na interface.
- Aposentadoria com totais, ficha, origens, clubes, linha do tempo e onze níveis de legado. Patamares superiores exigem Bolas de Ouro. O FENÔMENO exige sete Bolas, duas Copas, auge 96 e 9.000 pontos.
- Ranking local Top 10 geral, últimos sete dias, posição, ritmo e dificuldade. PNG para compartilhar, link reproduzível, repetir seed e jogar novamente.

Fast e Completa usam exatamente o mesmo motor. Avanço automático pausa em propostas, finais e premiações. O modo rápido busca aproximadamente 60–120 segundos conforme escolhas e eventos.

## Dados e limites

Identidades reais e fontes individuais: `public/athletes-sources.json`. Notas e forças de clubes são estimativas de entretenimento. Temporadas e resultados são fictícios; não reproduzem mudanças futuras de divisões, elencos, regulamentos ou calendários. Competições são resumidas, com finais progressivas. Emblemas são tipográficos originais, sem escudos oficiais. Não há backend nem ranking global. Regras: `public/career-methodology.md`.

LocalStorage guarda montagem, última carreira e até 100 resultados. A importação reconstrói a ficha e resultados, sem confiar em estatísticas recebidas. Limpar o navegador apaga o histórico. Rankings locais não constituem competição autenticada.

## Execução

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
pnpm preview --port 5178
```

O lockfile fixa dependências. Apenas o pós-instalação de esbuild é autorizado. `dist/` tem caminhos relativos e é publicado em `forja-de-craques/`. Fontes preservadas em `_projetos/forja-de-craques/`, fora da publicação Jekyll.

Motor separado em `src/engine/draft.ts`, `src/engine/career.ts` e `src/engine/random.ts`. Compartilhamento verificado em `src/careerShare.ts`. Interface de carreira em `src/CareerGame.tsx`; configuração e sorteio em `src/App.tsx`.

Nove grupos de testes: dados, 1.000 seeds em ambos os modos, escolhas permanentes, pesos/replay, retomada/corrupção, carreira determinística, equivalência dos ritmos, 500 carreiras com limites de estatísticas/finais/aposentadoria e bloqueio de mercado. Amostra adicional de 2.000 montagens fortes usada para revisar raridade dos prêmios. Revisão no navegador inclui importação, mercado, eventos, aposentadoria, filtros, PNG, compartilhamento e telas móveis.

Os outros três jogos são preservados. Quem Sou Eu permanece arquivado em `_arquivo/quem-sou-eu/`.
