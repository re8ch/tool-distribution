#!/usr/bin/env python3
"""Validate the deterministic consumer-only Re8ch OpenAI review archive."""

from __future__ import annotations

import hashlib
import json
import zipfile

from build_openai_re8ch import APP_ID, VERSION, build


EXPECTED_LANGUAGES = {
    "zh-CN", "zh-TW", "ja-JP", "ko-KR", "es-ES",
    "fr-FR", "de-DE", "pt-BR", "it-IT", "ar-SA",
}
EXPECTED_SKILLS = {
    "tenant-byoc", "tenant-database", "tenant-observability",
    "tenant-registry", "tenant-self-service", "tenant-ssh-broker",
}
FORBIDDEN_TOOL_MARKERS = {
    "platform_kubectl_exec", "platform_kubernetes_resource_read",
    "platform_node_ssh_exec", "tenant_kubernetes_get",
    "tenant_kubernetes_apply", "tenant_kubernetes_delete",
    "reconcile_control_plane_authentication_config",
}
EXPECTED_STALWART_TOOLS = {
    "stalwart_capabilities",
    "stalwart_mail_query", "stalwart_mail_read", "stalwart_mail_send",
    "stalwart_calendar_query", "stalwart_calendar_respond",
    "stalwart_contacts_query", "stalwart_files_list", "stalwart_files_read",
}


def digest(path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    first = build()
    first_digest = digest(first)
    second = build()
    assert first_digest == digest(second), "OpenAI archive is not deterministic"

    with zipfile.ZipFile(second) as archive:
        names = set(archive.namelist())
        manifest = json.loads(archive.read("plugin.json"))
        mcp = json.loads(archive.read("mcp.json"))
        skills = {
            name.split("/")[1]
            for name in names
            if name.startswith("skills/") and name.endswith("/SKILL.md")
        }
        text = "\n".join(
            archive.read(name).decode()
            for name in names
            if name == "plugin.json" or name.endswith("/SKILL.md")
        )

    assert manifest["name"] == APP_ID
    assert manifest["version"] == VERSION == "1.0.3"
    translations = manifest["extensions"]["com.openai"]["publication"]["translations"]
    assert set(translations) == EXPECTED_LANGUAGES
    assert skills == EXPECTED_SKILLS
    assert "skills/platform-admin/SKILL.md" not in names
    server = mcp["mcpServers"]["re8ch-tenant"]
    assert server == {
        "type": "streamable-http",
        "url": "https://tools.service.re8ch.com/tenant-plugin/mcp",
    }
    for marker in FORBIDDEN_TOOL_MARKERS:
        assert marker not in text, f"consumer package exposes {marker}"
    for tool in EXPECTED_STALWART_TOOLS:
        assert tool in text, f"consumer review contract is missing {tool}"
    for required in (
        "service_catalog_list", "service_instance_get", "service_binding_list",
        "organization-owned service instance", "static tool name",
    ):
        assert required in text, f"consumer compatibility contract is missing {required}"
    print(f"validated {second} sha256={first_digest}")


if __name__ == "__main__":
    main()
