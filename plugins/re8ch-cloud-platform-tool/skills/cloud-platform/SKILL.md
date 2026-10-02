---
name: cloud-platform
description: Inspect RE8CH Kubernetes and perform authorized administrator kubectl and SSH operations.
---

# RE8CH Cloud Platform Tool

This package provides three OAuth MCP connections with distinct live tool surfaces:

| Connection | Endpoint | Tools |
| --- | --- | --- |
| `re8ch-cloud-observe` | `https://tools.service.re8ch.com/cloud/mcp` | Published read-only infrastructure tools |
| `re8ch-platform-operate` | `https://operate.tools.re8ch.com/mcp` | Five bounded platform operation tools |
| `re8ch-cloud-platform-tool` | `https://operate.tools.re8ch.com/cloud/mcp` | Native Kubernetes, node and workspace tools; administrator writes require `re8ch:k8s-admins` |

Use `tools/list` for the selected connection. A skill description does not establish that a tool is available. If the administrative connection or a named tool is unavailable, report the missing capability; do not present the read-only connection as an administrator surface.

The native administrative tools include `nodes.list`, `nodes.get`, `nodes.reachability`, `kube.nodes`, `kube.pods`, `kube.resource.get`, `kube.resource.list`, `kube.events.query` and workspace inspection. Members of `re8ch:k8s-admins` additionally receive `kubectl.exec`, `node.ssh.exec`, `kube.resource.apply`, `kube.resource.patch`, `kube.resource.delete`, `workspace.index` and `workspace.sync`. `kubectl.exec` accepts an argument array and optional stdin; `node.ssh.exec` accepts an inventory node name and argument array. Both return an operation ID, exit code and bounded stdout/stderr.

1. Inspect the target and current state before a write when the control plane is reachable.
2. An explicit request to run kubectl, SSH, transfer a file, restart a service or repair a named target authorizes the corresponding operation. Follow repository GitOps rules for declared cluster state.
3. Use argument arrays and stdin exactly. Never put credentials, token values, kubeconfig contents or private keys in arguments, output, artifacts or logs. Avoid commands that return Secret payloads.
4. Select inventory node names for SSH and report the target, exit status and operation ID. The server keeps Kubernetes and SSH credentials; never request or copy them.
5. Treat Windows hosts and their WSL Kubernetes nodes as separate targets: `a1-windows` hosts `a1-wsl-zt`, and `b1-windows` hosts `b1-wsl-zt`. Recover an unavailable WSL node through its Windows host and the healthy peer jump path.
