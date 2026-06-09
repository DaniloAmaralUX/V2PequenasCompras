# Decisões pendentes para fechamento do escopo do MVP

**Cliente:** SESI  
**Produto:** Automação de Pequenas Compras no Base-b  
**Status:** Questionário para validação com o cliente  
**Data:** 2026-06-09  
**Fonte:** PRD e User Stories do MVP Pequenas Compras

## Orientações de uso

Este documento reúne as decisões de negócio e governança que precisam ser confirmadas para encerrar o escopo do MVP. As recomendações representam uma proposta inicial para o piloto e não devem ser tratadas como regras aprovadas pelo SESI.

Durante a reunião, a analista deve:

1. apresentar o cenário e a decisão pendente;
2. confirmar se a recomendação atende à operação do SESI;
3. registrar a opção escolhida ou uma decisão alternativa;
4. identificar o responsável pela confirmação e a data;
5. manter como pendente qualquer item que dependa de consulta a outra área.

Funcionalidades avançadas, como penalidades automáticas, BI altamente personalizável, configuração ampla de regras e automações complementares, permanecem como evolução futura quando não forem indispensáveis ao piloto.

## Resumo executivo

| ID | User Story | Decisão | Área principal |
| --- | --- | --- | --- |
| DEC-01 | US-009 | Destino de solicitações com item de estoque | Suprimentos e Estoque |
| DEC-02 | US-010 | Dados de contrato exibidos ao requisitante | Suprimentos e Contratos |
| DEC-03 | US-011 | Critérios para detectar fracionamento | Compliance e Suprimentos |
| DEC-04 | US-011 | Tratamento após bloqueio por fracionamento | Compliance e Suprimentos |
| DEC-05 | US-013 | Responsável por inserir cotações da exceção | Compras e Suprimentos |
| DEC-06 | US-013 | Aprovação adicional para fornecedor não homologado | Compliance e Compras |
| DEC-07 | US-019 | Obrigatoriedade e formato do motivo de rejeição | Gestores e Suprimentos |
| DEC-08 | US-020 | Frequência de execução da automação SAP | TI/SAP e Compras |
| DEC-09 | US-025 | Acesso, retenção e exportação da auditoria | Auditoria, Compliance e TI |
| DEC-10 | US-027 | Fórmula e fontes do ganho operacional | Gestão de Compras e BI |
| DEC-11 | US-027 | Filtros, atualização e permissões do BI | Gestão de Compras e BI |
| DEC-12 | US-028 | Regras configuráveis e perfis autorizados | Suprimentos e TI |

## CEN-01 - Item identificado como estoque

**Épico:** EP-02 - Elegibilidade e compliance  
**User Story:** US-009 - Identificar item de estoque  
**Área responsável:** Suprimentos, Estoque/Almoxarifado e TI

### DEC-01 - Definir o destino da solicitação

**Pergunta ao SESI:** Para onde o requisitante deve ser direcionado quando o item solicitado já estiver disponível ou cadastrado como item de estoque?

**Por que validar:** O MVP precisa indicar uma ação concreta. Apenas bloquear a compra deixaria o requisitante sem saber como obter o item e poderia gerar chamados paralelos.

**Impacto no MVP:** Define mensagem, status, responsável pelo atendimento e eventual ligação com o processo interno de estoque.

**Recomendação inicial:** Bloquear o fluxo de pequena compra e orientar o requisitante para o processo interno de estoque, sem automatizar a retirada ou criar integração adicional no MVP.

**Opções:**

- OPT-A | Bloquear e apresentar orientação para o fluxo interno de estoque. [Recomendado]
- OPT-B | Redirecionar por link para um sistema ou formulário de estoque já existente.
- OPT-C | Abrir automaticamente uma demanda de estoque.
- OPT-D | Outra decisão, detalhada no campo de decisão final.

## CEN-02 - Item com contrato vigente

**Épico:** EP-02 - Elegibilidade e compliance  
**User Story:** US-010 - Identificar contrato vigente  
**Área responsável:** Suprimentos, Gestão de Contratos, Segurança da Informação e TI

### DEC-02 - Definir os dados contratuais exibidos

**Pergunta ao SESI:** Quais informações do contrato vigente poderão ser apresentadas ao requisitante quando a pequena compra for impedida?

**Por que validar:** Informações contratuais podem ter restrições de acesso. Ao mesmo tempo, o requisitante precisa de dados suficientes para continuar o atendimento pelo contrato correto.

**Impacto no MVP:** Define permissões, conteúdo da mensagem de impedimento e orientação para utilização do contrato.

**Recomendação inicial:** Exibir referência do contrato, fornecedor, vigência, contato responsável e orientação de uso, respeitando as restrições de acesso definidas pelo SESI.

**Opções:**

- OPT-A | Exibir referência, fornecedor, vigência, contato e orientação de uso. [Recomendado]
- OPT-B | Exibir somente referência do contrato e contato responsável.
- OPT-C | Não exibir dados contratuais; orientar o contato com Suprimentos.
- OPT-D | Outra composição de dados, detalhada no campo de decisão final.

## CEN-03 - Possível fracionamento de compra

**Épico:** EP-02 - Elegibilidade e compliance  
**User Story:** US-011 - Detectar tentativa de fracionamento  
**Área responsável:** Compliance, Suprimentos, Auditoria e TI/Dados

### DEC-03 - Definir os critérios de detecção

**Pergunta ao SESI:** Quais critérios, período de análise e combinações de dados devem caracterizar uma possível tentativa de fracionamento?

**Por que validar:** Uma regra vaga pode bloquear compras legítimas ou permitir que compras relacionadas sejam divididas para permanecer abaixo do limite do MVP.

**Impacto no MVP:** Define o motor de regras, os dados necessários, a taxa de falsos bloqueios e a evidência disponível para auditoria.

**Recomendação inicial:** Adotar uma regra inicial configurável e aprovada por Compliance, combinando uma janela temporal com campos como requisitante, unidade, centro de custo, natureza do objeto, fornecedor e similaridade dos itens.

**Opções:**

- OPT-A | Regra inicial configurável com janela temporal e combinação de campos. [Recomendado]
- OPT-B | Sinalizar casos suspeitos para análise manual, sem bloqueio automático.
- OPT-C | Bloquear somente repetições exatas dentro de um período definido.
- OPT-D | Outra regra, detalhada no campo de decisão final.

### DEC-04 - Definir o tratamento após o bloqueio

**Pergunta ao SESI:** O que deve acontecer operacionalmente depois que uma solicitação for bloqueada por possível fracionamento?

**Por que validar:** O bloqueio não define quem analisa o caso, se a solicitação pode ser corrigida ou quais evidências são necessárias. Penalidades não devem ser automatizadas sem política formal.

**Impacto no MVP:** Define status, responsável, notificações, possibilidade de correção e trilha de auditoria.

**Recomendação inicial:** Encaminhar o caso para análise manual de Compliance ou Suprimentos, manter o pedido impedido e não aplicar penalidade automática no MVP.

**Opções:**

- OPT-A | Encaminhar para análise manual e manter o pedido bloqueado. [Recomendado]
- OPT-B | Encerrar a solicitação e exigir abertura de uma nova demanda.
- OPT-C | Permitir correção e reenvio pelo requisitante antes da análise.
- OPT-D | Outro tratamento, detalhado no campo de decisão final.

## CEN-04 - Ausência de fornecedor homologado

**Épico:** EP-03 - Fornecedores, cotações e evidências  
**User Story:** US-013 - Tratar ausência de fornecedor homologado  
**Área responsável:** Compras, Suprimentos e Compliance

### DEC-05 - Definir quem registra as cotações

**Pergunta ao SESI:** Quem será responsável por inserir preços e evidências quando não houver fornecedor homologado aplicável?

**Por que validar:** A responsabilidade determina permissões, segregação de funções e SLA. Sem um responsável claro, a solicitação pode ficar parada entre requisitante e Compras.

**Impacto no MVP:** Define telas por perfil, atribuição de tarefas, notificações e responsabilidade pela qualidade das evidências.

**Recomendação inicial:** O requisitante registra os preços e evidências; Compras ou Suprimentos valida a exceção antes do prosseguimento.

**Opções:**

- OPT-A | Requisitante registra; Compras/Suprimentos valida. [Recomendado]
- OPT-B | Comprador registra e valida todas as cotações.
- OPT-C | A responsabilidade depende da categoria ou do valor da compra.
- OPT-D | Outro fluxo, detalhado no campo de decisão final.

### DEC-06 - Definir a aprovação adicional

**Pergunta ao SESI:** A utilização de fornecedor não homologado deverá exigir uma aprovação adicional antes da tentativa de registro no SAP?

**Por que validar:** O fornecedor representa uma exceção de cadastro e compliance. A aprovação gerencial normal pode não ser suficiente para assumir esse risco.

**Impacto no MVP:** Define aprovadores, etapas, prazo de atendimento e elegibilidade para integração com o SAP.

**Recomendação inicial:** Exigir uma aprovação adicional de Compras, Suprimentos ou Compliance antes do envio ao SAP.

**Opções:**

- OPT-A | Exigir aprovação adicional para toda exceção. [Recomendado]
- OPT-B | Exigir aprovação adicional somente em categorias ou valores definidos.
- OPT-C | Manter apenas a aprovação gerencial normal.
- OPT-D | Outra política, detalhada no campo de decisão final.

## CEN-05 - Rejeição pelo gestor

**Épico:** EP-04 - Aprovação gerencial  
**User Story:** US-019 - Rejeitar solicitação  
**Área responsável:** Gestores aprovadores, Suprimentos e Compliance

### DEC-07 - Definir o motivo da rejeição

**Pergunta ao SESI:** O motivo da rejeição será obrigatório e qual formato deverá ser utilizado?

**Por que validar:** Uma rejeição sem justificativa dificulta a correção e reduz a qualidade da auditoria. O formato também influencia a análise de motivos recorrentes.

**Impacto no MVP:** Define formulário, mensagens, histórico e indicadores de rejeição.

**Recomendação inicial:** Tornar o motivo obrigatório, usando uma lista estruturada de motivos e comentário obrigatório quando a opção “Outro” for selecionada.

**Opções:**

- OPT-A | Lista de motivos e comentário obrigatório para “Outro”. [Recomendado]
- OPT-B | Texto livre obrigatório.
- OPT-C | Motivo opcional.
- OPT-D | Outro formato, detalhado no campo de decisão final.

## CEN-06 - Registro automático no SAP

**Épico:** EP-05 - Registro no SAP e tratamento de impedimentos  
**User Story:** US-020 - Registrar pedido aprovado no SAP  
**Área responsável:** TI/SAP, Compras e Suprimentos

### DEC-08 - Definir a frequência da automação

**Pergunta ao SESI:** Quando e com que frequência o MVP deverá tentar registrar no SAP as solicitações aprovadas e elegíveis?

**Por que validar:** O processamento duas vezes ao dia pertence ao benchmarking. A frequência do SESI deve considerar SLA, capacidade técnica, disponibilidade do SAP e tratamento de filas.

**Impacto no MVP:** Define tempo de conclusão, expectativa do requisitante, agendamento técnico e estratégia de reprocessamento.

**Recomendação inicial:** Manter um agendamento configurável fora da interface e usar duas execuções diárias apenas como referência inicial do piloto, sujeita à validação de TI/SAP.

**Opções:**

- OPT-A | Agendamento configurável, iniciando com duas execuções diárias. [Recomendado]
- OPT-B | Uma execução diária em horário definido.
- OPT-C | Processamento próximo de tempo real após aprovação.
- OPT-D | Execução manual controlada por Compras/TI durante o piloto.

## CEN-07 - Consulta do histórico de auditoria

**Épico:** EP-06 - Auditoria e rastreabilidade  
**User Story:** US-025 - Consultar histórico de auditoria  
**Área responsável:** Auditoria, Compliance, Segurança da Informação e TI

### DEC-09 - Definir acesso, retenção e exportação

**Pergunta ao SESI:** Quais perfis poderão consultar o histórico, por quanto tempo os registros serão mantidos e a exportação será necessária no MVP?

**Por que validar:** O histórico pode conter dados sensíveis e precisa seguir políticas de segurança, LGPD, auditoria e armazenamento do SESI.

**Impacto no MVP:** Define controle de acesso, capacidade de armazenamento, política de retenção e necessidade de exportação.

**Recomendação inicial:** Disponibilizar consulta somente leitura para perfis autorizados, seguir o prazo de retenção da política vigente do SESI e deixar a exportação fora do MVP, salvo exigência formal.

**Opções:**

- OPT-A | Acesso restrito, retenção conforme política SESI e sem exportação no MVP. [Recomendado]
- OPT-B | Acesso restrito, retenção definida neste projeto e exportação CSV/PDF.
- OPT-C | Consulta disponível somente para Auditoria e TI durante o piloto.
- OPT-D | Outra política, detalhada no campo de decisão final.

## CEN-08 - Indicadores e análise operacional

**Épico:** EP-07 - Indicadores e gestão da rotina  
**User Story:** US-027 - Analisar operação por dimensões e ganho estimado  
**Área responsável:** Gestão de Compras, Suprimentos, Controladoria e BI/Dados

### DEC-10 - Definir o cálculo do ganho operacional

**Pergunta ao SESI:** Qual fórmula e quais fontes de dados serão usadas para estimar o ganho operacional do MVP?

**Por que validar:** Sem metodologia acordada, o indicador pode apresentar uma economia sem sustentação ou impedir comparação confiável com o processo anterior.

**Impacto no MVP:** Define dados coletados, linha de base, credibilidade do painel e avaliação do resultado do piloto.

**Recomendação inicial:** Calcular horas economizadas comparando o tempo médio manual de referência com o tempo medido no MVP, multiplicado pelo volume de solicitações concluídas.

**Opções:**

- OPT-A | Horas economizadas com linha de base manual e tempo medido no MVP. [Recomendado]
- OPT-B | Quantidade de etapas ou interações manuais eliminadas.
- OPT-C | Economia financeira estimada com custo-hora validado pelo SESI.
- OPT-D | Não apresentar ganho operacional no MVP até existir uma linha de base.

### DEC-11 - Definir a configuração mínima do BI

**Pergunta ao SESI:** Quais filtros, periodicidade de atualização e perfis de acesso são necessários no painel do MVP?

**Por que validar:** Usuários diferentes podem precisar de visões distintas, enquanto atualização em tempo real aumenta complexidade sem necessariamente gerar valor para o piloto.

**Impacto no MVP:** Define arquitetura de dados, desempenho, segurança e experiência dos gestores.

**Recomendação inicial:** Disponibilizar filtros essenciais, atualização diária e acesso restrito a gestores de Compras/Suprimentos e áreas de controle.

**Opções:**

- OPT-A | Filtros essenciais, atualização diária e acesso restrito. [Recomendado]
- OPT-B | Atualização em tempo real e filtros ampliados.
- OPT-C | Relatório periódico estático, sem painel interativo no MVP.
- OPT-D | Outra configuração, detalhada no campo de decisão final.

## CEN-09 - Administração das regras

**Épico:** EP-08 - Configuração das regras  
**User Story:** US-028 - Configurar regras críticas do processo  
**Área responsável:** Suprimentos, Compliance e TI

### DEC-12 - Definir regras e perfis configuráveis

**Pergunta ao SESI:** Quais regras poderão ser alteradas pelo usuário e quais perfis terão autorização para modificá-las?

**Por que validar:** Flexibilidade excessiva pode comprometer compliance; pouca flexibilidade aumenta dependência de desenvolvimento. Alterações também precisam ser auditáveis.

**Impacto no MVP:** Define painel administrativo, permissões, trilha de mudanças e manutenção operacional.

**Recomendação inicial:** Limitar a interface do MVP ao valor máximo de pequenas compras e à quantidade mínima de cotações; manter as demais regras em configuração técnica auditável.

**Opções:**

- OPT-A | Interface limitada a valor máximo e quantidade mínima de cotações. [Recomendado]
- OPT-B | Interface para todas as regras de elegibilidade e compliance.
- OPT-C | Nenhuma configuração pela interface; alterações somente por TI.
- OPT-D | Outra divisão de regras e perfis, detalhada no campo de decisão final.

## Consolidação e aceite

Ao término da validação, registrar:

- decisões aprovadas;
- decisões que exigem análise complementar;
- responsáveis pelos retornos pendentes;
- prazo acordado para fechamento;
- necessidade de revisão do PRD e das User Stories;
- autorização para utilizar as decisões como referência do MVP.

