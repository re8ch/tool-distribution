---
name: cluster-infra
description: Observe and operate RE8CH Cilium, Rook/Ceph, Pigsty, Harbor, Grafana and GitHub infrastructure.
---

# RE8CH Cluster Infra Tool

Use the connections bundled with RE8CH Cloud Platform Tool. `re8ch-cloud-observe` publishes read-only infrastructure tools. `re8ch-platform-operate` publishes the five bounded operation tools. `re8ch-cloud-platform-tool` publishes native Kubernetes and SSH tools for administrators in `re8ch:k8s-admins`. Check `tools/list` on the selected connection before calling a tool; these surfaces are separate.

Observe the named domain before executing a change. For Ceph, use the read-only `ops-observe-vmcp-internal_get_ceph_storage_status` and `ops-observe-vmcp-internal_get_ready_node_storage_inventory` tools when listed. The bounded operate connection provides `get_ceph_recovery_status` and `restart_ceph_osd_1` when listed. The OSD restart is appropriate only for the reviewed failed single-Pod state on a Ready host; a restart alone does not prove recovery. For broader administrator repair, use native `kubectl.exec` or `node.ssh.exec` after verifying the exact target and repository GitOps rules.

Report the operation ID, affected resources, verification and rollback state. Never return Secrets or credentials. GitHub permissions remain native to GitHub; Dex authorization for an MCP resource does not grant repository rights. Missing or stale telemetry is unknown, not healthy. Inspect the owner, path, age and rollback route before any storage cleanup.

## Mandatory R640 public-network preflight

Before every operation that changes an R640 public IP, route, Gateway, listener, DNAT, eBGP, ZeroTier or dummy interface, read `operations/network/manifests/network/public-mesh/inventory.json` in the authoritative `service-backend` checkout and run `python operations/scripts/validate-r640-public-authority.py`. Its `r640.publicAuthority` is the machine-readable authority. Stop if the declaration, validator or live intent conflicts. The R640 ZeroTier address and dummy interface are routing identities, not directly attached public endpoints. Include the inventory path and validated authority fields in the audit evidence without credentials.
