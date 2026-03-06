# Security Assessment — Open Invoice

Audit performed: March 2026

## Summary

This document covers the security findings from an audit of the original `serverless-invoices` codebase and the remediations applied.

## Fixed Issues

### Critical: CSS Injection via innerHTML (CustomizationsModal.vue)

**Before:** User-supplied custom CSS was injected into a `<style>` element via `innerHTML` with no sanitization. This could allow data exfiltration via `url()`, `@import`, or layout-based phishing.

**Fix:** Replaced `innerHTML` with `textContent` and added a `sanitizeCss()` method that strips dangerous patterns (`@import`, `url()`, `expression()`, `javascript:`, `behavior:`, `binding:`, block comments).

### High: Import Accepts Arbitrary Keys — Prototype Pollution Risk (data.js)

**Before:** JSON import wrote every key from user-supplied data into localforage storage without restriction.

**Fix:** Added an allowlist of valid storage keys. Only `invoices`, `invoice_rows`, `invoice_row_taxes`, `invoice_client_fields`, `invoice_team_fields`, `clients`, `client_fields`, `bank_accounts`, `taxes`, `team`, and `team_fields` are accepted.

### High: Local Adapter Null Dereference (local.adapter.js)

**Before:** `storage.getItem()` returning `null` caused `.find()`, `.findIndex()`, and `.splice()` to throw.

**Fix:** Added `|| []` fallbacks and early-return guards for missing indexes.

### High: WordPress Adapter Crashes on Network Errors (wordpress.adapter.js)

**Before:** The response interceptor accessed `error.response.status` without checking if `error.response` exists, crashing on network-level errors.

**Fix:** Added `error.response &&` guard and a separate handler for missing response (network errors).

### High: Missing Input Validation on Create Operations (invoice.service.js, client.service.js)

**Before:** `createInvoice` and `createClient`/`updateClient` accepted arbitrary data without validation.

**Fix:** Added required-field validation (currency + number for invoices, name for clients).

### Medium: Validation Has No Length Limits (helpers.js)

**Before:** `validateField` only checked field presence, allowing arbitrarily long strings.

**Fix:** Added a 10,000-character maximum length check.

### Medium: External CDN Resources Without Security Attributes (index.html)

**Before:** Google Fonts loaded without `crossorigin` or `referrerpolicy` attributes.

**Fix:** Added `crossorigin="anonymous"` and `referrerpolicy="no-referrer"` to all external font links. Note: SRI hashes are not practical for Google Fonts (responses vary by user agent). For maximum security, consider self-hosting font files.

## Known Limitations (Not Fixed)

### Data Stored Unencrypted in Browser

All invoice, client, bank account, and team data is stored in browser-local IndexedDB/localStorage without encryption. This is by design for a serverless app. Users should be aware that data is accessible to anyone with physical or malicious access to their browser profile.

### HTTP Adapter is a Stub

`src/services/adapters/http.adapter.js` sets `axios = null` and will crash if used. This is intentionally unused placeholder code.

## Dependency Vulnerabilities

The original codebase used dependencies with known CVEs (Vue 2.x, axios 0.21.x, node-sass 6.x, etc.). These are being resolved through the Vue 3 migration, which upgrades all dependencies to current maintained versions.
