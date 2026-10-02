---
name: agent-orchestra
description: Coordinate RE8CH Teable, LiteLLM, OpenSandbox, KAgent and Codex workflows using stable task and artifact identifiers.
---

# RE8CH Agent Orchestra Collab

Use the shared `re8ch-cloud-platform-tool` MCP server for this workflow.
Authentication is shared once at this edge; application tools retain their own
authorization and audit boundaries.

1. Preserve `task_id`, `kagent_session_id`, `trace_id`, `codex_thread_id` and `artifact_id` across calls.
2. An explicit request to claim/update a task, manage a sandbox, dispatch an agent or register an artifact authorizes that exact application write.
3. Never request or expose Kubernetes Secrets, kubeconfig, SSH access or infrastructure mutation through this surface.
4. Report stable identifiers and application-level audit status after mutations.
