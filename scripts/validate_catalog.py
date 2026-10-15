#!/usr/bin/env python3
"""Validate the public ConnecTool distribution catalog."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "docs/catalog.json").read_text())
CLAUDE_TENANT = ROOT / "plugins/re8ch-tenant"


def main() -> None:
    if CATALOG.get("schemaVersion") != "2.0":
        raise SystemExit("catalog schemaVersion must be 2.0")
    channels = CATALOG.get("channels", [])
    channel_ids = [item["id"] for item in channels]
    required_channels = {
        "openai-private", "openai-public", "anthropic-custom-connector",
        "anthropic-private-plugin", "anthropic-public", "cursor-team",
        "cursor-public", "workbuddy", "coze-custom", "coze-team-store", "doubao",
    }
    if set(channel_ids) != required_channels or len(channel_ids) != len(set(channel_ids)):
        raise SystemExit(f"channel set drifted: {channel_ids}")
    allowed_classes = {"self-service", "official-review", "unavailable"}
    for channel in channels:
        if channel.get("entryClass") not in allowed_classes:
            raise SystemExit(f"{channel['id']}: invalid entryClass")
        if not channel.get("status") or not channel.get("detail"):
            raise SystemExit(f"{channel['id']}: status and detail are required")

    plugins = CATALOG.get("plugins", [])
    plugin_ids = [item["id"] for item in plugins]
    expected_plugins = {
        "re8ch-cloud-platform-tool", "re8ch-cluster-infra-tool",
        "re8ch-agent-orchestra-collab", "re8ch-tenant-admin", "re8ch-tenant",
    }
    if set(plugin_ids) != expected_plugins or len(plugin_ids) != len(set(plugin_ids)):
        raise SystemExit(f"plugin set drifted: {plugin_ids}")
    for plugin in plugins:
        mcp = plugin["mcp"]
        if mcp["role"] == "owner" and not mcp.get("url"):
            raise SystemExit(f"{plugin['id']}: owning plugin has no MCP URL")
        if mcp["role"] == "shared" and mcp.get("owner") != "re8ch-cloud-platform-tool":
            raise SystemExit(f"{plugin['id']}: unexpected shared MCP owner")

    claude_manifest = json.loads(
        (CLAUDE_TENANT / ".claude-plugin/plugin.json").read_text()
    )
    claude_mcp = json.loads((CLAUDE_TENANT / ".mcp.json").read_text())
    claude_readme = (CLAUDE_TENANT / "README.md").read_text()
    claude_skill = (CLAUDE_TENANT / "skills/tenant-self-service/SKILL.md").read_text()
    claude_icon = (CLAUDE_TENANT / ".claude-plugin/icon.png").read_bytes()

    if claude_manifest.get("version") != "0.2.4":
        raise SystemExit("Claude tenant plugin version must be 0.2.4")
    if claude_mcp["mcpServers"]["re8ch-tenant"]["url"] != (
        "https://tools.service.re8ch.com/tenant-native/mcp"
    ):
        raise SystemExit("Claude tenant plugin must use the tenant-native endpoint")
    for required in ("Re8ch application organization", "Re8ch Admin", "disconnect and reconnect"):
        if required not in claude_readme:
            raise SystemExit(f"Claude tenant README is missing organization boundary: {required}")
    if "Never treat membership in one organization" not in claude_skill:
        raise SystemExit("Claude tenant skill must preserve organization membership boundaries")
    if not claude_icon.startswith(b"\x89PNG\r\n\x1a\n"):
        raise SystemExit("Claude tenant icon must remain a PNG")

    print("catalog validation passed: channels and plugin ownership are complete")


if __name__ == "__main__":
    main()
