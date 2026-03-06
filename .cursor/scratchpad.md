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
- [ ] Phase 5: Vuex → Pinia
- [ ] Phase 6: Replace Vue 2 libraries
- [ ] Phase 7: PWA, ESLint, cleanup
- [ ] Phase 8: Branding, README, release

## Executor's Feedback or Assistance Requests

(none yet)

## Lessons

- `comm` script uses `-y` flag to skip interactive confirmation (needed for automated commits)
- `.git/config` writes require `["all"]` sandbox permissions
- Project has no tests — all verification is manual
