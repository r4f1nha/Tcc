# CONTEXTO DE MEMÓRIA CONTÍNUA — MecaFlow

> Este arquivo é a fonte de verdade para a IA entre sessões.
> Atualize os checkboxes conforme as tarefas forem concluídas.
> Nunca apague itens concluídos — eles servem como histórico.

---

## PROJETO

**Nome:** MecaFlow
**Descrição:** SaaS multi-tenant — CRM com agente de IA para oficinas mecânicas
**Repositório:** https://github.com/r4f1nha/Tcc
**Branch ativa (frontend):** `Renzo_front`
**Branch ativa (backend):** `Rafael_back_tcc`

---

## STACK

| Camada | Tecnologia |
|---|---|
| Frontend | Angular 21, standalone, NgRx, Bootstrap 4.6, Font Awesome |
| Backend | Java 21, Spring Boot, JPA/Hibernate, PostgreSQL (Neon cloud) |
| IA / Automações | n8n (não acesso direto — eventos via WebSocket) |
| Comunicação realtime | WebSocket (Socket.io planejado) |
| Banco de dados | PostgreSQL — Neon (cloud) |

---

## ESTADO ATUAL DA INTEGRAÇÃO

| Ponto | Status |
|---|---|
| CORS configurado | ❌ Não |
| Prefixo `/api` no backend | ❌ Não |
| JWT / Spring Security | ❌ Não |
| Serviços Angular consumindo API real | ❌ Não (mock/devMode) |
| WebSocket backend | ❌ Não |
| Nomenclatura alinhada (PT ↔ EN) | ❌ Parcial |

---

## ROADMAP DE TAREFAS

### FASE 1 — Integração Básica (Backend → Frontend)

- [ ] **[BACK]** Adicionar `server.servlet.context-path=/api` no `application.properties`
- [ ] **[BACK]** Criar `CorsConfig.java` — liberar `http://localhost:4200`
- [ ] **[BACK]** Padronizar nomenclatura: `Cliente` → `Lead`, `Etiqueta` → `Label`
- [ ] **[BACK]** Corrigir `@PathVariable` ausente em `getClienteById` e `getEtiquetaById`
- [ ] **[FRONT]** Atualizar `environment.ts` — confirmar `apiUrl: 'http://localhost:8080/api'`
- [ ] **[FRONT]** Substituir dados mock em `lead.service.ts` por chamadas reais a `/api/leads`
- [ ] **[FRONT]** Substituir dados mock em `appointment.service.ts` por chamadas reais a `/api/agenda`
- [ ] **[FRONT]** Substituir dados mock em `label.service.ts` por chamadas reais a `/api/labels`

### FASE 2 — Autenticação

- [ ] **[BACK]** Adicionar dependência Spring Security + JWT (`jjwt`) no `pom.xml`
- [ ] **[BACK]** Criar entidade `Usuario` com campos: `id`, `nome`, `email`, `senha`, `role`, `tenantId`, `ativo`
- [ ] **[BACK]** Criar `AuthController` com endpoints: `POST /api/auth/login`, `POST /api/auth/refresh`
- [ ] **[BACK]** Criar `JwtService` — geração e validação de tokens
- [ ] **[BACK]** Criar `SecurityConfig` — filtros, rotas públicas e protegidas
- [ ] **[BACK]** Criar `JwtFilter` — interceptar requests e validar token
- [ ] **[FRONT]** Ligar `auth.service.ts` ao endpoint real `POST /api/auth/login`
- [ ] **[FRONT]** Habilitar `JwtInterceptor` — validar que injeta header `Authorization: Bearer ...`
- [ ] **[FRONT]** Habilitar `TenantInterceptor` — validar que injeta header `X-Tenant-ID`
- [ ] **[FRONT]** Testar `AuthGuard` e `RoleGuard` com token real
- [ ] **[FRONT]** Desligar `devMode: true` no `environment.ts`

### FASE 3 — Multi-tenancy

- [ ] **[BACK]** Adicionar campo `tenantId` em todas as entidades
- [ ] **[BACK]** Criar filtro global de tenant em todas as queries (`@Query` com `WHERE tenant_id = ?`)
- [ ] **[BACK]** Validar que o `TenantInterceptor` no frontend envia `X-Tenant-ID` corretamente
- [ ] **[BACK]** Endpoint `POST /api/auth/register-tenant` para onboarding de nova oficina

### FASE 4 — Features Pendentes (Backend)

- [ ] **[BACK]** Criar entidade + CRUD de `Conversa` (Conversation)
- [ ] **[BACK]** Criar entidade + CRUD de `Mensagem` (Message)
- [ ] **[BACK]** Criar entidade + CRUD de `KanbanCard` (ServiceOrder)
- [ ] **[BACK]** Criar entidade + CRUD de `Time` (Team) + relacionamento com `Usuario`
- [ ] **[BACK]** Criar entidade + CRUD de `Automacao` (Automation)
- [ ] **[BACK]** Criar entidade + CRUD de `BaseConhecimento` (KnowledgeBase)

### FASE 5 — Realtime (WebSocket)

- [ ] **[BACK]** Adicionar dependência Spring WebSocket no `pom.xml`
- [ ] **[BACK]** Criar `WebSocketConfig.java` com STOMP broker
- [ ] **[BACK]** Criar endpoint `/ws/conversations` — emitir novas mensagens
- [ ] **[FRONT]** Ligar `websocket.service.ts` ao endpoint real `/ws`
- [ ] **[FRONT]** Conectar `ConversationEffects` para ouvir eventos WebSocket

### FASE 6 — Dashboard e Métricas

- [ ] **[BACK]** Criar `DashboardController` com endpoint `GET /api/dashboard/kpis`
- [ ] **[BACK]** KPIs: total de leads, conversas abertas, agendamentos hoje, taxa de resolução
- [ ] **[FRONT]** Ligar `dashboard.service.ts` ao endpoint real

### FASE 7 — Qualidade e Deploy

- [ ] Criar testes unitários nos services do backend (JUnit 5 + Mockito)
- [ ] Criar testes no frontend para guards e interceptors (Jest)
- [ ] Configurar variáveis de ambiente para produção (`environment.prod.ts`)
- [ ] Documentar API com Swagger/OpenAPI no backend
- [ ] Configurar CORS para domínio de produção
- [ ] Deploy backend (Railway, Render ou AWS)
- [ ] Deploy frontend (Vercel, Netlify ou S3)

---

## ESTRUTURA DE ARQUIVOS (resumo)

```
Tcc/
├── mecaflow/                         ← Frontend Angular 21
│   └── src/app/
│       ├── core/auth/                ← guards, interceptors, auth.service
│       ├── core/websocket/           ← websocket.service
│       ├── shared/                   ← componentes reutilizáveis
│       ├── layout/shell + sidebar/   ← layout principal
│       └── features/
│           ├── auth/
│           ├── dashboard/
│           ├── conversations/
│           ├── leads/
│           ├── appointments/
│           ├── kanban/
│           ├── knowledge-base/
│           ├── automations/
│           ├── labels/
│           ├── teams/
│           └── settings/
│
└── TCC/                              ← Backend Spring Boot
    └── src/main/java/com/moduloAi/TCC/
        ├── controller/               ← ClienteController, AgendaController, EtiquetaController
        ├── service/                  ← regras de negócio
        ├── repository/               ← interfaces JPA
        ├── domain/                   ← entidades JPA
        └── dto/                      ← request/response objects
```

---

## MAPEAMENTO FRONTEND ↔ BACKEND

| Frontend (Angular) | Backend (Spring) | Endpoint alvo |
|---|---|---|
| `lead.service.ts` | `ClienteController` | `/api/leads` |
| `appointment.service.ts` | `AgendaController` | `/api/appointments` |
| `label.service.ts` | `EtiquetaController` | `/api/labels` |
| `auth.service.ts` | `AuthController` (a criar) | `/api/auth/login` |
| `conversation.service.ts` | `ConversaController` (a criar) | `/api/conversations` |
| `kanban.service.ts` | `KanbanController` (a criar) | `/api/kanban` |
| `team.service.ts` | `TimeController` (a criar) | `/api/teams` |
| `dashboard.service.ts` | `DashboardController` (a criar) | `/api/dashboard/kpis` |

---

## DECISÕES TÉCNICAS REGISTRADAS

- Bootstrap 4.6 (não Tailwind) — migração já feita, manter
- Font Awesome `fas fa-*` — não usar SVG inline
- `devMode: true` no environment — permite testar frontend sem backend
- JWT em httpOnly cookie — nunca em localStorage
- Roles: `owner` > `admin` > `agent`
- Idioma das entidades backend: a padronizar para inglês (alinhado ao frontend)

---

## ÚLTIMA ATUALIZAÇÃO

Data: 2026-03-12
Responsável: IA (Claude Sonnet 4.6)
