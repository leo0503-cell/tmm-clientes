const CACHE = "tmm-clientes-4ab4ee222c";
const ARCHIVOS = ["./", "index.html", "styles.css", "app.js", "data.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "img/c_argentina.webp", "img/c_asia.webp", "img/c_brasil.webp", "img/c_durax.webp", "img/c_leonera.webp", "img/cert_canainma.webp", "img/cert_esr.webp", "img/cert_hecho_mexico.webp", "img/cert_imexfor.webp", "img/chapas_a.webp", "img/chapas_b.webp", "img/e_birch.webp", "img/e_mdo.webp", "img/e_tulsa.webp", "img/f_albasia2.webp", "img/f_almacen.webp", "img/f_asesoria.webp", "img/f_bodega.webp", "img/f_bosque.webp", "img/f_camion.webp", "img/f_carga.webp", "img/f_esr.webp", "img/f_estiba.webp", "img/f_fancy1.webp", "img/f_liston1.webp", "img/f_montacargas.webp", "img/f_paquete.webp", "img/f_puerto.webp", "img/f_taller.webp", "img/f_trailer.webp", "img/logo_color.webp", "img/logo_white.webp", "img/m_a_banak.webp", "img/m_a_caoba.webp", "img/m_a_cedro.webp", "img/m_a_marupa.webp", "img/m_a_parota.webp", "img/m_a_poplar.webp", "img/m_a_redoak.webp", "img/m_a_tornillo.webp", "img/m_a_tzalam.webp", "img/m_aglo_blanco.webp", "img/m_aglomerado.webp", "img/m_albasia.webp", "img/m_alto_brillo.webp", "img/m_blanco.webp", "img/m_caobilla.webp", "img/m_cedro.webp", "img/m_celotex.webp", "img/m_cimbra_brasil.webp", "img/m_cimbra_chilena.webp", "img/m_cimbra_china.webp", "img/m_cimbra_nacional.webp", "img/m_cimbra_rusa.webp", "img/m_cumala.webp", "img/m_deck_cumaru.webp", "img/m_deck_teca.webp", "img/m_encino.webp", "img/m_eucalipto.webp", "img/m_film.webp", "img/m_mdf_arauco.webp", "img/m_mdf_chileno.webp", "img/m_mdf_chino.webp", "img/m_mdf_nacional.webp", "img/m_mdf_tailandes.webp", "img/m_mdf_tecnotabla.webp", "img/m_nogal.webp", "img/m_okume.webp", "img/m_osb_a.webp", "img/m_osb_b.webp", "img/m_parota.webp", "img/m_pino_asiatico.webp", "img/m_pino_chileno.webp", "img/m_pino_nacional.webp", "img/m_pino_uruguayo.webp", "img/m_ranurado.webp", "img/m_rosa_morada.webp", "img/m_tzalam.webp", "img/m_uruply.webp", "img/mdf_chapa.webp", "img/mdf_crudo.webp", "img/p_asia.webp", "img/p_cmpc.webp", "img/p_eagon.webp", "img/p_uruply_bc.webp", "img/prov_arauco.webp", "img/prov_eagon.webp", "img/prov_lumin.webp", "img/prov_segezha.webp", "img/u_altobrillo.webp", "img/u_cocina.webp", "img/u_logo.webp", "img/u_marmol.webp", "img/u_matt.webp", "img/u_melamina.webp", "img/u_pvc.webp", "img/u_wpc2.webp", "img/u_wpc_muro.webp"];
const ESENCIALES = ARCHIVOS.filter((f) => !f.startsWith("img/"));
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) =>
    c.addAll(ESENCIALES).then(() => Promise.allSettled(ARCHIVOS.filter((f) => f.startsWith("img/")).map((f) => c.add(f))))
  ).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("tmm-clientes-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) {
    if (!/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;
    e.respondWith(caches.open(CACHE).then((c) => c.match(e.request).then((r) => r || fetch(e.request).then((res) => { c.put(e.request, res.clone()); return res; }))));
    return;
  }
  if (url.pathname.includes("/img/")) {
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request)));
    return;
  }
  const red = fetch(e.request, { cache: "no-cache" }).then((res) => {
    if (res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(e.request.mode === "navigate" ? "index.html" : url.pathname, copia)); }
    return res;
  });
  const respaldo = () => caches.match(e.request.mode === "navigate" ? "index.html" : e.request, { ignoreSearch: true });
  e.respondWith(Promise.race([red, new Promise((_, no) => setTimeout(no, 4000))]).catch(() => respaldo().then((r) => r || red)));
});
