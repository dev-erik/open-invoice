# Changelog

## v1.0.0 — Open Invoice (2026-03-06)

Full migration from Serverless Invoices (Vue 2) to a modern tech stack.

### Breaking Changes

- Requires **Node 20+** (was Node 16.18)
- Build system changed from Vue CLI to **Vite 5**
- `npm run serve` replaced by `npm run dev`

### Migration Summary

- **Vue 2 to Vue 3.4** — all 44 components migrated to Vue 3 Options API
- **Vuex 3 + Vuex ORM to Pinia 2** — 13 store modules rewritten, 11 ORM models replaced with plain reactive state
- **Bootstrap-Vue to Bootstrap 5.3** — modals, dropdowns, tooltips replaced with Bootstrap 5 markup
- **Vue CLI 3 to Vite 5** — faster builds, modern dev server, ES module support
- **node-sass to dart-sass** — deprecated native dependency removed
- **Vue Router 3 to Vue Router 4** — `createRouter()` + `createWebHistory()` API

### Library Replacements

| Removed | Replaced With |
|---------|---------------|
| @panter/vue-i18next | i18next-vue |
| vue2-datepicker | @vuepic/vue-datepicker |
| vue-multiselect | @vueform/multiselect |
| vue-autosuggest | Custom autocomplete |
| vue-notification | @kyvg/vue3-notification |
| vue-progressbar | NProgress |
| bootstrap-vue | Bootstrap 5 + custom components |
| @vuex-orm/core | Pinia reactive state |
| es6-promise | Removed (not needed) |
| core-js | Removed (not needed) |
| html2pdf.js | Removed (unused) |

### Security Fixes

- Fixed CSS injection via `innerHTML` in CustomizationsModal (Critical)
- Added import key allowlist to prevent prototype pollution (High)
- Fixed null dereference in local storage adapter (High)
- Fixed WordPress adapter crash on network errors (High)
- Added input validation to client and invoice create operations (High)
- Added field length limits to validation (Medium)
- Added `crossorigin` and `referrerpolicy` to external font links (Medium)

### Removed

- `babel.config.js`, `postcss.config.js`, `.browserslistrc` (handled by Vite)
- `vue.config.js.example` (replaced by `vite.config.js`)
- `src/store/models/` directory (replaced by Pinia reactive state)
- `src/config/progressbar.config.js` (using NProgress)
- `register-service-worker` dependency (PWA handled by Vite plugin)
