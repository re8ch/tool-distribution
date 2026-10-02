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
credentials, and never bypass the tenant API with database administration tools.
