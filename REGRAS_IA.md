# REGRAS PARA IA — MecaFlow

> Leia este arquivo INTEIRO antes de escrever qualquer código.
> Estas regras valem para frontend (Angular) e backend (Spring Boot).
> Nunca gere código que viole qualquer uma das seções abaixo.

---

## 1. PRINCÍPIOS SOLID

### S — Single Responsibility
- Cada classe/service faz UMA coisa.
- `LeadService` só lida com leads. `AuthService` só com autenticação.
- Se um método faz mais de uma coisa, quebre em métodos privados.

### O — Open/Closed
- Use interfaces e injeção para variar comportamentos.
- O componente de lista não deve mudar ao adicionar um novo tipo de filtro.
- Prefira composição a herança.

### L — Liskov Substitution
- Implemente interfaces de forma que qualquer implementação seja intercambiável.
- Nunca use `any` no TypeScript. Nunca use `Object` no Java onde pode usar generics.

### I — Interface Segregation
- Crie interfaces pequenas e específicas.
- Nunca uma interface com 20+ campos opcionais.
- Separe `LeadFilters` de `Lead` de `LeadFormData`.

### D — Dependency Inversion
- Components Angular dependem de services injetados, nunca de implementações concretas.
- Services Spring Boot recebem repositories via construtor, nunca instanciam diretamente.

---

## 2. CLEAN CODE

### Nomes
- Descritivos e sem abreviações: `getActiveConversationsByTenant()` não `getData()`
- Variáveis booleanas: `isLoading`, `hasError`, `canEdit`
- Constantes: `UPPER_SNAKE_CASE` em arquivo separado `constants.ts`
- Enums para status — nunca strings mágicas:
  ```typescript
  // ERRADO
  if (lead.status === 'active') {}
  // CORRETO
  if (lead.status === LeadStatus.ACTIVE) {}
  ```

### Funções e Métodos
- Máximo 20 linhas por função. Se passar, extraia.
- Um nível de abstração por função.
- Sem efeitos colaterais ocultos.

### Componentes Angular
- Máximo 150 linhas por componente. Se passar, extraia um filho.
- Sem lógica de negócio no componente — tudo no service.
- Sem `console.log` solto — usar `LogService`.

### Comentários
- O código deve ser autoexplicativo.
- Comente apenas o "por que", nunca o "o que".
- Remova código comentado antes de commitar.

---

## 3. PADRÕES DO PROJETO ANGULAR

### Estrutura obrigatória por feature
```
feature-name/
├── components/        → UI "burra" — só recebe @Input e emite @Output
├── containers/        → Smart — conecta ao NgRx store
├── services/          → HTTP e regras de negócio
├── store/
│   ├── actions/
│   ├── reducers/
│   ├── effects/
│   └── selectors/
├── models/            → interfaces TypeScript + enums
└── feature.routes.ts  → lazy loading
```

### Service padrão
```typescript
@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/leads`;

  getAll(filters: LeadFilters): Observable<PaginatedResponse<Lead>> {
    return this.http.get<PaginatedResponse<Lead>>(this.API, {
      params: this.buildParams(filters)
    });
  }

  private buildParams(filters: LeadFilters): HttpParams {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    return params;
  }
}
```

### Effect padrão
```typescript
loadLeads$ = createEffect(() =>
  this.actions$.pipe(
    ofType(LeadActions.loadLeads),
    switchMap(({ filters }) =>
      this.leadService.getAll(filters).pipe(
        map(response => LeadActions.loadLeadsSuccess({ response })),
        catchError(error => of(LeadActions.loadLeadsFailure({ error })))
      )
    )
  )
);
```

### Component padrão
```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class LeadListPage implements OnInit {
  private readonly store = inject(Store);

  leads$ = this.store.select(selectLeads);
  isLoading$ = this.store.select(selectLeadsLoading);

  ngOnInit(): void {
    this.store.dispatch(LeadActions.loadLeads({ filters: {} }));
  }

  trackById(_: number, item: Lead): number { return item.id; }
}
```

### Regras de template
- Sempre `trackBy` em `*ngFor`
- Sempre `async pipe` — nunca `.subscribe()` no componente
- Sempre skeleton loading enquanto `isLoading$` for `true`
- Sempre empty state quando lista for vazia
- Usar classes Bootstrap 4 — nunca Tailwind, nunca CSS inline

### Regras de tipagem
- Nunca `any`
- Nunca `Object` genérico
- Resposta paginada: `PaginatedResponse<T>` com `items`, `total`, `page`, `pageSize`
- Nunca `Array<any>` — sempre `T[]`

### Subscriptions
- Nunca `.subscribe()` sem destruição
- Usar `takeUntilDestroyed()` ou `async pipe`
- Nunca guardar subscription manual a menos que seja necessário

---

## 4. PADRÕES DO PROJETO SPRING BOOT

### Controller padrão
```java
@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<List<LeadResponse>> list() {
        return ResponseEntity.ok(leadService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.findById(id));
    }

    @PostMapping
    public ResponseEntity<LeadResponse> create(@RequestBody @Valid LeadRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leadService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid LeadRequest request) {
        return ResponseEntity.ok(leadService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Regras do Controller
- Sempre retornar `ResponseEntity<T>` com status HTTP correto
- `@Valid` em todo `@RequestBody`
- ID sempre como `@PathVariable`, nunca como query param em PUT/DELETE
- Sem lógica de negócio no controller — só delegar ao service

### Service padrão
```java
@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadMapper leadMapper;

    public List<LeadResponse> list() {
        return leadRepository.findAll().stream()
            .map(leadMapper::toResponse)
            .toList();
    }

    public LeadResponse findById(Long id) {
        return leadRepository.findById(id)
            .map(leadMapper::toResponse)
            .orElseThrow(() -> new EntityNotFoundException("Lead não encontrado: " + id));
    }
}
```

### Regras do Service
- Receber entidades via repository, nunca instanciar `new Entity()` na lógica
- Usar mapper para converter entre entidade e DTO
- Lançar exceções específicas — nunca retornar `null`
- Sem referência a `HttpServletRequest` ou headers no service — isso é responsabilidade do controller/filter

### Entidade padrão
```java
@Entity
@Table(name = "leads")
@Getter @Setter @NoArgsConstructor
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private LeadStatus status;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### DTO padrão
- Sempre separar `Request` (entrada) de `Response` (saída)
- `Request`: campos obrigatórios com `@NotBlank`, `@NotNull`, `@Valid`
- `Response`: campos que o cliente precisa ver, nunca senhas ou dados sensíveis
- Nunca expor a entidade JPA diretamente na API

---

## 5. SEGURANÇA

### Frontend
- JWT armazenado em httpOnly cookie — **NUNCA** em `localStorage`
- Inputs sanitizados antes de enviar ao backend
- `DomSanitizer` para qualquer HTML vindo da API
- Desabilitar botão de submit durante requisição (`isLoading`)
- `AuthGuard` em todas as rotas privadas
- `RoleGuard` em rotas restritas por papel

### Backend
- Nunca expor stack trace ao cliente — handler global de exceções
- Senhas com `BCryptPasswordEncoder`
- Validar `@Valid` em todo request body
- Filtrar por `tenantId` em TODAS as queries — nunca retornar dados de outro tenant
- CORS restrito a origens conhecidas
- Endpoints `/api/auth/**` públicos, todo o resto autenticado

### Roles
| Role | Acesso |
|---|---|
| `owner` | Tudo |
| `admin` | Tudo exceto billing |
| `agent` | Conversations, Leads, Appointments, Kanban (read-only) |

---

## 6. PERFORMANCE

### Angular
- `ChangeDetectionStrategy.OnPush` em TODOS os componentes
- Lazy loading em TODAS as features — nunca importar feature no bundle principal
- `trackBy` em todo `*ngFor`
- `takeUntilDestroyed()` em toda subscription
- Debounce de 300ms em campos de busca
- Virtual scroll em listas com mais de 50 itens

### Spring Boot
- Usar paginação em endpoints de listagem — nunca retornar lista completa sem limite
- Índices no banco para campos de busca frequente (`email`, `tenantId`, `status`)
- Nunca fazer N+1 queries — usar `JOIN FETCH` ou `@EntityGraph`

---

## 7. UI — PADRÕES VISUAIS

### Bootstrap 4.6 (obrigatório)
- Grid: `row` / `col-md-*`
- Cards: `card` / `card-header` / `card-body`
- Botões: `btn btn-primary`, `btn btn-outline-secondary`, `btn btn-sm`
- Badges: `badge badge-pill badge-{primary|success|warning|danger|info}`
- Tabelas: `table table-hover table-sm` + `thead-light`
- Forms: `form-group` + `form-control`
- Flex: `d-flex align-items-center justify-content-between`

### Ícones
- Font Awesome: `<i class="fas fa-NOME"></i>`
- **Nunca** usar SVG inline
- Ícones usados no projeto:
  `fa-tachometer-alt`, `fa-comments`, `fa-users`, `fa-columns`,
  `fa-calendar-alt`, `fa-book`, `fa-tags`, `fa-bolt`, `fa-user-friends`,
  `fa-cog`, `fa-plus`, `fa-edit`, `fa-trash`, `fa-search`, `fa-times`

### Header de página (padrão)
```html
<div class="content-header">
  <div class="d-flex align-items-center">
    <div class="header-icon mr-3">
      <i class="fas fa-ICONE"></i>
    </div>
    <div>
      <h4 class="mb-0">Título da Página</h4>
      <small class="text-muted">Subtítulo ou descrição</small>
    </div>
  </div>
  <button class="btn btn-primary btn-sm">
    <i class="fas fa-plus mr-1"></i> Ação Principal
  </button>
</div>
```

---

## 8. NOMENCLATURA

### Alinhamento Frontend ↔ Backend

| Conceito | Frontend (Angular) | Backend (Spring) | Endpoint |
|---|---|---|---|
| Cliente/Lead | `Lead` | `Lead` | `/api/leads` |
| Etiqueta/Label | `Label` | `Label` | `/api/labels` |
| Agenda | `Appointment` | `Appointment` | `/api/appointments` |
| Conversa | `Conversation` | `Conversation` | `/api/conversations` |
| Usuário | `User` | `User` | `/api/users` |
| Time | `Team` | `Team` | `/api/teams` |
| Automação | `Automation` | `Automation` | `/api/automations` |

### Regra geral: inglês em tudo
- Nomes de classes, variáveis, métodos, endpoints: inglês
- Textos exibidos na UI: português (Brasil)

---

## 9. CHECKLIST ANTES DE ENTREGAR CÓDIGO

**Angular:**
- [ ] Usa `ChangeDetectionStrategy.OnPush`?
- [ ] Sem `any` no TypeScript?
- [ ] Subscriptions destruídas com `takeUntilDestroyed()` ou `async pipe`?
- [ ] Lógica de negócio está no service, não no component?
- [ ] Component tem menos de 150 linhas?
- [ ] Usa enum em vez de string mágica?
- [ ] Rota com lazy loading?
- [ ] Acesso protegido por guard?
- [ ] Tem skeleton loading?
- [ ] `trackBy` em todo `*ngFor`?
- [ ] Usa classes Bootstrap (não Tailwind, não CSS inline)?

**Spring Boot:**
- [ ] Controller retorna `ResponseEntity` com status correto?
- [ ] `@Valid` em todo `@RequestBody`?
- [ ] Service sem referência a HTTP/headers?
- [ ] Exceções específicas com mensagem clara?
- [ ] DTO separado de entidade?
- [ ] Query filtra por `tenantId`?
- [ ] Senha nunca exposta no `Response`?
- [ ] Sem N+1 queries?

---

## 10. O QUE NUNCA FAZER

| Proibido | Motivo |
|---|---|
| `any` no TypeScript | Derrota o sistema de tipos |
| `localStorage` para JWT | Vulnerável a XSS |
| Lógica no template Angular | Não testável, viola SRP |
| Retornar entidade JPA diretamente na API | Expõe dados internos, acopla banco à API |
| `console.log` solto | Usar `LogService` |
| SVG inline para ícones | Projeto usa Font Awesome |
| Classes Tailwind | Projeto usa Bootstrap 4.6 |
| `devMode: true` em produção | Bypassa autenticação |
| Endpoint sem paginação em lista | Performance |
| Query sem filtro de `tenantId` | Vazamento de dados entre tenants |
