# Re8ch OpenAI review package

This directory contains the source-only additions for the reproducible OpenAI
review ZIP. Shared tenant skills are read from `plugins/re8ch-tenant`; the ZIP
is built with:

```sh
python3 scripts/build_openai_re8ch.py
```

The generated archive is written to `dist/` and is not the source of truth.
Version 1.0.3 uses the consumer-only MCP resource at
`https://tools.service.re8ch.com/tenant-plugin/mcp`. It publishes organization
context, BYOC, claims, Catalog service instances, bindings, usage and
service-oriented tools. It does not publish raw Kubernetes, node, SSH or
platform-administration entry points. Provider tools require an active
organization grant and a Ready service binding.

Version 1.0.2 remains on
`https://tools.service.re8ch.com/tenant-native/mcp`; this package does not alter
that compatibility endpoint. The new endpoint and its OAuth protected-resource
metadata must be deployed before the 1.0.3 archive is submitted for review.
