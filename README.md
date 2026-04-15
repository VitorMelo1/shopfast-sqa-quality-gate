# ShopFast — Mini-SQAP, Quality Gate e Matriz de Risco (SQA)

__Identificação:__  
__Matrícula:__ `2320023` · __Nome completo:__ Vitor Martins Melo  
__Instituição:__ Faculdade UniEvangélica  
__Curso:__ Engenharia de Software — Anápolis

__Repositório público (GitHub):__ _cole aqui o URL após o push_

---

## A — Política do Quality Gate (IEEE 730 + Enforcement)

A __Garantia da Qualidade de Software (SQA)__ conforme orientação da norma __IEEE 730__ exige que atividades de verificação, validação e auditoria do processo sejam __planejadas, documentadas e executadas de forma repetível__, com evidências objetivas de conformidade antes da liberação de baseline para produção.

A __Política do Quality Gate__ abaixo define __duas regras imutáveis__. Cada regra inclui __mecanismo automatizado de bloqueio de versão (enforcement)__ — sem enforcement, não há governança SQA, apenas intenção.

| ID | Regra imutável | Fundamentação (IEEE 730) | Enforcement (bloqueio automatizado) |
| ---- | ---------------- | --------------------------- | ---------------------------------------- |
| __QG-01__ | Nenhum incremento que altere __checkout, cupom, autorização de pagamento ou despacho logístico__ pode integrar a branch de release sem __prova de que o valor líquido cobrável foi capturado/autorizado__ contra o meio de pagamento vinculado ao pedido. | Controle de configuração + atividades de __V&V__ planejadas para itens de alto risco ao negócio. | __Status check obrigatório__ no CI (ex.: GitHub Actions) na PR para `main`/`release`: job `payment-coupon-contract` deve passar (testes de contrato + integração mínima API pagamento × carrinho × cupom). __Branch protection__: merge __bloqueado__ se o job falhar ou for skipped. __Ambiente de deploy__: regra de _deployment protection_ exigindo o mesmo workflow verde antes de promover artefato. |
| __QG-02__ | Nenhuma história de usuário entra em release sem __critérios de aceitação executáveis__ (BDD/Gherkin) que cubram __cenários de negação__ (cupom inválido, saldo insuficiente, captura recusada) e sem __revisão obrigatória__ do papel __SQA/CODEOWNER__ na área de checkout. | Revisões técnicas documentadas + rastreabilidade requisito ↔ evidência de teste. | __CODEOWNERS__ em `src/checkout/**` exige aprovação do time SQA; __PR template__ com checklist que referencia IDs de cenários BDD; bot ou workflow __bloqueia merge__ se não houver alteração em `features/` correspondente à US ou se labels obrigatórios (`bdd-linked`, `risk-reviewed`) não estiverem presentes. |

__Efeito direto no incidente Black Friday:__ o código que “pintou a barra verde” sem validar API de pagamento e saldo __não passaria__ em QG-01; a ausência de cenários BDD de negação e revisão SQA __não passaria__ em QG-02 — a baseline __não seria promovida__ a produção.

---

## B — Sumário executivo (gestão de risco)

### Classificação na matriz Probabilidade × Impacto (P×I)

| Eixo | Nível no incidente |
| ---- | ------------------ |
| Probabilidade | Alta (release apressado, validação superficial, SQA fraco na origem) |
| Impacto | Catastrófico (despacho sem pagamento; perda direta e reputacional) |
| Célula P×I | __Alta × catastrófico__ — __Incidente ShopFast (BLACK50)__: despacho sem pagamento efetivo |

__Evento:__ liberação de funcionalidade de cupom com ênfase apenas na UI (“barra verde”), sem validação cruzada da API de pagamento com __autorização/captura__ e __limite de saldo__ do cartão, permitindo conclusão do fluxo logístico com __valor cobrável não garantido__.

### SQA documentado e Change Failure Rate (DORA)

O __SQA documentado__ (plano tipo IEEE 730 + quality gates com enforcement) reduz o __Change Failure Rate__ porque troca o modelo __reativo (SQC — inspeção pós-fato)__ por __controles preventivos no processo__: cada mudança de alto risco precisa de evidência automatizada de integridade pagamento–pedido e de rastreabilidade até testes executáveis, __antes__ da promoção de release. Isso diminui a probabilidade de defeitos escaparem para produção e, quando escapam, acelera a detecção na pipeline — menos alterações “falham” sob o olhar do cliente e da operação.

Em uma linha para diretoria: __menos deploy sem prova, menos incidente financeiro-operacional, CFR mensurável em queda.__

---

## Artefato de código (Clean Code)

Regra de negócio __isolada__ (sem HTTP, sem UI, sem filas): cálculo do total com cupom __condicionado__ a __saldo/autorização disponível__ para o valor líquido. Ver `src/checkout/couponAndPayableTotal.ts`.

---

## Como usar este repositório

1. Colar o __link do GitHub__ no topo deste README, após o `git push`.  
2. Criar repositório público no GitHub, fazer push deste conteúdo.  
3. Colar o __link público__ no campo do AVA / no PDF, conforme instrução do professor.

---

_Referências conceituais: IEEE 730 (SQA Plans), ISO/IEC 25010 (adequação funcional), métricas DORA (Change Failure Rate), técnicas de validação e BDD (Aulas 09–10)._
