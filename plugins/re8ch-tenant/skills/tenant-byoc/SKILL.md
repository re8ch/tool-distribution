---
name: tenant-byoc
description: Register and consume a tenant-owned outbound-only RE8CH cluster connection.
---

# Tenant BYOC

Use only `re8ch-tenant`. Register only cluster UID, HTTPS issuer, public-key
identity, region, and declared capabilities. Never request or upload a kubeconfig
or private key. Return enrollment and connection references as opaque and wait
for admin approval. Use only a Ready, non-revoked connection owned by the
authenticated tenant. List before revoke and report pending cleanup when an
offline cluster cannot complete revocation.
