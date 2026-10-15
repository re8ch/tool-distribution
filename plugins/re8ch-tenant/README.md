# RE8CH Tenant

Connect Claude to the RE8CH cloud capabilities available to your tenant. The
plugin uses the RE8CH OAuth sign-in flow and the remote MCP endpoint at
`https://tools.service.re8ch.com/tenant-native/mcp`. Available tools and data
depend on your account, tenant membership, and roles.

The connection supports two separate organization sign-in paths:

- a Re8ch application organization account for tenant capabilities; or
- a Re8ch Admin organization account for platform and system infrastructure.

Membership, grants, credentials, and resource ownership do not carry between
these organizations. To change organization or account, disconnect and reconnect
the Re8ch Tenant connection. The new OAuth session is resolved by the
server; neither the plugin nor a prompt can promote or copy an identity.

Start with `tenant_self_service_capabilities` to see the active organization's
current resource operations and Ready namespaces. Search `dynamic_skill_search`
for reviewed internal workflows and integrations that are not listed as static
tools. A connector's installed tool list is not the complete service catalog;
refresh its discovery after a server update. If `platform_tool_catalog` is
exposed for an authorized admin session, use it to discover protected modules.
The administrator catalog is a separate authorization path in this same
self-service connection: ordinary tenant grants and service classes do not
limit a tool that the server publishes for a verified platform administrator.
For PostgreSQL schema work, discover the reviewed `postgres_admin_sql` entry;
it uses a server-held credential and requires a plan hash for writes. A fresh
Supabase Studio login is not required for each agent migration.

When you invoke a tool, Claude sends the tool name and arguments needed for
that request to RE8CH. RE8CH returns the authorized result to Claude. The
connection also processes account identity, tenant membership, session,
usage, and security records needed to provide and protect the service. Do not
include passwords, private keys, or unrelated personal information in tool
arguments. See the [RE8CH privacy notice](https://re8ch.github.io/tool-distribution/privacy.html)
for details about processing and retention.

Installing the plugin does not grant additional RE8CH permissions. Sign in
with the organization that owns the intended resources and use only the
capabilities already assigned to that session.
