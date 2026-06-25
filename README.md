# BeeGone Honeypot (Wappler App Connect + Server Connect)

> ## ⚠️ NPM users — please read first (important)
>
> Mr Cheese extensions were built for **Git copy install** first. Wappler's **npm** lane (Project Settings → Extensions) puts the package in `node_modules` but **does not automatically copy** Server Connect modules, App Connect JS/CSS, or other files into your project folders. **Project Updater alone is not enough.**
>
> **If you use npm, follow the full [npm install](#npm-install-wappler-project-settings) section below.** Quick summary:
>
> 1. Add this extension in **Wappler → Project Settings → Extensions**, then run **`npm install`** in your project root.
> 2. **Verify** the package landed: `ls node_modules/wappler-beegone-honeypot/package.json` (if this fails, fix registration before copying anything).
> 3. Run the copy script from the **[Mr Cheese npm install assistant](https://www.mrcheese.co.uk/extensions/install/npm)** — choose **Both** — into `extensions/`, `lib/modules/`, and `public/`.
> 4. Run **Project Updater → Update** after copying.
> 5. **Quit Wappler completely** (including the tray icon) and reopen your project.
>
> Mr Cheese is working on a combined solution and has proposed **[`wappler-install.json`](https://github.com/MrCheeseGit/Wappler-Git-Extension-Manifest-Standard)** so install tools (and hopefully Wappler itself) can deploy extensions the same way from Git or npm. Until then, sorry for the extra steps — this is one reason these extensions were never intended to rely on npm alone.
>
> **Prefer Git?** Use the [Git Extension Installer](https://www.mrcheese.co.uk/extensions/install) — the most complete path, no npm required.

**Honeypot spam trap** for Wappler forms: a hidden field bots fill, humans never see, validated on the server before you insert or send mail.

[![License: Mr Cheese Extension v1.0](https://img.shields.io/badge/License-Mr%20Cheese%20Extension%20v1.0-blue.svg)](https://www.mrcheese.co.uk/extension-license)
![Wappler](https://img.shields.io/badge/Wappler-App%20%2B%20Server%20Connect-teal)
![Version](https://img.shields.io/badge/version-1%2E0%2E4-green)

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

Pick **one** install path and follow it completely:

| Path | Best for |
|------|----------|
| **Git** (recommended) | Most reliable; uses `git clone` + copy from the repo |
| **npm** | You already use Wappler Project Settings → Extensions |

Both paths copy files into `extensions/`, `lib/modules/`, and `public/`. The npm path also requires verifying `node_modules/wappler-beegone-honeypot` exists **before** you run any copy commands.

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

Use this when you register the extension through **Wappler → Project Settings → Extensions**. The npm package makes BeeGone appear in Wappler but **does not copy runtime files** into your project folders.

1. **Register in Wappler** — Project Settings → Extensions → Add → enter `wappler-beegone-honeypot` or this repository's GitHub URL.
2. **Install dependencies** — from your Wappler project root (folder with `package.json`):
   ```bash
   npm install
   ```
3. **Verify before copying** (required):
   ```bash
   ls node_modules/wappler-beegone-honeypot/package.json
   ```
   If this command fails, stop here. The extension is missing from `.wappler/project.json` or `npm install` did not succeed. **Do not** run copy commands until `node_modules` contains the package.
4. **Copy files into your project** — open the **[npm install assistant](https://www.mrcheese.co.uk/extensions/install/npm)**, select **BeeGone Honeypot**, choose **Both**, copy the generated script, and run it from your project root.
5. Run **Project Updater → Update** after the copy script.
6. **Quit Wappler completely** (tray icon too) and reopen your project.

#### Local `file:` development (optional)

```json
"devDependencies": {
  "wappler-beegone-honeypot": "file:../path/to/BeeGone-Honeypot-Extension"
}
```

After you change extension source, run `npm install wappler-beegone-honeypot` again in the project root, run the npm install assistant copy script, Project Updater, and restart Wappler.

---

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

