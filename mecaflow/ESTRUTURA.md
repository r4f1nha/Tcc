# MecaFlow — Estrutura do Frontend

## Stack
- **Framework:** Angular 17+ (standalone components, signals)
- **Estilização:** TailwindCSS
- **Estado global:** NgRx (actions, reducers, effects, selectors)
- **Comunicação real-time:** Socket.io
- **HTTP:** Angular HttpClient com interceptors
- **Formulários:** Reactive Forms
- **Backend:** Java (Spring Boot) — apenas consome APIs REST
- **IA:** n8n — recebe eventos via WebSocket

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── core/                          # Serviços singleton, auth, segurança
│   │   ├── auth/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts          → CanActivateFn - verifica autenticação
│   │   │   │   └── role.guard.ts          → CanActivateFn - verifica role (OWNER/ADMIN/AGENT)
│   │   │   ├── interceptors/
│   │   │   │   ├── jwt.interceptor.ts     → Injeta Authorization header + refresh automático
│   │   │   │   ├── tenant.interceptor.ts  → Injeta X-Tenant-ID header (multi-tenant)
│   │   │   │   ├── error.interceptor.ts   → Captura erros HTTP, loga e redireciona
│   │   │   │   └── loading.interceptor.ts → Controla estado de loading global
│   │   │   ├── models/
│   │   │   │   └── user.model.ts          → User, UserRole enum, TokenPayload, LoginRequest/Response
│   │   │   └── services/
│   │   │       └── auth.service.ts        → Login, logout, refresh, idle detection (30min)
│   │   ├── services/
│   │   │   ├── log.service.ts             → Logging estruturado (sem console.log direto)
│   │   │   ├── loading.service.ts         → Estado de loading via signals
│   │   │   └── theme.service.ts           → Tema claro/escuro com persistência
│   │   ├── websocket/
│   │   │   └── websocket.service.ts       → Socket.io: connect, on<T>, emit<T>, connected$
│   │   └── error/
│   │       └── global-error-handler.ts    → ErrorHandler global
│   │
│   ├── shared/                        # Componentes reutilizáveis
│   │   ├── components/
│   │   │   ├── button/                    → Botão com variantes (primary/secondary/danger/ghost)
│   │   │   ├── badge/                     → Badge com variantes de cor
│   │   │   ├── modal/                     → Modal dialog reutilizável
│   │   │   ├── avatar/                    → Avatar com initials fallback + status dot
│   │   │   ├── empty-state/              → Empty state ilustrado
│   │   │   ├── skeleton/                  → Skeleton loading (text/circle/card/table-row)
│   │   │   ├── toast/                     → Toast service + container (success/error/warning/info)
│   │   │   ├── confirm-dialog/           → Dialog de confirmação
│   │   │   └── search-input/             → Input com debounce de 300ms
│   │   ├── directives/
│   │   │   ├── has-role.directive.ts      → *appHasRole="[ADMIN, OWNER]" - esconde por role
│   │   │   └── click-outside.directive.ts → Detecta click fora do elemento
│   │   ├── pipes/
│   │   │   ├── time-ago.pipe.ts           → "há 5 minutos" (pt-BR)
│   │   │   ├── truncate.pipe.ts           → Trunca texto com "..."
│   │   │   └── status-label.pipe.ts       → Converte enums para labels em português
│   │   └── validators/
│   │       └── custom-validators.ts       → CPF, CNPJ, telefone BR, senha forte, matchFields
│   │
│   ├── layout/                        # Layout da aplicação
│   │   ├── sidebar/
│   │   │   └── sidebar.component.ts       → Sidebar recolhível com navegação + toggle tema
│   │   └── shell/
│   │       └── shell.component.ts         → Shell: sidebar + <router-outlet> + toasts
│   │
│   └── features/                      # Módulos de funcionalidade (lazy loaded)
│       │
│       ├── auth/                      → Login, recuperar senha, resetar senha
│       │   ├── models/
│       │   ├── services/
│       │   ├── store/ (actions, reducers, effects, selectors)
│       │   ├── components/ (login-form, forgot-password-form, reset-password-form)
│       │   ├── containers/ (login-page, forgot-password-page, reset-password-page)
│       │   └── auth.routes.ts
│       │
│       ├── dashboard/                 → Métricas, KPIs, atividades recentes
│       │   ├── models/
│       │   ├── services/
│       │   ├── store/
│       │   ├── components/ (kpi-card, metrics-grid, period-selector, recent-activity)
│       │   ├── containers/ (dashboard-page)
│       │   └── dashboard.routes.ts
│       │
│       ├── conversations/             → Inbox estilo Chatwoot (3 abas: Bot/Humano/Resolvidas)
│       │   ├── models/
│       │   ├── services/
│       │   ├── store/
│       │   ├── components/ (tab-filter, conversation-list-item, message-bubble,
│       │   │                message-input, conversation-header, label-selector)
│       │   ├── containers/ (conversation-inbox, conversation-detail)
│       │   └── conversations.routes.ts
│       │
│       ├── leads/                     → Lista, perfil, filtros, importação CSV
│       │   ├── models/
│       │   ├── services/
│       │   ├── store/
│       │   ├── components/ (lead-table)
│       │   ├── containers/ (lead-list-page, lead-detail-page)
│       │   └── leads.routes.ts
│       │
│       ├── appointments/              → Agenda com visualizações Mês/Semana/Dia
│       │   ├── models/
│       │   ├── services/
│       │   ├── store/
│       │   ├── containers/ (agenda-page)
│       │   └── appointments.routes.ts
│       │
│       ├── kanban/                    → Board + Lista, drag-and-drop (CDK), forward-only
│       │   ├── models/
│       │   ├── services/
│       │   ├── store/ (com optimistic update no drag-and-drop)
│       │   ├── containers/ (kanban-page)
│       │   └── kanban.routes.ts
│       │
│       ├── knowledge-base/            → CRUD de entradas RAG (apenas admin/owner)
│       │   ├── models/
│       │   ├── services/
│       │   ├── store/
│       │   ├── containers/ (knowledge-base-page)
│       │   └── knowledge-base.routes.ts
│       │
│       ├── automations/               → Automações por etiqueta (toggle ativar/desativar)
│       │   ├── models/
│       │   ├── services/
│       │   ├── containers/ (automations-page)
│       │   └── automations.routes.ts
│       │
│       ├── teams/                     → Times e usuários (apenas owner cria/altera roles)
│       │   ├── models/
│       │   ├── services/
│       │   ├── containers/ (teams-page)
│       │   └── teams.routes.ts
│       │
│       └── settings/                  → Configurações da oficina (apenas admin/owner)
│           ├── models/
│           ├── services/
│           ├── containers/ (settings-page)
│           └── settings.routes.ts
│
├── environments/
│   ├── environment.ts                     → Dev (localhost:8080)
│   └── environment.prod.ts                → Produção
│
└── styles.scss                            → TailwindCSS + tema + scrollbar custom
```

---

## Permissões por Role

| Módulo          | OWNER | ADMIN | AGENT |
|-----------------|-------|-------|-------|
| Dashboard       | ✅     | ✅     | ✅     |
| Conversations   | ✅     | ✅     | ✅     |
| Leads           | ✅     | ✅     | ✅     |
| Appointments    | ✅     | ✅     | ✅     |
| Kanban          | ✅     | ✅     | 👁️ Somente leitura |
| Knowledge Base  | ✅     | ✅     | ❌     |
| Automations     | ✅     | ✅     | ❌     |
| Teams           | ✅     | ❌     | ❌     |
| Settings        | ✅     | ✅     | ❌     |

---

## Design System

- **Tema escuro:** bg `#0f1117`, sidebar `#1a1d27`, cards `#22263a`, accent `#4F6EF7`
- **Tema claro:** bg `#f8fafc`, cards `#ffffff`
- **Tipografia:** Inter (corpo), JetBrains Mono (timestamps, IDs, valores)
- **Status colors:** success `#22c55e`, warning `#eab308`, danger `#ef4444`, muted `#6b7280`

---

## Comandos

```bash
cd Tcc/mecaflow
npm start          # Inicia dev server (http://localhost:4200)
npm run build      # Build de produção
npm test           # Roda testes
```

---

## Regras de Segurança Implementadas

- JWT em httpOnly cookie (nunca localStorage)
- Refresh token silencioso via interceptor
- Logout automático após 30min de inatividade
- 4 interceptors: JWT, Tenant, Error, Loading
- RoleGuard em rotas protegidas
- Diretiva *appHasRole para esconder elementos no template
- Sanitização de inputs via Reactive Forms + validators custom
- LogService estruturado (sem console.log direto)
- GlobalErrorHandler para erros não capturados
