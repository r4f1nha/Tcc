# PLANO DE AÇÃO — Integração MecaFlow + WAHA + n8n

> Execute este plano na ordem das fases. Leia REGRAS_IA.md e CONTEXTO_IA.md antes de qualquer código.
> Ao concluir cada tarefa, marque como feita com `[x]`.

---

## CONTEXTO DO PROJETO

**MecaFlow** é um SaaS CRM para atendimento WhatsApp que substituirá o Chatwoot.

| Serviço       | URL                                                      |
|---------------|----------------------------------------------------------|
| WAHA API      | `https://cloudy-waha.e4xqua.easypanel.host`              |
| n8n           | `https://n8n.cloudysolutions.fun`                        |
| Chatwoot      | `https://chatwoot-chatwoot.e4xqua.easypanel.host` (substituir) |
| Backend local | `http://localhost:8080/api`                              |
| Frontend local| `http://localhost:4200`                                  |

**WAHA:**
- API Key: `DH2zDGOz7KusN1UItxTI4LZxVeIVig9g` (header: `X-Api-Key`)
- Session: `Cloudy`
- Evento de webhook: `message.any`

**n8n webhook ativo:** `POST https://n8n.cloudysolutions.fun/webhook/Recebemensagem`
- Bot CloudyBot continua funcionando normalmente
- MecaFlow recebe webhook em paralelo

**Formato do webhook que o WAHA envia:**
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

**Mecanismo bot/humano (Redis compartilhado com n8n):**
- Chave Redis: `CloudSolutions_{telefone@s.whatsapp.net}_block`
- Valor: `true` — bot para de responder para esse número
- TTL padrão do bot: 900s (15min)
- Para bloquear permanentemente: setar sem TTL ou TTL longo (ex: 86400s)
- Para liberar (reativar bot): deletar a chave

---

## ESTRUTURA DE ARQUIVOS DO BACKEND

```
TCC/src/main/java/com/moduloAi/TCC/
├── config/
│   └── CorsConfig.java          (já existe)
├── controller/
│   ├── LabelController.java     (já existe)
│   ├── LeadController.java      (já existe)
│   ├── AppointmentController.java (já existe)
│   ├── ConversationController.java  (CRIAR)
│   ├── AutomationController.java    (CRIAR)
│   └── WebhookController.java       (CRIAR)
├── domain/
│   ├── Label.java               (já existe)
│   ├── Lead.java                (já existe)
│   ├── Appointment.java         (já existe)
│   ├── Conversation.java        (CRIAR)
│   ├── Message.java             (CRIAR)
│   ├── ConversationLabel.java   (CRIAR — tabela de junção)
│   ├── Automation.java          (CRIAR)
│   ├── AutomationCondition.java (CRIAR)
│   └── AutomationAction.java    (CRIAR)
├── dto/
│   ├── ConversationResponse.java  (CRIAR)
│   ├── MessageResponse.java       (CRIAR)
│   ├── SendMessageRequest.java    (CRIAR)
│   ├── AssignRequest.java         (CRIAR)
│   ├── AddLabelRequest.java       (CRIAR)
│   ├── AutomationRequest.java     (CRIAR)
│   └── AutomationResponse.java    (CRIAR)
├── repository/
│   ├── ConversationRepository.java (CRIAR)
│   └── MessageRepository.java      (CRIAR)
│   └── AutomationRepository.java   (CRIAR)
├── service/
│   ├── ConversationService.java    (CRIAR)
│   ├── WebhookService.java         (CRIAR)
│   ├── WahaApiService.java         (CRIAR)
│   └── AutomationService.java      (CRIAR)
└── resources/
    └── application.properties      (ATUALIZAR)
```

---

## FASE 1 — application.properties

### Tarefa 1.1 — Atualizar application.properties

Arquivo: `TCC/src/main/resources/application.properties`

Substituir `spring.jpa.hibernate.ddl-auto=validate` por `update`.
Adicionar configurações do WAHA e Redis:

```properties
spring.datasource.url=jdbc:postgresql://ep-small-sun-aia1wbw6-pooler.c-4.us-east-1.aws.neon.tech/neondb?user=neondb_owner&password=npg_Abdu0NUXRK6E&sslmode=require&channelBinding=require
spring.datasource.username=neondb_owner
spring.datasource.password=npg_Abdu0NUXRK6E

spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=false

server.servlet.context-path=/api

# WAHA
waha.base-url=https://cloudy-waha.e4xqua.easypanel.host
waha.api-key=DH2zDGOz7KusN1UItxTI4LZxVeIVig9g
waha.session=Cloudy

# Redis (para controle bot/humano)
spring.data.redis.url=redis://default:c875c4dcf056a7f60c08@cloudy_evolution-api-redis:6379
```

- [x] Tarefa 1.1 concluída

---

## FASE 2 — Dependências (pom.xml)

### Tarefa 2.1 — Adicionar dependências necessárias

Arquivo: `TCC/pom.xml`

Adicionar dentro de `<dependencies>`:

```xml
<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- Redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- WebClient para chamar WAHA API -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

- [x] Tarefa 2.1 concluída

---

## FASE 3 — Domínio (Entidades JPA)

### Tarefa 3.1 — Criar Conversation.java

- [x] Tarefa 3.1 concluída

---

### Tarefa 3.2 — Criar Message.java

- [x] Tarefa 3.2 concluída

---

### Tarefa 3.3 — Criar Automation.java, AutomationCondition.java, AutomationAction.java

- [x] Tarefa 3.3 concluída

---

## FASE 4 — Repositories

### Tarefa 4.1 — Criar ConversationRepository.java
### Tarefa 4.2 — Criar MessageRepository.java
### Tarefa 4.3 — Criar AutomationRepository.java

- [x] Tarefa 4.1, 4.2, 4.3 concluídas

---

## FASE 5 — DTOs

### Tarefa 5.1 — Criar DTOs de Conversation e Message

- [x] Tarefa 5.1 concluída

---

### Tarefa 5.2 — Criar DTOs de Automation

- [x] Tarefa 5.2 concluída

---

## FASE 6 — Services

### Tarefa 6.1 — Criar WahaApiService.java

- [x] Tarefa 6.1 concluída

---

### Tarefa 6.2 — Criar ConversationService.java

- [x] Tarefa 6.2 concluída

---

### Tarefa 6.3 — Criar WebhookService.java

- [x] Tarefa 6.3 concluída

---

### Tarefa 6.4 — Criar AutomationService.java

- [x] Tarefa 6.4 concluída

---

## FASE 7 — Controllers

### Tarefa 7.1 — Criar ConversationController.java

- [x] Tarefa 7.1 concluída

---

### Tarefa 7.2 — Criar WebhookController.java

- [x] Tarefa 7.2 concluída

---

### Tarefa 7.3 — Criar AutomationController.java

- [x] Tarefa 7.3 concluída

---

## FASE 8 — Configuração do WAHA (webhook duplo)

### Tarefa 8.1 — Configurar webhook no WAHA via API

Após o backend estar rodando e acessível publicamente (via EasyPanel), fazer a chamada:

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
        "url": "https://{BACKEND_DOMAIN}/api/webhooks/waha",
        "events": ["message.any"]
      }
    ]
  }'
```

**Substituir `{BACKEND_DOMAIN}` pelo domínio real do backend no EasyPanel.**

- [ ] Tarefa 8.1 concluída (fazer após deploy)

---

## FASE 9 — Validação

### Checklist final

- [ ] Backend compila sem erros (`./mvnw clean package -DskipTests`)
- [ ] Tabelas criadas no Neon automaticamente (`ddl-auto=update`)
- [ ] `GET /api/conversations` retorna `[]` sem erro
- [ ] `GET /api/labels` retorna labels existentes
- [ ] Webhook recebe payload do WAHA e cria conversa + mensagem
- [ ] Envio de mensagem pelo frontend chega no WhatsApp
- [ ] Automação com `ADD_LABEL` funciona ao receber mensagem com palavra-chave
- [ ] Modo HUMAN bloqueia bot (chave Redis setada)
- [ ] Modo BOT libera bot (chave Redis deletada)

---

## OBSERVAÇÕES IMPORTANTES

1. **ddl-auto=update**: cria as tabelas automaticamente no Neon na primeira vez que o backend subir. Seguro para desenvolvimento.

2. **Redis compartilhado**: o backend usa o mesmo Redis do n8n para controle bot/humano. A chave é `CloudSolutions_{wahaChatId}_block`. Quando o agente clicar em "Assumir" no MecaFlow, o backend seta essa chave sem TTL. Quando liberar, deleta.

3. **Mensagens fromMe**: o webhook `message.any` envia TODAS as mensagens, incluindo as que o backend enviou. Filtrar `payload.key.fromMe == true` para salvar como mensagem do agente sem reprocessar.

4. **Paginação de mensagens**: usar `Pageable` com tamanho padrão de 50 mensagens, ordem crescente por `createdAt`.

5. **CORS**: o `CorsConfig.java` já existe e libera `localhost:4200`. Para produção, adicionar o domínio do frontend.
