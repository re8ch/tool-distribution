---
name: tenant-database
description: Consume PostgreSQL capabilities granted to the authenticated RE8CH tenant.
---

# Tenant Database

Use only `re8ch-tenant`. Discover and plan before provisioning. Show storage,
connection, backup, retention, placement, quota impact, and approval state.
Create, update, suspend, resume, or delete only after explicit instruction.
Storage may expand but never shrink. Treat connection references as opaque;
never expose database passwords, Kubernetes Secrets, node addresses, or Pigsty
credentials. Ordinary tenant operations must not bypass their grant boundary
with database administration tools.

For a verified platform-admin session, use `platform_tool_catalog` and
`platform_tool_call` on this same plugin to discover the separate Pigsty
administrator tools. A missing ordinary database Consumable does not restrict
the returned administrator catalog. If `postgres_admin_sql` is published, use
its fixed server-held Supabase credential, read-only inventory first, and its
approval ID plus plan hash before any write. Do not retrieve Secret values or
substitute `kubectl.exec` for this reviewed SQL entry.
