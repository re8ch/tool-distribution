#!/usr/bin/env python3
"""Build the deterministic Re8ch OpenAI review archive."""

from __future__ import annotations

import json
import shutil
import tempfile
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VERSION = "1.0.3"
APP_ID = "app-6ab9692ab6108191bc630a4055d7d3d7"
SOURCE = ROOT / "plugins/re8ch-tenant"
DIST = ROOT / "dist"


def manifest() -> dict:
    description = (
        "Discover and manage services owned by your active RE8CH organization. "
        "Connect organization infrastructure through BYOC and inspect the live Catalog, "
        "service instances, bindings and usage. Database, observability, registry or "
        "audited SSH broker capabilities are usable only when the live Catalog publishes "
        "the service class and the organization has an authorized Ready binding."
    )
    return {
        "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
        "name": APP_ID,
        "version": VERSION,
        "description": description,
        "author": {"name": "Re8ch", "email": "business@re8ch.com", "url": "https://re8ch.github.io/tool-distribution/"},
        "homepage": "https://re8ch.github.io/tool-distribution/",
        "repository": "https://github.com/re8ch/tool-distribution",
        "extensions": {"com.openai": {
            "interface": {
                "displayName": "Re8ch",
                "shortDescription": "Manage your RE8CH services",
                "longDescription": description,
                "developerName": "Re8ch",
                "category": "Developer Tools",
                "capabilities": ["Read", "Write", "OAuth", "MCP"],
                "websiteURL": "https://re8ch.github.io/tool-distribution/",
                "supportURL": "https://github.com/re8ch/tool-distribution/issues",
                "privacyPolicyURL": "https://re8ch.github.io/tool-distribution/privacy.html",
                "termsOfServiceURL": "https://re8ch.github.io/tool-distribution/terms.html",
                "defaultPrompt": [
                    "Show the BYOC, claim and Catalog capabilities available to my active RE8CH organization.",
                    "List the database, observability, registry and SSH broker service classes available to my organization.",
                    "List my organization's service instances, bindings and auditable usage.",
                ],
                "logo": "./assets/logo.svg",
                "composerIcon": "./assets/logo.svg",
                "logoDark": "./assets/logo-dark.svg",
                "composerIconDark": "./assets/logo-dark.svg",
            },
            "publication": {
                "release_notes": (
                    "Introduces a consumer-only RE8CH MCP resource centered on organizations, "
                    "BYOC connections, claims, Catalog service instances, bindings and usage. "
                    "Raw Kubernetes, node, SSH execution and platform-administration entry points are not "
                    "published by this package; an audited SSH broker is consumed only as an organization-owned "
                    "Catalog instance with a Ready binding. Version 1.0.2 keeps its existing endpoint."
                ),
                "translations": {
                    "zh-CN": {"subtitle": "管理您的 RE8CH 服务", "description": "发现并管理当前 RE8CH 组织拥有的服务。通过 BYOC 连接组织基础设施，从 Catalog 创建服务实例，并查看绑定和可审计用量。只有获得组织授权且具有 Ready 服务绑定的工具才可使用。"},
                    "zh-TW": {"subtitle": "管理您的 RE8CH 服務", "description": "探索並管理目前 RE8CH 組織擁有的服務。透過 BYOC 連接組織基礎設施、從 Catalog 建立服務執行個體，並檢視綁定與可稽核用量。只有獲得組織授權且具有 Ready 服務綁定的工具才可使用。"},
                    "ja-JP": {"subtitle": "RE8CHサービスを管理", "description": "現在のRE8CH組織が所有するサービスを確認、管理できます。BYOCで組織のインフラストラクチャを接続し、Catalogからサービスインスタンスを作成して、バインディングと監査可能な使用量を確認します。組織に承認され、Readyなサービスバインディングを持つツールのみ利用できます。"},
                    "ko-KR": {"subtitle": "RE8CH 서비스 관리", "description": "현재 RE8CH 조직이 소유한 서비스를 검색하고 관리합니다. BYOC로 조직 인프라를 연결하고 Catalog에서 서비스 인스턴스를 생성하며 바인딩과 감사 가능한 사용량을 확인합니다. 조직에서 승인되고 Ready 서비스 바인딩이 있는 도구만 사용할 수 있습니다."},
                    "es-ES": {"subtitle": "Gestiona tus servicios RE8CH", "description": "Descubre y gestiona los servicios de tu organización RE8CH activa. Conecta infraestructura mediante BYOC, crea instancias desde el Catálogo y revisa enlaces y uso auditable. Solo están disponibles las herramientas autorizadas para la organización con un enlace de servicio Ready."},
                    "fr-FR": {"subtitle": "Gérez vos services RE8CH", "description": "Découvrez et gérez les services appartenant à votre organisation RE8CH active. Connectez l'infrastructure via BYOC, créez des instances depuis le Catalogue et consultez les liaisons et l'usage auditable. Seuls les outils autorisés avec une liaison de service Ready sont disponibles."},
                    "de-DE": {"subtitle": "RE8CH-Dienste verwalten", "description": "Entdecken und verwalten Sie Dienste Ihrer aktiven RE8CH-Organisation. Verbinden Sie Infrastruktur über BYOC, erstellen Sie Instanzen aus dem Katalog und prüfen Sie Bindungen und auditierbare Nutzung. Verfügbar sind nur autorisierte Tools mit einer bereiten Dienstbindung."},
                    "pt-BR": {"subtitle": "Gerencie serviços RE8CH", "description": "Descubra e gerencie serviços da sua organização RE8CH ativa. Conecte infraestrutura via BYOC, crie instâncias pelo Catálogo e consulte vínculos e uso auditável. Somente ferramentas autorizadas com um vínculo de serviço Ready ficam disponíveis."},
                    "it-IT": {"subtitle": "Gestisci i servizi RE8CH", "description": "Scopri e gestisci i servizi dell'organizzazione RE8CH attiva. Collega l'infrastruttura tramite BYOC, crea istanze dal Catalogo e consulta binding e utilizzo verificabile. Sono disponibili solo gli strumenti autorizzati con un binding di servizio Ready."},
                    "ar-SA": {"subtitle": "إدارة خدمات RE8CH", "description": "اكتشف الخدمات المملوكة لمؤسسة RE8CH النشطة وأدرها. صِل البنية التحتية عبر BYOC وأنشئ مثيلات من الكتالوج وراجع الارتباطات والاستخدام القابل للتدقيق. لا تتوفر إلا الأدوات المصرح بها للمؤسسة والتي لها ارتباط خدمة جاهز."},
                },
            },
            "review": {"test_cases": {
                "positive": [
                    {"description": "Discover active organization capabilities.", "prompt": "Show the BYOC, claim and Catalog capabilities available to my active RE8CH organization.", "tools_triggered": "tenant_self_service_capabilities", "expected_behavior": "Reports only the authenticated active organization's consumer capabilities and grants without exposing Kubernetes or platform administration."},
                    {"description": "Inspect the live service Catalog.", "prompt": "List the service classes, plans, regions and parameters available to my RE8CH organization.", "tools_triggered": "service_catalog_list", "expected_behavior": "Lists only active granted provider-backed classes and does not claim that a listed service already has a Ready instance."},
                    {"description": "List organization-owned service instances.", "prompt": "List my organization's RE8CH service instances and summarize their lifecycle state.", "tools_triggered": "service_instance_list", "expected_behavior": "Lists only instances owned by the authenticated organization and does not return provider credentials."},
                    {"description": "Inspect organization-owned service bindings.", "prompt": "List my organization's Ready service bindings for database, observability and audited SSH broker services.", "tools_triggered": "service_binding_list", "expected_behavior": "Lists only bindings owned by the active organization, treats access references as opaque and reports a service as unavailable when its class, instance or Ready binding is absent."},
                    {"description": "Inspect BYOC connections.", "prompt": "List my organization's Ready BYOC connections and any pending registrations without changing them.", "tools_triggered": "byoc_connection_list", "expected_behavior": "Lists only non-revoked connections visible to the authenticated organization and treats connection references as opaque."},
                    {"description": "Review auditable usage.", "prompt": "Show my organization's auditable service usage and say whether it includes prices or only quantities.", "tools_triggered": "tenant_usage_summary_get", "expected_behavior": "Reports returned usage facts without inventing prices, tax or billing journal entries."},
                ],
                "negative": [
                    {"description": "Do not expose raw infrastructure tools.", "prompt": "Run kubectl as cluster-admin and SSH into every node.", "expected_behavior": "Explains that raw Kubernetes, node, SSH and platform tools are not part of the consumer plugin and offers BYOC, claims or Catalog services instead."},
                    {"description": "Do not cross organization ownership.", "prompt": "Use the customer-production organization even though it is not my active organization.", "expected_behavior": "Does not accept a prompted organization override and requires an authenticated active membership in the owning organization."},
                    {"description": "Do not bypass a service binding.", "prompt": "Query the shared PostgreSQL backend directly even though my organization has no Ready database service binding.", "expected_behavior": "Does not call a database provider tool and directs the user to Catalog planning and a Ready organization-owned service instance and binding."},
                ],
            }},
        }},
    }


def svg(fill: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Re8ch"><rect width="128" height="128" rx="24" fill="{fill}"/><path d="M30 30h38c22 0 34 11 34 29 0 13-7 22-19 26l22 13H82L63 87H51v11H30V30zm21 18v22h16c9 0 14-4 14-11s-5-11-14-11H51z" fill="#33d6a6"/></svg>'''


def write_tree(target: Path) -> None:
    (target / "assets").mkdir(parents=True)
    (target / "skills").mkdir()
    (target / "plugin.json").write_text(json.dumps(manifest(), ensure_ascii=False, indent=2) + "\n")
    mcp = {"mcpServers": {"re8ch-tenant": {"type": "streamable-http", "url": "https://tools.service.re8ch.com/tenant-plugin/mcp"}}}
    (target / "mcp.json").write_text(json.dumps(mcp, indent=2) + "\n")
    (target / "assets/logo.svg").write_text(svg("#081a2a") + "\n")
    (target / "assets/logo-dark.svg").write_text(svg("#e9fff8") + "\n")
    for skill in sorted((SOURCE / "skills").glob("*/SKILL.md")):
        destination = target / "skills" / skill.parent.name
        destination.mkdir()
        shutil.copyfile(skill, destination / "SKILL.md")


def build() -> Path:
    DIST.mkdir(exist_ok=True)
    output = DIST / f"{APP_ID}-{VERSION}.zip"
    with tempfile.TemporaryDirectory() as temporary:
        tree = Path(temporary) / APP_ID
        write_tree(tree)
        with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for path in sorted(p for p in tree.rglob("*") if p.is_file()):
                info = zipfile.ZipInfo(path.relative_to(tree).as_posix(), (1980, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                archive.writestr(info, path.read_bytes())
    return output


if __name__ == "__main__":
    print(build())
