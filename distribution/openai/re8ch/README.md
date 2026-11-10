# Re8ch OpenAI review package

This directory contains the source-only additions for the reproducible OpenAI
review ZIP. Shared tenant skills are read from `plugins/re8ch-tenant`; the ZIP
is built with:

```sh
python3 scripts/build_openai_re8ch.py
```

The generated archive is written to `dist/` and is not the source of truth.
Version 1.0.4 uses the unified tenant MCP server and preserves the existing
tenant interface. A verified Admin session is the Meta tenant; the existing
`tenant_kubernetes_get`, `tenant_kubernetes_apply`, and
`tenant_kubernetes_delete` calls receive full direct-cluster scope from the
backend. The explicit Admin-only `github_governance` tool consumes the active
Enterprise Governance App grant for bounded Ruleset, Actions Variable and
organization-setting operations without returning credential material. BYOC
remains the tenant path for external clusters connected through AmongCluster.
The package does not publish the retired `platform_tool_catalog` or
`platform_tool_call` bridge, or add the three legacy public MCP connections.
