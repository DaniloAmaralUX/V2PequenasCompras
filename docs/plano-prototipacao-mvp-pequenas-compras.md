# Plano de Prototipação — MVP Pequenas Compras (SESI)

> **Revisado para alinhamento com `guia-prototipacao-claude-code-shadcn-sesi.md`** (documento operacional mestre). Onde o guia define processo, este plano o segue.

## Contexto

O SESI precisa validar, via protótipo navegável de alta fidelidade, o fluxo de **Pequenas Compras no Base-b** antes de comprometer integração real (SAP/Base-b/RPA). Construção **por incrementos verificáveis**, preservando a arquitetura e os componentes do **shadcn-admin** — que é a **base estrutural** do produto, não apenas referência visual (Guia §1).

## Precedência (Guia §5)

**Ordem de carregamento dos documentos:** 1) `CLAUDE.md` · 2) PRD funcional · 3) PRD Design · 4) Decisões pendentes · 5) User Stories · 6) PDFs originais · 7) PNG do processo.

**Precedência em caso de conflito:** 1) PRD funcional aprovado · 2) decisão confirmada pelo SESI · 3) **critérios de aceite das User Stories** · 4) PRD Design · 5) recomendações pendentes (hipóteses) · 6) benchmarking (referência, nunca regra automática).

> Regra transversal: `DEC-01`..`DEC-12` aparecem **sempre como hipótese rotulada** "Hipótese — a confirmar com o SESI", nunca como requisito confirmado. Prototipação **mock-only**: sem backend/SAP/RPA reais.

## Repositório-alvo (confirmado)

**`DaniloAmaralUX/V2PequenasCompras`** — confirmado pelo usuário (guia prevalece sobre o URL `1base-sesi-pequenas-compras` citado na 1ª mensagem). A pasta atual auditada é o template shadcn-admin **sem `.git`**; a Etapa 0 clona o repo-alvo confirmado em pasta limpa.

## Calibração do escopo (decidida com o usuário)

O usuário é **UX/UI Designer** e entrega **design + front (protótipo navegável em código)** para handoff a um front-end developer. Sem backend, sem integração real. Duas decisões calibram a profundidade técnica:

1. **Design-first enxuto:** foco em UX/UI, fidelidade e reuso. **Zod + mocks mínimos** (só o necessário para as telas funcionarem); `evaluateCompliance()` e os **adaptadores de integração ficam como stubs simples** (entradas mockadas → resultado), não implementações completas.
2. **Testes para o dev:** o designer **não escreve testes automatizados** (Vitest/Playwright). Sua verificação é **`pnpm build` + `pnpm lint` + screenshots responsivas + acessibilidade**. Os testes ficam registrados no handoff como tarefa do front-end dev (critérios `CT-01..12` documentados como guia para ele).

Essas calibrações reduzem o "peso de dev" sem quebrar o alinhamento ao guia — mantêm código limpo, regra de negócio fora dos componentes visuais e máximo reaproveitamento.

---

## Etapa 0 — Preparação do repositório (Guia §3 e §4)

1. **Clonar e ramificar** (Guia §3.1):
   ```bash
   git clone https://github.com/DaniloAmaralUX/V2PequenasCompras.git
   cd V2PequenasCompras
   git checkout -b prototype/ux-pequenas-compras
   pnpm install
   pnpm build
   ```
   **Gate:** não prosseguir se o build inicial falhar; registrar antes se a falha já existia.
2. **Inspecionar config shadcn** (Guia §3.2): `pnpm dlx shadcn@latest info` + leitura de package.json, components.json, Vite, TS, CSS/tokens, rotas TanStack, `src/components`, `src/components/ui`, `src/features`, e Tasks/Dashboard/Sidebar/Data Table. *(Já coberto pela auditoria PROMPT ZERO — reaproveitar.)* Não rodar `init` novamente.
3. **Criar `CLAUDE.md` curto** (Guia §4) — regras permanentes (Projeto/Produto/Código/Verificação) conforme modelo do guia; **não** copiar o PRD para dentro dele.
4. **Aplicar somente tema e fonte** (Guia §3.3), em branch limpa, revisando o diff a cada passo:
   ```bash
   pnpm dlx shadcn@latest apply --preset b5dyXAABk --only theme
   pnpm dlx shadcn@latest apply --preset b5dyXAABk --only font
   git status && git diff && pnpm build   # revisar antes de seguir
   ```
5. **Adicionar componentes com segurança** (Guia §3.4) — confirmar ausência e revisar prévia **antes** de instalar; nunca `--overwrite` por padrão:
   ```bash
   pnpm dlx shadcn@latest docs progress
   pnpm dlx shadcn@latest add progress --dry-run
   pnpm dlx shadcn@latest add progress --diff
   pnpm dlx shadcn@latest add progress          # só após revisar
   ```
   `progress` é o **único** primitivo ausente necessário (barra de upload de evidência). Demais necessidades = composição de componentes existentes.

---

## Princípios de reutilização (Guia §2)

- **Reutilizar direto:** app shell autenticado, sidebar responsiva, header fixo, busca global + command menu, Data Table (ordenação/filtros/paginação/seleção de colunas), dialogs + confirm dialogs, sheets (filtros mobile/consulta), tabs, alerts/badges/tooltips, forms RHF+Zod, tema claro/escuro, skeletons + Sonner, páginas de erro, padrões de settings.
- **Adaptar:** `Tasks`→`Solicitações`; dashboard→indicadores de pequenas compras; `Apps`→base de integrações; settings→parâmetros autorizados; filtros/dados/schemas/rotas/textos/ações refletem regras do SESI.
- **Não reutilizar sem revisão:** exclusão em massa, aprovação/rejeição em massa, formulários extensos em drawer, cards promocionais, textos/mocks genéricos do template, páginas que não atendem uma User Story, autenticação do template como decisão definitiva.
- **Nunca** passar ao CLId (com/sem `--overwrite`) os customizados: `sidebar, sheet, dialog, alert-dialog, command, select, dropdown-menu, calendar, table, switch` (RTL) e `scroll-area, sonner, separator` (Modified).

## Arquitetura de pastas (PRD Design §37)

```text
src/features/
  purchase-requests/  components | data | schemas | hooks | services | index.tsx
  approvals/  audit/  analytics/  rules/  integrations/
```
Rotas (UI em PT; aba do detalhe via search param `?tab=` para evitar abas-dentro-de-abas):
`/` · `/solicitacoes` · `/solicitacoes/nova` · `/solicitacoes/$id` · `/solicitacoes/$id/corrigir` · `/aprovacoes` · `/auditoria` · `/indicadores` · `/administracao/regras` · `/administracao/integracoes`.

---

## Fundação compartilhada (Guia §8, incremento 3 — "Domínio") — versão enxuta

> Calibrada como **design-first enxuto**: o mínimo de tipagem/lógica para as telas funcionarem com realismo; o restante fica anotado/scaffold para o front-end dev.

### Schemas Zod + tipos (fonte única — EN-001)
`PurchaseRequest, Item, Supplier, Quote, Evidence, ComplianceCheck, Approval, AuditEvent, SapAttempt, Rule` (campos detalhados na seção de cada fluxo). Schemas Zod são fonte de tipos inferidos, validação de formulário e validação de search params.

### Modelo de status (PRD Design §8 — union discriminada)
`draft·needs_correction·redirected·blocked·awaiting_approval·rejected·approved·queued_for_sap·processing_sap·integration_error·completed` → mapa central `status → {label, variant, className, icon, ownerArea}` (badge com texto+ícone, nunca só cor).

### Mocks tipados (Guia §4/§9; handoff §363-368)
faker com seed fixa, **tipados pelos schemas**, **sem dados genéricos do template**, dirigidos a `CT-01..CT-12`. **Catálogo central de mensagens** (problema + motivo + próxima ação) — vocabulário oficial PRD Design §25 (sem "ticket/payload/endpoint/erro 500").

### Adaptadores de integração (Guia §12) — stubs simples
Integrações (Base-b, SAP, fornecedores, contratos, estoque, BI) **isoladas por adaptadores/serviços** (`features/*/services`), **sem acoplar componentes React** ao mecanismo final. No protótipo são **stubs simples** que retornam dados mockados e simulam **4 estados**: **sucesso · processamento · erro corrigível · erro que exige intervenção**. A fronteira existe (contrato), mas a implementação real fica para o dev.

### Permissões mockadas (PRD Design §6)
`useMockRole()` (switcher no header) pré-visualiza as 6 personas; gate **no dado e na ação**, não só ocultando UI. **Hipótese (DEC-09/DEC-12):** perfis/retenção/exportação definitivos.

### Componentes
- **Reutilizados:** ver Princípios acima + `use-table-url-state`, `confirm-dialog`, `features/errors/*`, recharts (`analytics-chart`).
- **1 via CLI:** `progress`.
- **7 customizados (sem CLI, em `features/*/components`):** `RequestStepper`, `EvidenceUploader`(+progress), `SupplierCombobox`(Command+Popover), `TimePicker`(Input[time]), `AuditTimeline`(ScrollArea+Separator+Collapsible+Badge), `RejectionDialog`(Dialog+RadioGroup+Textarea), `RequestDetailHeader`(Card+Badge+Button+Separator).
- **Mapa de status badge** estende `badge.tsx` via `className` (verde/âmbar) **sem alterar o arquivo**.

---

## Padrão mínimo por tela (Guia §9 — obrigatório em TODO fluxo)

Cada fluxo abaixo define: **persona+permissão · rota+forma de retorno · objetivo · ação primária única · ações secundárias · dados/origem dos mocks · loading/vazio/erro/sucesso · mobile · teclado · mensagem de bloqueio (motivo+próxima ação) · rastreabilidade (US/RN/CT)**. Telas operacionais priorizam leitura/comparação/ação — sem hero, cards aninhados ou decoração sem função.

---

## Fluxos do protótipo

### F-01 — Visão geral por papel · `/`
- **Persona/permissão:** todas (conteúdo por papel). **Retorno:** home (raiz).
- **Objetivo:** orientar a rotina do papel. **Ação primária única:** requisitante → "Nova solicitação"; comprador/gestor → "Ir para a fila". **Secundárias:** abrir KPI (drill-down), trocar período/visão.
- **US/RN/CT:** US-026, US-027 (leitura).
- **Reutiliza:** `features/dashboard/*`, `card`, `tabs`, `badge`, `analytics-chart`, `skeleton`.
- **Mocks/schemas:** agregados de `PurchaseRequest[]`.
- **Estados:** *loading* skeleton KPIs/listas; *vazio* "Nenhuma solicitação ainda" + atalho Nova; *erro* alert recuperável; *sucesso* KPIs+listas por papel (§19.1-19.3).
- **Mobile:** coluna única, gráfico com resumo textual. **Teclado:** KPIs são links tabuláveis; Enter abre a lista.
- **Verificação:** trocar papel muda KPIs; cada KPI abre `/solicitacoes` com filtro; sem hero/cards promocionais. **Hipótese (DEC-10/DEC-11):** ganho operacional/filtros do BI rotulados.

### F-02 — Lista de solicitações + filtros · `/solicitacoes`
- **Persona:** comprador/Suprimentos (primária); requisitante (escopo próprio); gestor. **Retorno:** filtros/página na URL; voltar do detalhe restaura.
- **Objetivo:** localizar e priorizar. **Ação primária única:** "Nova solicitação". **Secundárias:** filtrar, buscar (command-menu), abrir linha, ações de linha em menu.
- **US/RN/CT:** US-001 (entrada), US-026; conformidade RN-01..14 visível; CT-02..11 localizáveis.
- **Reutiliza:** `data-table/*`, `table`, `badge`, `dropdown-menu`, `use-table-url-state`, `sheet` (filtros mobile), `command-menu`, `skeleton`.
- **Mocks/schemas:** `PurchaseRequest[]` (fixtures CT + volume). Colunas: código, necessidade, requisitante, unidade, valor BRL, fornecedor, conformidade, status, tempo aguardando, data.
- **Estados:** *loading* linhas skeleton; *vazio 1º uso* "Crie a primeira solicitação"; *vazio sem resultado* "Nenhum resultado — ajustar filtros" + Limpar; *erro* alert recuperável; *sucesso* tabela paginada com total.
- **Mobile:** linha → lista resumida; filtros em `Sheet`; botão Nova persistente. **Teclado:** linhas navegáveis, Enter abre; atalho de busca.
- **Verificação:** filtros combináveis + contador + "Limpar" + URL (§29); paginação (não scroll infinito) com total; nenhuma ação crítica só no menu de contexto; linha inteira clicável.

### F-03 — Nova solicitação (stepper, página completa) ⭐ núcleo · `/solicitacoes/nova`
- **Persona:** requisitante (e autorizados). **Retorno:** aviso de saída com alterações não salvas → volta a `/solicitacoes`.
- **Objetivo:** criar solicitação válida. **Ação primária única:** "Continuar" (por etapa) → "Enviar para aprovação" (etapa 5). **Secundárias:** "Salvar rascunho", "Voltar".
- **US/RN/CT:** US-002..007, US-009..016; RN-01..12; CT-02, CT-04..09, CT-11. **Cobre 8 dos 13 fluxos obrigatórios.**
- **Reutiliza:** `form, input, textarea, select, label, collapsible, card, alert, confirm-dialog, sonner, separator, button`. **Customizados:** `RequestStepper`(5 etapas §12.1), `SupplierCombobox`, `EvidenceUploader`(+progress), `TimePicker`.
- **Mocks/schemas:** `PurchaseRequest(draft), Supplier, Quote, Evidence, Item, ComplianceCheck`; **stub puro** `evaluateCompliance()` (RN-01..12, lógica mínima a partir dos mocks) — fora dos componentes visuais.
- **Etapas:** 1 Enquadramento · 2 Necessidade · 3 Fornecedor e preços · 4 Evidências e conformidade · 5 Revisão e envio.
- **Estados:** *loading* skeleton em campos reaproveitados (US-002); *vazio* rascunho novo; *erro/bloqueio* inline por campo + banner de negócio persistente (sem "Tentar novamente" genérico); *sucesso* "Salvando/Salvo/Falha" + envio com confirmação.
- **Sub-comportamentos (= critérios):** acima do limite (CT-02/RN-01, **direcionamento, não erro**, preserva dados); fornecedor bloqueado (CT-03/RN-06); item de estoque (CT-04/RN-08 — **Hip. DEC-01**); contrato vigente (CT-05/RN-09 — **Hip. DEC-02**); possível fracionamento (CT-11/RN-10, linguagem "possível", **Hip. DEC-03/04**); sem homologado → exceção até 3 preços com evidência **vinculada à cotação** (CT-09/RN-07 — **Hip. DEC-05/06**); fora do menor preço (CT-08/RN-12); evidência+data/hora (US-014/015/RN-11).
- **Mobile:** uma coluna; stepper compacto com nome da etapa; botão principal persistente; touch ≥44px. **Teclado:** setas/Enter no stepper; foco no 1º campo com erro; aviso de saída acessível.
- **Verificação:** voltar não perde dados; rascunho automático com indicador; resumo de pendências antes do envio; BRL sem negativos + total comparado ao limite; **não** usar drawer (§22.3).

### F-04 — Detalhe (abas) · `/solicitacoes/$id?tab=…`
- **Persona:** conforme vínculo/permissão. **Retorno:** voltar à lista preservando filtros.
- **Objetivo:** compreender estado e agir. **Ação primária única:** depende do status/papel ("Corrigir pendências" | "Aprovar" | "Acompanhar"). **Secundárias:** trocar aba, abrir evidência/anexo.
- **US/RN/CT:** US-008, US-018..022, US-024 (visualização); CT-01, CT-03, CT-10.
- **Reutiliza:** `tabs`(URL+indicador de pendência), `card, badge, alert, dialog, separator, scroll-area`. **Customizados:** `RequestDetailHeader`, `AuditTimeline`(aba Histórico).
- **Mocks/schemas:** `PurchaseRequest` completa + `ComplianceCheck[]` + `Approval` + `SapAttempt[]` + `AuditEvent[]`.
- **Estados:** *loading* skeleton; *vazio* por aba ("Sem cotações"); *erro* alert por aba; *sucesso* dados + status com responsável visível.
- **Mobile:** abas em scroll horizontal; ações preservadas. **Teclado:** abas por setas; Esc fecha overlays e devolve foco.
- **Verificação:** aba reflete URL e mantém estado no reload; aba com pendência mostra indicador; status separado do resultado de validação; responsável sempre visível.

### F-05 — Correção e reenvio · `/solicitacoes/$id/corrigir`
- **Persona:** requisitante. **Retorno:** volta ao detalhe.
- **Objetivo:** resolver pendências. **Ação primária única:** "Reenviar". **Secundárias:** "Salvar", ir à pendência (âncora).
- **US/RN/CT:** US-023; RN-14; RNF-01/02; CT-12.
- **Reutiliza:** `form, alert`(resumo no topo+âncoras), `input/select/textarea, button, sonner`.
- **Mocks/schemas:** `PurchaseRequest(needs_correction)` + `ComplianceCheck[]`(fail) + `AuditEvent[]` preservados.
- **Estados:** *loading* skeleton; *erro* revalidação ainda falha → mantém pendências; *sucesso* revalida ok → retorna à etapa adequada + toast.
- **Mobile:** lista de pendências âncora + formulário em coluna. **Teclado:** âncoras focáveis; foco na 1ª pendência.
- **Verificação:** não apaga histórico (CT-12); ao salvar reexecuta todas as regras; diferencia "corrigir" × "aguardar análise" × "encerrada" (§17); registra usuário/data-hora/valor anterior→novo/origem.

### F-06 — Fila de aprovação + aprovar/rejeitar · `/aprovacoes`
- **Persona:** gestor aprovador (+ aprovadores adicionais). **Retorno:** volta à fila.
- **Objetivo:** decidir com segurança. **Ação primária única:** "Aprovar solicitação" (no detalhe). **Secundárias:** "Rejeitar solicitação", preview em `sheet`, filtrar.
- **US/RN/CT:** US-017, US-018, US-019; RN-13; CT-01.
- **Reutiliza:** `data-table/*, table, badge, sheet`(preview sem decisão), `dialog`(confirmação), `button`(disable em processamento), `card`(resumo). **Customizado:** `RejectionDialog`.
- **Mocks/schemas:** `PurchaseRequest[](awaiting_approval)` + `Approval`.
- **Estados:** *loading* skeleton; *vazio* "Nada aguardando sua decisão"; *erro* alert recuperável; *sucesso* aprovar→`approved`/fila SAP; rejeitar→`rejected` com motivo.
- **Mobile:** aprovação só com resumo+evidências legíveis. **Teclado:** Enter abre; dialog Esc; foco na confirmação.
- **Verificação:** **sem ações em massa** (§15.5); aprovação no detalhe com confirmação e ação desabilitada em processamento; ação principal não colada a secundárias. **Hip. DEC-07** (motivo de rejeição) e **DEC-06** (aprovação adicional p/ não homologado).

### F-07 — Integração SAP (estados + erro acionável) · `/solicitacoes/$id?tab=sap`
- **Persona:** requisitante (acompanha), comprador/TI (intervém). **Retorno:** aba dentro do detalhe.
- **Objetivo:** acompanhar a integração. **Ação primária única:** depende — "Acompanhar" | "Solicitar reprocessamento" (quando permitido) | "Corrigir". **Secundárias:** ver tentativas, abrir pedido.
- **US/RN/CT:** US-020, US-021, US-022; RN-13/14; RNF-05/06; CT-01, CT-10.
- **Reutiliza:** `card, badge, alert, button, table`. **Adaptador SAP mock** com 4 estados (§12).
- **Mocks/schemas:** `SapAttempt[]`(queued/processing/success/error+errorType), `sapOrderRef`.
- **Estados:** *processo longo* "Na fila/Registrando" com última atualização e próxima janela quando conhecida — **sem spinner contínuo longo**; *vazio* "Ainda não enviada"; *erro* classificado (dado/regra/técnico/indeterminado) com responsável; *sucesso* nº/ref do pedido + data-hora + histórico.
- **Mobile:** cards empilhados; usuário pode sair e status atualiza ao voltar. **Teclado:** mudança de status anunciada via `aria-live`.
- **Verificação:** mensagens **sem** stack/payload/endpoint/código; falha não marca concluído; erro de dado→F-05, técnico→TI. **Hip. DEC-08** (frequência rotulada, não SLA).

### F-08 — Auditoria · `/auditoria`
- **Persona:** Compliance/Auditoria (somente leitura). **Retorno:** filtros na URL.
- **Objetivo:** reconstruir o processo. **Ação primária única:** "Consultar" (aplicar filtros). **Secundárias:** expandir evento, abrir evidência/tentativa.
- **US/RN/CT:** US-024, US-025; RNF-01/02.
- **Reutiliza:** `data-table/toolbar`+`faceted-filter`, `scroll-area, collapsible, badge, separator`. **Customizado:** `AuditTimeline`.
- **Mocks/schemas:** `AuditEvent[]` (ator humano × "Sistema/Motor de regras/Integração SAP").
- **Estados:** *loading* skeleton; *vazio sem filtro* "Selecione filtros"; *vazio sem resultado* "Ajustar filtros"; *erro* alert; *sucesso* timeline cronológica com regra/resultado/valor anterior→novo.
- **Mobile:** filtros em `Sheet`; eventos colapsáveis. **Teclado:** collapsible por Enter/Espaço.
- **Verificação:** **somente leitura** (sem editar/excluir); eventos automáticos não como humano; vínculo evento↔evidência/tentativa. **Hip. DEC-09** (perfis/retenção/exportação rotulados; exportação fora do MVP por padrão).

### F-09 — Indicadores / BI · `/indicadores`
- **Persona:** gestão de Compras/Suprimentos. **Retorno:** filtros globais persistem ao detalhar.
- **Objetivo:** gerir operação. **Ação primária única:** abrir a lista que compõe o indicador (drill-down). **Secundárias:** filtrar período/dimensão, alternar visão.
- **US/RN/CT:** US-026, US-027; RF-22; RNF-08.
- **Reutiliza:** `features/dashboard/*, analytics-chart, card, tabs, table`(tabela acessível), `skeleton`.
- **Mocks/schemas:** agregados de `PurchaseRequest[]/SapAttempt[]/AuditEvent[]`.
- **Estados:** *loading* skeleton; *vazio* "Sem dados no período"; *erro* alert; *sucesso* KPIs+gráficos+drill-down.
- **Mobile:** gráfico com resumo textual + tabela; filtros em `Sheet`. **Teclado:** tabela equivalente do gráfico tabulável.
- **Verificação:** indicador abre lista e filtros persistem; gráfico com resumo+tabela; período/atualização visíveis; nenhum gráfico decorativo. **Hip. DEC-10/DEC-11.**

### F-10 — Administração de regras · `/administracao/regras`
- **Persona:** perfil autorizado (Suprimentos/TI). **Retorno:** volta à lista de regras.
- **Objetivo:** ajustar parâmetro autorizado. **Ação primária única:** "Salvar alteração" (com confirmação). **Secundárias:** cancelar, ver histórico.
- **US/RN/CT:** US-028; RF-23; RNF-04.
- **Reutiliza:** `features/settings/*`(padrão), `form, input, label, alert`(diff antes/depois), `alert-dialog/confirm-dialog, button`.
- **Mocks/schemas:** `Rule[]` (hipótese: `small_purchase_limit`, `min_quotes`) + histórico.
- **Estados:** *loading* skeleton; *erro* validação do novo valor; *sucesso* "antes→depois" + toast + registro.
- **Mobile:** coluna única. **Teclado:** foco no diff antes de confirmar.
- **Verificação:** alteração exige confirmação com contexto; aplica só a novas validações, **não reescreve** processadas; registra ator/data-hora/anterior→novo. **Hip. DEC-12** (lista/perfis rotulados; MVP só limite + qtd mínima).

### F-11 — Integrações (saúde técnica) · `/administracao/integracoes`
- **Persona:** TI/Admin; comprador (leitura). **Retorno:** rota admin.
- **Objetivo:** acompanhar saúde das integrações. **Ação primária única:** "Solicitar reprocessamento" (TI, quando permitido) — caso contrário leitura. **Secundárias:** ver tentativas/detalhe.
- **US/RN/CT:** apoia US-022/US-026 (TI — PRD Design §4.6); RNF-07/08.
- **Reutiliza:** `features/apps/*`(padrão visual, **sem apps genéricos**), `card, badge, table, alert`. **Adaptadores** §12.
- **Mocks/schemas:** entidades de integração + `SapAttempt[]`.
- **Estados:** *loading* skeleton cards; *vazio* "Nenhuma integração configurada"; *erro* card indisponível; *sucesso* status + última verificação + tentativas.
- **Mobile:** cards empilhados. **Teclado:** cards/tabela tabuláveis.
- **Verificação:** status conceitual claro; reprocessamento só quando permitido (§6); nenhum dado genérico do template `apps`.

---

## Sequência de construção (Guia §8 — ordem fixa)

| # | Incremento | Resultado verificável |
|---|---|---|
| 0 | Preparação | Branch + `pnpm build` base OK + `CLAUDE.md` |
| 1 | Tema e fonte | Preset aplicado sem substituir componentes |
| 2 | App shell | Sidebar, header, navegação e acesso por perfil (F-01 estrutura) |
| 3 | Domínio | Tipos, schemas Zod, status, mocks, adaptadores |
| 4 | Visão geral | Dashboard coerente com o perfil (F-01) |
| 5 | Solicitações | Lista, filtros, busca, paginação, estados (F-02) |
| 6 | Nova solicitação | Formulário em 5 etapas com revisão (F-03) |
| 7 | Detalhe e correção | Validações, timeline, reenvio (F-04, F-05) |
| 8 | Aprovações | Fila, detalhe, aprovação, rejeição (F-06) |
| 9 | Integração SAP | Fila, processamento, sucesso, erro acionável (F-07) |
| 10 | Auditoria | Eventos, filtros, trilha somente leitura (F-08) |
| 11 | Indicadores | BI mínimo + drill-down (F-09) |
| 12 | Administração | Regras autorizadas + histórico (F-10, F-11) |
| 13 | Qualidade transversal | Mobile, acessibilidade, temas, smoke tests |

> **Primeiro marco funcional (Guia §8):** NÃO construir todas as rotas antes de validar **um slice vertical do caminho feliz** ponta a ponta:
> `Nova solicitação elegível → Aprovação → Registro SAP simulado → Pedido criado`.
> Só depois preencher a largura (incrementos 4–12) e então as **exceções**: acima do limite · fornecedor bloqueado · item de estoque · contrato vigente · possível fracionamento · fornecedor não homologado · ausência de anexos/cotações · fora do menor preço · erro SAP e correção.

## Definition of Done por incremento (Guia §7 prompts 4–8 + §10 checklists)

Para cada fluxo entregue, na ordem:
1. **Implementar** (P4): reutilizar antes de criar; PT + mocks tipados; incluir loading/vazio/erro/sucesso, desktop+mobile, teclado, foco/labels. Rodar **`pnpm build` (typecheck) + `pnpm lint`**; listar arquivos alterados e critérios atendidos. *(Testes automatizados não são escritos pelo designer — ficam para o front-end dev; ver Calibração.)*
2. **Validar visualmente** (P5): screenshots **1440×900, 768×1024, 390×844, 320px**; checar hierarquia, sem sobreposição/corte, responsividade de tabela/filtros, dialogs/sheets, tema claro/escuro, preservação do layout shadcn-admin.
3. **Acessibilidade** (P6): WCAG 2.2 AA — teclado, ordem/visibilidade de foco, labels, nomes de botões-ícone, mensagens associadas, contraste, zoom 200%, cor só como apoio, `aria-live`, retorno de foco de dialogs.
4. **Fidelidade ao produto** (P7): matriz requisito → evidência na UI → arquivo → status (atendido/parcial/ausente); caçar regra inventada, decisão pendente como aprovada, status divergente, ação em perfil errado, mensagem sem motivo/próxima ação, fluxo que exige reiniciar, comportamento não auditável.
5. **Handoff** (P8): resumo, US/critérios, componentes reutilizados, novos componentes + justificativa, decisões pendentes preservadas, arquivos alterados, comandos+resultados, screenshots, limitações, próximo incremento. **Sem commit/push sem autorização.**

Gates: **Checklist 1** (antes da sessão), **Checklist 2** (antes de "tela concluída"), **Checklist 3** (antes do handoff) — Guia §10.

## Pontos de controle Git (Guia §11)

Commits pequenos por incremento validado (`git status && git diff && pnpm build` antes). Mensagem estilo `feat: prototype purchase request flow`. **Não misturar** no mesmo commit: tema+funcionalidade · refatoração+nova tela · doc+UI extensa · múltiplos fluxos. Git é o ponto de recuperação; checkpoints não o substituem. **Nenhum commit/push sem autorização.**

## Fora da prototipação (Guia §12)

Backend definitivo · auth definitiva · SAP real sem decisão técnica · dados reais · penalidade automática por fracionamento · BI avançado · portal de fornecedor · configuração irrestrita de regras · IA · migração Next.js · substituição do fluxo normal de compras. Integrações só por **adaptadores/mocks** (4 estados).

## Critérios de sucesso do processo (Guia §13)

Preserva shell/padrões do shadcn-admin · prioriza componentes existentes · cada incremento ligado a US/critérios · fluxo principal ponta a ponta · exceções críticas representadas · decisões pendentes como hipóteses · build+testes+validação visual como definição de pronto · outro dev consegue continuar pelo repositório.

---

## Cobertura

**13 fluxos obrigatórios (PRD Design §34):** elegível (F-03→F-06→F-07) · acima do limite (F-03) · fornecedor bloqueado (F-03/04) · item de estoque (F-03·DEC-01) · contrato vigente (F-03·DEC-02) · fracionamento (F-03/04·DEC-03/04) · não homologado (F-03·DEC-05/06) · fora do menor preço (F-03) · aprovação (F-06) · rejeição (F-06·DEC-07) · erro SAP (F-07·DEC-08) · correção/reenvio (F-05) · auditoria (F-08·DEC-09).

**Hipóteses → fluxo:** DEC-01 F-03 · DEC-02 F-03 · DEC-03 F-03 · DEC-04 F-03/04 · DEC-05 F-03 · DEC-06 F-03/06 · DEC-07 F-06 · DEC-08 F-07 · DEC-09 F-08 · DEC-10 F-09 · DEC-11 F-09 · DEC-12 F-10.

## Verificação global (PRD Design §35)

Personas só veem funções coerentes · nova solicitação 3–7 etapas + revisão · rascunho/recuperação · `RN-01..14` com comportamento visível · `CT-01..12` representados (na UI; cobertura por testes é tarefa do dev) · estados por tela · bloqueios com motivo+próxima ação · filtros/paginação preservados · aprovar/rejeitar/alterar regra com confirmação · nada depende só de cor · teclado + 320px · conteúdo realista PT · preserva padrões shadcn-admin · `pnpm build`+`pnpm lint` sem erro · `vercel.json` rewrite p/ `index.html`. *(Testes automatizados — role/label/texto — documentados no handoff para o front-end dev.)*

> **Próximo passo após aprovação:** Etapa 0 (confirmar repo, branch, build base, `CLAUDE.md`, preset, `add progress`) — ainda sem construir telas. `DEC-01..12` permanecem hipóteses até confirmação do SESI.
