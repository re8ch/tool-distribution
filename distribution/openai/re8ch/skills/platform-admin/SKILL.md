---
name: platform-admin
description: Use explicit RE8CH Admin tools for authorized full-cluster inspection and operations.
---

# RE8CH Platform Admin

Use the unified `re8ch-tenant` MCP connection. A verified Re8ch Admin session
may expose directly connected RE8CH platform clusters through explicit
cluster-scoped tools. BYOC is for external tenant clusters connected through
AmongCluster; do not require an Admin BYOC registration. Server-published input schemas are the callable
interface. Never discover or dispatch work through `platform_tool_catalog` or
`platform_tool_call`, and do not require the three legacy public MCP servers.

The Admin organization is the Meta tenant for the directly connected platform
cluster. Prefer the existing `tenant_kubernetes_get`,
`tenant_kubernetes_apply`, and `tenant_kubernetes_delete` interfaces: the
backend grants those same calls namespaced and cluster-scoped Meta access.
Specialized `platform_*` tools may remain available for compatibility, but a
client does not need a new interface to control cluster resources. Preview
mutations before applying them. Ordinary tenant grants and Ready namespaces do
not constrain verified Admin Meta calls; Secret values remain write-only or
redacted.

Platform administration requires a separately verified Re8ch Admin session.
Do not infer Admin authority from an ordinary tenant role, a tenant name in a
prompt, or access to a static skill. Prefer observation and planning before a
write, preserve server-issued plan and audit references, and use exact bounded
arguments for every operation.

`dynamic_skill_search`, `dynamic_skill_load`, and `dynamic_skill_submit` manage
reviewed workflow instructions only. They do not register a remote cloud API,
publish a new executable MCP tool, store its credential, or invoke it with
arbitrary arguments.
