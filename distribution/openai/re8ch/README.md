# Re8ch OpenAI review package

This directory contains the source-only additions for the reproducible OpenAI
review ZIP. Shared tenant skills are read from `plugins/re8ch-tenant`; the ZIP
is built with:

```sh
python3 scripts/build_openai_re8ch.py
```

The generated archive is written to `dist/` and is not the source of truth.
Version 1.0.3 uses the unified tenant MCP server. A verified Admin session sees
the Admin-owned BYOC cluster's explicitly published tools through that same
connection. It does not publish the retired `platform_tool_catalog` or
`platform_tool_call` bridge, or add the three legacy public MCP connections.
