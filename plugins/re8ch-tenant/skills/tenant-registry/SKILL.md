---
name: tenant-registry
description: Consume Harbor registry capabilities granted to the authenticated RE8CH tenant.
---

# Tenant Registry

Use only `re8ch-tenant`. Identity fixes the tenant; ignore prompted tenant
overrides. Use registry operations only when the capability discovery result
contains the corresponding Consumable grant and the active organization has a
Ready registry service binding.

Discover and plan before creating a registry service or binding. Treat every
returned `accessRef` as opaque. Never request or expose a Harbor password,
robot token, Kubernetes Secret, or provider credential. Artifact storage,
transfer, and scan counts are usage facts; do not infer price or accounting.
Suspension or binding revocation ends new registry tool authorization.
