/* TMM Clientes — motor de la app.
   Rutas por hash: #/inicio · #/catalogo[/l/<línea>|/g/<grupo>] · #/p/<producto> (hoja encima de la
   vista actual) · #/asesor[/calc] · #/cotizacion · #/nosotros.
   La cotización vive en localStorage del teléfono y se envía armada por WhatsApp o correo. */
(() => {
  "use strict";
  const D = window.TMM;
  const E = D.empresa;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const ico = (n, c = "ico") => `<svg class="${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const palomita = () => `<svg class="ico marca-ok" aria-hidden="true" viewBox="0 0 24 24"><path class="trazo-a" d="m5 12.5 4.5 4.5"/><path class="trazo-b" d="M9.5 17 19 7.5"/></svg>`;
  const img = (n) => `img/${n}.webp`;
  const movimiento = matchMedia("(prefers-reduced-motion: reduce)");
  let reducido = movimiento.matches;

  /* El estado está listo antes de animar; solo se limpian adornos al terminar. */
  const animaciones = new Set(), canales = new WeakMap();
  function anima(el, cuadros, opciones = {}, limpia = () => {}) {
    if (!el) { limpia(); return; }
    const { canal = "entrada", ...tiempo } = opciones;
    const mapa = canales.get(el) || new Map();
    mapa.get(canal)?.();
    if (reducido || document.hidden || !el.animate) { limpia(); return; }
    const ajustes = { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards", ...tiempo };
    let a;
    try { a = el.animate(cuadros, ajustes); } catch { limpia(); return; }
    let timer, terminado = false;
    const fin = () => {
      if (terminado) return;
      terminado = true; clearTimeout(timer); a.cancel(); limpia();
      animaciones.delete(fin);
      if (mapa.get(canal) === fin) mapa.delete(canal);
    };
    mapa.set(canal, fin); canales.set(el, mapa); animaciones.add(fin);
    a.onfinish = fin; a.oncancel = fin;
    timer = setTimeout(fin, ajustes.duration + (ajustes.delay || 0) + 100);
  }
  const detieneAdornos = () => [...animaciones].forEach((fin) => fin());
  movimiento.addEventListener("change", (e) => { reducido = e.matches; if (reducido) { detieneAdornos(); restableceGestos(); } paralaje(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { detieneAdornos(); restableceGestos(); } });

  /* Indicadores FLIP: el tamaño final se fija, solo se anima la transformación. */
  function selectorDesliza(grupo, activo, clase) {
    if (!grupo || !activo || !grupo.offsetWidth) return;
    let pas = $("." + clase, grupo);
    const anterior = pas && pas.dataset.listo ? { x: pas.offsetLeft, y: pas.offsetTop, w: pas.offsetWidth, h: pas.offsetHeight } : null;
    if (!pas) { pas = document.createElement("span"); pas.className = clase; pas.setAttribute("aria-hidden", "true"); grupo.prepend(pas); }
    const x = activo.offsetLeft, y = activo.offsetTop, w = activo.offsetWidth, h = activo.offsetHeight;
    Object.assign(pas.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
    pas.dataset.listo = "1";
    if (clase === "selector-pill") grupo.classList.add("con-indicador");
    if (anterior && anterior.w && anterior.h) anima(pas, [
      { transform: `translate(${anterior.x - x}px, ${anterior.y - y}px) scale(${anterior.w / w}, ${anterior.h / h})` },
      { transform: "none" },
    ], { duration: 320, canal: "selector" });
  }
  function preparaPills(raiz) {
    $$(".pills", raiz).forEach((g) => selectorDesliza(g, $("[aria-pressed=true]", g), "selector-pill"));
  }
  function rueda(input, valor) {
    const viejo = Number(input.value);
    input.value = valor;
    if (viejo !== Number(valor)) anima(input, [
      { transform: `translateY(${Number(valor) > viejo ? 10 : -10}px)`, opacity: .35 },
      { transform: "none", opacity: 1 },
    ], { duration: 220, canal: "numero" });
  }

  /* Onda desde el toque, también desde el centro al usar el teclado. */
  const tactiles = ".btn, .btn-ico, .card-add, .pill, .chip, .opcion, .stepper button, .segmento button";
  function onda(boton, x, y) {
    if (!boton || boton.disabled || reducido || document.hidden) return;
    const r = boton.getBoundingClientRect(), s = Math.hypot(r.width, r.height) * 2;
    const o = document.createElement("span"); o.className = "onda"; o.setAttribute("aria-hidden", "true");
    Object.assign(o.style, { width: s + "px", height: s + "px", left: (x - r.left) + "px", top: (y - r.top) + "px" });
    boton.appendChild(o);
    anima(o, [{ transform: "translate(-50%,-50%) scale(0)", opacity: .24 }, { transform: "translate(-50%,-50%) scale(1)", opacity: 0 }], { duration: 480 }, () => o.remove());
  }
  document.addEventListener("pointerdown", (e) => { if (e.isPrimary && e.button === 0) onda(e.target.closest(tactiles), e.clientX, e.clientY); }, { passive: true });
  document.addEventListener("click", (e) => {
    const b = e.target.closest(tactiles);
    if (b && e.detail === 0) { const r = b.getBoundingClientRect(); onda(b, r.left + r.width / 2, r.top + r.height / 2); }
    const pill = e.target.closest(".pill");
    if (pill) selectorDesliza(pill.closest(".pills"), $("[aria-pressed=true]", pill.closest(".pills")), "selector-pill");
  });

  /* La imagen siempre existe; carga y destello son decoración. */
  const imagenes = new WeakSet();
  function preparaImagenes(raiz) {
    $$(".card-stage img, .det-stage > img, .item-img img", raiz).forEach((im) => {
      if (imagenes.has(im)) return;
      imagenes.add(im);
      const stage = im.parentElement;
      const lista = () => {
        stage.classList.remove("cargando");
        if (im.naturalWidth) anima(im, [{ opacity: .25 }, { opacity: 1 }], { duration: 300, canal: "foto" });
      };
      if (im.complete) return;
      stage.classList.add("cargando");
      im.addEventListener("load", lista, { once: true });
      im.addEventListener("error", lista, { once: true });
    });
  }

  const guarda = {
    lee(k, d) { try { const v = localStorage.getItem("tmmc." + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    pon(k, v) { try { localStorage.setItem("tmmc." + k, JSON.stringify(v)); } catch { /* sin almacenamiento: la app sigue funcionando en memoria */ } },
  };

  const PROD = Object.fromEntries(D.productos.map((p) => [p.id, p]));
  const GRUPO = Object.fromEntries(D.grupos.map((g) => [g.id, g]));
  const LINEA = Object.fromEntries(D.lineas.map((l) => [l.id, l]));
  const lineaDe = (p) => GRUPO[p.g].linea;

  /* ───────── Producto: textos auxiliares ───────── */
  const mm = (n) => (typeof n === "number" ? `${String(n)} mm` : n);
  const resumenEsp = (p) => {
    if (!p.esp) return "Espesores con tu asesor";
    if (typeof p.esp[0] !== "number") return p.esp.join(" · ");
    if (p.esp.length === 1) return mm(p.esp[0]);
    return `${p.esp[0]} – ${p.esp[p.esp.length - 1]} mm · ${p.esp.length} espesores`;
  };
  const unidades = (p) => (p.unidad === "pieza" ? ["piezas", "pies tabla"] : ["hojas", "paquetes"]);
  const cantidad = (n, u) => `${n} ${n === 1 ? { hojas: "hoja", paquetes: "paquete", piezas: "pieza", "pies tabla": "pie tabla" }[u] || u : u}`;
  const visual = (p, cls = "") => (p.m
    ? `<img class="slab ${cls}" src="${img(p.m)}" alt="" loading="lazy" decoding="async">`
    : `<img class="foto ${cls}" src="${img(p.foto)}" alt="" loading="lazy" decoding="async">`);

  /* ───────── Estado ───────── */
  let cot = guarda.lee("cot", []).filter((i) => PROD[i.pid]);
  let datos = guarda.lee("datos", { entrega: "obra", sucursal: "ags" });
  let hist = guarda.lee("hist", []);
  const filtro = { linea: "todo", grupo: null, q: "" };
  const asesor = { a: null, b: null };

  const guardaCot = () => { guarda.pon("cot", cot); pintaBadge(); };

  /* ───────── Utilidades de UI ───────── */
  let toastT;
  function toast(html) {
    const t = $("#toast");
    t.innerHTML = html;
    t.classList.add("ver");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("ver"), 3200);
  }

  const urlWA = (txt) => `https://wa.me/${E.whatsapp}?text=${encodeURIComponent(txt)}`;
  const urlMapa = (dir) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Triplay y Maderas de Mayoreo " + dir)}`;

  function horaMX() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/Mexico_City", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" })
      .formatToParts(new Date()).map((x) => [x.type, x.value]));
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
    return { dia, h: Number(p.hour) + Number(p.minute) / 60 };
  }
  function pintaAbierto() {
    const el = $("#abierto");
    const { dia, h } = horaMX();
    const r = E.horas[dia];
    const si = r && h >= r[0] && h < r[1];
    el.hidden = false;
    el.classList.toggle("si", !!si);
    el.textContent = si ? "Abierto ahora" : "Cerrado ahora";
  }

  function pintaBadge() {
    const n = cot.length;
    $$("[data-badge]").forEach((b) => {
      const cambio = b.textContent !== String(n);
      b.hidden = !n; b.textContent = n;
      if (cambio && n) anima(b, [{ transform: "scale(.65)" }, { transform: "scale(1.2)", offset: .55 }, { transform: "none" }], { duration: 340, canal: "badge" });
    });
    const tab = $(".tab-cot");
    tab.classList.toggle("con-estiba", n > 0);
    $$(".estiba i", tab).forEach((i, k) => {
      const nueva = i.hidden && k < Math.min(n, 5);
      i.hidden = k >= Math.min(n, 5);
      if (nueva) anima(i, [
        { transform: "translateY(-28px) rotate(-12deg)", opacity: 0 },
        { transform: "translateY(-4px) rotate(3deg)", opacity: 1, offset: .65 },
        { transform: "translateY(1px) scaleX(1.08)", offset: .85 }, { transform: "none" },
      ], { duration: 360, delay: 320, canal: "tabla" });
    });
    $$(".card-add").forEach((b) => {
      const en = cot.some((i) => i.pid === b.dataset.add);
      if (b.classList.contains("en-cot") !== en || !$(".ico", b)) {
        b.classList.toggle("en-cot", en);
        b.innerHTML = en ? palomita() : ico("mas");
      }
      b.setAttribute("aria-label", en ? "Ya está en tu cotización: agregar otra" : "Agregar a mi cotización");
    });
  }

  /* El contenido es visible incluso sin observador ni cuadros de animación. */
  const revelados = new WeakSet();
  function revela(el) {
    if (revelados.has(el)) return;
    revelados.add(el); el.classList.add("visto");
    const delay = Math.min(320, (parseFloat(el.style.getPropertyValue("--d")) || 0) * 1000);
    anima(el, [{ opacity: .15, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 460, delay });
    if (el.matches(".carta")) anima($(".carta-in", el), [
      { transform: "rotateY(0)" }, { transform: "rotateY(-12deg)", offset: .4 },
      { transform: "rotateY(4deg)", offset: .7 }, { transform: "rotateY(0)" },
    ], { duration: 700, delay: delay + 350, canal: "guino" });
    if (el.matches(".continente")) $$("span", el).forEach((s, i) => anima(s, [
      { opacity: .2, transform: "translateY(6px)" }, { opacity: 1, transform: "none" },
    ], { duration: 300, delay: delay + Math.min(i, 6) * 40 }));
  }
  const io = "IntersectionObserver" in window ? new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      revela(e.target);
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function observa(raiz) {
    preparaImagenes(raiz);
    $$("[data-cuenta]", raiz).forEach((el) => { el.textContent = (el.dataset.pre || "") + el.dataset.cuenta; });
    $$(".rev, [data-cuenta]", raiz).forEach((el) => {
      if (io && !reducido && !revelados.has(el)) io.observe(el);
      else el.classList.add("visto");
    });
  }

  /* La muestra vuela hacia la pestaña de cotización */
  function vuela(desde) {
    if (reducido || document.hidden || !desde) return;
    const destino = [$(".tab-cot"), $(".barra-cot")].find((d) => d && d.offsetParent !== null);
    if (!destino) return;
    const a = desde.getBoundingClientRect(), b = destino.getBoundingClientRect();
    if (!a.width) return;
    const c = desde.cloneNode();
    c.className = "vuelo";
    c.removeAttribute("loading");
    c.removeAttribute("id"); c.setAttribute("aria-hidden", "true");
    Object.assign(c.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px", objectFit: "cover", borderRadius: "10px" });
    document.body.appendChild(c);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    anima(c, [
      { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 },
      { transform: `translate(${dx * .3}px, ${Math.min(-70, dy * .2 - 80)}px) scale(.7) rotate(-14deg)`, opacity: .95, offset: .4 },
      { transform: `translate(${dx * .82}px, ${dy * .65 - 28}px) scale(.3) rotate(8deg)`, opacity: .85, offset: .75 },
      { transform: `translate(${dx}px, ${dy}px) scale(.1) rotate(0)`, opacity: 0 },
    ], { duration: 650, easing: "cubic-bezier(.35,0,.25,1)" }, () => c.remove());
    const pila = destino.matches(".tab-cot") ? $(".estiba", destino) : $(".ico", destino);
    anima(pila, [{ transform: "none" }, { transform: "translateY(3px) scale(1.15,.85)", offset: .3 }, { transform: "translateY(-3px) scale(.95,1.08)", offset: .65 }, { transform: "none" }], { duration: 320, delay: 560, canal: "aterrizaje" });
  }

  /* ───────── Cotización: operaciones ───────── */
  function agrega(pid, { esp = null, cant = 1, unidad = null, nota = "" } = {}, desde) {
    const p = PROD[pid];
    unidad = unidad || unidades(p)[0];
    const ya = cot.find((i) => i.pid === pid && i.esp === esp && i.unidad === unidad);
    if (ya) { ya.cant += cant; if (nota) ya.nota = nota; } else cot.push({ k: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), pid, esp, cant, unidad, nota });
    guardaCot();
    if (!reducido && typeof navigator.vibrate === "function") { try { navigator.vibrate(8); } catch { /* vibración opcional */ } }
    vuela(desde);
    toast(`${ico("ok")} <span>${esc(p.n)} en tu cotización</span><a href="#/cotizacion">Ver</a>`);
    if (vistaActual === "cotizacion") pintaCotizacion();
  }

  const folio = () => {
    const d = new Date(), z = (n) => String(n).padStart(2, "0");
    return `TMM-${String(d.getFullYear()).slice(2)}${z(d.getMonth() + 1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}`;
  };

  function mensaje(f) {
    const suc = D.sucursales.find((s) => s.id === datos.sucursal);
    const lineas = cot.map((i, n) => {
      const p = PROD[i.pid];
      const partes = [i.esp ? mm(i.esp) : "espesor por definir", p.fmt, cantidad(i.cant, i.unidad)].filter(Boolean);
      return `${n + 1}) ${p.n}\n   ${partes.join(" · ")}${i.nota ? `\n   Nota: ${i.nota}` : ""}`;
    });
    const quien = [
      `Nombre: ${datos.nombre || ""}`,
      datos.empresa && `Empresa: ${datos.empresa}`,
      `Ciudad: ${datos.ciudad || ""}`,
      datos.tipo && `Soy: ${datos.tipo}`,
      datos.entrega === "obra" ? "Entrega: en mi obra / negocio" : `Entrega: recojo en sucursal ${suc ? suc.k : ""}`,
      datos.entrega === "obra" && suc && `Sucursal más cercana: ${suc.k}`,
      datos.coment && `Comentarios: ${datos.coment}`,
    ].filter(Boolean);
    return `Hola, TMM. Quiero cotizar:\n\n${lineas.join("\n")}\n\n— Mis datos —\n${quien.join("\n")}\n\nFolio: ${f} (enviado desde la app de TMM)`;
  }

  /* ───────── Hoja (diálogo) ───────── */
  const capa = $("#hoja-capa"), hoja = $("#hoja");
  let alCerrar = null, enfoquePrevio = null, hojaPorHash = false, hojaAbierta = false;
  let fondoInerte = [];
  function tomaMuestra(desde) {
    const im = desde && $(".slab, .foto", desde);
    if (!im || reducido || document.hidden || !im.complete || !im.naturalWidth) return null;
    const rect = im.getBoundingClientRect();
    return rect.width && rect.height ? { rect, im: im.cloneNode(), proporcion: im.naturalWidth / im.naturalHeight } : null;
  }
  function comparteMuestra(origen) {
    const destino = $(".det-stage > img", hoja);
    if (!origen || !destino) return;
    if (destino.classList.contains("slab")) destino.style.aspectRatio = origen.proporcion;
    const b = destino.getBoundingClientRect(), a = origen.rect, c = origen.im;
    if (!b.width || !b.height) return;
    c.className = "muestra-compartida"; c.removeAttribute("loading"); c.setAttribute("aria-hidden", "true");
    Object.assign(c.style, { left: b.left + "px", top: b.top + "px", width: b.width + "px", height: b.height + "px", objectFit: destino.classList.contains("foto") ? "cover" : "contain" });
    document.body.appendChild(c);
    anima(c, [
      { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`, opacity: 1 },
      { transform: "none", opacity: 1, offset: .8 }, { transform: "none", opacity: 0 },
    ], { duration: 440 }, () => c.remove());
    anima(destino, [{ opacity: .2 }, { opacity: 1 }], { duration: 440, canal: "foto" });
  }
  function abreHoja(html, { porHash = false, onClose = null, origen = null } = {}) {
    canales.get(hoja)?.get("hoja")?.(); canales.get(capa)?.get("capa")?.();
    $$(".capa-salida, .muestra-compartida").forEach((el) => el.remove());
    if (!hojaAbierta) {
      enfoquePrevio = document.activeElement;
      fondoInerte = $$(".barra, #vistas, .tabs, #fab-wa").map((el) => [el, el.inert]);
      fondoInerte.forEach(([el]) => { el.inert = true; });
    }
    hojaAbierta = true;
    hoja.innerHTML = `<div class="hoja-agarre"></div><button class="hoja-cerrar" data-cerrar aria-label="Cerrar">${ico("x")}</button>${html}`;
    hoja.scrollTop = 0;
    hoja.style.transform = "";
    hojaPorHash = porHash;
    alCerrar = onClose;
    capa.hidden = false;
    document.documentElement.style.overflow = "hidden";
    $("#fab-wa").classList.add("oculto");
    capa.classList.add("abierta");
    hoja.focus({ preventScroll: true });
    observa(hoja);
    preparaPills(hoja);
    comparteMuestra(origen);
    anima(capa, [{ opacity: 0 }, { opacity: 1 }], { duration: 240, canal: "capa" });
    anima(hoja, [{ transform: origen ? "translateY(18px)" : matchMedia("(min-width:640px)").matches ? "translateY(28px) scale(.97)" : "translateY(100%)", opacity: origen ? .6 : 1 }, { transform: "none", opacity: 1 }], { duration: 400, canal: "hoja" });
  }
  function cierraHoja({ desdeHash = false } = {}) {
    if (!hojaAbierta) return;
    if (hojaPorHash && !desdeHash) {
      hojaPorHash = false;
      if (history.state && history.state.tmmHoja) history.back();
      else location.replace("#/" + (vistaActual || "catalogo"));
      return;
    }
    $$(".muestra-compartida").forEach((el) => el.remove());
    if (!reducido && !document.hidden && hoja.animate) {
      const copia = capa.cloneNode(true);
      copia.removeAttribute("id"); copia.classList.add("capa-salida"); copia.inert = true;
      copia.setAttribute("aria-hidden", "true");
      $$("[id]", copia).forEach((el) => el.removeAttribute("id"));
      $(".hoja", copia).removeAttribute("aria-modal");
      document.body.appendChild(copia);
      $(".hoja", copia).scrollTop = hoja.scrollTop;
      anima($(".hoja", copia), [{ transform: "none", opacity: 1 }, { transform: "translateY(36px)", opacity: .4 }], { duration: 220 });
      anima(copia, [{ opacity: 1 }, { opacity: 0 }], { duration: 220 }, () => copia.remove());
    }
    hojaAbierta = false;
    canales.get(hoja)?.get("hoja")?.(); canales.get(capa)?.get("capa")?.();
    capa.hidden = true;
    capa.classList.remove("abierta");
    hoja.innerHTML = "";
    fondoInerte.forEach(([el, anterior]) => { el.inert = anterior; }); fondoInerte = [];
    document.documentElement.style.overflow = "";
    pintaFab();
    const cb = alCerrar; alCerrar = null; hojaPorHash = false;
    if (cb) cb();
    if (enfoquePrevio && document.contains(enfoquePrevio)) enfoquePrevio.focus({ preventScroll: true });
  }
  capa.addEventListener("click", (e) => { if (e.target === capa || e.target.closest("[data-cerrar]")) cierraHoja(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hojaAbierta) cierraHoja();
    if (e.key === "Tab" && hojaAbierta) {
      const f = $$("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])", hoja).filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && (document.activeElement === f[0] || !f.includes(document.activeElement))) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (document.activeElement === f[f.length - 1] || !f.includes(document.activeElement))) { e.preventDefault(); f[0].focus(); }
    }
  });
  /* Deslizar hacia abajo para cerrar (celular) */
  (() => {
    let y0 = null, dy = 0;
    hoja.addEventListener("touchstart", (e) => {
      y0 = null; dy = 0;
      if (hoja.scrollTop <= 0 && !e.target.closest("button, input, select, textarea, a")) y0 = e.touches[0].clientY;
    }, { passive: true });
    hoja.addEventListener("touchmove", (e) => {
      if (y0 === null) return;
      dy = e.touches[0].clientY - y0;
      if (dy > 0 && hoja.scrollTop <= 0) { if (!reducido) hoja.style.transform = `translateY(${Math.min(dy, 240)}px)`; } else { dy = 0; hoja.style.transform = ""; }
    }, { passive: true });
    const suelta = (cancelado = false) => {
      hoja.style.transform = "";
      if (!cancelado && dy > 110) cierraHoja();
      else if (dy > 0) anima(hoja, [{ transform: `translateY(${Math.min(dy, 240)}px)` }, { transform: "none" }], { duration: 240, canal: "hoja" });
      y0 = null; dy = 0;
    };
    hoja.addEventListener("touchend", () => suelta());
    hoja.addEventListener("touchcancel", () => suelta(true));
  })();

  /* ───────── Tarjeta de producto ───────── */
  function tarjeta(p, i = 0, sinTag = false) {
    const tag = p.ultra ? `<span class="card-tag ultra">ULTRA</span>` : p.destacado && !sinTag ? `<span class="card-tag">Recomendado</span>` : "";
    return `<article class="card rev" style="--d:${Math.min(i, 8) * 0.04}s">
      <button class="card-hit" data-prod="${p.id}" aria-label="Ver ${esc(p.n)}">
        <div class="card-stage">${visual(p)}${tag}</div>
        <div class="card-body">
          ${p.origen ? `<span class="card-origen">${esc(p.origen)}</span>` : `<span class="card-origen">${esc(GRUPO[p.g].k)}</span>`}
          <h3>${esc(p.n)}</h3>
          <span class="card-esp">${esc(resumenEsp(p))}</span>
        </div>
      </button>
      <button class="card-add" data-add="${p.id}" aria-label="Agregar a mi cotización">${ico("mas")}</button>
    </article>`;
  }

  /* ───────── Detalle de producto ───────── */
  function abreProducto(id, desde = null) {
    const p = PROD[id];
    if (!p) return;
    const origen = tomaMuestra(desde);
    const g = GRUPO[p.g];
    const vistas = [p.m && { src: p.m, tipo: "slab" }, p.foto && { src: p.foto, tipo: "foto" }].filter(Boolean);
    const specs = [
      ["Espesores", p.esp ? p.esp.map(mm).join(" · ") : "Consulta con tu asesor"],
      p.fmt && ["Formato", p.fmt],
      p.origen && ["Origen", p.origen],
      ...(p.datos || []),
    ].filter(Boolean);
    const rel = D.productos.filter((x) => x.g === p.g && x.id !== p.id).slice(0, 8);
    const sel = { esp: p.esp && p.esp.length === 1 ? p.esp[0] : null, cant: 1, unidad: unidades(p)[0] };

    abreHoja(`
      <div class="det-stage" id="det-stage">${vistas[0].tipo === "slab" ? `<img class="slab" src="${img(vistas[0].src)}" alt="">` : `<img class="foto" src="${img(vistas[0].src)}" alt="">`}
        <span class="ilus">Imagen ilustrativa</span>
        ${vistas.length > 1 ? `<div class="det-fotos">${vistas.map((v, k) => `<button data-vista-img="${k}" aria-pressed="${k === 0}" aria-label="Ver imagen ${k + 1}"><img src="${img(v.src)}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="det-in">
        <div class="det-meta">
          <span class="etq azul">${esc(LINEA[g.linea].k)}</span><span class="etq">${esc(g.k)}</span>
          ${p.origen ? `<span class="etq">${ico("pin")}${esc(p.origen)}</span>` : ""}
        </div>
        <h2 id="hoja-titulo">${esc(p.n)}</h2>
        <p class="det-txt">${esc(p.txt)}</p>
        ${p.tip ? `<div class="det-tip">${ico("hoja")}<span><b>Consejo:</b> ${esc(p.tip)}</span></div>` : ""}
        <dl class="specs">${specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        ${p.usos ? `<div><span class="campo-tit">Para qué sirve</span><div class="usos">${p.usos.map((u) => `<span>${esc(u)}</span>`).join("")}</div></div>` : ""}
        <div>
          <span class="campo-tit">${p.esp ? "Espesor" : "Espesor / medida"}</span>
          <div class="pills" role="group" aria-label="Espesor">
            ${(p.esp || []).map((e) => `<button class="pill" data-esp="${esc(e)}" aria-pressed="${sel.esp === e}">${esc(mm(e))}</button>`).join("")}
            <button class="pill" data-esp="" aria-pressed="${sel.esp === null}">${p.esp ? "Que me asesoren" : "Por definir con mi asesor"}</button>
          </div>
        </div>
        <div>
          <span class="campo-tit">Cantidad</span>
          <div class="fila-cant">
            <div class="stepper"><button data-paso="-1" aria-label="Menos">${ico("menos")}</button><input id="det-cant" type="number" inputmode="numeric" min="1" value="1" aria-label="Cantidad"><button data-paso="1" aria-label="Más">${ico("mas")}</button></div>
            <select class="select" id="det-unidad" aria-label="Unidad">${unidades(p).map((u) => `<option>${u}</option>`).join("")}</select>
          </div>
        </div>
        ${p.unidad !== "pieza" ? `<details class="plegable" id="det-calc"><summary>${ico("calc")}¿Cuántas hojas necesito?${ico("chev", "ico ico-fin")}</summary><div></div></details>` : ""}
        <div class="aviso">${ico("camion")}<span>${esc(E.pedido)}. Precio y disponibilidad te los confirma tu asesor.</span></div>
        ${rel.length ? `<div><span class="campo-tit">También en ${esc(g.k.toLowerCase())}</span><div class="relacionados">${rel.map((r) => `<button class="mini" data-prod="${r.id}" data-reemplaza><div class="card-stage">${visual(r)}</div><b>${esc(r.n)}</b></button>`).join("")}</div></div>` : ""}
      </div>
      <div class="det-acciones">
        <a class="btn btn-borde" style="flex:0 0 auto;width:52px;padding:0" target="_blank" rel="noopener" href="${urlWA(`Hola, TMM. Me interesa: ${p.n}. ¿Me pueden asesorar?`)}" aria-label="Preguntar por WhatsApp">${ico("wa")}</a>
        <button class="btn" id="det-agregar">${ico("cotizar")}Agregar a mi cotización</button>
      </div>`, { porHash: true, origen });

    const cantI = $("#det-cant");
    hoja.addEventListener("click", function h(e) {
      if (!hoja.contains(cantI)) { hoja.removeEventListener("click", h); return; }
      const pe = e.target.closest("[data-esp]");
      if (pe) {
        $$("[data-esp]", hoja).forEach((b) => b.setAttribute("aria-pressed", b === pe));
        const v = pe.dataset.esp;
        sel.esp = v === "" ? null : (p.esp.find((x) => String(x) === v) ?? v);
      }
      const ps = e.target.closest("[data-paso]");
      if (ps) rueda(cantI, Math.max(1, (parseInt(cantI.value, 10) || 1) + Number(ps.dataset.paso)));
      const vi = e.target.closest("[data-vista-img]");
      if (vi) {
        const v = vistas[+vi.dataset.vistaImg];
        $$("[data-vista-img]", hoja).forEach((b) => b.setAttribute("aria-pressed", b === vi));
        const st = $("#det-stage"), viejo = $(".slab, .foto", st);
        const nuevo = document.createElement("img");
        nuevo.className = v.tipo; nuevo.src = img(v.src); nuevo.alt = "";
        viejo.replaceWith(nuevo);
        preparaImagenes(st);
        anima(nuevo, [{ opacity: .3 }, { opacity: 1 }], { duration: 280, canal: "foto" });
      }
      if (e.target.closest("#det-agregar")) {
        agrega(p.id, { esp: sel.esp, cant: Math.max(1, parseInt(cantI.value, 10) || 1), unidad: $("#det-unidad").value }, $("#det-stage .slab, #det-stage .foto"));
        cierraHoja();
      }
    });
    const calc = $("#det-calc");
    if (calc) calc.addEventListener("toggle", () => {
      if (calc.open && !calc.dataset.listo) {
        calc.dataset.listo = 1;
        calculadora($("div", calc), { hoja: p.hoja, alUsar: (n) => { rueda(cantI, n); $("#det-unidad").value = "hojas"; } });
      }
    });
  }

  /* ───────── Calculadora de hojas ───────── */
  function calculadora(raiz, { hoja: medida = null, alUsar = null, conProducto = false } = {}) {
    const formatos = [
      { k: "1.22 × 2.44 m (4' × 8')", w: 1.22, h: 2.44 },
      { k: "1.22 × 2.90 m (PVC mármol)", w: 1.22, h: 2.9 },
    ];
    let fi = medida && medida[1] === 2.9 ? 1 : 0;
    const tableros = D.productos.filter((p) => p.unidad !== "pieza");
    raiz.innerHTML = `
      <div class="calc">
        <div class="calc-fila">
          <div class="campo"><label for="c-largo">Largo (m)</label><input id="c-largo" type="number" inputmode="decimal" min="0" step="0.01" placeholder="Ej. 4.5"></div>
          <div class="campo"><label for="c-alto">Alto o ancho (m)</label><input id="c-alto" type="number" inputmode="decimal" min="0" step="0.01" placeholder="Ej. 2.4"></div>
        </div>
        <div class="calc-fila">
          <div class="campo"><label for="c-veces">¿Cuántas superficies iguales?</label><input id="c-veces" type="number" inputmode="numeric" min="1" value="1"></div>
          <div class="campo"><label for="c-fmt">Medida de la hoja</label><select id="c-fmt">${formatos.map((f, k) => `<option value="${k}" ${k === fi ? "selected" : ""}>${f.k}</option>`).join("")}</select></div>
        </div>
        <div><span class="campo-tit">Desperdicio por cortes</span><div class="pills" role="group" aria-label="Desperdicio">${[0, 5, 10, 15].map((m) => `<button class="pill" data-merma="${m}" aria-pressed="${m === 10}">${m}%</button>`).join("")}</div></div>
        <div class="calc-res" aria-live="polite"><b id="c-res">0</b><span><strong id="c-res-u">hojas</strong><span id="c-res-d">Escribe las medidas de tu superficie.</span></span></div>
        ${conProducto ? `<div class="campo"><label for="c-prod">Producto (opcional)</label><select id="c-prod"><option value="">— Elige un producto para cotizar —</option>${D.grupos.filter((g) => tableros.some((p) => p.g === g.id)).map((g) => `<optgroup label="${esc(g.k)}">${tableros.filter((p) => p.g === g.id).map((p) => `<option value="${p.id}">${esc(p.n)}</option>`).join("")}</optgroup>`).join("")}</select></div>` : ""}
        ${alUsar || conProducto ? `<button class="btn btn-bloque" id="c-usar" disabled>${ico(conProducto ? "cotizar" : "ok")}${conProducto ? "Agregar a mi cotización" : "Usar esta cantidad"}</button>` : ""}
      </div>`;
    preparaPills(raiz);
    let merma = 10, n = 0;
    const calcula = () => {
      const l = parseFloat($("#c-largo", raiz).value) || 0, a = parseFloat($("#c-alto", raiz).value) || 0;
      const v = Math.max(1, parseInt($("#c-veces", raiz).value, 10) || 1);
      const f = formatos[+$("#c-fmt", raiz).value];
      const area = l * a * v, ah = f.w * f.h;
      n = area > 0 ? Math.ceil((area * (1 + merma / 100)) / ah) : 0;
      $("#c-res", raiz).textContent = n;
      $("#c-res-u", raiz).textContent = n === 1 ? "hoja" : "hojas";
      $("#c-res-d", raiz).textContent = area > 0
        ? `${area.toFixed(2)} m² + ${merma}% de desperdicio · cada hoja cubre ${ah.toFixed(2)} m²`
        : "Escribe las medidas de tu superficie.";
      const u = $("#c-usar", raiz);
      if (u) u.disabled = !n;
      if (n) anima($("#c-res", raiz), [{ transform: "scale(1.08)" }, { transform: "none" }], { duration: 240, canal: "numero" });
    };
    raiz.addEventListener("input", calcula);
    raiz.addEventListener("click", (e) => {
      const m = e.target.closest("[data-merma]");
      if (m) { merma = +m.dataset.merma; $$("[data-merma]", raiz).forEach((b) => b.setAttribute("aria-pressed", b === m)); calcula(); }
      if (e.target.closest("#c-usar") && n) {
        if (alUsar) alUsar(n);
        else {
          const pid = $("#c-prod", raiz).value;
          if (!pid) { location.hash = "#/catalogo"; toast(`${ico("calc")} <span>Necesitas ${n} hojas. Elige el producto en el catálogo.</span>`); return; }
          agrega(pid, { cant: n, unidad: "hojas" }, e.target.closest("#c-usar"));
        }
      }
    });
  }

  /* ───────── Bloques compartidos ───────── */
  const contacto = () => `
    <section class="seccion" id="contacto">
      <div class="cont">
        <div class="seccion-cab rev"><div><span class="ceja">Contacto</span><h2>Estamos para asesorarte</h2><p>${esc(E.horario)}</p></div></div>
        <div class="sucs">${D.sucursales.map((s, i) => `
          <article class="suc rev" style="--d:${i * 0.06}s"><h3>${ico("pin")}${esc(s.k)}</h3><p>${esc(s.v)}</p>
            <a class="enlace" href="${urlMapa(s.v)}" target="_blank" rel="noopener">Cómo llegar ${ico("flecha")}</a></article>`).join("")}
        </div>
        <div class="contacto-grid">
          <a class="contacto-item rev" href="${urlWA("Hola, TMM. Me comunico desde la app.")}" target="_blank" rel="noopener">${ico("wa")}<div><b>WhatsApp</b><span>${esc(E.telefono)}</span></div></a>
          <a class="contacto-item rev" href="tel:${E.tel}">${ico("tel")}<div><b>Llámanos</b><span>${esc(E.telefono)}</span></div></a>
          <a class="contacto-item rev" href="mailto:${E.correo}">${ico("mail")}<div><b>Correo</b><span>${esc(E.correo)}</span></div></a>
        </div>
        <div class="redes rev">
          <a href="${E.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ico("fb")}</a>
          <a href="${E.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ico("ig")}</a>
          <a href="${E.web}" target="_blank" rel="noopener" aria-label="Sitio web">${ico("web")}</a>
        </div>
      </div>
    </section>
    <footer class="pie"><img src="${img("logo_color")}" alt="TMM" class="logo-claro"><img src="${img("logo_white")}" alt="" class="logo-oscuro" style="margin:0 auto 10px;height:34px;width:auto"><b>${esc(E.lema)}</b>${esc(E.nombre)} S.A. de C.V.<br>Imágenes de producto ilustrativas.</footer>`;

  const cifras = () => `<div class="cifras">${D.cifras.map((c, i) => `
    <div class="cifra rev" style="--d:${i * 0.07}s"><b data-cuenta="${c.n}" data-pre="${c.pre || ""}">${c.pre || ""}0</b><span>${esc(c.txt)}</span><small>${esc(c.nota)}</small></div>`).join("")}</div>`;

  /* ───────── Vista: Inicio ───────── */
  function pintaInicio() {
    const v = $("#v-inicio");
    const dest = D.productos.filter((p) => p.destacado);
    v.innerHTML = `
      <div class="heroe">
        <div class="heroe-foto"><img src="${img("f_bodega")}" alt="Almacén de TMM con estibas de triplay" fetchpriority="high"></div>
        <div class="heroe-tri" aria-hidden="true"></div>
        <div class="heroe-in">
          <img class="heroe-logo" src="${img("logo_white")}" alt="TMM Triplay y Maderas de Mayoreo">
          <h1>¡Tenemos <em>la madera!</em></h1>
          <p>Triplay, MDF, cimbra, OSB y maderas finas de mayoreo, importadas de 25 países. Arma tu cotización en minutos.</p>
          <div class="heroe-acciones">
            <a class="btn" href="#/catalogo">${ico("catalogo")}Ver catálogo</a>
            <a class="btn btn-fantasma" href="${urlWA("Hola, TMM. Quiero hablar con un asesor.")}" target="_blank" rel="noopener">${ico("wa")}Hablar con un asesor</a>
          </div>
          <span class="heroe-pedido">${ico("camion")}Entregamos ${esc(E.pedido.toLowerCase())}</span>
        </div>
      </div>
      <div class="cont">${cifras()}</div>

      <section class="seccion">
        <div class="cont">
          <div class="seccion-cab rev"><div><span class="ceja">Catálogo</span><h2>¿Qué vas a construir?</h2><p>Elige tu línea y encuentra el material con medidas, orígenes y usos.</p></div></div>
          <div class="lineas">${D.lineas.map((l, i) => `
            <a class="linea rev" style="--d:${i * 0.08}s" href="#/catalogo/l/${l.id}"><img src="${img(l.foto)}" alt="" loading="lazy">
              <div class="linea-in"><div><h3>${esc(l.k)}</h3><p>${esc(l.sub)}</p></div><span class="flecha">${ico("flecha")}</span></div></a>`).join("")}
          </div>
        </div>
      </section>

      <section class="cont">
        <div class="herramientas">
          <a class="herr rev" href="#/asesor"><span class="herr-ico">${ico("asesor")}</span><div><b>¿No sabes cuál elegir?</b><span>Te recomendamos el material en 2 preguntas.</span></div>${ico("chev", "ico ico-fin")}</a>
          <a class="herr rev" style="--d:.06s" href="#/asesor/calc"><span class="herr-ico">${ico("calc")}</span><div><b>Calcula tus hojas</b><span>Mide tu superficie y te decimos cuántas hojas pedir.</span></div>${ico("chev", "ico ico-fin")}</a>
        </div>
      </section>

      <section class="seccion">
        <div class="cont">
          <div class="seccion-cab rev"><div><span class="ceja">Lo más pedido</span><h2>Recomendados</h2></div><a class="enlace" href="#/catalogo">Todo el catálogo ${ico("flecha")}</a></div>
          <div class="grid">${dest.map((p, i) => tarjeta(p, i, true)).join("")}</div>
        </div>
      </section>

      <section class="cont">
        <div class="banda rev">
          <div class="banda-foto"><img src="${img("f_camion")}" alt="Tractocamión de TMM" loading="lazy"></div>
          <div class="banda-in">
            <span class="ceja" style="color:#7fc8f3">Entregas</span>
            <h2>Desde 2 paquetes <em>hasta 1 tráiler.</em></h2>
            <p>Entregamos en tus instalaciones. 3 almacenes —Aguascalientes, Guadalajara y Ciudad de México— y presencia en más de 22 estados.</p>
            <a class="btn btn-claro" href="#/cotizacion">${ico("cotizar")}Armar mi cotización</a>
          </div>
        </div>
      </section>

      <section class="seccion">
        <div class="cont">
          <div class="seccion-cab rev"><div><span class="ceja">Así trabajamos</span><h2>Inventario que sí está</h2></div><a class="enlace" href="#/nosotros">Conócenos ${ico("flecha")}</a></div>
          <div class="galeria">${D.galeria.map((g) => `<figure><img src="${img(g.img)}" alt="${esc(g.pie)}" loading="lazy"><figcaption>${esc(g.pie)}</figcaption></figure>`).join("")}</div>
        </div>
      </section>

      <section class="cont">
        <div class="seccion-cab rev"><div><span class="ceja">Clientes</span><h2>Lo que dicen de nosotros</h2></div></div>
        <div class="testis">${D.testimonios.map((t, i) => `<blockquote class="testi rev" style="margin:0;--d:${i * 0.07}s"><p>${esc(t.txt)}</p><b>${esc(t.quien)}</b></blockquote>`).join("")}</div>
      </section>
      ${contacto()}`;
  }

  /* ───────── Vista: Catálogo ───────── */
  function pintaCatalogo() {
    const v = $("#v-catalogo");
    if (!v.dataset.listo) {
      v.dataset.listo = 1;
      v.innerHTML = `
        <div class="cat-cab"><div class="cont">
          <div class="buscador">${ico("buscar")}<input id="buscar" type="search" placeholder="Busca: encino, cimbra, 18 mm, muros…" aria-label="Buscar en el catálogo" autocomplete="off" enterkeyhint="search"><button class="limpiar" id="limpiar" aria-label="Borrar búsqueda" hidden>${ico("x")}</button></div>
          <div class="segmento" role="group" aria-label="Línea"><span class="pastilla" aria-hidden="true"></span>
            <button data-linea="todo">Todo</button>${D.lineas.map((l) => `<button data-linea="${l.id}">${esc(l.id === "ultra" ? "Ultra" : l.k)}</button>`).join("")}
          </div>
          <div class="chips-marco"><div class="chips" id="chips"></div></div>
        </div></div>
        <div class="cont" id="cat-lista"></div>`;
      const inp = $("#buscar", v);
      $("#chips", v).addEventListener("scroll", pintaBordes, { passive: true });
      let t;
      inp.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => { filtro.q = inp.value.trim(); $("#limpiar", v).hidden = !filtro.q; pintaLista(); }, 120);
      });
      $("#limpiar", v).addEventListener("click", () => { inp.value = ""; filtro.q = ""; $("#limpiar", v).hidden = true; pintaLista(); inp.focus(); });
      v.addEventListener("click", (e) => {
        const l = e.target.closest("[data-linea]");
        if (l) { history.replaceState(history.state, "", l.dataset.linea === "todo" ? "#/catalogo" : `#/catalogo/l/${l.dataset.linea}`); filtro.linea = l.dataset.linea; filtro.grupo = null; pintaFiltros(); pintaLista(); }
        const g = e.target.closest("[data-grupo]");
        if (g) { filtro.grupo = filtro.grupo === g.dataset.grupo ? null : g.dataset.grupo; pintaFiltros(); pintaLista(); }
      });
    }
    pintaFiltros();
    pintaLista();
  }
  function pintaFiltros() {
    const v = $("#v-catalogo");
    const botones = $$(".segmento button", v);
    botones.forEach((b) => b.setAttribute("aria-pressed", b.dataset.linea === filtro.linea));
    selectorDesliza($(".segmento", v), botones.find((b) => b.dataset.linea === filtro.linea), "pastilla");
    const gs = D.grupos.filter((g) => filtro.linea === "todo" || g.linea === filtro.linea);
    $("#chips", v).innerHTML = gs.map((g) => `<button class="chip" data-grupo="${g.id}" aria-pressed="${filtro.grupo === g.id}">${esc(g.k)}</button>`).join("");
    pintaBordes();
  }
  function pintaBordes() {
    const chips = $("#chips");
    if (!chips) return;
    chips.parentElement.classList.toggle("hay-izquierda", chips.scrollLeft > 2);
    chips.parentElement.classList.toggle("hay-derecha", chips.scrollWidth - chips.clientWidth - chips.scrollLeft > 2);
  }
  function coincide(p, q) {
    const g = GRUPO[p.g];
    const pajar = norm([p.n, p.txt, p.origen, g.k, LINEA[g.linea].k, ...(p.usos || []), ...(p.esp || []).map(mm)].join(" "));
    return norm(q).split(/\s+/).filter(Boolean).every((t) => pajar.includes(t.replace(/mm$/, "")));
  }
  function pintaLista() {
    const caja = $("#cat-lista");
    $$(".rev", caja).forEach((el) => io?.unobserve(el));
    const q = filtro.q;
    let gs = D.grupos.filter((g) => (filtro.linea === "todo" || g.linea === filtro.linea) && (!filtro.grupo || g.id === filtro.grupo));
    let total = 0;
    const html = gs.map((g) => {
      const ps = D.productos.filter((p) => p.g === g.id && (!q || coincide(p, q)));
      total += ps.length;
      if (!ps.length) return "";
      return `<section class="grupo" id="g-${g.id}"><div class="grupo-cab"><h2>${esc(g.k)} <small>${ps.length}</small></h2><p>${esc(g.sub)}</p></div>
        <div class="grid">${ps.map(tarjeta).join("")}</div></section>`;
    }).join("");
    caja.innerHTML = total ? html : `<div class="vacio"><b>No encontramos “${esc(q)}”</b>Prueba con otra palabra o pregúntale a un asesor.<br><br><a class="btn btn-wa" target="_blank" rel="noopener" href="${urlWA(`Hola, TMM. Busco: ${q}`)}">${ico("wa")}Preguntar por WhatsApp</a></div>`;
    caja.insertAdjacentHTML("beforeend", `<div style="height:24px"></div>`);
    pintaBadge();
    observa(caja);
  }

  /* ───────── Vista: Asesor ───────── */
  function pintaAsesor(foco, direccion = 0) {
    const v = $("#v-asesor");
    const previo = Number(v.dataset.hecho || 0);
    $$(".rev", v).forEach((el) => io?.unobserve(el));
    const A = D.asesor;
    const op1 = asesor.a !== null ? A.ops[asesor.a] : null;
    const op2 = op1 && op1.sig && asesor.b !== null ? op1.sig.ops[asesor.b] : null;
    const fin = op1 && (!op1.sig ? op1 : op2);
    const pasos = op1 && op1.sig ? 3 : 2;
    const hecho = fin ? pasos : op1 ? 1 : 0;
    let cuerpo;
    if (!op1) {
      cuerpo = `<div class="paso"><h2>${esc(A.q)}</h2><div class="opciones">${A.ops.map((o, i) => `<button class="opcion rev" style="--d:${i * 0.04}s" data-a="${i}"><span class="herr-ico">${ico(o.icono)}</span>${esc(o.k)}${ico("chev", "ico ico-fin")}</button>`).join("")}</div></div>`;
    } else if (!fin) {
      cuerpo = `<div class="paso"><button class="enlace volver" data-volver>${ico("atras")}${esc(op1.k)}</button><h2>${esc(op1.sig.q)}</h2><div class="opciones">${op1.sig.ops.map((o, i) => `<button class="opcion rev" style="--d:${i * 0.05}s" data-b="${i}">${esc(o.k)}${ico("chev", "ico ico-fin")}</button>`).join("")}</div></div>`;
    } else {
      const ps = fin.r.map((id) => PROD[id]).filter(Boolean);
      const ctx = [op1.k, op2 && op2.k].filter(Boolean).join(" · ");
      cuerpo = `<div class="paso">
        <button class="enlace volver" data-volver>${ico("atras")}${esc(ctx)}</button>
        <h2>Te recomendamos</h2>
        <div class="resultado-por rev">${ico("asesor")}<span>${esc(fin.por)}</span></div>
        <div class="grid">${ps.map(tarjeta).join("")}</div>
        <div class="heroe-acciones" style="margin-top:18px">
          <a class="btn btn-wa" target="_blank" rel="noopener" href="${urlWA(`Hola, TMM. Busco material para: ${ctx}. ¿Qué me recomiendan?`)}">${ico("wa")}Confirmar con un asesor</a>
          <button class="btn btn-borde" data-reinicia>${ico("historial")}Empezar de nuevo</button>
        </div></div>`;
    }
    v.innerHTML = `<div class="cont">
      <div class="asesor-cab"><span class="ceja">Asesor TMM</span><h1>Encuentra tu material</h1><p>Responde y te mostramos las opciones que nuestros vendedores recomiendan.</p></div>
      <div class="asesor-layout">
        <div><div class="progreso" aria-hidden="true">${Array.from({ length: pasos }, (_, i) => `<i class="${i < hecho ? "ok" : ""} ${i >= previo && i < hecho ? "nuevo" : ""}"></i>`).join("")}</div>${cuerpo}</div>
        <div class="lateral" id="calc-lado" style="padding-top:18px"><span class="ceja">Calculadora</span><h2 style="font-size:26px;margin-bottom:6px">¿Cuántas hojas necesito?</h2><p style="color:var(--tenue);margin-bottom:14px">Mide la superficie a cubrir. Le sumamos el desperdicio por cortes.</p><div id="calc-caja"></div></div>
      </div>
      <div style="height:30px"></div></div>`;
    calculadora($("#calc-caja", v), { conProducto: true });
    pintaBadge();
    observa(v);
    v.dataset.hecho = hecho;
    if (direccion) {
      anima($(".paso", v), [{ transform: `translateX(${direccion * 24}px)`, opacity: .3 }, { transform: "none", opacity: 1 }], { duration: 340 });
      const titulo = $(".paso h2", v); titulo.tabIndex = -1; titulo.focus({ preventScroll: true });
    }
  }
  $("#v-asesor").addEventListener("click", (e) => {
    const a = e.target.closest("[data-a]"), b = e.target.closest("[data-b]");
    if (a) { asesor.a = +a.dataset.a; asesor.b = null; }
    else if (b) { asesor.b = +b.dataset.b; }
    else if (e.target.closest("[data-volver]")) { if (asesor.b !== null) asesor.b = null; else asesor.a = null; }
    else if (e.target.closest("[data-reinicia]")) { asesor.a = asesor.b = null; }
    else return;
    pintaAsesor(null, e.target.closest("[data-volver], [data-reinicia]") ? -1 : 1);
    $("#v-asesor").scrollIntoView({ behavior: reducido ? "auto" : "smooth" });
  });

  /* ───────── Vista: Cotización ───────── */
  function pintaCotizacion() {
    const v = $("#v-cotizacion");
    const anteriores = new Set($$(".item", v).map((it) => it.dataset.k));
    const historial = hist.length ? `
      <details class="plegable" style="margin-top:14px"><summary>${ico("historial")}Mis solicitudes enviadas (${hist.length})${ico("chev", "ico ico-fin")}</summary>
        <div class="hist">${hist.slice(0, 10).map((h) => `<div class="hist-item"><div><b>${esc(h.folio)}</b><span>${esc(h.fecha)} · ${h.n} producto${h.n === 1 ? "" : "s"}</span></div><span>${esc(h.via)}</span></div>`).join("")}</div></details>` : "";
    if (!cot.length) {
      v.innerHTML = `<div class="cont">
        <div class="cot-cab"><div><span class="ceja">Cotizador</span><h1>Mi cotización</h1></div></div>
        <div class="cot-vacia">
          <div class="estiba-grande" aria-hidden="true">${pilaSVG()}</div>
          <h2>Tu estiba está vacía</h2>
          <p>Agrega productos desde el catálogo y te mandamos todo armado por WhatsApp para que un asesor te cotice.</p>
          <div class="heroe-acciones" style="justify-content:center"><a class="btn" href="#/catalogo">${ico("catalogo")}Ir al catálogo</a><a class="btn btn-borde" href="#/asesor">${ico("asesor")}Que me recomienden</a></div>
        </div>${historial}<div style="height:30px"></div></div>`;
      return;
    }
    const tipo = D.tiposCliente.map((t) => `<option ${datos.tipo === t ? "selected" : ""}>${esc(t)}</option>`).join("");
    v.innerHTML = `<div class="cont">
      <div class="cot-cab"><div><span class="ceja">Cotizador</span><h1>Mi cotización</h1></div><button class="enlace" id="vaciar" style="border:0;background:none;color:var(--tenue)">${ico("basura")}Vaciar</button></div>
      <div class="cot-layout">
        <div>
          <div class="cot-lista" id="cot-lista">${cot.map(itemHTML).join("")}</div>
          <a class="herr" href="#/catalogo" style="margin-top:10px;box-shadow:none;border:1.5px dashed var(--linea);background:transparent"><span class="herr-ico">${ico("mas")}</span><div><b>Agregar más productos</b><span>Pide desde 2 paquetes hasta 1 tráiler.</span></div></a>
          ${historial}
        </div>
        <div class="lateral">
          <form class="form" id="form-datos" novalidate>
            <h2 style="font-size:24px">Tus datos</h2>
            <div class="campo" data-req><label for="f-nombre">Nombre *</label><input id="f-nombre" name="nombre" autocomplete="name" value="${esc(datos.nombre || "")}" required><div class="ayuda">Escribe tu nombre.</div></div>
            <div class="campo"><label for="f-empresa">Empresa o negocio</label><input id="f-empresa" name="empresa" autocomplete="organization" value="${esc(datos.empresa || "")}"></div>
            <div class="calc-fila">
              <div class="campo" data-req><label for="f-ciudad">Ciudad *</label><input id="f-ciudad" name="ciudad" autocomplete="address-level2" value="${esc(datos.ciudad || "")}" required><div class="ayuda">¿En qué ciudad?</div></div>
              <div class="campo"><label for="f-tipo">Soy</label><select id="f-tipo" name="tipo"><option value="">Elige…</option>${tipo}</select></div>
            </div>
            <div><span class="campo-tit">¿Cómo lo recibes?</span>
              <div class="radio-tarjetas">
                <label><input type="radio" name="entrega" value="obra" ${datos.entrega !== "sucursal" ? "checked" : ""}>${ico("camion")}Entrega en mi obra o negocio</label>
                <label><input type="radio" name="entrega" value="sucursal" ${datos.entrega === "sucursal" ? "checked" : ""}>${ico("pin")}Recojo en sucursal</label>
              </div></div>
            <div class="campo"><label for="f-suc" id="f-suc-l">${datos.entrega === "sucursal" ? "Sucursal" : "Sucursal más cercana"}</label><select id="f-suc" name="sucursal">${D.sucursales.map((s) => `<option value="${s.id}" ${datos.sucursal === s.id ? "selected" : ""}>${esc(s.k)}</option>`).join("")}</select></div>
            <div class="campo"><label for="f-coment">Comentarios</label><textarea id="f-coment" name="coment" placeholder="Fecha que lo necesitas, dirección de la obra, dudas…">${esc(datos.coment || "")}</textarea></div>
            <div class="aviso">${ico("asesor-p")}<span>Tus datos se guardan solo en este teléfono y se envían cuando tú mandas el mensaje. Precio y disponibilidad te los confirma un asesor.</span></div>
            <details class="plegable"><summary>${ico("wa")}Ver el mensaje que se enviará${ico("chev", "ico ico-fin")}</summary><div><div class="previa" id="previa"></div></div></details>
            <div class="envio">
              <a class="btn btn-wa btn-bloque" data-via="WhatsApp" href="${urlWA("Hola, TMM. Quiero cotizar.")}" target="_blank" rel="noopener">${ico("wa")}Enviar por WhatsApp</a>
              <div class="envio-sec">
                <a class="btn btn-borde" data-via="Correo" href="mailto:${E.correo}">${ico("mail")}Correo</a>
                <button class="btn btn-borde" type="button" data-via="Copiar">${ico("copiar")}Copiar</button>
                <button class="btn btn-borde" type="button" data-via="Compartir">${ico("compartir")}Compartir</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div style="height:20px"></div></div>`;
    pintaPrevia();
    preparaImagenes(v);
    $$(".item", v).filter((it) => !anteriores.has(it.dataset.k)).forEach((it, i) => anima(it, [
      { transform: "translateY(14px)", opacity: .2 }, { transform: "none", opacity: 1 },
    ], { duration: 360, delay: Math.min(i, 6) * 45 }));
  }
  function pilaSVG() {
    const tonos = ["#e2b880", "#c9955b", "#d8a86c", "#b9824a", "#e6c08c"];
    return `<svg viewBox="0 0 150 120" width="150" height="120">${tonos.map((c, i) => `<g class="tabla-pila" style="--i:${i}"><rect x="${14 + (i % 2) * 4}" y="${96 - i * 17}" width="${118 - (i % 2) * 8}" height="13" rx="2" fill="${c}"/><rect x="${14 + (i % 2) * 4}" y="${106 - i * 17}" width="${118 - (i % 2) * 8}" height="3" fill="rgba(0,0,0,.12)"/></g>`).join("")}<path d="M120 22 132 42h-24z" fill="#00d200"/></svg>`;
  }
  function itemHTML(i) {
    const p = PROD[i.pid];
    const esps = p.esp ? [...p.esp] : [];
    return `<article class="item" data-k="${i.k}">
      <div class="item-img">${visual(p)}</div>
      <div><h3>${esc(p.n)}</h3><div class="item-sub">${esc([p.fmt, p.origen].filter(Boolean).join(" · ") || GRUPO[p.g].k)}</div></div>
      <button class="item-quitar" data-quitar aria-label="Quitar ${esc(p.n)}">${ico("x")}</button>
      <div class="item-ctrl">
        <select class="select esp-sel" data-campo="esp" aria-label="Espesor">
          <option value="" ${i.esp === null ? "selected" : ""}>${p.esp ? "Espesor por definir" : "Por definir"}</option>
          ${esps.map((e) => `<option value="${esc(e)}" ${String(i.esp) === String(e) ? "selected" : ""}>${esc(mm(e))}</option>`).join("")}
        </select>
        <div class="stepper chico"><button data-paso="-1" aria-label="Menos">${ico("menos")}</button><input type="number" inputmode="numeric" min="1" value="${i.cant}" data-campo="cant" aria-label="Cantidad"><button data-paso="1" aria-label="Más">${ico("mas")}</button></div>
        <select class="select" data-campo="unidad" aria-label="Unidad">${unidades(p).map((u) => `<option ${u === i.unidad ? "selected" : ""}>${u}</option>`).join("")}</select>
      </div>
      <div class="item-nota"><input data-campo="nota" placeholder="Nota (color, calidad, uso…)" value="${esc(i.nota || "")}" aria-label="Nota para ${esc(p.n)}"></div>
    </article>`;
  }
  function pintaPrevia() {
    const pv = $("#previa");
    if (pv) pv.textContent = mensaje("TMM-…");
  }
  function leeForm() {
    const f = $("#form-datos");
    if (!f) return;
    const fd = new FormData(f);
    datos = { ...datos, ...Object.fromEntries(fd.entries()) };
    guarda.pon("datos", datos);
  }
  const vc = $("#v-cotizacion");
  function quitaItem(it) {
    const quitado = cot.find((x) => x.k === it.dataset.k);
    if (!quitado) return;
    const pos = cot.indexOf(quitado), teniaFoco = it.contains(document.activeElement);
    const siguiente = cot[pos + 1] || cot[pos - 1];
    const r = it.getBoundingClientRect();
    const copia = !reducido && !document.hidden ? it.cloneNode(true) : null;
    leeForm();
    cot = cot.filter((x) => x !== quitado); guardaCot(); pintaCotizacion();
    toast(`${ico("basura")} <span>Quitaste ${esc(PROD[quitado.pid].n)}</span><a href="#" data-deshacer>Deshacer</a>`);
    const deshacer = $("#toast [data-deshacer]");
    deshacer.addEventListener("click", (ev) => {
      ev.preventDefault(); cot.splice(Math.min(pos, cot.length), 0, quitado); guardaCot(); pintaCotizacion();
      $("#toast").classList.remove("ver");
      const boton = $(`[data-k="${quitado.k}"] [data-quitar]`, vc);
      if (vistaActual === "cotizacion") boton?.focus({ preventScroll: true });
    }, { once: true });
    if (teniaFoco) (siguiente ? $(`[data-k="${siguiente.k}"] [data-quitar]`, vc) : $(".cot-vacia .btn", vc))?.focus({ preventScroll: true });
    if (copia) {
      copia.classList.add("item-salida"); copia.inert = true; copia.setAttribute("aria-hidden", "true");
      copia.removeAttribute("data-k");
      Object.assign(copia.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px", margin: 0, transform: "none" });
      document.body.appendChild(copia);
      anima(copia, [{ transform: "none", opacity: 1 }, { transform: "translateX(-100px)", opacity: 0 }], { duration: 220 }, () => copia.remove());
    }
  }

  /* Solo el fondo del renglón inicia el gesto; los controles conservan su uso. */
  let arrastre = null, omiteClick = false;
  function restableceGestos() {
    if (arrastre) {
      const { it, id } = arrastre; arrastre = null; it.style.transform = "";
      if (it.hasPointerCapture(id)) it.releasePointerCapture(id);
    }
    hoja.style.transform = "";
    $$(".card-stage").forEach((s) => { s.style.transform = ""; });
    if (cuadroScroll) { cancelAnimationFrame(cuadroScroll); cuadroScroll = 0; }
  }
  vc.addEventListener("pointerdown", (e) => {
    omiteClick = false;
    const it = e.target.closest(".item");
    if (e.pointerType !== "touch" || !e.isPrimary || !it || e.target.closest("button, input, select, textarea, a")) return;
    arrastre = { it, id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, activo: false };
  }, { passive: true });
  vc.addEventListener("pointermove", (e) => {
    if (!arrastre || arrastre.id !== e.pointerId) return;
    const dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
    if (!arrastre.activo && Math.abs(dy) > 12 && Math.abs(dy) >= Math.abs(dx)) { arrastre = null; return; }
    if (!arrastre.activo && dx < -10 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      arrastre.activo = true; arrastre.it.setPointerCapture(e.pointerId);
    }
    if (!arrastre.activo) return;
    arrastre.dx = Math.min(0, Math.max(-160, dx));
    if (!reducido) arrastre.it.style.transform = `translateX(${arrastre.dx}px)`;
  }, { passive: true });
  function sueltaItem(e, cancelado = false) {
    if (!arrastre || arrastre.id !== e.pointerId) return;
    const { it, dx, activo } = arrastre; arrastre = null;
    if (it.hasPointerCapture(e.pointerId)) it.releasePointerCapture(e.pointerId);
    omiteClick = activo;
    if (!cancelado && activo && dx < -Math.min(100, it.offsetWidth * .28)) quitaItem(it);
    else {
      it.style.transform = "";
      if (activo) anima(it, [{ transform: `translateX(${dx}px)` }, { transform: "none" }], { duration: 230, canal: "gesto" });
    }
  }
  vc.addEventListener("pointerup", (e) => sueltaItem(e));
  vc.addEventListener("pointercancel", (e) => sueltaItem(e, true));
  vc.addEventListener("lostpointercapture", (e) => sueltaItem(e, true));
  vc.addEventListener("click", (e) => { if (omiteClick && e.detail !== 0) { omiteClick = false; e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  vc.addEventListener("input", (e) => {
    const it = e.target.closest(".item");
    if (it && e.target.dataset.campo) {
      const i = cot.find((x) => x.k === it.dataset.k);
      const c = e.target.dataset.campo;
      if (c === "cant") i.cant = Math.max(1, parseInt(e.target.value, 10) || 1);
      else if (c === "esp") { const p = PROD[i.pid]; i.esp = e.target.value === "" ? null : (p.esp.find((x) => String(x) === e.target.value) ?? e.target.value); }
      else i[c] = e.target.value;
      guardaCot();
    }
    if (e.target.closest("#form-datos")) {
      leeForm();
      const c = e.target.closest(".campo.error");
      if (c && e.target.value.trim()) c.classList.remove("error");
      if (e.target.name === "entrega") $("#f-suc-l").textContent = datos.entrega === "sucursal" ? "Sucursal" : "Sucursal más cercana";
    }
    pintaPrevia();
  });
  vc.addEventListener("click", async (e) => {
    const it = e.target.closest(".item");
    if (it && e.target.closest("[data-paso]")) {
      const i = cot.find((x) => x.k === it.dataset.k);
      i.cant = Math.max(1, i.cant + Number(e.target.closest("[data-paso]").dataset.paso));
      rueda($("[data-campo=cant]", it), i.cant);
      guardaCot(); pintaPrevia();
      return;
    }
    if (it && e.target.closest("[data-quitar]")) {
      quitaItem(it);
      return;
    }
    if (e.target.closest("#vaciar")) {
      const copia = cot.slice();
      cot = []; guardaCot(); pintaCotizacion();
      toast(`${ico("basura")} <span>Vaciaste tu cotización</span><a href="#" data-deshacer>Deshacer</a>`);
      $("#toast [data-deshacer]").addEventListener("click", (ev) => { ev.preventDefault(); cot = copia; guardaCot(); pintaCotizacion(); $("#toast").classList.remove("ver"); }, { once: true });
      return;
    }
    const via = e.target.closest("[data-via]");
    if (via && via.tagName === "A") {
      if (!valida()) { e.preventDefault(); return; }
      const f = folio(), txt = mensaje(f);
      via.href = via.dataset.via === "WhatsApp" ? urlWA(txt) : urlCorreo(f, txt);
      setTimeout(() => registra(via.dataset.via, f), 400);
      return;
    }
    if (via) { e.preventDefault(); envia(via.dataset.via); }
  });
  vc.addEventListener("submit", (e) => e.preventDefault());

  function valida() {
    leeForm();
    let ok = true;
    $$("#form-datos [data-req]").forEach((c) => {
      const vacio = !$("input", c).value.trim();
      c.classList.toggle("error", vacio);
      if (vacio && ok) { ok = false; $("input", c).focus(); }
    });
    if (!ok) toast(`${ico("x")} <span>Escribe tu nombre y ciudad para enviar.</span>`);
    return ok;
  }
  const urlCorreo = (f, txt) => `mailto:${E.correo}?subject=${encodeURIComponent("Solicitud de cotización " + f)}&body=${encodeURIComponent(txt)}`;
  /* WhatsApp y correo son enlaces reales (<a>): el navegador los abre aunque window.open esté bloqueado.
     El href se arma al tocar, con el folio de ese momento. Copiar y Compartir sí van por script. */
  async function envia(via) {
    if (!valida()) return;
    const f = folio(), txt = mensaje(f);
    if (via === "Copiar") {
      try { await navigator.clipboard.writeText(txt); toast(`${ico("copiar")} <span>Mensaje copiado. Pégalo en WhatsApp o en un correo para TMM.</span>`); } catch { muestraTexto(txt); }
      return;
    }
    if (via === "Compartir") {
      if (!navigator.share) { toast(`${ico("x")} <span>Este navegador no permite compartir; usa Copiar.</span>`); return; }
      try { await navigator.share({ title: "Cotización TMM " + f, text: txt }); } catch (err) {
        if (err && err.name !== "AbortError") toast(`${ico("x")} <span>No se pudo compartir aquí; usa Copiar.</span>`);
        return;
      }
      registra(via, f);
    }
  }
  /* Si el portapapeles no está disponible, se muestra el texto seleccionado para copiarlo a mano */
  function muestraTexto(txt) {
    abreHoja(`<div class="det-in"><h2 id="hoja-titulo">Copia tu solicitud</h2><p class="det-txt">Mantén presionado el texto y elige Copiar.</p><textarea id="txt-copia" class="previa" style="width:100%;min-height:280px" readonly>${esc(txt)}</textarea></div>`);
    const t = $("#txt-copia", hoja); t.focus(); t.select();
  }
  function registra(via, f) {
    const d = new Date();
    hist.unshift({ folio: f, fecha: d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }), n: cot.length, via });
    hist = hist.slice(0, 20);
    guarda.pon("hist", hist);
    const nombre = esc((datos.nombre || "").split(" ")[0]);
    const texto = {
      WhatsApp: "Abrimos WhatsApp con tu solicitud. Toca Enviar en el chat y un asesor de TMM te contesta con precio y disponibilidad.",
      Correo: `Abrimos tu correo con la solicitud lista. Si no se abrió, usa Copiar y mándala a ${esc(E.correo)}.`,
      Compartir: "Compartiste tu solicitud. Un asesor de TMM te contesta con precio y disponibilidad.",
    }[via];
    abreHoja(`<div class="exito">
      <div class="exito-sello">${palomita()}</div>
      <h2 id="hoja-titulo">${via === "Compartir" ? "¡Listo" : "¡Ya casi"}, ${nombre}!</h2>
      <p>${texto}</p>
      <span class="folio">${esc(f)}</span>
      <div class="heroe-acciones" style="justify-content:center">
        <button class="btn" data-nueva>${ico("mas")}Nueva cotización</button>
        <button class="btn btn-borde" data-cerrar>Conservar esta lista</button>
      </div></div>`);
    $("[data-nueva]", hoja).addEventListener("click", () => { cot = []; guardaCot(); cierraHoja(); pintaCotizacion(); });
    lanzaTriangulos();
  }

  /* Confeti de triángulos de la marca */
  function lanzaTriangulos() {
    if (reducido || document.hidden || !document.body.animate) return;
    const colores = ["#00d200", "#0079c1", "#e1fae1", "#0a8fdc"];
    for (let k = 0; k < 26; k++) {
      const t = document.createElement("i");
      const s = 8 + Math.random() * 10;
      Object.assign(t.style, { position: "fixed", zIndex: 95, left: 50 + (Math.random() - 0.5) * 30 + "vw", top: "38vh", width: 0, height: 0, pointerEvents: "none",
        borderLeft: `${s / 2}px solid transparent`, borderRight: `${s / 2}px solid transparent`, borderBottom: `${s}px solid ${colores[k % colores.length]}` });
      document.body.appendChild(t);
      const dx = (Math.random() - 0.5) * 520, dy = -160 - Math.random() * 220;
      anima(t, [
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: `translate(${dx * 0.6}px, ${dy}px) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${dx}px, ${dy + 520}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ], { duration: 1500 + Math.random() * 700, easing: "cubic-bezier(.2,.6,.4,1)" }, () => t.remove());
    }
  }

  /* ───────── Vista: Nosotros ───────── */
  function pintaNosotros() {
    const v = $("#v-nosotros");
    v.innerHTML = `
      <div class="nos-heroe">
        <span class="ceja" style="color:#7fc8f3">Nosotros</span>
        <div class="gran"><span data-cuenta="35" data-pre="">0</span><small>años</small></div>
        <p>Cumplimos 35 años con presencia en más de 22 estados del país, atendiendo los principales mercados con el mejor producto nacional e internacional, importado desde 25 países.</p>
      </div>
      <div class="cont">${cifras()}</div>

      <section class="seccion"><div class="cont">
        <div class="seccion-cab rev"><div><span class="ceja">Importación y distribución</span><h2>Desde los 5 continentes</h2><p>Distribuimos los principales productos nacionales e internacionales para mueblería, revestimientos y construcción.</p></div></div>
        <div class="foto-ancha rev"><img src="${img("f_puerto")}" alt="Contenedores en puerto" loading="lazy"></div>
        <span class="campo-tit" style="margin-top:18px">Algunos de nuestros orígenes</span>
        <div class="mapa-origenes">${D.origenes.map((o, i) => `<div class="continente rev" style="--d:${i * 0.06}s"><b>${esc(o.k)}</b><div>${o.v.map((x) => `<span>${esc(x)}</span>`).join("")}</div></div>`).join("")}</div>
      </div></section>

      <section class="cont">
        <div class="seccion-cab rev"><div><span class="ceja">Materiales</span><h2>Una mezcla a la medida de cada obra</h2></div></div>
        <div class="mezcla rev">
          <div><h3>Construcción</h3><ul><li>Cimbras</li><li>OSB (astilla)</li><li>Celotex</li></ul></div>
          <div><h3>Carpintería</h3><ul><li>Triplay / triplay finos</li><li>Maderas finas</li><li>Melaminas</li><li>MDF / MDF enchapados</li><li>Aglomerados</li></ul></div>
        </div>
        <span class="campo-tit" style="margin-top:22px">Las chapas que manejamos</span>
        <p style="color:var(--tenue)">Tzalam · Encino · Nogal · Albasia · Okume · Caobilla · Parota · Parotilla · Pino · Cedro · Rosa Morada · Cumala Pencil</p>
        <div class="chapas"><img class="rev" src="${img("chapas_a")}" alt="Chapas: tzalam, encino, nogal, albasia, okume y caobilla" loading="lazy"><img class="rev" style="--d:.08s" src="${img("chapas_b")}" alt="Chapas: parota, parotilla, pino, cedro, rosa morada y cumala pencil" loading="lazy"></div>
      </section>

      <section class="seccion"><div class="cont">
        <div class="seccion-cab rev"><div><span class="ceja">Nos distinguen</span><h2>Lo que nos hace diferentes</h2><p>Toca cada tarjeta.</p></div></div>
        <div class="voltea">${D.distintivos.map((d, i) => `<button class="carta rev" style="--d:${i * 0.06}s" aria-pressed="false"><div class="carta-in">
          <div class="carta-cara carta-frente"><span class="herr-ico">${ico(d.icono === "asesor" ? "asesor-p" : d.icono)}</span><div><b>${esc(d.k)}</b><br><small>Toca para ver más</small></div></div>
          <div class="carta-cara carta-reverso">${esc(d.v)}</div></div></button>`).join("")}</div>
      </div></section>

      <section class="cont">
        <div class="seccion-cab rev"><div><span class="ceja">Nuestra esencia</span><h2>Misión, visión y valores</h2></div></div>
        <div class="esencia"><div class="rev"><b>Misión</b>${esc(D.esencia.mision)}</div><div class="rev" style="--d:.06s"><b>Visión</b>${esc(D.esencia.vision)}</div></div>
        <div class="valores">${D.esencia.valores.map((x, i) => `<div class="valor rev" style="--d:${i * 0.06}s">${esc(x)}</div>`).join("")}</div>
      </section>

      <section class="seccion"><div class="cont">
        <div class="seccion-cab rev"><div><span class="ceja">Alianzas</span><h2>Proveedores de talla mundial</h2><p>Alianzas estratégicas que nos posicionan como uno de los grupos madereros más importantes del país.</p></div></div>
        <div class="logos">${D.proveedores.map((l, i) => `<div class="logo-caja rev" style="--d:${i * 0.05}s"><img src="${img(l)}" alt="${esc(l.replace("prov_", ""))}" loading="lazy"></div>`).join("")}</div>
        <span class="campo-tit" style="margin-top:22px">Respaldo que nos distingue</span>
        <div class="logos">${D.certificaciones.map((c, i) => `<div class="logo-caja cert rev" style="--d:${i * 0.05}s"><img src="${img(c.img)}" alt="" loading="lazy"><small>${esc(c.k)}</small></div>`).join("")}</div>
      </div></section>

      <section class="cont">
        <div class="sustentable rev">
          <img src="${img("f_bosque")}" alt="Bosque" loading="lazy">
          <div><span class="ceja">Bosques sustentables</span><h2 style="font-size:28px">Madera con origen responsable</h2>
            <p>Todos nuestros productos provienen de bosques sustentables, y nuestros proveedores cuentan con certificaciones como FSC y Eco-Friendly, entre otras.</p>
            <p>Nuestro compromiso con clientes, colaboradores y la sociedad nos otorga el reconocimiento de Empresa Socialmente Responsable.</p></div>
        </div>
      </section>

      <section class="seccion"><div class="cont">
        <div class="seccion-cab rev"><div><span class="ceja">Por dentro</span><h2>Así se ve TMM</h2></div></div>
        <div class="galeria">${D.galeria.map((g) => `<figure><img src="${img(g.img)}" alt="${esc(g.pie)}" loading="lazy"><figcaption>${esc(g.pie)}</figcaption></figure>`).join("")}</div>
      </div></section>
      ${contacto()}`;
  }
  $("#v-nosotros").addEventListener("click", (e) => {
    const c = e.target.closest(".carta");
    if (c) { canales.get($(".carta-in", c))?.get("guino")?.(); c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") !== "true"); }
  });

  /* ───────── Clics globales: abrir producto / agregar rápido ───────── */
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      e.preventDefault();
      const p = PROD[add.dataset.add];
      agrega(p.id, { esp: p.esp && p.esp.length === 1 ? p.esp[0] : null }, add.closest(".card").querySelector(".slab, .foto"));
      anima(add, [{ transform: "scale(.85)" }, { transform: "scale(1.12)", offset: .55 }, { transform: "none" }], { duration: 340, canal: "boton" });
      return;
    }
    const pr = e.target.closest("[data-prod]");
    if (pr) {
      e.preventDefault();
      if (pr.hasAttribute("data-reemplaza")) { history.replaceState({ tmmHoja: true }, "", "#/p/" + pr.dataset.prod); abreProducto(pr.dataset.prod, pr); }
      else { history.pushState({ tmmHoja: true }, "", "#/p/" + pr.dataset.prod); abreProducto(pr.dataset.prod, pr); }
    }
  });

  /* ───────── Router ───────── */
  let vistaActual = null;
  const pintadas = new Set();
  const ordenTabs = $$(".tabs [data-tab]").map((a) => a.dataset.tab);
  const indicadorTab = document.createElement("span");
  indicadorTab.className = "tabs-indicador"; indicadorTab.setAttribute("aria-hidden", "true");
  $(".tabs").appendChild(indicadorTab);
  function mueveTab(nombre, anterior) {
    const i = ordenTabs.indexOf(nombre), previo = ordenTabs.indexOf(anterior);
    indicadorTab.style.transform = `translateX(${i * 100}%)`;
    if (previo >= 0 && previo !== i) {
      anima(indicadorTab, [{ transform: `translateX(${previo * 100}%)` }, { transform: `translateX(${i * 100}%)` }], { duration: 380, canal: "tab" });
      const tab = $(`.tabs [data-tab="${nombre}"]`), icono = tab.matches(".con-estiba") ? $(".estiba", tab) : $(".ico", tab);
      anima(icono, [{ transform: "translateY(0) scale(.9)" }, { transform: "translateY(-4px) scale(1.12)", offset: .55 }, { transform: "translateY(-1px) scale(1.08)" }], { duration: 370, canal: "tab" });
    }
  }
  function animaHeroe() {
    const h = $(".heroe h1");
    if (!h) return;
    if (!h.dataset.palabras) {
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), textos = [];
      while (walker.nextNode()) textos.push(walker.currentNode);
      textos.forEach((t) => {
        const f = document.createDocumentFragment();
        (t.textContent.match(/\S+|\s+/g) || []).forEach((palabra) => {
          if (/^\s+$/.test(palabra)) f.appendChild(document.createTextNode(palabra));
          else { const s = document.createElement("span"); s.className = "heroe-palabra"; s.textContent = palabra; f.appendChild(s); }
        });
        t.replaceWith(f);
      });
      h.dataset.palabras = "1";
    }
    $$(".heroe-palabra", h).forEach((s, i) => anima(s, [{ transform: "translateY(12px)", opacity: .1 }, { transform: "none", opacity: 1 }], { duration: 500, delay: 70 + i * 85 }));
    paralaje();
  }
  function paralaje() {
    const foto = $(".heroe-foto"), heroe = $(".heroe");
    if (!foto) return;
    foto.style.transform = !reducido && vistaActual === "inicio" && heroe.getBoundingClientRect().bottom > 0 ? `translateY(${Math.min(18, Math.max(0, scrollY * .055))}px)` : "";
  }

  /* Inclinación solo con un puntero preciso; no compite con la entrada de la tarjeta. */
  const punteroFino = matchMedia("(hover:hover) and (pointer:fine)");
  document.addEventListener("pointermove", (e) => {
    if (reducido || !punteroFino.matches || e.pointerType === "touch") return;
    const card = e.target.closest(".card"), stage = card && $(".card-stage", card);
    if (!stage) return;
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    stage.style.transform = `perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg)`;
  }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    const card = e.target.closest(".card");
    if (card && !card.contains(e.relatedTarget)) $(".card-stage", card).style.transform = "";
  }, { passive: true });
  punteroFino.addEventListener("change", () => $$(".card-stage").forEach((s) => { s.style.transform = ""; }));
  function pintaFab() {
    const fab = $("#fab-wa");
    fab.href = urlWA("Hola, TMM. Me comunico desde la app.");
    fab.classList.toggle("oculto", vistaActual === "cotizacion" || hojaAbierta);
  }
  function muestra(nombre, extra = []) {
    const anterior = vistaActual;
    const cambio = vistaActual !== nombre;
    vistaActual = nombre;
    $$(".vista").forEach((s) => { s.hidden = s.dataset.vista !== nombre; });
    $$("[data-tab]").forEach((a) => (a.dataset.tab === nombre ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    const v = $("#v-" + nombre);
    if (nombre === "inicio" && !pintadas.has("inicio")) { pintaInicio(); observa(v); }
    if (nombre === "nosotros" && !pintadas.has("nosotros")) { pintaNosotros(); observa(v); }
    if (nombre === "catalogo") {
      const [, tipo, id] = extra || [];
      if (tipo === "l" && LINEA[id]) { filtro.linea = id; filtro.grupo = null; }
      else if (tipo === "g" && GRUPO[id]) { filtro.grupo = id; filtro.linea = GRUPO[id].linea; }
      else if (!tipo && cambio) { filtro.linea = "todo"; filtro.grupo = null; }
      if (cambio || tipo || !pintadas.has("catalogo")) pintaCatalogo();
    }
    if (nombre === "asesor" && (cambio || extra[0])) pintaAsesor(extra[0]);
    if (nombre === "cotizacion" && cambio) pintaCotizacion();
    pintadas.add(nombre);
    if (cambio) {
      window.scrollTo(0, 0);
      restableceGestos();
      const direccion = ordenTabs.indexOf(nombre) >= ordenTabs.indexOf(anterior) ? 1 : -1;
      anima(v, [{ transform: `translateX(${anterior ? direccion * 22 : 0}px)`, opacity: .4 }, { transform: "none", opacity: 1 }], { duration: 330, canal: "vista" });
      mueveTab(nombre, anterior);
      if (nombre === "inicio") animaHeroe();
      document.title = { inicio: "TMM Clientes", catalogo: "Catálogo · TMM", asesor: "Asesor · TMM", cotizacion: "Mi cotización · TMM", nosotros: "Nosotros · TMM" }[nombre];
    }
    pintaFab();
    if (nombre === "asesor" && extra[0] === "calc") $("#calc-lado").scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "start" });
  }
  function ruta() {
    const partes = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const [r, ...resto] = partes;
    if (r === "p" && PROD[resto[0]]) {
      if (!vistaActual) muestra("catalogo");
      if (!hojaAbierta || !hojaPorHash) abreProducto(resto[0]);
      return;
    }
    if (hojaAbierta) cierraHoja({ desdeHash: true });
    const vistas = ["inicio", "catalogo", "asesor", "cotizacion", "nosotros"];
    muestra(vistas.includes(r) ? r : "inicio", r === "catalogo" ? [null, ...resto] : resto);
  }
  window.addEventListener("hashchange", ruta);
  window.addEventListener("popstate", () => { if (!location.hash.startsWith("#/p/") && hojaAbierta && hojaPorHash) cierraHoja({ desdeHash: true }); });

  /* Borde de la barra al hacer scroll */
  let cuadroScroll = 0;
  addEventListener("scroll", () => {
    $("#barra").classList.toggle("con-borde", scrollY > 8);
    if (!reducido && !document.hidden && vistaActual === "inicio" && !cuadroScroll) cuadroScroll = requestAnimationFrame(() => { cuadroScroll = 0; paralaje(); });
  }, { passive: true });
  addEventListener("resize", () => {
    const seg = $(".segmento");
    selectorDesliza(seg, seg && $("[aria-pressed=true]", seg), "pastilla");
    preparaPills(document); pintaBordes(); paralaje();
  }, { passive: true });

  pintaAbierto();
  setInterval(pintaAbierto, 60000);
  pintaBadge();
  ruta();

  /* PWA: registra el service worker si existe (solo en la versión instalable) */
  if ("serviceWorker" in navigator && location.protocol === "https:" && document.querySelector('link[rel="manifest"]')) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
