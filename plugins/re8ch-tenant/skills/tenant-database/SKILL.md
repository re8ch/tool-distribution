---
name: tenant-database
description: Consume PostgreSQL capabilities granted to the authenticated RE8CH tenant.
---

# Tenant Database

Use only `re8ch-tenant`. Start with the Catalog and the authenticated
organization's service instances and bindings. Discover and plan before
provisioning. Show storage,
connection, backup, retention, placement, quota impact, and approval state.
Create, update, suspend, resume, or delete only after explicit instruction.
Storage may expand but never shrink. Treat connection references as opaque;
never expose database passwords, Kubernetes Secrets, node addresses, or Pigsty
credentials. Use database tools only when the active organization has the
required grant and a Ready database service binding. Do not bypass a missing,
suspended or revoked binding with a shared provider endpoint or an
administrator tool. A database grant without a database class returned by
`service_catalog_list` is not currently provisionable; report that Catalog gap
instead of falling back to PostgreSQL administration or Kubernetes.
