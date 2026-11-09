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
      <p class="card-cargo">${realce(m.cargo)}</p>
      <h3 class="card-nome">${realce(m.nome)}</h3>
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
    aposRender();
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
  aposRender();
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

/* =========================================================
   Dinâmica: animações e interações
   ========================================================= */
const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const temHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Destaca no texto os termos buscados (ignorando acentos e maiúsculas). */
function realce(texto) {
  const tokens = normalizar(state.termo).split(/\s+/).filter((t) => t && !/^\d+$/.test(t));
  if (!tokens.length) return escapeHtml(texto);
  let norm = "";
  const mapa = [];
  [...texto].forEach((ch, idx) => {
    const n = normalizar(ch) || ch.toLowerCase();
    for (const c of n) { norm += c; mapa.push(idx); }
  });
  const chars = [...texto];
  const marcado = new Array(chars.length).fill(false);
  tokens.forEach((t) => {
    let pos = norm.indexOf(t);
    while (pos !== -1) {
      for (let k = pos; k < pos + t.length; k++) marcado[mapa[k]] = true;
      pos = norm.indexOf(t, pos + t.length);
    }
  });
  let out = "", aberto = false;
  chars.forEach((ch, idx) => {
    if (marcado[idx] && !aberto) { out += "<mark>"; aberto = true; }
    if (!marcado[idx] && aberto) { out += "</mark>"; aberto = false; }
    out += escapeHtml(ch);
  });
  return aberto ? out + "</mark>" : out;
}

/* ---- Cards surgem ao rolar ---- */
let revelador = null;
function revelarCards() {
  const cards = els.container.querySelectorAll(".card");
  if (reduzMovimento || !("IntersectionObserver" in window)) {
    cards.forEach((c) => c.classList.add("is-visible"));
    return;
  }
  revelador?.disconnect();
  revelador = new IntersectionObserver((entradas) => {
    entradas
      .filter((e) => e.isIntersecting)
      .forEach((e, n) => {
        e.target.style.setProperty("--d", `${Math.min(n, 6) * 70}ms`);
        e.target.classList.add("is-visible");
        revelador.unobserve(e.target);
      });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
  cards.forEach((c) => revelador.observe(c));
}

/* ---- Atalhos de seção + destaque da seção atual ---- */
let espiao = null;
function montarAtalhos() {
  const nav = $("quicknav");
  const secoes = [...els.container.querySelectorAll(".section")];
  nav.hidden = secoes.length < 2;
  nav.innerHTML = secoes
    .map((sec) => {
      const h2 = sec.querySelector("h2");
      const n = sec.querySelectorAll(".card").length;
      return `<a href="#${sec.id}" class="chip" data-alvo="${sec.id}">${escapeHtml(h2.textContent)}<span>${n}</span></a>`;
    })
    .join("");
  espiao?.disconnect();
  if (!("IntersectionObserver" in window) || !secoes.length) return;
  const visiveis = new Map();
  espiao = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => visiveis.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null));
    const atual = secoes.find((s) => visiveis.get(s.id) != null);
    nav.querySelectorAll(".chip").forEach((c) => {
      const ativo = atual && c.dataset.alvo === atual.id;
      c.classList.toggle("is-active", !!ativo);
      if (ativo) {
        c.setAttribute("aria-current", "true");
        const dx = c.offsetLeft - nav.scrollLeft - (nav.clientWidth - c.offsetWidth) / 2;
        nav.scrollBy({ left: dx, behavior: reduzMovimento ? "auto" : "smooth" });
      } else c.removeAttribute("aria-current");
    });
  }, { rootMargin: "-180px 0px -55% 0px" });
  secoes.forEach((s) => espiao.observe(s));
}

/* ---- Contador com "pulo" quando muda ---- */
let ultimoTotal = null;
function animarContador() {
  const total = els.container.querySelectorAll(".card").length;
  if (ultimoTotal !== null && total !== ultimoTotal) {
    els.count.classList.remove("bump");
    void els.count.offsetWidth;
    els.count.classList.add("bump");
  }
  ultimoTotal = total;
}

function aposRender() {
  els.container.querySelectorAll(".section").forEach((s) => {
    s.id = "area-" + s.getAttribute("aria-labelledby").slice(4);
  });
  revelarCards();
  montarAtalhos();
  animarContador();
}

/* ---- Números do topo contam de 0 até o total ---- */
function contarAte(el, alvo) {
  if (reduzMovimento) { el.textContent = alvo; return; }
  const ini = performance.now(), dur = 1200;
  const passo = (t) => {
    const p = Math.min(1, (t - ini) / dur);
    el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

/* ---- Card inclina e brilha seguindo o mouse (só em computador) ---- */
function efeitoTilt() {
  if (!temHover || reduzMovimento) return;
  let atual = null;
  els.container.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".card");
    if (atual && atual !== card) soltar(atual);
    atual = card;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    card.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    card.classList.add("is-tilting");
  });
  const soltar = (c) => {
    c.classList.remove("is-tilting");
    c.style.removeProperty("--rx");
    c.style.removeProperty("--ry");
  };
  els.container.addEventListener("pointerleave", () => atual && soltar(atual));
}

/* ---- Onda ao tocar nos botões ---- */
function efeitoOnda() {
  document.addEventListener("pointerdown", (e) => {
    const btn = e.target.closest(".btn, .copy-btn, .chip, .filter-option, .explore-btn, .fab-top");
    if (!btn || reduzMovimento) return;
    const r = btn.getBoundingClientRect();
    const tam = Math.max(r.width, r.height) * 2;
    const onda = document.createElement("span");
    onda.className = "ripple";
    onda.style.cssText = `width:${tam}px;height:${tam}px;left:${e.clientX - r.left - tam / 2}px;top:${e.clientY - r.top - tam / 2}px`;
    btn.appendChild(onda);
    onda.addEventListener("animationend", () => onda.remove());
  });
}

/* ---- Cabeçalho: parallax do fundo e brasão que reage ao mouse ---- */
function efeitoHero() {
  const hero = document.querySelector(".hero");
  const logo = $("logo");
  if (reduzMovimento) return;
  let agendado = false;
  window.addEventListener("scroll", () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, hero.offsetHeight);
      hero.style.setProperty("--py", `${y * 0.35}px`);
      hero.style.setProperty("--fade", `${1 - y / hero.offsetHeight}`);
      agendado = false;
    });
  }, { passive: true });
  if (!temHover) return;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    logo.style.setProperty("--lx", `${x * 14}deg`);
    logo.style.setProperty("--ly", `${-y * 14}deg`);
  });
  hero.addEventListener("pointerleave", () => {
    logo.style.setProperty("--lx", "0deg");
    logo.style.setProperty("--ly", "0deg");
  });
}

/* ---- Barra fixa compacta, botão de voltar ao topo e atalho "/" ---- */
function efeitoRolagem() {
  const fab = $("fab-top");
  const controls = $("controls");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      controls.classList.toggle("is-stuck", !e.isIntersecting);
      fab.classList.toggle("is-shown", !e.isIntersecting);
    }).observe($("controls-sentinel"));
  }
  fab.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduzMovimento ? "auto" : "smooth" }));
  document.addEventListener("keydown", (e) => {
    const digitando = /input|textarea|select/i.test(document.activeElement?.tagName || "");
    if (e.key === "/" && !digitando) {
      e.preventDefault();
      els.search.focus();
      controls.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "start" });
    }
  });
  $("quicknav").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    e.preventDefault();
    const alvo = document.getElementById(chip.dataset.alvo);
    alvo?.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "start" });
  });
}

function iniciarDinamica() {
  document.documentElement.classList.add("js-anim");
  contarAte($("stat-contatos"), membros.length);
  contarAte($("stat-areas"), areas.length);
  efeitoTilt();
  efeitoOnda();
  efeitoHero();
  efeitoRolagem();
}

/* ---------- Início ---------- */
aplicarConfig();
renderFiltro();
render();
ligarEventos();
iniciarDinamica();
