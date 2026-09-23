# RE8CH Tool Distribution

Public, machine-readable distribution catalog for RE8CH platform tools.

- Published page: <https://re8ch.github.io/tool-distribution/>
- Catalog JSON: <https://re8ch.github.io/tool-distribution/catalog.json>

The catalog describes direct MCP endpoints and distribution state across
ChatGPT, ChatGPT Work, Codex, Claude, Claude Code, Cowork, Cursor, WorkBuddy,
Coze and Doubao. Every channel is classified as self-service, official-review,
or unavailable so a packaged integration is never confused with vendor
approval. The administrative plugin source and marketplace remain private.

Validate the machine-readable catalog before publication:

```sh
python3 scripts/validate_catalog.py
```
