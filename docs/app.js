const routeOrder = ["mcp", "plugin", "app", "work"];
const routeNames = { mcp: "MCP", plugin: "Codex Plugin", app: "ChatGPT App", work: "ChatGPT Work / Cowork" };

function routeValue(route) {
  return route.url || route.uri || route.selector || "Registration ID pending";
}

function routeButton(route, value) {
  if (route.url) return `<button type="button" data-copy="${value}">Copy endpoint</button>`;
  if (route.uri) return `<a class="button" href="${route.uri}">Open plugin</a>`;
  return "";
}

function renderRoute(kind, route) {
  const value = routeValue(route);
  return `<section class="route">
    <div class="route-head"><span class="route-title">${routeNames[kind]}</span><span class="badge ${route.status}">${route.status.replaceAll("-", " ")}</span></div>
    <div class="value">${value}</div>
    ${route.detail ? `<p class="detail">${route.detail}</p>` : ""}
    ${routeButton(route, value)}
  </section>`;
}

async function init() {
  const response = await fetch("./catalog.json");
  const catalog = await response.json();
  document.querySelector("#updated").textContent = `Catalog updated ${catalog.updated}`;
  document.querySelector("#plugins").innerHTML = catalog.plugins.map((plugin, index) => `
    <article class="card ${index === 0 ? "tools" : "admin"}" id="${plugin.id}">
      <h2>${plugin.name}</h2>
      <p class="summary">${plugin.summary}</p>
      <p class="access">${plugin.access}</p>
      <div class="routes">${routeOrder.map(kind => renderRoute(kind, plugin[kind])).join("")}</div>
    </article>`).join("");

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
  document.querySelector("#plugins").innerHTML = `<p>Catalog unavailable: ${error.message}</p>`;
});
