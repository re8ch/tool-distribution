---
name: tenant-admin
description: Administer RE8CH tenants, Consumable grants and BYOC approvals through the protected admin plane.
---

# RE8CH Tenant Admin

Use only the `re8ch-tenant-admin` MCP server. Confirm the authenticated identity maps to the protected `admin` tenant and `re8ch:tenant-admins` before mutations.

List and inspect before changing state. Tenant creation, grant changes, visibility changes, BYOC approval/revocation and deletion must return an operation or resource reference. Never request application credentials, kubeconfigs or private keys. Treat enrollment and access references as opaque. If a connection is offline, preserve `RevocationPending` until the adapter confirms cleanup. Do not describe a service as operational without a successful signed MCP evidence manifest for its exact audience and image digest.
