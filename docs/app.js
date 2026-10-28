// Renders docs/catalog.json: hero stats, the distribution map, the channel matrix and packages.
const SVG_NS = "http://www.w3.org/2000/svg";
const CLASSES = [
  { id: "self-service", label: "Self-service", tone: "ok" },
  { id: "official-review", label: "Official review", tone: "warn" },
  { id: "unavailable", label: "Unavailable", tone: "bad" }
];
const toneOf = entryClass => (CLASSES.find(item => item.id === entryClass) || { tone: "unknown" }).tone;
const statusLabel = value => value.replaceAll("-", " ");
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function channelRow(channel) {
  const docs = channel.documentation ? `<a href="${escapeHtml(channel.documentation)}" rel="noopener">Official requirements →</a>` : "";
  return `<article class="row channel tone-${toneOf(channel.entryClass)}" id="${escapeHtml(channel.id)}">
    <div class="row-title"><h3>${escapeHtml(channel.name)}</h3><p class="surfaces">${channel.surfaces.map(escapeHtml).join(" · ")}</p></div>
    <div class="row-text"><p>${escapeHtml(channel.detail)}</p><p class="integration">${escapeHtml(channel.integration)}</p></div>
    <div class="row-side"><span class="state tone-${toneOf(channel.entryClass)}">${escapeHtml(statusLabel(channel.status))}</span>${docs}</div>
  </article>`;
}

function channelGroups(channels) {
  return CLASSES.map(group => {
    const items = channels.filter(channel => channel.entryClass === group.id);
    if (!items.length) return "";
    return `<div class="group"><h3 class="group-head tone-${group.tone}">${group.label}<span>${items.length}</span></h3><div class="rows">${items.map(channelRow).join("")}</div></div>`;
  }).join("");
}

function pluginCard(plugin, byId) {
  const owner = plugin.mcp.url ? "" : byId[plugin.mcp.owner];
  const endpoint = plugin.mcp.url
    ? `<div class="code"><div class="code-head"><span>MCP endpoint</span><button class="copy" type="button" data-copy="${escapeHtml(plugin.mcp.url)}">Copy</button></div><pre>${escapeHtml(plugin.mcp.url)}</pre></div>`
    : `<p class="shared-note">Reuses the <a href="#${escapeHtml(plugin.mcp.owner)}">${escapeHtml(owner ? owner.name : plugin.mcp.owner)}</a> connection.</p>`;
  return `<article class="panel package" id="${escapeHtml(plugin.id)}">
    <div class="package-head"><h3>${escapeHtml(plugin.name)}</h3><span class="state ${plugin.mcp.status === "live" ? "tone-ok" : "tone-unknown"}">${escapeHtml(plugin.mcp.role)} · ${escapeHtml(plugin.mcp.status)}</span></div>
    <p class="summary">${escapeHtml(plugin.summary)}</p>
    <p class="access">${escapeHtml(plugin.access)}</p>
    ${endpoint}
    <p class="selector"><code>${escapeHtml(plugin.selector)}</code></p>
  </article>`;
}

function svg(tag, attrs, parent, text) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  if (parent) parent.appendChild(node);
  return node;
}

function fitText(node, text, maxWidth) {
  node.textContent = text;
  if (node.getComputedTextLength() <= maxWidth) return;
  let cut = text.length;
  while (cut > 1 && node.getComputedTextLength() > maxWidth) node.textContent = `${text.slice(0, --cut).trimEnd()}…`;
}

function createMap(catalog) {
  const host = document.querySelector("[data-map]");
  const svgRoot = host.querySelector("svg");
  const caption = document.querySelector("[data-map-caption]");
  const chips = [...document.querySelectorAll("[data-map-filter] [data-filter]")];
  const state = { filter: "all", selected: catalog.channels[0].id };
  let nodes = [];

  function describe() {
    const channel = catalog.channels.find(item => item.id === state.selected);
    const tone = toneOf(channel.entryClass);
    caption.dataset.state = tone;
    caption.innerHTML = `<b>${escapeHtml(channel.name)} <span class="state tone-${tone}">${escapeHtml(statusLabel(channel.status))}</span></b><span>${escapeHtml(channel.detail)}</span><a href="#${escapeHtml(channel.id)}">Open in the matrix ↓</a>`;
  }

  function paint() {
    for (const node of nodes) {
      const visible = state.filter === "all" || node.channel.entryClass === state.filter;
      const selected = node.channel.id === state.selected;
      node.group.classList.toggle("is-dim", !visible);
      node.group.setAttribute("aria-pressed", String(selected));
      node.path.classList.toggle("is-dim", !visible);
      node.path.classList.toggle("is-selected", selected);
    }
    chips.forEach(chip => chip.setAttribute("aria-pressed", String(chip.dataset.filter === state.filter)));
    describe();
  }

  function select(id) { state.selected = id; paint(); }

  function draw() {
    const width = Math.max(280, Math.round(host.clientWidth));
    const wide = width >= 560;
    svgRoot.replaceChildren();
    nodes = [];
    const owners = catalog.plugins.filter(plugin => plugin.mcp.url).length;
    const hubTitle = "ToolHive MCP";
    const hubSub = `${catalog.plugins.length} packages · ${owners} endpoints`;

    let height;
    let hub;
    let channelPoint;
    if (wide) {
      const rowH = 34;
      height = catalog.channels.length * rowH + 28;
      const colX = Math.round(width * 0.62);
      hub = { x: Math.round(width * 0.42), y: height / 2, w: Math.min(140, Math.round(width * 0.19)), h: 64 };
      channelPoint = index => ({ x: colX, y: 14 + rowH * index + rowH / 2 });
      const plugH = 40;
      const plugGap = (height - catalog.plugins.length * plugH) / (catalog.plugins.length + 1);
      const plugW = Math.round(width * 0.25);
      const zone = svg("g", { class: "map-plugins" }, svgRoot);
      catalog.plugins.forEach((plugin, index) => {
        const y = plugGap + index * (plugH + plugGap);
        const shared = !plugin.mcp.url;
        svg("path", { class: `map-link ${shared ? "is-shared" : ""}`, d: `M${12 + plugW},${y + plugH / 2} C${12 + plugW + 30},${y + plugH / 2} ${hub.x - hub.w / 2 - 30},${hub.y} ${hub.x - hub.w / 2},${hub.y}` }, zone);
        svg("rect", { class: "svg-box", x: 12, y, width: plugW, height: plugH, rx: 8 }, zone);
        const label = svg("text", { class: "svg-title", x: 22, y: y + 17 }, zone);
        fitText(label, plugin.name, plugW - 20);
        svg("text", { class: "svg-mono", x: 22, y: y + 31 }, zone, shared ? "shared" : "owner");
      });
    } else {
      const rowH = 38;
      const top = 86;
      height = top + catalog.channels.length * rowH + 4;
      hub = { x: width / 2, y: 34, w: width - 24, h: 52 };
      channelPoint = index => ({ x: 46, y: top + rowH * index + rowH / 2 });
    }

    const links = svg("g", { class: "map-channels" }, svgRoot);
    const hubEdge = wide ? { x: hub.x + hub.w / 2, y: hub.y } : { x: 26, y: hub.y + hub.h / 2 };
    catalog.channels.forEach((channel, index) => {
      const point = channelPoint(index);
      const tone = toneOf(channel.entryClass);
      const d = wide
        ? `M${hubEdge.x},${hubEdge.y} C${hubEdge.x + 60},${hubEdge.y} ${point.x - 70},${point.y} ${point.x - 6},${point.y}`
        : `M${hubEdge.x},${hubEdge.y} L${hubEdge.x},${point.y - 10} Q${hubEdge.x},${point.y} ${hubEdge.x + 10},${point.y} L${point.x - 6},${point.y}`;
      const path = svg("path", { class: `map-route tone-${tone}`, d }, links);
      const group = svg("g", { class: `hit tone-${tone}`, tabindex: "0", role: "button", "aria-label": `${channel.name}: ${statusLabel(channel.status)}` }, svgRoot);
      const textX = point.x + 14;
      const textW = width - textX - 10;
      svg("rect", { class: "hit-area", x: point.x - 10, y: point.y - 16, width: width - point.x + 4, height: 32, rx: 6 }, group);
      svg("circle", { class: "focus-ring", cx: point.x, cy: point.y, r: 9 }, group);
      svg("circle", { class: "map-dot", cx: point.x, cy: point.y, r: 5 }, group);
      const name = svg("text", { class: "svg-title", x: textX, y: point.y - 2 }, group);
      fitText(name, channel.name, textW);
      const sub = svg("text", { class: "svg-label", x: textX, y: point.y + 12 }, group);
      fitText(sub, channel.surfaces.join(" · "), textW);
      group.addEventListener("click", () => select(channel.id));
      group.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(channel.id); }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          const next = nodes[(index + (event.key === "ArrowDown" ? 1 : nodes.length - 1)) % nodes.length];
          next.group.focus();
          select(next.channel.id);
        }
      });
      nodes.push({ channel, group, path });
    });

    const hubGroup = svg("g", { class: "map-hub" }, svgRoot);
    svg("rect", { class: "svg-hub", x: hub.x - hub.w / 2, y: hub.y - hub.h / 2, width: hub.w, height: hub.h, rx: 10 }, hubGroup);
    svg("text", { class: "svg-hub-title", x: hub.x, y: hub.y - (wide ? 8 : 3), "text-anchor": "middle" }, hubGroup, hubTitle);
    if (wide) {
      svg("text", { class: "svg-hub-sub", x: hub.x, y: hub.y + 9, "text-anchor": "middle" }, hubGroup, `${catalog.plugins.length} packages`);
      svg("text", { class: "svg-hub-sub", x: hub.x, y: hub.y + 23, "text-anchor": "middle" }, hubGroup, `${owners} endpoints`);
    } else {
      svg("text", { class: "svg-hub-sub", x: hub.x, y: hub.y + 14, "text-anchor": "middle" }, hubGroup, hubSub);
    }

    svgRoot.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgRoot.setAttribute("height", height);
    paint();
  }

  chips.forEach(chip => chip.addEventListener("click", () => {
    state.filter = chip.dataset.filter;
    const current = catalog.channels.find(item => item.id === state.selected);
    if (state.filter !== "all" && current.entryClass !== state.filter) {
      state.selected = catalog.channels.find(item => item.entryClass === state.filter).id;
    }
    paint();
  }));

  let lastWidth = 0;
  new ResizeObserver(() => {
    const width = Math.round(host.clientWidth);
    if (width !== lastWidth) { lastWidth = width; draw(); }
  }).observe(host);
}

async function init() {
  const response = await fetch("./catalog.json");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const catalog = await response.json();
  const byId = Object.fromEntries(catalog.plugins.map(plugin => [plugin.id, plugin]));

  document.querySelector("#updated").textContent = `Catalog updated ${catalog.updated}`;
  const counts = {
    channels: catalog.channels.length,
    live: catalog.plugins.filter(plugin => plugin.mcp.status === "live").length
  };
  for (const group of CLASSES) counts[group.id] = catalog.channels.filter(channel => channel.entryClass === group.id).length;
  document.querySelectorAll("[data-stat]").forEach(node => { node.textContent = counts[node.dataset.stat]; });

  document.querySelector("[data-channels]").innerHTML = channelGroups(catalog.channels);
  document.querySelector("[data-plugins]").innerHTML = catalog.plugins.map(plugin => pluginCard(plugin, byId)).join("");
  createMap(catalog);

  // Rendered content arrives after the browser's own hash scroll; honour deep links such as #re8ch-tenant.
  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
}

init().catch(error => {
  document.querySelector("[data-channels]").innerHTML = `<p class="note error">Catalog unavailable: ${escapeHtml(error.message)}</p>`;
  document.querySelector("[data-map-caption]").innerHTML = `<b>Catalog unavailable</b><span>${escapeHtml(error.message)}</span>`;
});
