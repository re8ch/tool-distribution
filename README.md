# RE8CH Tool Distribution

Public, machine-readable distribution catalog for RE8CH platform tools.

- Published page: <https://re8ch.github.io/tool-distribution/>
- Catalog JSON: <https://re8ch.github.io/tool-distribution/catalog.json>

The catalog describes direct MCP endpoints and distribution state across
ChatGPT, ChatGPT Work, Codex, Claude, Claude Code, Cowork, Cursor, WorkBuddy,
Coze and Doubao. Every channel is classified as self-service, official-review,
or unavailable so a packaged integration is never confused with vendor
approval. The public Git source contains the installable plugin files. OAuth and server-side roles control access to the tools.

Validate the machine-readable catalog before publication:

```sh
python3 scripts/validate_catalog.py
```

## Install plugins from one Git source

Use `re8ch/tool-distribution` as the marketplace repository in Claude, Claude
Code or Codex. The repository contains both `.claude-plugin/marketplace.json`
and `.agents/plugins/marketplace.json`, with the same five plugin names.

Claude Code:

```sh
claude plugin marketplace add re8ch/tool-distribution
claude plugin install re8ch-tenant@re8ch-tools
```

Codex: add `https://github.com/re8ch/tool-distribution.git` as a Git-source
plugin marketplace, then choose a plugin from `re8ch-tools`. Installing the
files does not grant permission to operate RE8CH services.
