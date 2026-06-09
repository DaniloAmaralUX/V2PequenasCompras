# User Stories - SESI | MVP Pequenas Compras

**Status:** backlog inicial para refinamento  
**Data:** 2026-06-09  
**Produto:** automação de Pequenas Compras no Base-b  
**Documento de referência:** `prd-pequenas-compras-sesi.md`

## 1. Objetivo e rastreabilidade

Este documento transforma o PRD e os anexos do projeto em histórias de usuário implementáveis, mantendo rastreabilidade com:

- requisitos funcionais `RF-01` a `RF-23`;
- regras de negócio `RN-01` a `RN-14`;
- requisitos não funcionais `RNF-01` a `RNF-08`;
- cenários de teste `CT-01` a `CT-12`;
- fluxo To Be documentado.

Hierarquia adotada em caso de dúvida:

1. Regras e requisitos explícitos no PRD.
2. Relatório inicial de mapeamento das automações do SESI.
3. Benchmarking e processo da empresa parceira como referência, não como regra automática do SESI.

Itens ainda não definidos pelo SESI são marcados como **A validar**. Eles não devem ser implementados como regra definitiva antes da decisão de Suprimentos, Processos e TI.

## 2. Resumo do backlog

| Épico | Tema | Histórias |
| --- | --- | --- |
| EP-01 | Abertura e enquadramento da solicitação | US-001 a US-005 |
| EP-02 | Elegibilidade e compliance | US-006 a US-011 |
| EP-03 | Fornecedores, cotações e evidências | US-012 a US-016 |
| EP-04 | Aprovação gerencial | US-017 a US-019 |
| EP-05 | Registro no SAP e tratamento de impedimentos | US-020 a US-023 |
| EP-06 | Auditoria e rastreabilidade | US-024 a US-025 |
| EP-07 | Indicadores e gestão da rotina | US-026 a US-027 |
| EP-08 | Configuração das regras | US-028 |

Prioridades:

- **Must:** necessária para que o MVP cumpra os requisitos obrigatórios do PRD.
- **Should:** importante, mas condicionada à disponibilidade de fonte confiável ou decisão técnica.

---

## EP-01 - Abertura e enquadramento da solicitação

### US-001 - Abrir solicitação de pequena compra

**Como** requisitante,  
**quero** abrir uma solicitação de pequena compra no Base-b,  
**para** iniciar o processo sem precisar acessar diretamente o SAP.

**Prioridade:** Must  
**Rastreabilidade:** RF-01, RNF-03

**Critérios de aceite**

- **Dado** que o requisitante está no fluxo de pequenas compras, **quando** iniciar uma solicitação, **então** o Base-b deve disponibilizar o formulário correspondente.
- **Dado** que a solicitação ainda não foi enviada, **quando** o requisitante preencher seus dados, **então** o processo deve permanecer no Base-b.
- **Dado** o escopo do MVP, **quando** o requisitante criar uma solicitação, **então** ele não deve precisar acessar o SAP.

### US-002 - Reaproveitar dados internos disponíveis

**Como** requisitante,  
**quero** que dados já conhecidos sejam reaproveitados automaticamente,  
**para** reduzir preenchimento repetitivo e inconsistências.

**Prioridade:** Should  
**Rastreabilidade:** RF-04, RN-03, RN-04

**Critérios de aceite**

- **Dado** que existe fonte interna confiável, **quando** o formulário for aberto, **então** centro de custo, unidade e natureza do objeto devem ser preenchidos ou sugeridos automaticamente.
- **Dado** que um dado automático não está disponível, **quando** o formulário for carregado, **então** o sistema não deve inventar valor nem assumir dado sem fonte.
- **Dado** um valor reaproveitado, **quando** ele for usado na solicitação, **então** ainda deve passar pelas validações de consistência aplicáveis.

### US-003 - Informar contexto e justificativa da compra

**Como** requisitante,  
**quero** descrever a necessidade e justificar a compra,  
**para** fornecer o contexto que não pode ser determinado automaticamente.

**Prioridade:** Must  
**Rastreabilidade:** RF-05, RN-05

**Critérios de aceite**

- **Dado** que justificativa e descrição dependem do contexto do requisitante, **quando** a solicitação for preenchida, **então** esses campos devem permanecer manuais.
- **Dado** que a justificativa está vazia, **quando** o requisitante tentar avançar, **então** o Base-b deve impedir o avanço.
- **Dado** o bloqueio por justificativa ausente, **quando** a mensagem for exibida, **então** ela deve identificar claramente o campo pendente.

### US-004 - Classificar a solicitação pelo limite de valor

**Como** requisitante,  
**quero** que o valor seja comparado automaticamente com o limite vigente,  
**para** saber se a demanda pode seguir como pequena compra.

**Prioridade:** Must  
**Rastreabilidade:** RF-02, RN-02

**Critérios de aceite**

- **Dado** o limite inicial configurado de `R$ 3.000,00`, **quando** o valor total for informado, **então** o sistema deve classificar automaticamente a solicitação.
- **Dado** um valor igual ou inferior ao limite, **quando** a classificação for executada, **então** a solicitação deve continuar nas validações de pequenas compras.
- **Dado** que o limite é configurável, **quando** ele for alterado por perfil autorizado, **então** novas classificações devem considerar o valor vigente.

### US-005 - Redirecionar solicitação acima do limite

**Como** requisitante,  
**quero** ser direcionado ao processo adequado quando o valor exceder o limite,  
**para** não continuar em um fluxo no qual a compra não se enquadra.

**Prioridade:** Must  
**Rastreabilidade:** RF-03, RN-01, CT-02

**Critérios de aceite**

- **Dado** que o valor total é maior que o limite configurado, **quando** o enquadramento for validado, **então** a solicitação não deve seguir no fluxo automatizado de pequenas compras.
- **Dado** o desenquadramento, **quando** o resultado for apresentado, **então** o requisitante deve ser orientado ao fluxo normal de compras.
- **Dado** o redirecionamento, **quando** o evento ocorrer, **então** o motivo deve ser registrado para rastreabilidade.

---

## EP-02 - Elegibilidade e compliance

### US-006 - Validar campos e documentos obrigatórios

**Como** requisitante,  
**quero** receber validações automáticas antes de enviar a solicitação,  
**para** corrigir pendências sem depender da análise manual do comprador.

**Prioridade:** Must  
**Rastreabilidade:** RF-06, RN-03, RN-04, RN-05, CT-06, CT-07

**Critérios de aceite**

- **Dado** o formulário preenchido, **quando** o requisitante tentar avançar, **então** centro de custo, unidade, natureza do objeto, urgência, fornecedores/cotações e anexos exigidos devem ser validados.
- **Dado** centro de custo inválido, **quando** a validação for executada, **então** a solicitação deve ser bloqueada ou devolvida para correção.
- **Dado** unidade ou natureza do objeto ausente ou inconsistente, **quando** a validação for executada, **então** o avanço deve ser impedido.
- **Dado** número mínimo de fornecedores/cotações não atendido, **quando** o requisitante tentar avançar, **então** o sistema deve informar a pendência.
- **Dado** anexo obrigatório ausente, **quando** o requisitante tentar avançar, **então** o Base-b deve impedir o avanço.

### US-007 - Consultar a situação do fornecedor

**Como** requisitante,  
**quero** que a situação do fornecedor seja verificada automaticamente,  
**para** utilizar fornecedores compatíveis com as regras de compras.

**Prioridade:** Must  
**Rastreabilidade:** RF-07, RN-07

**Critérios de aceite**

- **Dado** um fornecedor informado, **quando** a elegibilidade for analisada, **então** o sistema deve identificar se ele está homologado, bloqueado ou inexistente na base disponível.
- **Dado** que não existe fonte confiável para consultar o fornecedor, **quando** a validação for tentada, **então** o sistema não deve tratá-lo automaticamente como homologado.
- **Dado** fornecedor inexistente ou não homologado, **quando** a validação for concluída, **então** a solicitação não deve seguir pela automação direta.

### US-008 - Bloquear fornecedor impedido

**Como** profissional de Suprimentos ou Compliance,  
**quero** impedir pedidos com fornecedor bloqueado,  
**para** evitar compras em desacordo com a governança.

**Prioridade:** Must  
**Rastreabilidade:** RF-08, RN-06, CT-03

**Critérios de aceite**

- **Dado** fornecedor classificado como bloqueado, **quando** a elegibilidade for analisada, **então** a solicitação deve ser bloqueada.
- **Dado** o bloqueio, **quando** o requisitante consultar a solicitação, **então** deve visualizar motivo claro e acionável.
- **Dado** o bloqueio por fornecedor, **quando** ele ocorrer, **então** o evento deve ser registrado no histórico de auditoria.
- **Dado** fornecedor bloqueado, **quando** a automação SAP for considerada, **então** nenhum pedido deve ser criado.

### US-009 - Identificar item de estoque

**Como** profissional de Suprimentos,  
**quero** identificar automaticamente itens de estoque,  
**para** impedir que sigam indevidamente pelo fluxo de pequenas compras.

**Prioridade:** Must  
**Rastreabilidade:** RF-09, RN-08, CT-04

**Critérios de aceite**

- **Dado** um item informado, **quando** a elegibilidade for analisada, **então** sua condição de material de estoque deve ser consultada em fonte confiável.
- **Dado** que o item é de estoque, **quando** a validação for concluída, **então** a solicitação deve ser bloqueada ou redirecionada conforme regra definida por Suprimentos.
- **Dado** o impedimento, **quando** ele for apresentado, **então** o requisitante deve receber o motivo.
- **A validar:** destino exato do redirecionamento para item de estoque.

### US-010 - Identificar contrato vigente

**Como** profissional de Suprimentos,  
**quero** identificar itens que já possuem contrato vigente,  
**para** direcionar a compra ao contrato existente.

**Prioridade:** Must  
**Rastreabilidade:** RF-10, RN-09, CT-05

**Critérios de aceite**

- **Dado** um item informado, **quando** a elegibilidade for analisada, **então** a existência de contrato vigente deve ser consultada em fonte confiável.
- **Dado** contrato vigente para o item, **quando** a validação for concluída, **então** a solicitação não deve seguir pela automação de pequena compra.
- **Dado** o impedimento, **quando** o requisitante consultar a solicitação, **então** deve receber orientação para o contrato existente ou fluxo aplicável.
- **A validar:** dados do contrato que poderão ser exibidos ao requisitante.

### US-011 - Detectar tentativa de fracionamento

**Como** profissional de Compliance,  
**quero** detectar tentativas de fracionamento de compras,  
**para** impedir que o limite de pequenas compras seja burlado.

**Prioridade:** Must  
**Rastreabilidade:** RF-11, RN-10, CT-11

**Critérios de aceite**

- **Dado** o conjunto de dados disponível, **quando** uma solicitação apresentar padrão compatível com fracionamento, **então** ela deve ser bloqueada.
- **Dado** o bloqueio por possível fracionamento, **quando** ele ocorrer, **então** nenhum pedido deve ser enviado ao SAP.
- **Dado** o bloqueio, **quando** o evento for registrado, **então** o log deve permitir consulta por auditoria.
- **A validar:** critérios, janela temporal e combinações de campos usadas para caracterizar fracionamento.
- **A validar:** tratamento organizacional após o bloqueio; o MVP não define penalidade automática.

---

## EP-03 - Fornecedores, cotações e evidências

### US-012 - Seguir fluxo com fornecedor homologado

**Como** requisitante,  
**quero** utilizar fornecedor homologado no fluxo de pequena compra,  
**para** avançar com menor intervenção manual quando as regras forem atendidas.

**Prioridade:** Must  
**Rastreabilidade:** RF-13

**Critérios de aceite**

- **Dado** fornecedor homologado e não bloqueado, **quando** as demais regras forem atendidas, **então** a solicitação deve continuar no fluxo elegível.
- **Dado** o fluxo com fornecedor homologado, **quando** a solicitação for analisada, **então** os dados disponíveis do fornecedor devem ser reaproveitados.
- **Dado** qualquer outro impedimento de compliance, **quando** ele for identificado, **então** a homologação do fornecedor não deve sobrescrever o bloqueio.

### US-013 - Tratar ausência de fornecedor homologado

**Como** requisitante ou comprador,  
**quero** registrar preços quando não houver fornecedor homologado,  
**para** tratar a exceção com segurança e rastreabilidade.

**Prioridade:** Must  
**Rastreabilidade:** RF-14, RN-07, CT-09

**Critérios de aceite**

- **Dado** que não há fornecedor homologado aplicável, **quando** a solicitação for preenchida, **então** o fluxo de exceção deve ser acionado.
- **Dado** o fluxo de exceção, **quando** preços forem registrados, **então** deve ser possível informar até 3 preços obtidos pela internet ou prospecção rápida.
- **Dado** fornecedor não homologado, **quando** a solicitação for analisada, **então** ela não deve seguir pela automação direta sem cumprir a política de exceção.
- **A validar:** se o responsável pela inserção será sempre o requisitante, sempre o comprador ou dependerá do cenário.
- **A validar:** necessidade de aprovação prévia adicional para fornecedor não homologado.

### US-014 - Anexar evidência por preço informado

**Como** profissional de Compliance,  
**quero** que cada preço informado tenha uma evidência,  
**para** comprovar a origem da cotação.

**Prioridade:** Must  
**Rastreabilidade:** RF-15, RN-11, CT-06

**Critérios de aceite**

- **Dado** um fornecedor ou preço informado no fluxo de exceção, **quando** a solicitação for validada, **então** deve existir evidência correspondente.
- **Dado** preço sem evidência, **quando** o usuário tentar avançar, **então** o Base-b deve impedir o avanço.
- **Dado** múltiplos preços, **quando** os anexos forem validados, **então** cada evidência deve estar associada ao respectivo fornecedor/preço.
- **Dado** o escopo do MVP, **quando** a evidência for obtida, **então** ela será anexada manualmente; não haverá busca automática de preços online.

### US-015 - Registrar data e hora da coleta de preço

**Como** auditor,  
**quero** saber quando cada preço foi coletado,  
**para** avaliar sua rastreabilidade e validade temporal.

**Prioridade:** Must  
**Rastreabilidade:** RF-16

**Critérios de aceite**

- **Dado** um preço registrado no fluxo de exceção, **quando** ele for incluído, **então** sua data e hora de coleta devem ser registradas.
- **Dado** preço sem data/hora de coleta, **quando** a solicitação for validada, **então** o avanço deve ser impedido.
- **Dado** alteração posterior do registro, **quando** ela ocorrer, **então** a mudança deve permanecer rastreável no histórico.

### US-016 - Justificar escolha que não seja o menor preço

**Como** profissional de Suprimentos ou Compliance,  
**quero** exigir justificativa quando não for escolhido o menor preço,  
**para** manter transparência na decisão de compra.

**Prioridade:** Must  
**Rastreabilidade:** RF-12, RN-12, CT-08

**Critérios de aceite**

- **Dado** mais de um preço válido, **quando** o fornecedor escolhido não tiver o menor preço, **então** a justificativa deve se tornar obrigatória.
- **Dado** fornecedor escolhido fora do menor preço sem justificativa, **quando** o usuário tentar avançar, **então** o sistema deve impedir o avanço.
- **Dado** justificativa preenchida, **quando** a solicitação seguir, **então** a decisão e o texto devem ser registrados para auditoria.
- **Dado** fornecedor com menor preço escolhido, **quando** a validação for executada, **então** essa justificativa específica não deve ser exigida.

---

## EP-04 - Aprovação gerencial

### US-017 - Encaminhar solicitação elegível para aprovação

**Como** requisitante,  
**quero** enviar uma solicitação elegível para aprovação do gestor,  
**para** obter autorização antes da criação do pedido.

**Prioridade:** Must  
**Rastreabilidade:** RF-17

**Critérios de aceite**

- **Dado** que todas as validações obrigatórias foram aprovadas, **quando** o requisitante enviar a solicitação, **então** ela deve ser encaminhada ao gestor responsável.
- **Dado** qualquer impedimento ativo, **quando** houver tentativa de envio, **então** a solicitação não deve entrar na etapa de aprovação.
- **Dado** o encaminhamento, **quando** ele ocorrer, **então** data, hora, ator e novo estado devem ser registrados.

### US-018 - Aprovar solicitação

**Como** gestor aprovador,  
**quero** aprovar uma solicitação elegível,  
**para** autorizar sua tentativa de registro no SAP.

**Prioridade:** Must  
**Rastreabilidade:** fluxo To Be, RN-13, CT-01

**Critérios de aceite**

- **Dado** solicitação aguardando aprovação, **quando** o gestor aprovar, **então** a decisão deve ser registrada.
- **Dado** solicitação aprovada e sem impedimentos, **quando** a aprovação for concluída, **então** ela deve ficar apta para automação SAP.
- **Dado** a aprovação, **quando** o processo avançar, **então** o sistema deve preservar quem aprovou e quando.
- **Dado** divergência de dados ou regra após a aprovação, **quando** a integração for iniciada, **então** o pedido não deve ser criado sem nova validação de integridade.

### US-019 - Rejeitar solicitação

**Como** gestor aprovador,  
**quero** rejeitar uma solicitação,  
**para** impedir o prosseguimento de uma compra não autorizada.

**Prioridade:** Must  
**Rastreabilidade:** fluxo To Be

**Critérios de aceite**

- **Dado** solicitação aguardando aprovação, **quando** o gestor rejeitar, **então** a solicitação deve ser encerrada como rejeitada.
- **Dado** solicitação rejeitada, **quando** a automação SAP processar solicitações, **então** ela não deve ser enviada.
- **Dado** a rejeição, **quando** a decisão for registrada, **então** ator e data/hora devem permanecer no histórico.
- **A validar:** obrigatoriedade e formato do motivo de rejeição.

---

## EP-05 - Registro no SAP e tratamento de impedimentos

### US-020 - Registrar pedido aprovado no SAP

**Como** profissional de Compras,  
**quero** que solicitações aprovadas e elegíveis sejam registradas automaticamente no SAP,  
**para** reduzir trabalho operacional em compras de pequeno valor.

**Prioridade:** Must  
**Rastreabilidade:** RF-18, RN-13, RNF-03, RNF-06, CT-01

**Critérios de aceite**

- **Dado** solicitação aprovada e sem impedimentos, **quando** a automação for executada, **então** deve ocorrer tentativa de registro no SAP.
- **Dado** o estudo técnico, **quando** a integração for implementada, **então** poderá usar API, RPA, Power Automate, Python ou solução equivalente aprovada por TI.
- **Dado** divergência de fornecedor, item, valor, anexo ou aprovação, **quando** a automação for iniciada, **então** o pedido não deve ser criado.
- **Dado** o registro automatizado, **quando** ele ocorrer, **então** o requisitante não deve precisar acessar diretamente o SAP.
- **A validar:** frequência final de execução; o processamento duas vezes ao dia pertence ao benchmarking, não é regra confirmada para o SESI.

### US-021 - Confirmar criação do pedido

**Como** requisitante,  
**quero** visualizar a confirmação do pedido criado,  
**para** acompanhar a conclusão da minha solicitação.

**Prioridade:** Must  
**Rastreabilidade:** RF-20, CT-01

**Critérios de aceite**

- **Dado** que o SAP confirmou a criação do pedido, **quando** o retorno for recebido, **então** a solicitação deve ser registrada como concluída no Base-b.
- **Dado** a confirmação do SAP, **quando** o status for atualizado, **então** a referência do pedido deve ser associada à solicitação quando disponibilizada pela integração.
- **Dado** a conclusão, **quando** ela ocorrer, **então** tentativa, resultado, data/hora e origem devem ser registrados para auditoria.

### US-022 - Informar erro ou impedimento da automação

**Como** requisitante,  
**quero** receber uma mensagem clara quando o pedido não puder ser criado,  
**para** entender e corrigir o problema.

**Prioridade:** Must  
**Rastreabilidade:** RF-19, RN-14, RNF-05, CT-10

**Critérios de aceite**

- **Dado** erro técnico ou impedimento de regra na tentativa de registro, **quando** a automação retornar, **então** a solicitação deve ser atualizada no Base-b.
- **Dado** o erro, **quando** a mensagem for exibida, **então** ela deve explicar o motivo de forma compreensível e orientar a próxima ação.
- **Dado** um erro técnico sem correção disponível ao requisitante, **quando** ele ocorrer, **então** a mensagem deve indicar necessidade de intervenção de Compras ou TI.
- **Dado** qualquer falha, **quando** ela ocorrer, **então** o sistema não deve marcar o pedido como concluído.

### US-023 - Corrigir e reenviar solicitação impedida

**Como** requisitante,  
**quero** corrigir uma solicitação com pendência e reenviá-la,  
**para** concluir o processo sem perder seu histórico.

**Prioridade:** Must  
**Rastreabilidade:** RN-14, RNF-01, RNF-02, CT-12

**Critérios de aceite**

- **Dado** impedimento corrigível, **quando** o requisitante acessar a solicitação, **então** deve conseguir ajustar os dados permitidos.
- **Dado** a correção, **quando** a solicitação for reenviada, **então** todas as regras aplicáveis devem ser revalidadas.
- **Dado** a nova tentativa, **quando** ela ocorrer, **então** o histórico anterior não deve ser apagado.
- **Dado** alteração de campo, **quando** ela for salva, **então** usuário, data/hora, valor anterior, novo valor e origem devem ser registrados quando aplicável.

---

## EP-06 - Auditoria e rastreabilidade

### US-024 - Registrar eventos de auditoria automaticamente

**Como** auditor,  
**quero** que eventos relevantes sejam registrados automaticamente,  
**para** reconstruir o histórico completo de cada solicitação.

**Prioridade:** Must  
**Rastreabilidade:** RF-21, RNF-01

**Critérios de aceite**

- **Dado** alteração relevante, **quando** ela ocorrer, **então** devem ser registrados ator, data/hora, campo, valor anterior quando aplicável, novo valor e origem.
- **Dado** validação ou bloqueio, **quando** o resultado for produzido, **então** regra, resultado e mensagem devem ser registrados.
- **Dado** aprovação ou rejeição, **quando** a decisão ocorrer, **então** ator, decisão e data/hora devem ser registrados.
- **Dado** tentativa de integração SAP, **quando** ela ocorrer, **então** tentativa e resultado devem ser registrados.
- **Dado** criação do pedido, **quando** confirmada, **então** o evento deve constar no histórico.

### US-025 - Consultar histórico de auditoria

**Como** profissional de Compliance ou Auditoria,  
**quero** consultar o histórico de uma solicitação,  
**para** verificar alterações, decisões, bloqueios e integrações.

**Prioridade:** Must  
**Rastreabilidade:** RNF-02

**Critérios de aceite**

- **Dado** uma solicitação existente, **quando** o auditor consultar seu histórico, **então** deve visualizar eventos em ordem temporal.
- **Dado** bloqueio, aprovação, justificativa ou tentativa de integração, **quando** o histórico for consultado, **então** o evento deve estar disponível.
- **Dado** uma correção e reenvio, **quando** o histórico for consultado, **então** versões anteriores não devem ter sido apagadas.
- **A validar:** perfis autorizados, período de retenção e possibilidade de exportação.

---

## EP-07 - Indicadores e gestão da rotina

### US-026 - Acompanhar indicadores operacionais

**Como** gestor de Compras ou Suprimentos,  
**quero** acompanhar indicadores do fluxo de pequenas compras,  
**para** gerir a rotina e identificar gargalos.

**Prioridade:** Must  
**Rastreabilidade:** RF-22, RNF-08

**Critérios de aceite**

- **Dado** dados disponíveis do Base-b, SAP e logs, **quando** o painel for consultado, **então** deve apresentar volume de solicitações.
- **Dado** solicitações processadas, **quando** os indicadores forem calculados, **então** devem incluir percentuais de elegíveis e bloqueadas.
- **Dado** bloqueios registrados, **quando** o painel for consultado, **então** os principais motivos devem ser identificáveis.
- **Dado** o fluxo de aprovação e integração, **quando** houver dados suficientes, **então** devem ser apresentados solicitações aprovadas, pedidos SAP e erros de automação.
- **Dado** tempos registrados, **quando** os indicadores forem calculados, **então** devem incluir SLA até aprovação e SLA da aprovação ao SAP.

### US-027 - Analisar operação por dimensões e ganho estimado

**Como** gestor de Compras ou Suprimentos,  
**quero** analisar resultados por dimensões operacionais,  
**para** orientar melhoria contínua e expansão do piloto.

**Prioridade:** Must  
**Rastreabilidade:** RF-22, RNF-08, métricas do PRD

**Critérios de aceite**

- **Dado** dados suficientes, **quando** a análise for realizada, **então** deve ser possível observar distribuição por unidade, centro de custo, natureza do objeto e fornecedor.
- **Dado** correções registradas, **quando** o painel for consultado, **então** o retrabalho por correção deve ser mensurável.
- **Dado** uma metodologia definida, **quando** o ganho operacional for calculado, **então** o painel deve apresentar a estimativa para Compras/Suprimentos.
- **A validar:** fórmula e fonte de dados para estimar ganho operacional.
- **A validar:** filtros, periodicidade e permissões do BI.

---

## EP-08 - Configuração das regras

### US-028 - Configurar regras críticas do processo

**Como** profissional autorizado de Suprimentos ou TI,  
**quero** configurar regras críticas do fluxo,  
**para** ajustar a operação sem alterar estruturalmente o processo.

**Prioridade:** Should  
**Rastreabilidade:** RF-23, RNF-04

**Critérios de aceite**

- **Dado** perfil autorizado, **quando** acessar as configurações, **então** deve poder ajustar limite de valor, quantidade mínima de cotações e critérios de elegibilidade previstos.
- **Dado** uma alteração de regra, **quando** ela for confirmada, **então** novas validações devem considerar a configuração vigente.
- **Dado** uma regra alterada, **quando** a mudança ocorrer, **então** valor anterior, novo valor, ator e data/hora devem ser registrados.
- **Dado** solicitação já processada, **quando** uma configuração mudar, **então** seu histórico não deve ser reescrito.
- **A validar:** lista completa de regras configuráveis e perfis autorizados.

---

## 3. Habilitadores técnicos

Habilitadores não substituem histórias de usuário. Eles existem para sustentar implementação, qualidade e handoff.

### EN-001 - Centralizar schemas e tipos de domínio

Criar schemas Zod e tipos inferidos para `PurchaseRequest`, `Quote`, `ComplianceCheck`, `AuditLog` e `IntegrationEvent`, evitando tipos duplicados e strings de status dispersas.

**Aceite técnico**

- Dados de entrada e mocks passam pelos schemas aplicáveis.
- Estados e resultados usam unions tipadas.
- Mensagens de validação podem ser associadas ao campo/regra de origem.

### EN-002 - Isolar integrações por adaptadores

Definir fronteiras para Base-b, SAP, fornecedores, contratos, estoque, auditoria e BI sem acoplar componentes React ao mecanismo final de integração.

**Aceite técnico**

- Componentes de interface não chamam diretamente API/RPA.
- Mocks e integração real podem usar os mesmos contratos.
- Falhas são convertidas para resultado compreensível pela camada de produto.

### EN-003 - Estruturar rotas e estado de tabela

Organizar rotas do domínio em `src/features/purchase-requests` e validar filtros/paginação da URL com TanStack Router e Zod.

**Aceite técnico**

- Refresh preserva rota e filtros válidos.
- Parâmetros inválidos usam defaults seguros.
- Tabela reutiliza os componentes existentes do template.

### EN-004 - Automatizar testes críticos

Cobrir regras puras com Vitest e os fluxos principais com Vitest Browser Mode ou Playwright.

**Aceite técnico**

- Cenários `CT-01` a `CT-12` possuem cobertura automatizada ou justificativa documentada.
- Testes de interface usam role, label ou texto visível.
- Testes não dependem de seletores CSS frágeis.

### EN-005 - Preparar build e deploy Vercel

Garantir build estático Vite e suporte às rotas client-side na Vercel.

**Aceite técnico**

- `pnpm run build` conclui sem erro.
- `pnpm run lint` conclui sem erro.
- Refresh em rota interna funciona no ambiente publicado.
- `vercel.json` direciona rotas SPA para `index.html` quando necessário.

### EN-006 - Preservar design system e acessibilidade

Aplicar apenas tema e fonte do preset shadcn escolhido, preservando componentes customizados do shadcn-admin.

```bash
pnpm dlx shadcn@latest apply --preset b5dyXAABk --only theme
pnpm dlx shadcn@latest apply --preset b5dyXAABk --only font
```

**Aceite técnico**

- Sidebar, tabelas, dialogs, sheets, command menu e temas continuam funcionais.
- Estados de erro aparecem próximos à ação que os originou.
- Ações destrutivas exigem confirmação acessível.
- Light e dark mode mantêm legibilidade equivalente.

---

## 4. Matriz de cobertura dos requisitos funcionais

| Requisito | História |
| --- | --- |
| RF-01 | US-001 |
| RF-02 | US-004 |
| RF-03 | US-005 |
| RF-04 | US-002 |
| RF-05 | US-003 |
| RF-06 | US-006 |
| RF-07 | US-007 |
| RF-08 | US-008 |
| RF-09 | US-009 |
| RF-10 | US-010 |
| RF-11 | US-011 |
| RF-12 | US-016 |
| RF-13 | US-012 |
| RF-14 | US-013 |
| RF-15 | US-014 |
| RF-16 | US-015 |
| RF-17 | US-017 |
| RF-18 | US-020 |
| RF-19 | US-022 |
| RF-20 | US-021 |
| RF-21 | US-024 |
| RF-22 | US-026, US-027 |
| RF-23 | US-028 |

## 5. Matriz de cobertura das regras de negócio

| Regra | História |
| --- | --- |
| RN-01 | US-005 |
| RN-02 | US-004 |
| RN-03 | US-002, US-006 |
| RN-04 | US-002, US-006 |
| RN-05 | US-003, US-006 |
| RN-06 | US-008 |
| RN-07 | US-007, US-013 |
| RN-08 | US-009 |
| RN-09 | US-010 |
| RN-10 | US-011 |
| RN-11 | US-014 |
| RN-12 | US-016 |
| RN-13 | US-018, US-020 |
| RN-14 | US-022, US-023 |

## 6. Matriz de cobertura dos requisitos não funcionais

| Requisito | História / habilitador |
| --- | --- |
| RNF-01 | US-023, US-024 |
| RNF-02 | US-023, US-025 |
| RNF-03 | US-001, US-020 |
| RNF-04 | US-028 |
| RNF-05 | US-008, US-022 |
| RNF-06 | US-018, US-020, EN-002 |
| RNF-07 | EN-001, EN-002, EN-003 |
| RNF-08 | US-026, US-027 |

## 7. Matriz de cobertura dos cenários de teste

| Cenário | História |
| --- | --- |
| CT-01 | US-018, US-020, US-021 |
| CT-02 | US-005 |
| CT-03 | US-008 |
| CT-04 | US-009 |
| CT-05 | US-010 |
| CT-06 | US-006, US-014 |
| CT-07 | US-006 |
| CT-08 | US-016 |
| CT-09 | US-013, US-014, US-015 |
| CT-10 | US-022 |
| CT-11 | US-011 |
| CT-12 | US-023 |

## 8. Pontos que exigem decisão do SESI

Estes pontos aparecem como dependência ou ambiguidade no PRD e não devem ser fechados apenas pelo time de desenvolvimento:

1. Limite final de pequenas compras; `R$ 3.000,00` é o valor inicial configurável.
2. Política definitiva para fornecedores não homologados.
3. Responsável por inserir cotações no fluxo de exceção.
4. Quantidade mínima definitiva de cotações por cenário.
5. Destino de solicitações com item de estoque.
6. Informações exibidas quando houver contrato vigente.
7. Critérios e janela temporal para identificar fracionamento.
8. Obrigatoriedade e formato do motivo de rejeição do gestor.
9. Frequência de execução da automação SAP.
10. Perfis autorizados e retenção dos logs de auditoria.
11. Fórmula do ganho operacional estimado.
12. Regras que poderão ser configuradas sem mudança de código.
13. Fontes oficiais para fornecedores, contratos, estoque e centros de custo.
14. Tecnologia final de integração: API, RPA, Power Automate, Python ou solução híbrida.

## 9. Fora do backlog do MVP

Para preservar fidelidade ao PRD, não foram criadas histórias para:

- busca automática de preços na internet;
- penalidade automática por tentativa de fracionamento;
- homologação completa de fornecedores;
- portal dedicado para fornecedores;
- BI avançado ou auditoria online preventiva em tempo real;
- autenticação definitiva, enquanto a estratégia não for escolhida;
- funcionalidades de inteligência artificial;
- substituição do fluxo normal de compras;
- migração do projeto Vite para Next.js.
