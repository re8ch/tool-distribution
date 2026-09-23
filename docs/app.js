const statusLabel = value => value.replaceAll("-", " ");

function channelCard(channel) {
  const docs = channel.documentation ? `<a class="button" href="${channel.documentation}">Official requirements</a>` : "";
  return `<article class="channel ${channel.entryClass}" id="${channel.id}">
    <div class="channel-head"><span class="class-label">${statusLabel(channel.entryClass)}</span><span class="badge ${channel.status}">${statusLabel(channel.status)}</span></div>
    <h3>${channel.name}</h3>
    <p class="surfaces">${channel.surfaces.join(" · ")}</p>
    <p>${channel.detail}</p>
    <div class="integration">${channel.integration}</div>${docs}
  </article>`;
}

function pluginCard(plugin) {
  const endpoint = plugin.mcp.url || `Shared owner: ${plugin.mcp.owner}`;
  return `<article class="card" id="${plugin.id}">
    <h3>${plugin.name}</h3>
    <p class="summary">${plugin.summary}</p>
    <p class="access">${plugin.access}</p>
    <div class="route">
      <div class="route-head"><span>${plugin.mcp.role} MCP</span><span class="badge ${plugin.mcp.status}">${plugin.mcp.status}</span></div>
      <div class="value">${endpoint}</div>
      <div class="value">${plugin.selector}</div>
      ${plugin.mcp.url ? `<button type="button" data-copy="${plugin.mcp.url}">Copy endpoint</button>` : ""}
    </div>
  </article>`;
}

async function init() {
  const response = await fetch("./catalog.json");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const catalog = await response.json();
  document.querySelector("#updated").textContent = `Catalog updated ${catalog.updated}`;
  document.querySelector("#channels").innerHTML = catalog.channels.map(channelCard).join("");
  document.querySelector("#plugins").innerHTML = catalog.plugins.map(pluginCard).join("");

  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    await navigator.clipboard.writeText(button.dataset.copy);
    const original = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => { button.textContent = original; }, 1200);
  });
}

init().catch(error => {
  document.querySelector("#channels").innerHTML = `<p>Catalog unavailable: ${error.message}</p>`;
});
