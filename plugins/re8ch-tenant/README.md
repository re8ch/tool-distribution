# RE8CH Tenant

Connect Claude to the RE8CH cloud capabilities available to your tenant. The
plugin uses the RE8CH OAuth sign-in flow and the remote MCP endpoint at
`https://tools.service.re8ch.com/tenant-native/mcp`. Available tools and data
depend on your account, tenant membership, and roles.

When you invoke a tool, Claude sends the tool name and arguments needed for
that request to RE8CH. RE8CH returns the authorized result to Claude. The
connection also processes account identity, tenant membership, session,
usage, and security records needed to provide and protect the service. Do not
include passwords, private keys, or unrelated personal information in tool
arguments. See the [RE8CH privacy notice](https://re8ch.github.io/tool-distribution/privacy.html)
for details about processing and retention.

Installing the plugin does not grant additional RE8CH permissions. Sign in
with your own RE8CH account to use the capabilities already assigned to it.
