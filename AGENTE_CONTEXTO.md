# Contexto para o Próximo Agente — MecaFlow + WAHA + n8n

> Você é um agente de IA continuando o desenvolvimento do **MecaFlow**, um SaaS CRM para atendimento WhatsApp. Este documento contém tudo que você precisa saber para continuar o trabalho sem perder contexto.

---

## 1. O que é este projeto

**MecaFlow** substitui o Chatwoot como CRM de atendimento WhatsApp da empresa CloudySolutions.

- Mensagens do WhatsApp chegam via **WAHA** (API WhatsApp self-hosted)
- Um bot n8n (**CloudyBot**) responde automaticamente enquanto nenhum agente humano assumiu
- O agente humano usa o MecaFlow para ver as conversas, assumir o atendimento e responder
- Quando um agente "assume", o bot **para de responder** para aquele número via Redis

---

## 2. Infraestrutura (já em produção na CloudySolutions)

| Serviço | URL | Obs |
|---------|-----|-----|
| WAHA API | `https://cloudy-waha.e4xqua.easypanel.host` | WhatsApp API |
| n8n | `https://n8n.cloudysolutions.fun` | Bot CloudyBot |
| Backend local | `http://localhost:8080/api` | Spring Boot |
| Frontend local | `http://localhost:4200` | Angular |

**WAHA:**
- API Key: `DH2zDGOz7KusN1UItxTI4LZxVeIVig9g` (header `X-Api-Key`)
- Session: `Cloudy`
- Webhook event: `message.any`

**n8n webhook ativo (não mexer):**
`POST https://n8n.cloudysolutions.fun/webhook/Recebemensagem`

**Redis (compartilhado com n8n):**
- URL: `redis://default:c875c4dcf056a7f60c08@cloudy_evolution-api-redis:6379`
- Chave de bloqueio do bot: `CloudSolutions_{wahaChatId}_block`
  - Ex: `CloudSolutions_5511999999999@s.whatsapp.net_block`
  - Valor `true` sem TTL = bot bloqueado permanentemente para esse número
  - Deletar a chave = bot volta a responder

**Banco de dados:**
- PostgreSQL no Neon (já conectado, `ddl-auto=update` vai criar tabelas automaticamente)
- URL no `application.properties` (não precisa configurar nada)

---

## 3. Stack técnica

- **Backend:** Java 21 + Spring Boot 4.0.3 + JPA/Hibernate + Redis + WebFlux (WebClient)
- **Frontend:** Angular 21 + NgRx + Bootstrap 4.6 + Font Awesome
- **Banco:** PostgreSQL (Neon cloud)
- **Build backend:** Maven (usar `./mvnw` ou `mvnw.cmd` no Windows)
- **Build frontend:** Node 18+ com `npm install && npm start`

---

## 4. Estado atual da implementação

### O que JÁ foi implementado (branch `implementacao_n8n`)

**Backend — `TCC/` — Spring Boot:**

```
TCC/src/main/java/com/moduloAi/TCC/
├── domain/
│   ├── Conversation.java        ✅ Entidade JPA (tabela conversations)
│   ├── Message.java             ✅ Entidade JPA (tabela messages)
│   ├── Automation.java          ✅ Entidade JPA (tabela automations)
│   ├── AutomationCondition.java ✅ Entidade JPA (tabela automation_conditions)
│   └── AutomationAction.java    ✅ Entidade JPA (tabela automation_actions)
├── dto/
│   ├── ConversationResponse.java ✅
│   ├── MessageResponse.java      ✅
│   ├── SendMessageRequest.java   ✅
│   ├── AssignRequest.java        ✅
│   ├── AddLabelRequest.java      ✅
│   ├── AutomationConditionDto.java ✅
│   ├── AutomationActionDto.java    ✅
│   ├── AutomationRequest.java      ✅
│   └── AutomationResponse.java     ✅
├── repository/
│   ├── ConversationRepository.java ✅
│   ├── MessageRepository.java      ✅
│   └── AutomationRepository.java   ✅
├── service/
│   ├── WahaApiService.java      ✅ Envia mensagens via WebClient para WAHA
│   ├── ConversationService.java ✅ CRUD completo de conversas + mensagens
│   ├── WebhookService.java      ✅ Processa payload do WAHA
│   └── AutomationService.java   ✅ Motor de automações (condições + ações)
├── controller/
│   ├── ConversationController.java ✅ REST /conversations
│   ├── WebhookController.java      ✅ POST /webhooks/waha
│   └── AutomationController.java   ✅ REST /automations
└── config/
    └── CorsConfig.java             ✅ (já existia, libera localhost:4200)
```

**Frontend — `mecaflow/` — Angular:**
- Todas as telas já existem: inbox, conversation-detail, leads, kanban, agenda, automations, settings
- Usa Bootstrap 4.6 (não Tailwind)
- Ícones: Font Awesome (`fas fa-*`)
- **Porém:** o frontend ainda está mockado/desconectado do backend real

**Endpoints disponíveis no backend:**
```
GET    /api/conversations                        → lista conversas (opcional ?status=BOT|HUMAN|RESOLVED)
GET    /api/conversations/{id}                   → detalhe
GET    /api/conversations/{id}/messages          → mensagens paginadas (?page=0&size=50)
POST   /api/conversations/{id}/send              → enviar mensagem { "content": "texto" }
PATCH  /api/conversations/{id}/resolve           → resolver conversa
PATCH  /api/conversations/{id}/assign            → { "agentId": "x", "agentName": "y" }
PATCH  /api/conversations/{id}/human             → modo humano (agente assume)
PATCH  /api/conversations/{id}/bot               → modo bot (libera para o bot)
POST   /api/conversations/{id}/labels            → { "labelId": 1 }
DELETE /api/conversations/{id}/labels/{labelId}  → remove label
POST   /api/webhooks/waha                        → recebe eventos do WAHA
GET    /api/automations                          → lista automações
POST   /api/automations                          → cria automação
PUT    /api/automations/{id}                     → atualiza
DELETE /api/automations/{id}                     → deleta
PATCH  /api/automations/{id}/toggle              → ativa/desativa
```

---

## 5. O que AINDA PRECISA ser feito

### Prioridade CRÍTICA (sem isso o sistema não funciona end-to-end)

#### 5.1 Integração Redis no ConversationService
`setHumanMode()` e `setBotMode()` atualmente **só atualizam o banco**, mas NÃO tocam no Redis. O n8n verifica o Redis para decidir se responde ou não.

Precisa adicionar ao `ConversationService.java`:

```java
// Injetar no construtor:
private final StringRedisTemplate redisTemplate;

// Em setHumanMode():
String redisKey = "CloudSolutions_" + conversation.getWahaChatId() + "_block";
redisTemplate.opsForValue().set(redisKey, "true"); // sem TTL = permanente

// Em setBotMode():
String redisKey = "CloudSolutions_" + conversation.getWahaChatId() + "_block";
redisTemplate.delete(redisKey);
```

#### 5.2 Configurar webhook duplo no WAHA (fazer após deploy)

```bash
curl -X PUT "https://cloudy-waha.e4xqua.easypanel.host/api/sessions/Cloudy/config" \
  -H "X-Api-Key: DH2zDGOz7KusN1UItxTI4LZxVeIVig9g" \
  -H "Content-Type: application/json" \
  -d '{
    "webhooks": [
      {
        "url": "https://n8n.cloudysolutions.fun/webhook/Recebemensagem",
        "events": ["message.any"]
      },
      {
        "url": "https://{SEU_DOMINIO_BACKEND}/api/webhooks/waha",
        "events": ["message.any"]
      }
    ]
  }'
```

Substituir `{SEU_DOMINIO_BACKEND}` pelo domínio real após deploy no EasyPanel.

#### 5.3 Conectar o frontend Angular ao backend real

O frontend está mockado. Precisa criar/atualizar os services Angular para chamar os endpoints reais:

- `ConversationInboxComponent` → `GET /api/conversations`
- `ConversationDetailComponent` → `GET /api/conversations/{id}/messages` + `POST /api/conversations/{id}/send`
- Botão "Assumir" → `PATCH /api/conversations/{id}/human`
- Botão "Liberar bot" → `PATCH /api/conversations/{id}/bot`

O `environment.ts` provavelmente tem `apiUrl` que deve apontar para `http://localhost:8080/api` (dev) e o domínio EasyPanel (prod).

#### 5.4 Dockerfile para deploy no EasyPanel

Criar `TCC/Dockerfile` para o backend:

```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

E um `docker-compose.yml` na raiz para rodar localmente:

```yaml
version: '3.8'
services:
  backend:
    build: ./TCC
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: ${DATABASE_URL}
      WAHA_API_KEY: ${WAHA_API_KEY}
      SPRING_DATA_REDIS_URL: ${REDIS_URL}
```

---

## 6. Problemas conhecidos / issues do código atual

1. **`WebhookController` sem autenticação** — qualquer um pode fazer POST em `/api/webhooks/waha`. Para produção, validar o header `X-Api-Key` da requisição.

2. **`WahaApiService.sendText()` usa `.block()`** — Bloqueia a thread. Aceitável em Tomcat, mas monitorar timeout. Adicionar `.timeout(Duration.ofSeconds(10))` antes do `.block()`.

3. **Race condition em `findOrCreateConversation`** — Se duas mensagens chegarem simultaneamente para o mesmo número, pode tentar criar duas conversas (vai dar erro de UNIQUE constraint). Adicionar `try/catch DataIntegrityViolationException` e buscar novamente no catch.

4. **`Long.parseLong(action.getValue())` sem try/catch** em `AutomationService.executeAction()` — Vai explodir com `NumberFormatException` se o valor não for numérico. Envolver em try/catch.

5. **`application.properties` tem credenciais em texto plano** — Para produção, usar variáveis de ambiente no EasyPanel e referenciar como `${DATABASE_URL}` no properties.

6. **`senderName` hardcoded como "Agente"** em `ConversationService.sendMessage()` — Quando tiver autenticação, passar o nome do agente logado.

---

## 7. Como rodar localmente

**Pré-requisitos:**
- JDK 21
- Node 18+
- (Opcional) Redis local — mas o Redis de produção já está configurado no application.properties

**Backend:**
```bash
cd TCC
./mvnw spring-boot:run
# Windows:
mvnw.cmd spring-boot:run
```
Acessa: `http://localhost:8080/api/conversations`

**Frontend:**
```bash
cd mecaflow
npm install
npm start
```
Acessa: `http://localhost:4200`

**Verificar se backend está OK:**
```bash
curl http://localhost:8080/api/conversations
# Deve retornar []
curl http://localhost:8080/api/labels
# Deve retornar as labels existentes no banco
```

---

## 8. Formato do payload que o WAHA envia

```json
{
  "body": {
    "session": "Cloudy",
    "event": "message.any",
    "payload": {
      "from": "5511999999999@s.whatsapp.net",
      "body": "texto da mensagem",
      "hasMedia": false,
      "key": { "fromMe": false },
      "_data": {
        "Info": {
          "PushName": "Nome do Contato",
          "Timestamp": 1234567890
        }
      },
      "media": {
        "url": "https://...",
        "mimetype": "audio/ogg"
      }
    }
  }
}
```

- `fromMe: true` = mensagem enviada pelo backend/agente (ignorar no webhook)
- `fromMe: false` = mensagem recebida do lead (processar)

---

## 9. Estrutura de diretórios do repositório

```
Tcc/                          ← raiz do repositório
├── TCC/                      ← backend Spring Boot
│   ├── src/main/java/com/moduloAi/TCC/
│   ├── src/main/resources/application.properties
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
├── mecaflow/                 ← frontend Angular
│   ├── src/app/
│   │   ├── features/conversations/  ← tela de inbox e chat
│   │   ├── features/leads/
│   │   ├── features/kanban/
│   │   ├── features/agenda/
│   │   ├── features/automations/
│   │   ├── layout/shell/ + sidebar/
│   │   └── core/ (auth, guards)
│   ├── src/environments/
│   └── package.json
└── PLANO_ACAO.md             ← plano completo com todas as tarefas
```

---

## 10. Convenções do projeto Angular (frontend)

- **Componentes:** standalone, `OnPush` ChangeDetection
- **Estado:** NgRx (store, actions, reducers, effects, selectors) por feature
- **CSS:** Bootstrap 4.6 global (`src/styles.scss`), sem Tailwind
- **Ícones:** Font Awesome (`<i class="fas fa-*">`) — NÃO usar SVG
- **Layout padrão de cards:**
  ```html
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
    <div class="card-body">
    <div class="card-footer">
  ```
- **Badges:** `<span class="badge badge-pill badge-primary">`
- **Tabelas:** `<table class="table table-hover table-sm"><thead class="thead-light">`

---

## 11. Próximas tarefas em ordem de prioridade

1. Implementar Redis no `ConversationService` (item 5.1) — **impacta diretamente o bot**
2. Criar `Dockerfile` para o backend (item 5.4) — **necessário para EasyPanel**
3. Conectar frontend Angular ao backend real (item 5.3) — **necessário para testar**
4. Configurar webhook duplo no WAHA (item 5.2) — **fazer após backend estar online**
5. Adicionar tratamento de erros global (`@RestControllerAdvice`) no backend
6. Adicionar autenticação no `WebhookController` (validar API key do WAHA)
7. Adicionar timeout no `WahaApiService.sendText()`
8. Corrigir race condition em `findOrCreateConversation`
