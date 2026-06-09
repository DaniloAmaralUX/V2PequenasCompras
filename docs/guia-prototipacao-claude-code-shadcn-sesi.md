# Guia de Prototipação com Claude Code e shadcn-admin

**Cliente:** SESI  
**Produto:** MVP Pequenas Compras no Base-b  
**Status:** guia operacional para prototipação  
**Data:** 2026-06-09  
**Repositório-alvo:** `DaniloAmaralUX/V2PequenasCompras`  
**Base de interface:** `satnaing/shadcn-admin`

## 1. Finalidade do guia

Este documento orienta a prototipação funcional do MVP Pequenas Compras no Claude Code. O objetivo é transformar os requisitos já documentados em uma interface navegável sem reconstruir recursos que o shadcn-admin já oferece.

O fluxo de trabalho recomendado é:

1. preparar e validar o repositório;
2. fazer o Claude compreender o template existente;
3. carregar o contexto de produto na ordem correta;
4. planejar antes de editar;
5. construir por fluxo e não por páginas isoladas;
6. verificar build, testes, responsividade, acessibilidade e screenshots;
7. registrar decisões e manter o Git como ponto de recuperação.

**Princípio central:** o shadcn-admin é a base estrutural do produto. Ele não deve ser usado apenas como referência visual.

## 2. Como o PRD Design considera o shadcn-admin

O PRD Design foi escrito para aproveitar a arquitetura existente no `V2PequenasCompras`.

### Reutilizar diretamente

- app shell autenticado;
- sidebar responsiva;
- header fixo;
- busca global e command menu;
- Data Table, ordenação, filtros, paginação e seleção de colunas;
- dialogs e confirm dialogs;
- sheets para filtros mobile e consultas rápidas;
- tabs;
- alerts, badges e tooltips;
- formulários com React Hook Form e Zod;
- tema claro e escuro;
- skeletons, estados de carregamento e Sonner;
- páginas de erro e padrões de settings.

### Adaptar para o domínio

- `Tasks` deve se tornar `Solicitações`;
- o dashboard deve apresentar indicadores de pequenas compras;
- `Apps` pode servir como base para integrações;
- settings pode receber os parâmetros autorizados;
- filtros, dados, schemas, rotas, textos e ações devem refletir as regras do SESI.

### Não reutilizar sem revisão

- exclusão em massa;
- aprovação ou rejeição em massa;
- formulários extensos dentro de drawers;
- cards promocionais;
- textos e mocks genéricos do template;
- páginas que não atendem uma User Story;
- autenticação do template como decisão definitiva.

**Atenção:** o workspace deve ser aberto na raiz do `V2PequenasCompras`. Não utilize uma landing page Next.js como base técnica deste MVP.

## 3. Preparação do repositório

### 3.1 Clonar e criar uma branch

```bash
git clone https://github.com/DaniloAmaralUX/V2PequenasCompras.git
cd V2PequenasCompras
git checkout -b prototype/ux-pequenas-compras
pnpm install
pnpm build
```

Se o repositório já estiver clonado:

```bash
git status
git pull --ff-only
git checkout -b prototype/ux-pequenas-compras
pnpm install
pnpm build
```

Não continue se o build inicial falhar. Registre primeiro se a falha já existia antes das mudanças.

### 3.2 Inspecionar a configuração shadcn

```bash
pnpm dlx shadcn@latest info
```

O Claude deve ler antes de editar:

- `package.json`;
- `components.json`;
- configuração do Vite;
- configuração do TypeScript;
- CSS global e tokens;
- rotas TanStack;
- `src/components`;
- `src/components/ui`;
- `src/features`;
- implementação atual de Tasks, Dashboard, Sidebar e Data Table.

O `components.json` informa ao CLI o estilo, a biblioteca base, o arquivo CSS, os aliases, os diretórios e a biblioteca de ícones. Não execute `init` novamente em um projeto já configurado sem justificar a necessidade.

### 3.3 Aplicar somente tema e fonte do preset

```bash
pnpm dlx shadcn@latest apply --preset b5dyXAABk --only theme
pnpm dlx shadcn@latest apply --preset b5dyXAABk --only font
```

Execute esses comandos em uma branch limpa. Revise o diff após cada aplicação:

```bash
git status
git diff
pnpm build
```

### 3.4 Adicionar componentes com segurança

Antes de instalar qualquer componente, confirme que ele ainda não existe:

```bash
pnpm dlx shadcn@latest docs data-table
pnpm dlx shadcn@latest add data-table --dry-run
pnpm dlx shadcn@latest add data-table --diff
```

Somente após revisar a prévia:

```bash
pnpm dlx shadcn@latest add data-table
```

Não use `--overwrite` como padrão. Componentes shadcn são código pertencente ao projeto e podem conter customizações do template.

## 4. CLAUDE.md: contexto permanente e curto

O `CLAUDE.md` deve conter apenas instruções que precisam valer em todas as sessões. Requisitos extensos permanecem nos documentos de produto.

Conteúdo recomendado:

```markdown
# Projeto
- Este repositório implementa o MVP Pequenas Compras do SESI.
- Stack: Vite, React, TypeScript, TanStack Router/Table/Query, Tailwind e shadcn/ui.
- O shadcn-admin existente é a base estrutural. Reutilize antes de criar.

# Produto
- Interface e conteúdo em português.
- Nomes técnicos, tipos e arquivos em inglês consistente.
- O PRD funcional é a fonte de verdade.
- Decisões marcadas como pendentes não podem virar regras aprovadas.
- Não implementar backend ou integração SAP real durante a prototipação.

# Código
- Inspecione components.json e src/components antes de adicionar componentes.
- Regras de negócio ficam fora de componentes visuais.
- Use schemas Zod e mocks tipados.
- Preserve rotas, tokens e padrões já usados no template.
- Não use aprovação, rejeição ou exclusão em massa.

# Verificação
- Execute typecheck, testes e build após cada fluxo.
- Verifique desktop, tablet e mobile.
- Verifique teclado, foco, labels e contraste.
- Compare screenshots com os critérios do PRD Design.
```

Evite transformar o `CLAUDE.md` em uma cópia do PRD. Arquivos longos consomem contexto em todas as sessões e fazem regras importantes perderem destaque.

## 5. Ordem correta dos documentos

| Ordem | Documento | Função na sessão |
| --- | --- | --- |
| 1 | `CLAUDE.md` | Regras permanentes do repositório |
| 2 | `docs/prd-pequenas-compras-sesi.md` | Fonte de verdade funcional e regras de negócio |
| 3 | `docs/prd-design-pequenas-compras-sesi.md` | Personas, fluxos, IA, telas e comportamento de UX |
| 4 | `docs/decisoes-pendentes-mvp-pequenas-compras-sesi.md` | Hipóteses que não podem ser tratadas como aprovadas |
| 5 | `docs/user-stories-pequenas-compras-sesi.md` | Backlog, critérios de aceite e rastreabilidade |
| 6 | PDFs originais | Conferência de requisitos e evidência documental |
| 7 | PNG do processo | Referência visual do benchmarking e das exceções |

### Quando usar cada formato

- **Markdown:** contexto principal do trabalho cotidiano; é pesquisável, versionável e econômico.
- **PDF:** conferência da documentação original, diagramação, tabelas e conteúdo não preservado no Markdown.
- **Imagem:** referência visual de fluxo, estados, hierarquia ou problema encontrado.
- **Prompt:** objetivo e escopo da sessão atual.
- **`CLAUDE.md`:** regras permanentes, comandos e restrições que não devem ser repetidos.

Não anexe simultaneamente o Markdown e o PDF que contêm o mesmo conteúdo, salvo quando a tarefa for conferir fidelidade entre as versões.

### Precedência em caso de conflito

1. PRD funcional aprovado;
2. decisão formalmente confirmada pelo SESI;
3. critérios de aceite das User Stories;
4. PRD Design;
5. recomendações ainda pendentes;
6. benchmarking como referência, nunca como regra automática.

## 6. Estratégia de sessões no Claude Code

### Sessão 1: exploração

Use Plan Mode. O Claude deve entender a base antes de sugerir mudanças.

### Sessão 2: especificação

Carregue os documentos Markdown, confirme escopo, rotas, componentes reutilizados, estados e critérios de verificação. Ainda não implemente.

### Sessões de implementação

Use uma sessão por fluxo coerente, por exemplo:

- shell, navegação e tokens;
- solicitações e filtros;
- criação em etapas;
- detalhe e correção;
- aprovação;
- SAP e erros;
- auditoria;
- indicadores e administração.

Use `/clear` entre tarefas sem relação. Use `/compact` em sessões longas, pedindo para preservar arquivos modificados, decisões e comandos de teste. Nomeie as sessões para facilitar retomada.

**Atenção:** se forem necessárias mais de duas correções sobre o mesmo problema, interrompa, registre o aprendizado e inicie uma sessão limpa com um prompt mais preciso.

## 7. Prompts operacionais

### Prompt 1 - Explorar o template sem editar

```text
Não altere nenhum arquivo. Trabalhe em Plan Mode.

Analise este repositório como base do MVP Pequenas Compras do SESI.

Leia CLAUDE.md, package.json, components.json, configurações de Vite,
TypeScript e Tailwind, rotas TanStack, src/components, src/features e
as implementações atuais de Tasks, Dashboard, Sidebar e Data Table.

Mapeie:
1. componentes reutilizáveis sem alteração;
2. componentes que precisam ser adaptados;
3. componentes realmente ausentes;
4. rotas e features que podem ser renomeadas;
5. tokens e padrões visuais existentes;
6. riscos de sobrescrever customizações;
7. comandos de build, lint, typecheck e testes.

Não proponha reconstruir o projeto do zero.
Entregue um inventário com caminhos de arquivos e recomendações.
```

### Prompt 2 - Auditar o inventário shadcn

```text
Ainda sem editar, compare as necessidades do PRD Design com o inventário
real de src/components e src/components/ui.

Para cada necessidade, informe:
- componente existente que deve ser reutilizado;
- composição necessária;
- componente ausente;
- comando shadcn sugerido, somente quando realmente necessário;
- risco de conflito com componentes customizados.

Consulte components.json antes de recomendar qualquer comando.
Não use --overwrite.
```

### Prompt 3 - Planejar a prototipação

```text
Leia nesta precedência:
1. @docs/prd-pequenas-compras-sesi.md
2. @docs/prd-design-pequenas-compras-sesi.md
3. @docs/decisoes-pendentes-mvp-pequenas-compras-sesi.md
4. @docs/user-stories-pequenas-compras-sesi.md

Crie um plano de prototipação que reutilize o máximo do shadcn-admin.

Para cada fluxo, indique:
- persona;
- rota;
- User Stories, regras e cenários atendidos;
- componentes existentes reutilizados;
- mocks e schemas necessários;
- estados loading, vazio, erro e sucesso;
- comportamento desktop e mobile;
- critérios objetivos de verificação.

Decisões pendentes devem aparecer como hipótese, nunca como requisito
confirmado. Não implemente ainda.
```

### Prompt 4 - Implementar um fluxo

```text
Implemente somente o fluxo [NOME DO FLUXO].

Fontes:
- @docs/prd-pequenas-compras-sesi.md
- @docs/prd-design-pequenas-compras-sesi.md
- @docs/user-stories-pequenas-compras-sesi.md

Atender: [US], [RN] e [CT].

Reutilize primeiro os componentes e padrões existentes no shadcn-admin.
Não crie um componente quando houver equivalente instalado.
Não altere decisões marcadas como pendentes.
Use conteúdo realista em português e mocks tipados.

Inclua:
- carregamento;
- vazio;
- erro;
- sucesso;
- desktop e mobile;
- navegação por teclado;
- foco e labels acessíveis.

Ao terminar, execute typecheck, testes relacionados e build.
Liste os arquivos alterados e os critérios atendidos.
```

### Prompt 5 - Validar visualmente

```text
Abra o fluxo implementado no navegador e faça uma auditoria visual.

Capture e compare screenshots em:
- desktop 1440 x 900;
- tablet 768 x 1024;
- mobile 390 x 844;
- mobile mínimo 320 px.

Verifique:
- hierarquia e densidade;
- ausência de sobreposição ou corte;
- textos dentro dos componentes;
- estados de loading, vazio, erro e sucesso;
- tabela e filtros responsivos;
- dialogs e sheets;
- tema claro e escuro;
- preservação do layout do shadcn-admin.

Corrija os problemas encontrados e repita as screenshots.
```

### Prompt 6 - Revisar acessibilidade

```text
Revise o fluxo implementado para WCAG 2.2 nível AA.

Teste:
- navegação completa por teclado;
- ordem de foco;
- foco visível;
- labels e descrições;
- nomes acessíveis de botões com ícones;
- mensagens associadas aos campos;
- contraste;
- zoom de 200%;
- uso de cor apenas como apoio;
- anúncio de estados assíncronos;
- fechamento e retorno de foco de dialogs.

Corrija problemas confirmados. Não redesenhe partes que já atendem aos
critérios. Informe o que foi testado e qualquer risco residual.
```

### Prompt 7 - Verificar fidelidade ao produto

```text
Revise o fluxo contra PRD, PRD Design e User Stories.

Produza uma matriz:
- requisito ou critério;
- evidência na interface;
- arquivo responsável;
- status atendido, parcial ou ausente.

Procure especialmente:
- regra inventada;
- decisão pendente apresentada como aprovada;
- status divergente;
- ação disponível para perfil incorreto;
- mensagem sem motivo ou próxima ação;
- fluxo que exige reiniciar após correção;
- comportamento não auditável.

Corrija somente os desvios confirmados e execute novamente os testes.
```

### Prompt 8 - Preparar o handoff

```text
Prepare este incremento para handoff.

Execute build, typecheck, lint, testes e smoke tests disponíveis.
Confirme rotas, mocks, estados e responsividade.

Entregue:
1. resumo do fluxo;
2. User Stories e critérios atendidos;
3. componentes do template reutilizados;
4. novos componentes criados e justificativa;
5. decisões pendentes preservadas;
6. arquivos alterados;
7. comandos executados e resultados;
8. screenshots de referência;
9. limitações conhecidas;
10. próximo incremento recomendado.

Não faça commit nem push sem autorização.
```

## 8. Ordem recomendada de construção

| Etapa | Incremento | Resultado verificável |
| --- | --- | --- |
| 1 | Tema e fonte | Preset aplicado sem substituir componentes |
| 2 | App shell | Sidebar, header, navegação e acesso por perfil |
| 3 | Domínio | Tipos, schemas Zod, status e mocks |
| 4 | Visão geral | Dashboard coerente com o perfil |
| 5 | Solicitações | Lista, filtros, busca, paginação e estados |
| 6 | Nova solicitação | Formulário em cinco etapas com revisão |
| 7 | Detalhe e correção | Validações, timeline e reenvio |
| 8 | Aprovações | Fila, detalhe, aprovação e rejeição |
| 9 | Integração SAP | Fila, processamento, sucesso e erro acionável |
| 10 | Auditoria | Eventos, filtros e trilha somente leitura |
| 11 | Indicadores | BI mínimo e detalhamento das métricas |
| 12 | Administração | Regras autorizadas e histórico de alterações |
| 13 | Qualidade transversal | Mobile, acessibilidade, temas e smoke tests |

Não construa todas as rotas antes de validar o primeiro fluxo vertical. O primeiro incremento completo deve ser:

`Nova solicitação elegível` → `Aprovação` → `Registro SAP simulado` → `Pedido criado`.

Depois, implemente as exceções:

- valor acima do limite;
- fornecedor bloqueado;
- item de estoque;
- contrato vigente;
- possível fracionamento;
- fornecedor não homologado;
- ausência de anexos ou cotações;
- fornecedor escolhido fora do menor preço;
- erro SAP e correção.

## 9. Padrão mínimo para cada tela

Cada tela entregue deve definir:

- persona e permissão;
- rota e forma de retorno;
- objetivo principal;
- ação primária única;
- ações secundárias;
- dados e origem dos mocks;
- loading;
- vazio;
- erro;
- sucesso;
- comportamento mobile;
- comportamento por teclado;
- mensagem de bloqueio com motivo e próxima ação;
- rastreabilidade com User Story, regra e cenário.

Telas operacionais devem priorizar leitura, comparação e ação. Evite aparência de landing page, hero promocional, cards aninhados e decoração sem função.

## 10. Checklists

### Checklist 1 - Antes de iniciar uma sessão

- [ ] Estou na raiz do `V2PequenasCompras`.
- [ ] A branch está correta e o `git status` foi conferido.
- [ ] O build base está funcional.
- [ ] O Claude leu `CLAUDE.md` e os documentos necessários.
- [ ] O escopo da sessão corresponde a um fluxo pequeno e verificável.
- [ ] As User Stories, regras e cenários foram informados.
- [ ] Os componentes existentes foram identificados.
- [ ] Decisões pendentes permanecem sinalizadas.
- [ ] Há um método objetivo de verificação.

### Checklist 2 - Antes de considerar uma tela concluída

- [ ] A ação principal está evidente.
- [ ] Conteúdo e rótulos estão em português.
- [ ] Loading, vazio, erro e sucesso foram implementados.
- [ ] Mensagens explicam motivo e próxima ação.
- [ ] A tela funciona em desktop, tablet, mobile e 320 px.
- [ ] Não há texto cortado, sobreposição ou mudança inesperada de layout.
- [ ] A navegação por teclado foi testada.
- [ ] Foco, labels, contraste e ícones possuem tratamento acessível.
- [ ] Tema claro e escuro foram verificados.
- [ ] Typecheck, testes relacionados e build passaram.
- [ ] Screenshots foram revisadas.

### Checklist 3 - Antes do handoff

- [ ] O incremento atende às User Stories selecionadas.
- [ ] A matriz de rastreabilidade foi atualizada.
- [ ] Nenhuma regra nova foi inventada.
- [ ] Nenhuma decisão pendente foi tratada como aprovada.
- [ ] Componentes novos possuem justificativa.
- [ ] Mocks estão tipados e separados da interface.
- [ ] Regras de negócio não estão acopladas aos componentes visuais.
- [ ] Rotas, filtros e estados são reproduzíveis.
- [ ] Limitações e próximos passos foram registrados.
- [ ] O diff do Git foi revisado.
- [ ] Nenhum segredo ou arquivo local foi incluído.

## 11. Pontos de controle com Git

Faça commits pequenos depois de cada incremento validado:

```bash
git status
git diff
pnpm build
git add <arquivos-do-incremento>
git commit -m "feat: prototype purchase request flow"
```

Antes de alterações arriscadas, confirme que o estado atual está recuperável. Checkpoints do Claude ajudam durante a sessão, mas não substituem o Git.

Evite misturar no mesmo commit:

- tema e funcionalidade;
- refatoração e nova tela;
- atualização documental e alteração extensa de UI;
- múltiplos fluxos independentes.

## 12. O que não deve entrar na prototipação

- backend definitivo;
- autenticação definitiva;
- conexão real com SAP sem decisão técnica;
- dados pessoais ou corporativos reais;
- penalidade automática por fracionamento;
- BI avançado;
- portal de fornecedor;
- configuração irrestrita de regras;
- funcionalidades de IA;
- migração para Next.js;
- substituição do fluxo normal de compras.

As integrações devem ser representadas por adaptadores e mocks que permitam simular sucesso, processamento, erro corrigível e erro que exige intervenção.

## 13. Critérios de sucesso do processo

A estratégia de prototipação será considerada bem executada quando:

- o produto preservar o shell e os padrões do shadcn-admin;
- componentes existentes forem priorizados;
- cada incremento estiver ligado a User Stories e critérios;
- o fluxo principal puder ser executado ponta a ponta;
- exceções críticas estiverem representadas;
- decisões pendentes continuarem identificadas como hipóteses;
- build, testes e validação visual fizerem parte da definição de pronto;
- outro desenvolvedor conseguir compreender e continuar o trabalho pelo repositório.

## 14. Referências

- [Repositório V2PequenasCompras](https://github.com/DaniloAmaralUX/V2PequenasCompras)
- [Template satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin)
- [Claude Code - Best practices](https://code.claude.com/docs/en/best-practices)
- [Claude Code - Project memory](https://code.claude.com/docs/en/memory)
- [Claude Code - Desktop](https://code.claude.com/docs/en/desktop)
- [shadcn/ui CLI](https://ui.shadcn.com/docs/cli)
- [shadcn/ui components.json](https://ui.shadcn.com/docs/components-json)

