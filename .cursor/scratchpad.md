# Open Invoice — Project Scratchpad

## Background and Motivation

Fork of `mokuappio/serverless-invoices` — a Vue 2 invoicing tool for freelancers. We are migrating to Vue 3 + Vite + Pinia + Bootstrap 5, performing a full security audit, and releasing as `dev-erik/open-invoice`.

## Key Challenges and Analysis

- Vue 2 → Vue 3 migration across 44 components
- Vuex ORM (11 models) → Pinia (highest-risk phase)
- Bootstrap-Vue → Bootstrap 5 + custom wrappers
- No existing tests — manual verification only
- Multiple Vue 2-only libraries to replace

## High-level Task Breakdown

See plan file: `.cursor/plans/open_invoice_migration_57ee90a5.plan.md`

## Project Status Board

- [x] Phase 0: Fork repo, update comm script, init scratchpad
- [ ] Phase 1: Security assessment and remediation
- [ ] Phase 2: Build tooling (Vue CLI → Vite)
- [ ] Phase 3: Vue 3 + Vue Router 4
- [ ] Phase 4: Bootstrap-Vue → Bootstrap 5
- [x] Phase 5: Vuex → Pinia (store layer rewritten)
- [ ] Phase 6: Replace Vue 2 libraries
- [ ] Phase 7: PWA, ESLint, cleanup
- [ ] Phase 8: Branding, README, release

## Executor's Feedback or Assistance Requests

### Phase 4/6 — Group 2 Component Migration (Invoice components + views) — COMPLETE
Migrated all 19 files from Vue 2 → Vue 3. Changes applied:

**Invoice components (15 files):**
1. `InvoicesList.vue` — Replaced `mapGetters` → `useInvoicesStore()`, Vue 2 filters → method calls, removed `VBTooltip` (uses native `title` attr), removed `i18nOptions` (prefixed keys)
2. `InvoiceHeader.vue` — Replaced `BModal`/`VBModal` → div-based modals with `v-if` + Bootstrap 5 CSS, filters → methods, removed `i18nOptions`
3. `InvoiceRow.vue` — Replaced `this.$store.dispatch` → `useInvoiceRowsStore()` direct calls, filters → methods, fixed `removeRow` call to pass `(invoice_id, id)` matching Pinia store signature
4. `InvoiceTotals.vue` — Replaced `mapGetters` → `useInvoiceRowsStore()`, filters → methods
5. `InvoiceForm.vue` — Replaced `mapState`/`mapGetters` → `useInvoicesStore()`, removed `i18nOptions`
6. `InvoiceControls.vue` — Replaced `BDropdown`/`BDropdownGroup`/`BDropdownDivider` → Bootstrap 5 native dropdown HTML, `$bvModal.msgBoxConfirm` → `window.confirm()`, `mapGetters` → Pinia
7. `InvoiceRowsHeader.vue` — Replaced `mapGetters` → `useInvoiceRowsStore()`
8. `InvoiceAddRowBtn.vue` — Replaced `mapGetters` → `useInvoiceRowsStore()`, `$store.dispatch` → direct store call
9. `InvoiceCompanyDetails.vue` — Replaced `$store.commit('teams/isModalOpen')` → `teamsStore.isModalOpen = true`
10. `InvoiceContactDetails.vue` — Removed `i18nOptions`, prefixed `$t()` keys
11. `InvoiceBankDetails.vue` — Replaced `BModal`/`VBModal`/`$bvModal.hide()` → div-based modal with `showBankModal` data prop
12. `InvoiceClientDetails.vue` — Replaced `$store.dispatch('invoices/prefillClient')` → `invoicesStore.prefillClient()`
13. `InvoiceClientFields.vue` — Replaced `$store.dispatch` → `useInvoiceClientFieldsStore()` + `useClientFieldsStore()`
14. `InvoiceTeamFields.vue` — Replaced `$store.dispatch` → `useInvoiceTeamFieldsStore()` + `useTeamFieldsStore()`
15. `CustomizationsModal.vue` — Replaced `BModal` → div-based modal, `mapGetters` → Pinia, `$store.commit/dispatch` → direct store access

**View files (4 files):**
16. `Dashboard.vue` — Replaced `mapGetters` → `useTeamsStore()`, removed `VBTooltip` directive, fixed ImportModal import path
17. `Invoices.vue` — Replaced `BDropdown`/`BDropdownItem` → Bootstrap 5 native dropdown, `mapGetters` → Pinia, `$store.dispatch/commit` → direct store calls
18. `Invoice.vue` — Replaced `mapGetters` → `useTeamsStore()`
19. `InvoicePrint.vue` — Cleaned up unused `computed`/`methods` blocks, renamed component to `invoice-print`

### Phase 5 — Pinia Store Layer Complete
Rewrote all 14 store files from Vuex 3 + Vuex ORM to Pinia `defineStore()`. Deleted all 11 model class files and the `src/store/models/` directory.

**Files written/rewritten:**
- `src/store/store.js` — `createPinia()` export (replaces Vuex.Store + ORM database)
- `src/store/invoices.js` — `useInvoicesStore` with full CRUD, computed totals/taxes, relationship resolution via getters
- `src/store/clients.js` — `useClientsStore` with bank_account relationship resolution
- `src/store/bank-accounts.js` — `useBankAccountsStore`
- `src/store/taxes.js` — `useTaxesStore`
- `src/store/teams.js` — `useTeamsStore` (orchestrates init/terminate of all stores)
- `src/store/invoice-rows.js` — `useInvoiceRowsStore` (rows stored inline on invoices)
- `src/store/client-fields.js` — `useClientFieldsStore` (fields stored on client items)
- `src/store/invoice-client-fields.js` — `useInvoiceClientFieldsStore` (fields on invoice items)
- `src/store/invoice-team-fields.js` — `useInvoiceTeamFieldsStore` (fields on invoice items)
- `src/store/team-fields.js` — `useTeamFieldsStore` (fields on team item)
- `src/store/themes.js` — `useThemesStore`
- `src/store/data.js` — `useDataStore` (import/export with ALLOWED_KEYS security)
- `src/store/language.js` — `useLanguageStore` (no circular `app` import; accepts i18next/router as params)

**Other changes:**
- `src/utils/helpers.js` — `removeVuexORMFlags` now strips `_isNew`/`_isDirty` instead of `$id`/`$isNew`/`$isDirty`
- `src/services/team.service.js` — Replaced `Team` model import with inline `createDefaultTeam()` function

**Key design decisions:**
- Relationships (belongsTo, hasMany) are resolved in getters by looking up sibling stores
- Invoice `subTotal`, `taxTotal`, `total`, `taxes` computed properties from the old Model class are now handled by `computeInvoiceTotals()` helper
- Cross-store references use lazy `require()` to avoid circular import issues
- `_isNew` flag replaces Vuex ORM `$isNew` for tracking unsaved items
- All sorting (invoices by issued_at/number desc, rows by order asc) preserved in getters

**Blocker resolved:** The `useTeamsStore()` referenced in `src/router.js` now exists.

---

### Phase 3 — Vue 3 Core Infrastructure Files Rewritten
Rewrote the following files for Vue 3 / Vue Router 4 / Pinia / i18next-vue compatibility:

- `src/config/i18n.config.js` — Removed Vue import, `@panter/vue-i18next`, and circular `app` import. Now exports raw `i18next` instance + `initialized` promise. Uses `supportedLngs` (replaces deprecated `whitelist`).
- `src/main.js` — Uses `createApp()`, `app.use(pinia)`, `app.use(I18NextVue)`, `app.use(Notifications)`, NProgress. Language init dispatch moved here from i18n config. No default export (avoids circular deps).
- `src/router.js` — Uses `createRouter` / `createWebHistory`. Dashboard `beforeEnter` uses dynamic `import('@/store/teams')` for `useTeamsStore()` (requires teams Pinia migration). `beforeEach` uses `i18next` directly.
- `src/App.vue` — Removed `<vue-progress-bar/>`, removed bootstrap-vue CSS import, added NProgress CSS. Uses `useThemesStore()` Pinia store instead of `this.$store.commit`.
- `src/services/notification.service.js` — Uses `notify()` from `@kyvg/vue3-notification` instead of `Vue.notify()`.
- `src/config/progressbar.config.js` — DELETED (NProgress replaces vue-progressbar).
- `src/services/adapters/wordpress.adapter.js` — Replaced `app.$Progress` with `NProgress.start()` / `NProgress.done()`. Removed circular `app` import.
- `src/filters/` — Verified: `currency.filter.js` and `date.filter.js` are already plain exported functions, Vue 3 compatible.

**Blocker noted:** `src/store/teams.js` is still Vuex-style. The router `beforeEnter` references `useTeamsStore()` which doesn't exist yet. Teams store Pinia migration is needed before the router guard will work at runtime.

### Phase 6 (Group 3) — Client, Bank, Team & Other Components Migrated to Vue 3
Rewrote 16 component files from Vue 2 (Vuex, Bootstrap-Vue, vue-autosuggest) to Vue 3 (Pinia, Bootstrap 5, custom autocomplete):

**Client components:**
- `src/components/clients/ClientSelector.vue` — Replaced `vue-autosuggest` with custom autocomplete (plain input + filtered list). Removed `VueAutosuggest` import, `slot-scope` syntax. Uses `useClientsStore()`.
- `src/components/clients/ClientForm.vue` — Replaced `BDropdown`/`BTabs`/`BTab` with Bootstrap 5 native tabs (`nav nav-tabs` + `v-show`) and dropdown. Replaced `$bvModal.msgBoxConfirm` with `confirm()`. Uses `useClientsStore()`/`useBankAccountsStore()`. Changed `$isNew` to `_isNew`.
- `src/components/clients/ClientFields.vue` — Replaced `$bvModal.msgBoxConfirm` with `confirm()`, `$store.dispatch` with `useClientFieldsStore()`. Changed `float-right` to `float-end`.
- `src/components/clients/ClientModal.vue` — Replaced `BModal` with teleport-based div modal. Uses `useClientsStore()`/`useInvoicesStore()`. Replaced `hasOwnProperty` with `Object.prototype.hasOwnProperty.call`.

**Bank Account components:**
- `src/components/bank-accounts/BankAccountsList.vue` — Replaced `$listeners` (Vue 2) with explicit `hasSelectListener` prop. Removed `filters: { date }` (unused in template). Uses `useBankAccountsStore()`. Changed `text-right` to `text-end`.
- `src/components/bank-accounts/BankAccountForm.vue` — Replaced `mapGetters` with `useBankAccountsStore()`. Changed `$isNew` to `_isNew`, `ml-2` to `ms-2`, `text-right` to `text-end`.
- `src/components/bank-accounts/BankAccountModal.vue` — Replaced `BModal` with teleport-based div modal. Uses `useBankAccountsStore()`.

**Team components:**
- `src/components/team/TeamForm.vue` — Replaced `BTabs`/`BTab` with Bootstrap 5 tabs. Replaced `$bvModal.msgBoxConfirm` with `confirm()`. Uses `useTeamsStore()`/`useInvoiceRowsStore()`.
- `src/components/team/TeamFields.vue` — Replaced `$bvModal.msgBoxConfirm` with `confirm()`. Uses `useTeamFieldsStore()`.
- `src/components/team/TeamLogo.vue` — Replaced `BModal` with teleport-based div modal. Uses `useTeamsStore()`.
- `src/components/team/TeamModal.vue` — Replaced `BModal` with teleport-based div modal. Uses `useTeamsStore()`/`useInvoicesStore()`.
- `src/components/team/TeamTaxes.vue` — Replaced `$bvModal.msgBoxConfirm` with `confirm()`. Uses `useTaxesStore()`.

**Other components:**
- `src/components/EmptyState.vue` — Removed `i18nOptions`, prefixed `$t` key with `empty-state:`.
- `src/components/TheFooter.vue` — Replaced `VBTooltip` directive with `title` attr. Replaced `mapState` with `useThemesStore()`. Changed Bootstrap 4 classes (`ml-*`, `pl-*`) to Bootstrap 5 (`ms-*`, `ps-*`).
- `src/components/LanguageSwitcher.vue` — Replaced `BDropdown`/`BDropdownItemButton` with Bootstrap 5 dropdown. Replaced `mapState` with `useLanguageStore()`. Passes `i18next`/`router`/`route` to `changeLanguage()`.
- `src/components/ImportModal.vue` — Replaced `BModal` with teleport-based div modal. Uses `useDataStore()`.

**Migration patterns applied across all files:**
- `i18nOptions: { namespaces: 'xxx' }` → removed; `$t('key')` → `$t('xxx:key')`
- `mapGetters`/`mapState` from `vuex` → direct Pinia store calls
- `$store.dispatch('module/action')` → `useXxxStore().action()`
- `$store.commit('module/mutation', val)` → `store.property = val`
- `$store.state.module.prop` → `store.prop`
- `BModal` → `<teleport to="body"><div v-if="..." class="modal d-block">...</div></teleport>`
- `BDropdown`/`BDropdownItemButton` → Bootstrap 5 `dropdown` + `dropdown-menu` + `dropdown-item`
- `BTabs`/`BTab` → `nav nav-tabs` + `v-show` tab panels
- `$bvModal.msgBoxConfirm()` → native `confirm()`
- `$listeners` → explicit prop or `$attrs`
- Vue 2 `slot="name"` → Vue 3 `v-slot:name` or `#name`
- Bootstrap 4 → Bootstrap 5 class renames: `ml-*`→`ms-*`, `mr-*`→`me-*`, `pl-*`→`ps-*`, `pr-*`→`pe-*`, `text-right`→`text-end`, `float-right`→`float-end`, `badge-secondary`→`bg-secondary`

## Lessons

- `comm` script uses `-y` flag to skip interactive confirmation (needed for automated commits)
- `.git/config` writes require `["all"]` sandbox permissions
- Project has no tests — all verification is manual
- i18next v23+ uses `supportedLngs` instead of deprecated `whitelist` / `checkWhitelist`
- `@kyvg/vue3-notification` exports a `notify()` function for direct use outside components (replaces `Vue.notify()`)
- NProgress uses `NProgress.done()` not `NProgress.finish()` — different API from vue-progressbar
- Vue Router 4 `beforeEach` must use `next({ ...to, replace: true })` pattern (not `next(to)`) to avoid infinite redirect loops when mutating query params
- Pinia stores that reference each other must use lazy `require()` inside actions/getters (not top-level imports) to avoid circular dependency issues
- Vuex ORM `Model.createNew()` + `$save()` pattern maps to: create a plain object with `uuidv4()` id, push to items array, mark with `_isNew: true`
- Vuex ORM `Model.query().with(['relation'])` pattern maps to: resolve relationships in Pinia getters by looking up sibling store items
- Invoice computed properties (subTotal, taxTotal, total, taxes) that were on the Model class must be computed on-demand in getters, not stored in state
- `team.service.js` needed its own default team factory after removing the Team model class import
