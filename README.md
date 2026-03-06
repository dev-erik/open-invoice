# Open Invoice

A free, open-source invoicing tool for freelancers and small businesses. Create, manage, and export invoices entirely in your browser — no server, no signup required.

Fork of [Serverless Invoices](https://github.com/mokuappio/serverless-invoices) by Moku, fully migrated to a modern tech stack.

Built with [Vue 3](https://vuejs.org/), [Vite](https://vite.dev/), [Pinia](https://pinia.vuejs.org/), and [Bootstrap 5](https://getbootstrap.com/).

## Features

- **Truly serverless** — data stored in your browser only, no network requests
- **No hosting required** — works locally
- **Invoices** — create, manage, track by status and due date, multiple custom taxes, print to PDF
- **Clients** — create and manage clients with custom fields
- **Bank accounts** — manage bank details for invoices
- **Company details** — edit default company info with custom fields and default taxes
- **Customizable** — logo, template, and custom CSS
- **Export & import** — JSON data backup and restore
- **Dark and light mode**
- **Multilingual** — English, French, German, Spanish, Italian, Estonian, Persian, Bangla, Portuguese (BR), Indonesian, Korean
- **Backend adapters** — Browser Storage, WordPress, Custom HTTP API

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3.4 |
| Build | Vite 5 |
| State | Pinia 2 |
| Router | Vue Router 4 |
| UI | Bootstrap 5.3 |
| i18n | i18next + i18next-vue |
| Storage | localforage (IndexedDB) |

## Getting Started

Requires **Node 20+** (any current LTS).

```bash
# Clone the repo
git clone https://github.com/dev-erik/open-invoice.git
cd open-invoice

# Install dependencies
npm install

# Create app config
cp src/config/app.config.example.js src/config/app.config.js

# Start dev server
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
  components/     # Vue 3 components (form, invoices, clients, team, bank-accounts)
  config/         # App, i18n, and storage configuration
  filters/        # Currency and date formatting functions
  services/       # Service layer with adapter pattern (local, HTTP, WordPress)
  store/          # Pinia stores (invoices, clients, teams, taxes, etc.)
  utils/          # Helpers, validation, error handling
  views/          # Route-level view components
public/
  locales/        # i18n translation JSON files
  img/            # Icons and static images
```

## Security

See [SECURITY.md](SECURITY.md) for the security audit report, including fixed vulnerabilities and known limitations.

## Attribution

This project is a fork of [Serverless Invoices](https://github.com/mokuappio/serverless-invoices) by [Moku](https://mokuapp.io/). The original project was built with Vue 2, Vuex, and Bootstrap-Vue.

## License

MIT
