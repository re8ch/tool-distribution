---
name: tenant-ssh-broker
description: Discover an organization-owned audited SSH broker service without exposing raw node administration.
---

# Tenant SSH Broker

Use only `re8ch-tenant`. Treat the SSH broker as a Catalog service class,
organization-owned service instance and revocable binding. First confirm that
the active organization is entitled to the class and that
`service_catalog_list` actually publishes it. Then inspect the instance and its
Ready binding through `service_instance_get` and `service_binding_list`.

Only after those checks may a published broker consumer tool list the bounded
targets allowed by that binding. A static tool name is not proof that the
server published the tool for this session. If the class, instance, Ready
binding or consumer tool is absent, report the exact unavailable state.

Never expose raw SSH, node addresses, private keys, passwords, Kubernetes
credentials or a `platform_*` entry point. Never reinterpret organization
membership as permission to access an unbound target. Suspension or binding
revocation ends new authorization.
