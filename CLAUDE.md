# Projeto
- Este repositório implementa o **protótipo do MVP Pequenas Compras do SESI** (Base-b).
- Stack: Vite, React, TypeScript, TanStack Router/Table/Query, Tailwind e shadcn/ui.
- O **shadcn-admin existente é a base estrutural**. Reutilize antes de criar.
- Prototipação **design-first (mock-only)**: sem backend, sem SAP/RPA real, sem autenticação definitiva.

# Produto
- Interface e conteúdo em **português**; nomes técnicos, tipos e arquivos em **inglês** consistente.
- Precedência em conflito: PRD funcional → decisão confirmada do SESI → critérios das User Stories → PRD Design → recomendações pendentes → benchmarking.
- Decisões `DEC-01`..`DEC-12` são **hipóteses**; nunca apresentá-las como regra aprovada.
- Documentos de produto em `docs/` (PRD, PRD Design, decisões pendentes, user stories, guia).

# Código
- Inspecione `components.json` e `src/components` antes de adicionar componentes. **Nunca `--overwrite`.**
- **Não sobrescreva** os componentes customizados (RTL/Modified): `sidebar, sheet, dialog, alert-dialog, command, select, dropdown-menu, calendar, table, switch, scroll-area, sonner, separator`.
- Regras de negócio **fora** dos componentes visuais; **schemas Zod + mocks tipados**.
- Integrações por **adaptadores/stubs** simulando 4 estados: sucesso, processamento, erro corrigível, erro que exige intervenção.
- **Sem aprovação, rejeição ou exclusão em massa.** Domínio em `src/features/purchase-requests` (substitui `tasks`).

# Verificação
- Após cada fluxo: **`pnpm build` (typecheck) + `pnpm lint`**.
- Verifique desktop, tablet, mobile e **320px**; teclado, foco, labels e contraste; tema claro/escuro.
- **Testes automatizados (Vitest/Playwright) ficam para o front-end dev.**
- **Não commitar/push sem autorização.**
