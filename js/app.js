/* =========================================================
   Gabinete Estadual DeMolay SP — Diretório de contatos
   ========================================================= */

/* ---------- CONFIGURAÇÃO (edite à vontade) ---------- */
const CONFIG = {
  gestao: "Gestão 2026/2027",
  linhaSuperior: "DeMolay São Paulo", // aparece antes de "• Gestão ..."
  titulo: "Gabinete Estadual",
  subtitulo: "Solenes Propósitos.", // 2ª linha do título, em branco mais suave (deixe "" para ocultar)
  logo: "assets/brasao.jpg", // brasão no topo (ex.: "assets/brasao.png"); deixe "" para não mostrar
  areaDestaque: "Direção Estadual", // seção com cards maiores
  ddi: "55",
};

/* ---------- Utilitários ---------- */
const PREPOSICOES = new Set(["da", "das", "de", "do", "dos", "e", "di", "du"]);

/** "CARLOS EDUARDO DA SILVA FILHO" -> "Carlos Eduardo da Silva Filho".
 *  Nomes que já têm minúsculas são mantidos como estão (ex.: "Pedro De Cico"). */
function titleCase(nome) {
  const limpo = String(nome || "").trim().replace(/\s+/g, " ");
  if (limpo !== limpo.toLocaleUpperCase("pt-BR")) return limpo;
  return limpo
    .toLocaleLowerCase("pt-BR")
    .split(/\s+/)
    .map((p, i) =>
      i > 0 && PREPOSICOES.has(p)
        ? p
        : p.replace(/(^|[-'])(\p{L})/gu, (m, sep, ch) => sep + ch.toLocaleUpperCase("pt-BR"))
    )
    .join(" ");
}

/** Só dígitos, sem o DDI na frente. */
function soDigitos(tel, ddi = CONFIG.ddi) {
  let d = String(tel || "").replace(/\D/g, "");
  if (ddi === CONFIG.ddi && d.length > 11 && d.startsWith(ddi)) d = d.slice(ddi.length);
  return d;
}

/** "17996220111" -> "(17) 99622-0111" */
function formatarTelefone(digitos) {
  const d = digitos;
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return d;
}

/** Minúsculas e sem acentos, para comparar na busca. */
function normalizar(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** Ordem dentro da seção: MCE, Adjunto, Secretário(s), demais. */
function prioridadeCargo(cargo) {
  const c = normalizar(cargo);
  if (/^mestre conselheiro estadual$/.test(c) || c === "mce") return 0;
  if (/mestre conselheiro estadual.*adj|^mcea$/.test(c)) return 1;
  if (/^secretari/.test(c)) return 2;
  return 3;
}

/* ---------- Ícones (SVG inline) ---------- */
const ICON = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z"/></svg>',
  call: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
};

/* ---------- Dados ---------- */
const membros = (typeof MEMBROS !== "undefined" ? MEMBROS : []).map((m, ordem) => {
  const ddi = String(m.ddi || CONFIG.ddi).replace(/\D/g, "");
  const digitos = soDigitos(m.digitos || m.telefone, ddi);
  const nacional = ddi === CONFIG.ddi;
  const nome = titleCase(m.nome);
  const area = String(m.area || "Outros").trim();
  const detalhe = String(m.detalhe || "").trim();
  let telefone = "";
  if (digitos) {
    if (nacional) telefone = formatarTelefone(digitos);
    else if (ddi === "1" && digitos.length === 10)
      telefone = `+1 (${digitos.slice(0, 3)}) ${digitos.slice(3, 6)}-${digitos.slice(6)}`;
    else telefone = `+${ddi} ${String(m.telefone || digitos).trim()}`;
  }
  return {
    nome,
    cargo: String(m.cargo || "").trim(),
    area,
    detalhe,
    ddi,
    digitos,
    internacional: !nacional,
    telefone,
    ordem,
    busca: normalizar(`${nome} ${m.cargo} ${area} ${detalhe}`),
  };
}).map((m) => {
  m.palavras = m.busca.split(/[^a-z0-9ª]+/).filter(Boolean);
  return m;
});

// Áreas na ordem em que aparecem em membros.js (a área de destaque sempre primeiro)
const areas = [...new Set(membros.map((m) => m.area))].sort((a, b) =>
  (b === CONFIG.areaDestaque) - (a === CONFIG.areaDestaque)
);

/* ---------- Estado e elementos ---------- */
const state = { termo: "", area: "all" };
const $ = (id) => document.getElementById(id);
const els = {
  container: $("directory-container"),
  search: $("search"),
  clear: $("clear-btn"),
  filterBtn: $("filter-btn"),
  filterDot: document.querySelector(".filter-dot"),
  panel: $("filter-panel"),
  options: $("filter-options"),
  badge: $("filter-badge"),
  count: $("result-count"),
  toast: $("toast"),
};

/* ---------- Cabeçalho a partir da configuração ---------- */
function aplicarConfig() {
  $("eyebrow").textContent = `${CONFIG.linhaSuperior} • ${CONFIG.gestao}`;
  $("title").textContent = CONFIG.titulo;
  $("subtitle").textContent = CONFIG.subtitulo;
  if (CONFIG.logo) {
    $("logo").src = CONFIG.logo;
    $("logo").hidden = false;
  }
  const anos = (CONFIG.gestao.match(/\d{4}\s*\/\s*\d{4}/) || [""])[0].replace(/\s/g, "");
  if (anos) $("footer-copy").textContent = `© ${anos} Gabinete Estadual da Ordem DeMolay do Estado de São Paulo.`;
}

/* ---------- Busca ---------- */
function filtrar() {
  const tokens = normalizar(state.termo).split(/\s+/).filter(Boolean);
  const daArea = membros.filter((m) => state.area === "all" || m.area === state.area);
  if (!tokens.length) return daArea;

  const casa = (m, t, estrito) => {
    const td = t.replace(/\D/g, "");
    if (td.length >= 3 && td.length === t.replace(/[\s().+-]/g, "").length) {
      return m.digitos.includes(td);
    }
    // No modo estrito, termos curtos ("c", "a+b") precisam ser uma palavra inteira:
    // assim "macro c" não casa com o "c" de "Conselheiro".
    if (estrito && t.length <= 2) return m.palavras.includes(t);
    return m.busca.includes(t);
  };
  const estrito = daArea.filter((m) => tokens.every((t, i) => (i === 0 ? casa(m, t, false) : casa(m, t, true))));
  if (estrito.length || !tokens.slice(1).some((t) => t.length <= 2)) return estrito;
  // Ninguém casou no modo estrito (ex.: "joao pe" ainda sendo digitado): busca normal.
  return daArea.filter((m) => tokens.every((t) => casa(m, t, false)));
}

/* ---------- Renderização ---------- */
function cardHtml(m, i, destaque) {
  const prio = prioridadeCargo(m.cargo);
  const classes = ["card"];
  if (destaque) classes.push("card--featured");
  if (destaque && prio === 1) classes.push("is-adj");
  if (!destaque && (prio === 2 || /^coordenador/.test(normalizar(m.cargo)))) classes.push("card--lead");

  const nome = escapeHtml(m.nome);
  const tel = escapeHtml(m.telefone);
  const contato = m.digitos
    ? `
      <div class="card-phone">
        <span class="num">${tel}</span>
        <button type="button" class="copy-btn" data-copy="${escapeHtml(m.telefone)}" aria-label="Copiar número de ${nome}: ${tel}">
          ${ICON.copy}<span>Copiar</span>
        </button>
      </div>
      <div class="card-actions">
        <a class="btn btn-wa" href="https://wa.me/${m.ddi}${m.digitos}" target="_blank" rel="noopener" aria-label="Enviar mensagem no WhatsApp para ${nome}">
          ${ICON.wa}<span>WhatsApp</span>
        </a>
        <a class="btn btn-call" href="tel:+${m.ddi}${m.digitos}" aria-label="Ligar para ${nome}">
          ${ICON.call}<span>Ligar</span>
        </a>
      </div>`
    : `<p class="no-phone">Telefone não informado</p>`;

  return `
    <article class="${classes.join(" ")}" style="--i:${i}">
      <p class="card-cargo">${escapeHtml(m.cargo)}</p>
      <h3 class="card-nome">${nome}</h3>
      ${m.detalhe || m.internacional ? `<div class="card-tags">${m.detalhe ? `<span class="tag">${escapeHtml(m.detalhe)}</span>` : ""}${m.internacional ? `<span class="tag tag--intl">Número internacional</span>` : ""}</div>` : ""}
      ${contato}
    </article>`;
}

function render() {
  const lista = filtrar();
  const total = lista.length;
  els.count.textContent =
    total === 1 ? "1 contato encontrado" : `${total} contatos encontrados`;

  if (!total) {
    const termo = state.termo.trim();
    els.container.innerHTML = `
      <div class="empty">
        <p>Nenhum contato encontrado${termo ? ` para “${escapeHtml(termo)}”` : ""}.</p>
        <p class="empty-hint">Confira a grafia ou tente buscar só pelo primeiro nome.</p>
        <button type="button" class="btn btn-call" id="reset-btn" style="margin:16px auto 0">Limpar busca e filtros</button>
      </div>`;
    $("reset-btn").addEventListener("click", resetar);
    return;
  }

  let i = 0;
  const html = areas
    .map((area) => {
      const doGrupo = lista
        .filter((m) => m.area === area)
        .sort((a, b) => prioridadeCargo(a.cargo) - prioridadeCargo(b.cargo) || a.ordem - b.ordem);
      if (!doGrupo.length) return "";
      const destaque = area === CONFIG.areaDestaque;
      const cards = doGrupo.map((m) => cardHtml(m, i++, destaque)).join("");
      return `
        <section class="section" aria-labelledby="sec-${slug(area)}">
          <div class="section-head">
            <p class="section-eyebrow">${doGrupo.length === 1 ? "1 contato" : `${doGrupo.length} contatos`}</p>
            <h2 id="sec-${slug(area)}">${escapeHtml(area)}</h2>
          </div>
          <div class="grid${destaque ? " grid--featured" : ""}">${cards}</div>
        </section>`;
    })
    .join("");
  els.container.innerHTML = html;
}

function slug(s) {
  return normalizar(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* ---------- Filtro por área ---------- */
function renderFiltro() {
  const opcoes = [["all", "Todas as áreas", membros.length]].concat(
    areas.map((a) => [a, a, membros.filter((m) => m.area === a).length])
  );
  els.options.innerHTML = opcoes
    .map(
      ([valor, rotulo, n]) => `
      <button type="button" role="radio" class="filter-option" data-area="${escapeHtml(valor)}"
              aria-checked="${state.area === valor}">
        <span>${escapeHtml(rotulo)}</span><span class="count">${n}</span>
      </button>`
    )
    .join("");
  const ativo = state.area !== "all";
  els.badge.textContent = ativo ? state.area : "Todas";
  els.filterDot.hidden = !ativo;
  els.filterBtn.setAttribute("aria-label", ativo ? `Filtrar por área (atual: ${state.area})` : "Filtrar por área");
}

function abrirPainel(abrir) {
  els.panel.hidden = !abrir;
  els.filterBtn.setAttribute("aria-expanded", String(abrir));
  if (abrir) {
    const atual = els.options.querySelector('[aria-checked="true"]');
    (atual || els.options.firstElementChild)?.focus();
  }
}

function resetar() {
  state.termo = "";
  state.area = "all";
  els.search.value = "";
  els.clear.hidden = true;
  renderFiltro();
  render();
  els.search.focus();
}

/* ---------- Copiar número ---------- */
async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Alternativa para navegadores antigos ou contextos sem permissão
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

let toastTimer;
function toast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

/* ---------- Eventos ---------- */
function ligarEventos() {
  els.search.addEventListener("input", () => {
    state.termo = els.search.value;
    els.clear.hidden = !state.termo;
    render();
  });
  els.search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      els.search.blur(); // fecha o teclado no celular
      $("controls").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (e.key === "Escape" && els.search.value) {
      resetarBusca();
    }
  });
  els.clear.addEventListener("click", () => { resetarBusca(); els.search.focus(); });

  els.filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    abrirPainel(els.panel.hidden);
  });
  els.options.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-option");
    if (!btn) return;
    state.area = btn.dataset.area;
    renderFiltro();
    render();
    abrirPainel(false);
    els.filterBtn.focus();
  });
  els.options.addEventListener("keydown", (e) => {
    if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const btns = [...els.options.querySelectorAll(".filter-option")];
    const idx = btns.indexOf(document.activeElement);
    const prox = (idx + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length;
    btns[prox].focus();
  });
  document.addEventListener("click", (e) => {
    if (!els.panel.hidden && !e.target.closest(".search-wrap")) abrirPainel(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !els.panel.hidden) {
      abrirPainel(false);
      els.filterBtn.focus();
    }
  });

  els.container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const ok = await copiar(btn.dataset.copy);
    const label = btn.querySelector("span");
    if (ok) {
      btn.classList.add("copied");
      btn.querySelector("svg").outerHTML = ICON.check;
      label.textContent = "Copiado!";
      toast(`Número ${btn.dataset.copy} copiado`);
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.querySelector("svg").outerHTML = ICON.copy;
        label.textContent = "Copiar";
      }, 1800);
    } else {
      toast("Não foi possível copiar");
    }
  });
}

function resetarBusca() {
  els.search.value = "";
  state.termo = "";
  els.clear.hidden = true;
  render();
}

/* ---------- Início ---------- */
aplicarConfig();
renderFiltro();
render();
ligarEventos();
