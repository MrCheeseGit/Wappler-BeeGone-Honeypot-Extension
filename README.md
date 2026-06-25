# BeeGone Honeypot (Wappler App Connect + Server Connect)


**Honeypot spam trap** for Wappler forms: a hidden field bots fill, humans never see, validated on the server before you insert or send mail.

[![License: Mr Cheese Extension v1.0](https://img.shields.io/badge/License-Mr%20Cheese%20Extension%20v1.0-blue.svg)](https://www.mrcheese.co.uk/extension-license)
![Wappler](https://img.shields.io/badge/Wappler-App%20%2B%20Server%20Connect-teal)
![Version](https://img.shields.io/badge/version-1%2E0%2E8-green)

Built by **[Mr Cheese](https://www.mrcheese.co.uk)** · Wappler extensions & open source

---

## Why this exists

Contact and registration forms attract bots. CAPTCHA works but needs keys and UX friction. A **honeypot** is a simple first line of defence: one extra field, zero puzzles, no third-party API.

BeeGone ships **both sides**:

| Layer | What you get |
|-------|----------------|
| **App Connect** | `dmx-beegone-honeypot` - drops trap + optional timestamp into each form |
| **Server Connect** | **BeeGone Validate Honeypot** - checks POST values; output for Conditions |

---

## Features (v1)

| Capability | Description |
|------------|-------------|
| **Per-form instances** | Unique field names per component `id` (multiple forms per page) |
| **Visually hidden trap** | Off-screen, no tab focus, `autocomplete="off"` |
| **Optional timing** | Hidden timestamp + min seconds on server (blocks instant submits) |
| **Condition-friendly** | `{{beegone.passed}}`, `{{beegone.isBot}}`, `{{beegone.reason}}` |
| **On-bot modes** | Flag (default), reject (throw), or branch to fake success |
| **No extra npm packages** | Node built-ins only on the server |

**Not a CAPTCHA replacement.** Stops most dumb bots; use Turnstile or similar if you are under targeted attack.

---

## Requirements

- Wappler **Node.js** project (Server Connect + App Connect)
- Forms submitted via `dmx-serverconnect` / normal POST so trap fields are included

---

## Installation

| Path | |
|------|--|
| **npm** | Wappler Project Settings → Extensions (`wappler-beegone-honeypot`) |
| **Git** | [Extension Installer](https://www.mrcheese.co.uk/extensions/install) or manual copy below |

Git manual copy installs into `extensions/`, `lib/modules/`, and `public/`.

### Git install — Extension Installer (recommended)

Repo includes **`wappler-install.json`**. Use the **[Extension Installer](https://www.mrcheese.co.uk/extensions/install)** - select **BeeGone Honeypot**, choose **Both**, run the script from your Wappler project root.

### Manual install

Run from your **Wappler project root** (the folder that contains `package.json`). Skip `git clone` if you already have this repo cloned alongside your project.

```bash
git clone https://github.com/MrCheeseGit/Wappler-BeeGone-Honeypot-Extension.git ../Wappler-BeeGone-Honeypot-Extension

cp ../Wappler-BeeGone-Honeypot-Extension/server_connect/modules/beegone_validate.hjson extensions/server_connect/modules/
cp ../Wappler-BeeGone-Honeypot-Extension/server_connect/modules/beegone.js lib/modules/
cp ../Wappler-BeeGone-Honeypot-Extension/server_connect/modules/beegone.js extensions/server_connect/modules/

cp ../Wappler-BeeGone-Honeypot-Extension/app_connect/components.hjson extensions/app_connect/components/beegone_components.hjson
cp ../Wappler-BeeGone-Honeypot-Extension/includes/dmx-beegone-honeypot.js public/js/
cp ../Wappler-BeeGone-Honeypot-Extension/includes/dmx-beegone-honeypot.css public/css/
```

**Quit Wappler completely and restart.**

### npm install (Wappler Project Settings)

1. **Wappler** → Project Settings → Extensions → Add → `wappler-beegone-honeypot`
2. From your project root: `npm install`
3. Run **Project Updater → Update** when prompted.
4. **Quit Wappler completely** and reopen your project.

#### Local `file:` development (optional)

```json
"devDependencies": {
  "wappler-beegone-honeypot": "file:../path/to/this-extension"
}
```

After you change extension source, run `npm install` again, then Project Updater if needed, and restart Wappler.

## Quick start

### 1. Form (App Connect)

1. Open your form in the designer.
2. Add **BeeGone Honeypot** from **Mr Cheese** (inside the `<form>`, not outside).
3. Note **Honeypot field name** (default `beegone_yourComponentId`).
4. Set **Min seconds** if you want timing checks (e.g. `3`).

### 2. API (Server Connect)

1. Open the API **Input** panel. Set **Linked Page** and **Form** (same as your `dmx-serverconnect-form`).
2. Click **Import From Form** — BeeGone trap fields are included because the component writes real `<input name="...">` tags into the form HTML (Wappler only scans static inputs, not JS-injected fields).
3. Add **BeeGone Validate Honeypot** as the **first** step after POST.
4. Bind **Honeypot field value** → `{{$_POST.beegone_yourComponentId}}`.
5. If using timing: **Min seconds** `3`, **Timestamp** → `{{$_POST.beegone_ts_yourComponentId}}`.
6. Add **Condition**: if `{{beegone.passed}}` → real insert/mail; else fake success or empty response.
7. Run API once and **save** for `meta` / pickers.

See [examples/](examples/).

---

## Server Connect options

| Option | Default | Notes |
|--------|---------|--------|
| Honeypot field value | (bind POST) | Must match component `field-name` |
| Expected value | empty | Humans leave trap blank |
| Minimum seconds | `0` | `0` = skip timing |
| Timestamp field value | (bind POST) | From component timestamp field |
| When validation fails | `flag` | `reject` throws; use Condition for `flag` |

### Output

| Field | Type | Meaning |
|-------|------|---------|
| `passed` | boolean | `true` if human-like |
| `isBot` | boolean | inverse of passed |
| `reason` | text | `honeypot_filled`, `submitted_too_fast`, `invalid_timestamp`, or empty |

---

## Multiple forms on one page

Use **one BeeGone component per form**, each with a different `id` / field name:

- Footer form → `beegone_footer`, API binds `{{$_POST.beegone_footer}}`
- Contact form → `beegone_contact`, API binds `{{$_POST.beegone_contact}}`

---

## Limitations

- Bots that skip hidden fields or replay crafted POSTs may bypass v1.
- Trap must be **inside** the submitting `<form>`.
- PHP Server Connect: not in this repo (Node only for v1).

---

## Compatibility

Often paired with Redirect-IT on login forms. See [Mr Cheese extension docs](https://github.com/MrCheeseGit/Wappler-Extension-Docs/blob/main/extension-compatibility.md).

## License

[Mr Cheese Extension License v1.0](https://www.mrcheese.co.uk/extension-license) — see [LICENSE](LICENSE). © [Mr Cheese](https://www.mrcheese.co.uk)

