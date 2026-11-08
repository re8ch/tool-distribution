---
name: platform-admin
description: Use explicit RE8CH Admin tools for authorized full-cluster inspection and operations.
---

# RE8CH Platform Admin

Use the unified `re8ch-tenant` MCP connection. A verified Re8ch Admin session
may expose the Admin-owned BYOC cluster through explicit namespaced and
cluster-scoped tools. Their server-published input schemas are the callable
interface. Never discover or dispatch work through `platform_tool_catalog` or
`platform_tool_call`, and do not require the three legacy public MCP servers.

Platform administration requires a separately verified Re8ch Admin session.
Do not infer Admin authority from an ordinary tenant role, a tenant name in a
prompt, or access to a static skill. Prefer observation and planning before a
write, preserve server-issued plan and audit references, and use exact bounded
arguments for every operation.

`dynamic_skill_search`, `dynamic_skill_load`, and `dynamic_skill_submit` manage
reviewed workflow instructions only. They do not register a remote cloud API,
publish a new executable MCP tool, store its credential, or invoke it with
arbitrary arguments.
