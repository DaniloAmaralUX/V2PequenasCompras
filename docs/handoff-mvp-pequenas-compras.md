# Handoff — Protótipo MVP Pequenas Compras (SESI)

> Protótipo navegável de alta fidelidade, **design-first / mock-only**, construído sobre o template **shadcn-admin**. Entrega de UX/UI + front para o desenvolvedor front-end dar continuidade. **Sem backend, sem SAP/RPA/Base-b reais.**

Branch: `prototype/ux-pequenas-compras` · Stack: Vite + React 19 + TypeScript + TanStack Router/Table/Query + Tailwind v4 + shadcn/ui + RHF/Zod + Zustand + recharts + Sonner.

---

## 1. Como rodar

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # tsc -b + vite build (typecheck + build de produção)
pnpm lint     # eslint (0 erros / 0 warnings esperado)
```

Gotchas do ambiente (registrados no `CLAUDE.md`):
- **pnpm 11** exige `allowBuilds` (esbuild/@clerk) em `pnpm-workspace.yaml`.
- Ao **adicionar rotas**, rode `pnpm build` (ou `pnpm exec vite build`) para **regenerar `src/routeTree.gen.ts`** antes do typecheck.
- **Rota não aninhada:** `solicitacoes/$id_.corrigir.tsx` usa o sufixo `_` para NÃO virar filha de `$id` (o detalhe não tem `<Outlet/>`). A URL pública continua `/solicitacoes/$id/corrigir`.

---

## 2. Telas entregues (13/13 fluxos obrigatórios do PRD Design §34)

| Tela | Rota | Componente | US / RN / CT |
|---|---|---|---|
| Visão geral por perfil | `/` | `features/dashboard` | US-026/027 |
| Lista de solicitações | `/solicitacoes` | `features/purchase-requests` | US-001; RN-01..14; CT-02..11 |
| Nova solicitação (5 etapas) | `/solicitacoes/nova` | `…/components/new-request-form` | US-002..016; CT-02,04..09,11 |
| Detalhe (6 abas) | `/solicitacoes/$id` | `…/components/request-detail` | US-008,018..024; CT-01,03,10 |
| Correção e reenvio | `/solicitacoes/$id/corrigir` | `…/components/correction-form` | US-023; RN-14; CT-12 |
| Aprovações | `/aprovacoes` | `features/approvals` | US-017..019; RN-13; CT-01 |
| Integração SAP (aba) | `/solicitacoes/$id?tab=sap` | dentro do detalhe | US-020..022; CT-01,10 |
| Auditoria | `/auditoria` | `features/audit` | US-024/025 |
| Indicadores / BI | `/indicadores` | `features/analytics` | US-026/027; RF-22 |
| Administração — Regras | `/administracao/regras` | `features/admin/rules` | US-028; RF-23 |
| Administração — Integrações | `/administracao/integracoes` | `features/admin/integrations` | RNF-07/08 |

**Slice vertical do caminho feliz** funciona ponta a ponta: Nova solicitação elegível → Aprovação → fila SAP simulada → Pedido criado. As 9 exceções críticas (acima do limite, fornecedor bloqueado/não homologado, item de estoque, contrato vigente, possível fracionamento, fora do menor preço, ausência de evidência, erro SAP, correção) estão representadas na UI.

---

## 3. Perfis (personas) e como testar

6 perfis mockados, trocáveis pelo **RoleSwitcher** no topo da sidebar (cookie `mock_role`):
`requisitante · gestor · comprador · compliance · gestao · ti`.

O gating é **no dado e na ação**, não só ocultando UI. A navegação muda por perfil (`filterNavByRole` em `components/layout/data/sidebar-data.ts`). Ex.: Aprovações aparece para gestor/comprador; Administração para comprador/compliance/ti; Integrações só para ti.

> ⚠️ **Hipótese — a confirmar com o SESI (DEC-09/DEC-12):** os 6 perfis, suas permissões, retenção e exportação são **suposições do protótipo**, não requisitos confirmados.

---

## 4. Arquitetura

```
src/features/
  dashboard/         Visão geral por perfil (KPIs + prioridade)
  purchase-requests/ Núcleo do domínio
    schemas/         Zod = fonte única de tipos e validação
    data/            mocks tipados, status meta, derive (validações/timeline/SAP), use-requests
    lib/             format (BRL/datas), pendencies (resolução F-05)
    stores/          request-overrides-store (decisões do protótipo)
    components/      tabela, detalhe, nova solicitação, correção, badges, stepper, uploader, combobox
  approvals/  audit/  analytics/  admin/
  settings/  auth/  errors/        (do template, reutilizados/adaptados)
src/components/layout/
  page-transition.tsx  (motion: fade de entrada por rota)
  data/sidebar-data.ts (navegação SESI + gating por perfil)
src/stores/mock-role-store.ts  (perfil ativo)
src/config/roles.ts            (perfis + labels)
```

**Estado mock (sem backend):** Zustand com `persist` em `sessionStorage`:
- `request-overrides-store` — `approve`/`reject`/`resubmit` sobrepõem o status sobre os mocks; `use-requests` mescla mock + override. Sobrevive a reload, zera ao fechar a aba.
- `rules-store` (admin) — valores das regras + histórico de alterações.

**Integrações como adaptadores/stubs** (`features/admin/data/integrations.ts`): simulam os 4 estados (sucesso · processamento · erro corrigível · erro que exige intervenção). A fronteira existe; a implementação real fica para o dev.

---

## 5. Design system / Motion (Emil Kowalski + make-interfaces-feel-better)

Aplicado a **todas** as telas. Contrato no `CLAUDE.md` (seção Motion). Resumo:
- Tokens de motion (`--motion-fast/base/slow`, `--ease-out/in/inout/drawer`) em `src/styles/index.css`.
- `active:scale-[0.97]` embutido em `button.tsx` (feedback tátil — não replicar).
- `.stagger-list` em listas; `<PageTransition>` em toda rota; fade entre abas.
- Easing correto (entrada `ease-out`, saída `ease-in`); `@media (prefers-reduced-motion: reduce)` global.

---

## 6. Decisões pendentes (DEC-01..12) — **hipóteses, nunca requisitos**

Todas aparecem rotuladas **"Hipótese — a confirmar com o SESI"** na UI. Ver `docs/decisoes-pendentes-mvp-pequenas-compras-sesi.md`.

| DEC | Onde aparece |
|---|---|
| 01 item de estoque · 02 contrato vigente · 03/04 fracionamento · 05/06 não homologado | Nova solicitação / Detalhe |
| 07 motivo de rejeição | Aprovações (RejectionDialog) |
| 08 frequência/erro SAP | aba Integração SAP |
| 09 perfis/retenção/exportação | Auditoria |
| 10/11 indicadores/metas do BI | Indicadores |
| 12 parâmetros/perfis de regras | Administração — Regras |

---

## 7. Limitações conhecidas (escopo de protótipo)

- **Mock-only:** nenhum dado persiste em servidor; "upload" de evidência é visual (barra de progresso simulada).
- Persistência só em `sessionStorage` (zera ao fechar a aba).
- `evaluateCompliance`/validações são **stubs** derivados do `status`/`blockReason` do mock (`data/derive.ts`), não um motor de regras real.
- Autenticação é a do template (não definitiva).
- Conteúdo (nomes, valores, fornecedores) é ilustrativo em PT-BR.

---

## 8. Tarefas para o front-end dev

1. **Testes automatizados** (não escritos pelo designer): cobrir `CT-01..CT-12` com Vitest/Playwright — por papel, label, texto, e os comportamentos de bloqueio (motivo + próxima ação). Os critérios estão em `docs/user-stories-…` e `docs/prd-design-…`.
2. **Integração real:** substituir os stubs em `features/*/data` e `features/admin/data/integrations.ts` por adaptadores reais (Base-b, SAP, fornecedores, contratos, estoque, BI), mantendo a fronteira de serviço.
3. **Backend/persistência:** trocar `use-requests` + stores Zustand por chamadas de API (TanStack Query já está disponível).
4. **Motor de regras:** implementar `RN-01..14` de verdade fora dos componentes visuais (os schemas Zod já são a fonte de tipos).
5. **Autenticação definitiva** conforme decisão técnica do SESI.

---

## 9. Verificação realizada (Definition of Done)

- ✅ `pnpm build` (typecheck) + `pnpm lint` sem erros/warnings em cada incremento.
- ✅ Validação visual desktop + mobile **320px** (layouts em coluna única, sem overflow; validação inline).
- ✅ Acessibilidade: foco visível, `aria-label` em botões-ícone e inputs sem label textual, gráficos com `role=img`/equivalente em tabela, status com **ícone+texto** (nunca só cor), `prefers-reduced-motion`.
- ✅ Fidelidade ao produto: decisões pendentes como hipóteses; status separado do resultado de validação; mensagens com motivo + próxima ação; histórico preservado na correção (CT-12).

Histórico de construção: ver `git log` da branch (14 commits, do baseline ao Inc.13).
