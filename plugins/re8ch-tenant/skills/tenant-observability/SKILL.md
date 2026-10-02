---
name: tenant-observability
description: Use observability capabilities granted to the authenticated RE8CH tenant.
---

# Tenant Observability

Use only `re8ch-tenant`. Query or manage only organizations, folders,
datasources, dashboards, metrics, and logs returned for the authenticated
tenant. Never request Grafana API keys, datasource passwords, or Victoria
backend credentials. Do not call Grafana admin, Victoria, Kubernetes, or a
tenant-specific proxy directly.
