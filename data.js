/* Datos de la app de clientes TMM.
   Fuentes: catálogo de www.triplayymaderas.com (medidas por producto), curso de ventas
   CURSO VENTAS ABRIL 2026 (descripciones, orígenes, usos) y datos corporativos confirmados
   por Leonardo (sept 2026: 35 años, 25 países, 3 almacenes, sábados, "desde 2 paquetes").
   Nada de precios: los da el asesor. Lo que no está confirmado no se muestra. */
window.TMM = {
  empresa: {
    nombre: "Triplay y Maderas de Mayoreo",
    corto: "TMM",
    lema: "¡Tenemos la madera!",
    whatsapp: "524493435293",
    telefono: "(449) 343 52 93",
    tel: "+524493435293",
    correo: "karina.mateos@triplayymaderas.com",
    web: "https://www.triplayymaderas.com",
    facebook: "https://www.facebook.com/TriplayyMaderas",
    instagram: "https://www.instagram.com/triplayymaderasdemayoreo/",
    horario: "Lunes a viernes 8:30 – 18:30 · Sábados 8:30 – 14:00",
    // [día 0=domingo … 6=sábado] → [abre, cierra] en horas decimales, hora del centro de México
    horas: { 1: [8.5, 18.5], 2: [8.5, 18.5], 3: [8.5, 18.5], 4: [8.5, 18.5], 5: [8.5, 18.5], 6: [8.5, 14] },
    pedido: "Desde 2 paquetes hasta 1 tráiler",
  },

  cifras: [
    { n: 35, txt: "años", nota: "en la industria maderera" },
    { n: 25, txt: "países", nota: "de origen, en 5 continentes" },
    { n: 22, pre: "+", txt: "estados", nota: "con presencia" },
    { n: 3, txt: "almacenes", nota: "en la República" },
  ],

  origenes: [
    { k: "América", v: ["Canadá", "EUA", "Brasil", "Chile", "Uruguay", "Argentina", "Perú", "Colombia"] },
    { k: "Europa", v: ["Rumania", "Rusia"] },
    { k: "Asia", v: ["China", "Malasia", "Tailandia", "Indonesia"] },
    { k: "Oceanía", v: ["Nueva Zelanda"] },
  ],

  distintivos: [
    { k: "Entregas oportunas", v: "Distribuimos los principales productos nacionales e internacionales, directo a tus instalaciones.", icono: "camion" },
    { k: "Asesoría personalizada", v: "Vendedores expertos en productos maderables, listos para asesorarte en tu proyecto o negocio.", icono: "asesor" },
    { k: "Calidad del producto", v: "El producto que requieres, con la calidad que necesitas y al mejor precio.", icono: "calidad" },
    { k: "Productos sostenibles", v: "De bosques sustentables, con proveedores certificados FSC y Eco-Friendly, entre otras.", icono: "hoja" },
  ],

  esencia: {
    mision: "Generar valor para todos con una amplia oferta de productos sustentables, disponibilidad y entregas puntuales.",
    vision: "Ser el referente en la industria maderera como una empresa humana, responsable y de alto desempeño.",
    valores: ["Integridad", "Pasión", "Prosperidad", "Trabajo en equipo"],
  },

  proveedores: ["prov_arauco", "prov_segezha", "prov_eagon", "prov_lumin"],
  certificaciones: [
    { img: "cert_esr", k: "Empresa Socialmente Responsable" },
    { img: "cert_canainma", k: "CANAINMA" },
    { img: "cert_imexfor", k: "IMEXFOR" },
    { img: "cert_hecho_mexico", k: "Hecho en México" },
  ],

  testimonios: [
    { quien: "Óscar López", txt: "Tienen siempre el material que requiere, de excelente calidad y al mejor precio." },
    { quien: "Roberto González", txt: "Con Triplay y Maderas de Mayoreo nos olvidamos de los problemas en envíos. Siempre nos llega directo al almacén." },
    { quien: "Juan José Hermosillo", txt: "La variedad de maderas de importación que manejan es ideal para nuestros clientes más exigentes." },
  ],

  sucursales: [
    { id: "ags", k: "Aguascalientes", v: "José Antonio #108, Parque Industrial Siglo XXI, CP 20283, Aguascalientes, Ags." },
    { id: "gdl", k: "Guadalajara", v: "Camino Tala – San Isidro 76, km 12.5, CP 45340, San Isidro Mazatepec, Jal." },
    { id: "cdmx", k: "Ciudad de México", v: "Cerrada de Acalotenco #237, Parque Pical Pantaco bodega 14, Col. San Sebastián, CP 02040, Azcapotzalco, CDMX" },
  ],

  galeria: [
    { img: "f_bodega", pie: "Nuestro almacén en Aguascalientes" },
    { img: "f_carga", pie: "Carga de pedidos" },
    { img: "f_almacen", pie: "Inventario de MDF" },
    { img: "f_paquete", pie: "Producto importado, listo para entrega" },
    { img: "f_camion", pie: "Flotilla propia" },
    { img: "f_esr", pie: "Distintivo ESR" },
  ],

  /* ───────── Catálogo ───────── */
  lineas: [
    { id: "construccion", k: "Construcción", sub: "Cimbra, OSB y celotex para obra", foto: "f_trailer" },
    { id: "carpinteria", k: "Carpintería", sub: "Triplay, MDF, aglomerados y maderas finas", foto: "f_taller" },
    { id: "ultra", k: "Interiorismo Ultra", sub: "Melamina, alto brillo, matt, WPC y PVC mármol", foto: "u_cocina" },
  ],

  grupos: [
    { id: "cimbra", linea: "construccion", k: "Triplay para cimbra", sub: "Para colados de concreto. Elige según cuántas veces la vas a reutilizar." },
    { id: "especial", linea: "construccion", k: "Cimbras de especialidad", sub: "Cuando el concreto tiene que quedar perfecto: más usos y mejor acabado." },
    { id: "osb", linea: "construccion", k: "OSB (astilla) y celotex", sub: "Tableros estructurales para muros, techumbres, pisos y embalaje." },
    { id: "pino", linea: "carpinteria", k: "Triplay de pino", sub: "Cada origen tiene su carácter: apariencia, resistencia o precio." },
    { id: "fino", linea: "carpinteria", k: "Triplay fino", sub: "Caras limpias y vetas seleccionadas para ebanistería e interiores." },
    { id: "mdf", linea: "carpinteria", k: "MDF", sub: "Superficie lisa y homogénea, ideal para pintura y fácil de mecanizar." },
    { id: "enchapado", linea: "carpinteria", k: "MDF enchapado y recubierto", sub: "La estabilidad del MDF con la estética de la madera natural." },
    { id: "aglomerado", linea: "carpinteria", k: "Aglomerados y MDP", sub: "Tableros económicos para estructura de muebles." },
    { id: "aserrada", linea: "carpinteria", k: "Maderas aserradas", sub: "Maderas finas en gruesos de 1\", 1 ½\" y 2\"." },
    { id: "deck", linea: "carpinteria", k: "Decks", sub: "Maderas tropicales para terrazas y exteriores." },
    { id: "ultra", linea: "ultra", k: "Línea Ultra", sub: "Interiorismo accesible: materiales listos para instalar, con alto impacto visual." },
  ],

  productos: [
    /* Triplay para cimbra */
    { id: "cimbra-uruguaya", g: "cimbra", n: "Cimbra uruguaya Uruply CDX", m: "m_uruply", esp: [12, 15, 18], fmt: "1.22 × 2.44 m", origen: "Uruguay",
      txt: "Pino resistente de acabado rústico, para cimbra con durabilidad en obra. También en versión lijada (mejor acabado del concreto) y de eucalipto (más densa, para cimbra pesada).",
      usos: ["Cimbra", "Cimbra visible", "Cimbra pesada"], datos: [["Reutilizaciones", "3 a 4 usos"]] },
    { id: "cimbra-chilena", g: "cimbra", n: "Cimbra chilena Leonera CD", m: "m_cimbra_chilena", foto: "c_leonera", esp: [12, 15, 18], fmt: "1.22 × 2.44 m", origen: "Chile",
      txt: "Pino radiata de alta resistencia: desempeño estructural para construcción pesada.",
      usos: ["Construcción pesada", "Cimbra"], datos: [["Reutilizaciones", "3 a 4 usos"]] },
    { id: "cimbra-brasil", g: "cimbra", n: "Cimbra Brasil", m: "m_cimbra_brasil", foto: "c_brasil", esp: [12, 15, 18], fmt: "1.22 × 2.44 m", origen: "Brasil",
      txt: "Pino elliottii. La calidad C+/C da muy buena relación costo-desempeño; la BG es la opción de precio más bajo para usos temporales.",
      usos: ["Cimbra", "Uso temporal"], datos: [["Reutilizaciones", "C+/C: 3 a 4 usos · BG: 1 uso aprox."]] },
    { id: "cimbra-china", g: "cimbra", n: "Cimbra China Poplar / Combi Core", m: "m_cimbra_china", foto: "c_asia", esp: [15, 18], fmt: "1.22 × 2.44 m", origen: "China",
      txt: "Ligera y fácil de manejar. La Combi Core (poplar + eucalipto) da un mejor balance entre peso y resistencia que la de poplar.",
      usos: ["Cimbra ligera", "Cimbra media"], datos: [["Reutilizaciones", "3 a 4 usos"]] },
    { id: "cimbra-americana", g: "cimbra", n: "Cimbra americana", m: "m_pino_nacional", esp: [15, 18], fmt: "1.22 × 2.44 m", origen: "EUA",
      txt: "Triplay para cimbra de importación estadounidense.", usos: ["Cimbra"] },
    { id: "cimbra-argentina", g: "cimbra", n: "Cimbra argentina C+/C", foto: "c_argentina", origen: "Argentina",
      txt: "Pino elliottii, similar a la de Brasil: una opción balanceada para cimbra.", usos: ["Cimbra"], datos: [["Reutilizaciones", "3 a 4 usos"]] },
    { id: "cimbra-nacional", g: "cimbra", n: "Cimbra nacional", m: "m_cimbra_nacional", esp: [12, 15, 18], fmt: "1.22 × 2.44 m", origen: "México",
      txt: "Triplay de pino nacional para cimbra.", usos: ["Cimbra"] },
    { id: "cimbra-durax", g: "cimbra", n: "Cimbra Dura X Natural", foto: "c_durax", origen: "México",
      txt: "Alta durabilidad y mayor reutilización: pensada para cimbra intensiva.", usos: ["Cimbra intensiva"], datos: [["Reutilizaciones", "Hasta 10 usos"]] },

    /* Cimbras de especialidad */
    { id: "film-birch", g: "especial", n: "Cimbra Film Ruso Birch", m: "m_cimbra_rusa", foto: "e_birch", esp: [15, 18], fmt: "1.22 × 2.44 m", origen: "Rusia",
      txt: "Fabricada con abedul de alta densidad. La opción premium por su gran resistencia y excelente acabado.",
      usos: ["Concreto aparente", "Cimbra intensiva"], datos: [["Reutilizaciones", "Hasta 100 usos"]], destacado: true },
    { id: "film-tulsa", g: "especial", n: "Cimbra Film Tulsa", m: "m_film", foto: "e_tulsa", esp: [15, 18], fmt: "1.22 × 2.44 m", origen: "Chile",
      txt: "Alta calidad y control en fabricación, con excelente desempeño estructural. Caras revestidas con film fenólico café y cantos sellados de fábrica. Recomendada para concreto con tratamiento posterior: pintado, estucado, etc.",
      usos: ["Concreto con acabado posterior", "Cimbra intensiva"],
      datos: [["Reutilizaciones", "Hasta 20 usos"], ["Film fenólico", "125 g/m²"], ["Resina fenólica", "65%"]],
      tip: "Sella los cantos antes de usarla y aplica desmoldante antes de iniciar y después de cada descimbrado.", destacado: true },
    { id: "film-mdo", g: "especial", n: "Cimbra MDO Canto Plata 1/C", foto: "e_mdo", origen: "México",
      txt: "Hecha en México sobre triplay Uruply, con recubrimiento especial de acabado muy liso y cantos sellados. Ideal para concreto aparente.",
      usos: ["Concreto aparente"], datos: [["Reutilizaciones", "Hasta 8 usos"]] },
    { id: "film-asiatico", g: "especial", n: "Cimbra Film asiático", m: "m_film", esp: [15, 18], fmt: "1.22 × 2.44 m", origen: "Asia",
      txt: "Triplay para cimbra con recubrimiento film.", usos: ["Cimbra"] },

    /* OSB y celotex */
    { id: "osb-americano", g: "osb", n: "OSB americano", m: "m_osb_b", esp: [11, 15, 18], fmt: "1.22 × 2.44 m", origen: "EUA",
      txt: "Tablero de astillas orientadas: resistencia estructural, cara rugosa antideslizante y cantos sellados contra la humedad.",
      usos: ["Muros", "Techumbres", "Tabiques", "Pisos", "Cimbra", "Embalaje"] },
    { id: "osb-europeo", g: "osb", n: "OSB europeo", m: "m_osb_a", esp: [11, 15, 18], fmt: "1.22 × 2.44 m", origen: "Europa",
      txt: "Tablero de astillas orientadas para estructura: resistente y estable.", usos: ["Muros", "Techumbres", "Tabiques", "Pisos", "Embalaje"] },
    { id: "osb-asiatico", g: "osb", n: "OSB asiático", m: "m_osb_b", esp: [11, 15, 18], fmt: "1.22 × 2.44 m", origen: "Asia",
      txt: "Tablero de astillas orientadas para estructura y embalaje.", usos: ["Muros", "Tabiques", "Embalaje"] },
    { id: "celotex", g: "osb", n: "Celotex impregnado", m: "m_celotex", esp: [12], fmt: "1.22 × 2.44 m",
      txt: "Tablero de fibra impregnado de 12 mm.", usos: ["Construcción"] },

    /* Triplay de pino */
    { id: "pino-uruguayo", g: "pino", n: "Triplay de pino uruguayo Uruply", m: "m_pino_uruguayo", foto: "p_uruply_bc", esp: [9, 12, 15, 18], fmt: "1.22 × 2.44 m", origen: "Uruguay",
      txt: "Uruply BC: buena cara estética, ligero y versátil; el mejor balance entre costo y apariencia. Uruply BCX: calidad industrial para carpintería económica.",
      usos: ["Muebles", "Interiores", "Carpintería"], destacado: true },
    { id: "pino-chileno", g: "pino", n: "Triplay de pino chileno", m: "m_pino_chileno", foto: "p_eagon", esp: [3.2, 4.5, 5, 9, 12, 15, 18], fmt: "1.22 × 2.44 m", origen: "Chile",
      txt: "Pino radiata. Eagon BC es más uniforme y confiable: mejor consistencia en calidad para muebles y construcción ligera.",
      usos: ["Muebles", "Construcción ligera"] },
    { id: "pino-argentino", g: "pino", n: "Triplay de pino argentino CMPC BC", foto: "p_cmpc", origen: "Argentina",
      txt: "Pino taeda de calidad media-alta, con buena uniformidad y resistencia: equilibrio entre precio, resistencia y acabado.",
      usos: ["Muebles", "Carpintería"] },
    { id: "pino-asiatico", g: "pino", n: "Triplay de pino asiático", m: "m_pino_asiatico", foto: "p_asia", esp: [9, 12, 15, 18], fmt: "1.22 × 2.44 m", origen: "Asia",
      txt: "Calidades AB / BC. Muy accesible y ligero: buena opción para muebles económicos.", usos: ["Muebles económicos"] },
    { id: "pino-nacional", g: "pino", n: "Triplay de pino nacional", m: "m_pino_nacional", esp: [3.2, 5, 9, 12, 15, 18], fmt: "1.22 × 2.44 m", origen: "México",
      txt: "Triplay de pino de producción nacional, en la gama más amplia de espesores.", usos: ["Carpintería", "Muebles"] },

    /* Triplay fino */
    { id: "fino-encino", g: "fino", n: "Triplay de encino", m: "m_encino", esp: [4.5, 18], fmt: "1.22 × 2.44 m",
      txt: "Calidad A/A en caras: acabado premium para muebles finos.", usos: ["Muebles de diseño", "Cocinas integrales", "Clósets", "Paneles decorativos"], destacado: true },
    { id: "fino-parota", g: "fino", n: "Triplay de parota", m: "m_parota", esp: [4.5, 18], fmt: "1.22 × 2.44 m",
      txt: "Calidad A/A en caras: acabado premium para muebles finos.", usos: ["Muebles de diseño", "Puertas de tambor", "Paneles decorativos"] },
    { id: "fino-nogal", g: "fino", n: "Triplay de nogal", m: "m_nogal", esp: [4.5, 18], fmt: "1.22 × 2.44 m",
      txt: "Calidad A/A en caras: acabado premium para muebles finos.", usos: ["Muebles de diseño", "Cocinas integrales", "Clósets"] },
    { id: "fino-cedro", g: "fino", n: "Triplay de cedro asiático", m: "m_cedro", esp: [4.5, 18], fmt: "1.22 × 2.44 m", origen: "Asia",
      txt: "Calidad A/A en caras: acabado premium para muebles finos.", usos: ["Muebles de diseño", "Clósets", "Paneles decorativos"] },
    { id: "fino-tzalam", g: "fino", n: "Triplay de tzalam", m: "m_tzalam", esp: [4.5, 18], fmt: "1.22 × 2.44 m",
      txt: "Chapa de tzalam con veta seleccionada para mueblería y revestimientos.", usos: ["Muebles de diseño", "Revestimientos"] },
    { id: "fino-rosa-morada", g: "fino", n: "Triplay de rosa morada", m: "m_rosa_morada", esp: [4.5, 18], fmt: "1.22 × 2.44 m",
      txt: "Chapa de rosa morada para mueblería y revestimientos.", usos: ["Muebles de diseño", "Revestimientos"] },
    { id: "fino-caobilla", g: "fino", n: "Triplay de caobilla", m: "m_caobilla", esp: [2.4, 4.2, 12, 15, 18], fmt: "1.22 × 2.44 m",
      txt: "Maderas tropicales con apariencia de caoba: color café claro a rojizo, veta recta o ligeramente ondulada, fáciles de cortar, cepillar y barnizar.",
      usos: ["Muebles", "Puertas y marcos", "Carpintería en general"] },
    { id: "fino-albasia", g: "fino", n: "Triplay de albasia", m: "m_albasia", foto: "f_albasia2", esp: [4.2, 12, 15, 18], fmt: "1.22 × 2.44 m", origen: "Indonesia",
      txt: "Madera amarillo muy claro, ligera, de veta recta y gran resistencia: fácil de mecanizar, dar forma, tornear y tallar. Árbol de rápido crecimiento (3 a 5 años).",
      usos: ["Muebles", "Tallado", "Carpintería"], datos: [["Humedad", "8 a 12%"]] },
    { id: "fino-cumala", g: "fino", n: "Triplay de cumala", m: "m_cumala", esp: [3, 6, 9, 12, 15, 18], fmt: "1.22 × 2.44 m", origen: "América tropical",
      txt: "Tropical blanda, de beige a rojizo, fácil de trabajar.", usos: ["Muebles básicos", "Carpintería"] },
    { id: "fino-eucalipto", g: "fino", n: "Triplay de eucalipto", m: "m_eucalipto", esp: [4.5, 9], fmt: "1.22 × 2.44 m",
      txt: "Triplay con chapa de eucalipto.", usos: ["Carpintería", "Revestimientos"] },

    /* MDF */
    { id: "mdf-arauco-nacional", g: "mdf", n: "MDF Arauco nacional", m: "m_mdf_arauco", esp: [3, 9, 12, 15, 18, 25], origen: "México",
      txt: "Tablero de fibra de densidad media: superficie lisa y homogénea, ideal para pintura y fácil de cortar y fresar.", usos: ["Muebles", "Decoración", "Diseño modular"], destacado: true },
    { id: "mdf-arauco-chileno", g: "mdf", n: "MDF Arauco chileno", m: "m_mdf_chileno", esp: [3, 5.5, 9, 12, 15, 18], origen: "Chile",
      txt: "Tablero de fibra de densidad media: superficie lisa y homogénea, ideal para pintura y fácil de mecanizar.", usos: ["Muebles", "Decoración"] },
    { id: "mdf-tecnotabla", g: "mdf", n: "MDF Tecnotabla", m: "m_mdf_tecnotabla", esp: [5.5, 9, 12, 15, 18],
      txt: "Tablero de fibra de densidad media para mueblería y decoración.", usos: ["Muebles", "Decoración"] },
    { id: "mdf-duraplay", g: "mdf", n: "MDF Duraplay", m: "m_mdf_nacional", esp: [9, 12, 15, 18],
      txt: "Tablero de fibra de densidad media para mueblería y decoración.", usos: ["Muebles", "Decoración"] },
    { id: "mdf-masisa", g: "mdf", n: "MDF Masisa", m: "m_mdf_nacional", esp: [12, 15, 18],
      txt: "Tablero de fibra de densidad media para mueblería y decoración.", usos: ["Muebles", "Decoración"] },
    { id: "mdf-tailandes", g: "mdf", n: "MDF tailandés", m: "m_mdf_tailandes", esp: [3, 4.5, 9, 12, 15, 18], origen: "Tailandia",
      txt: "Tablero de fibra de densidad media para mueblería y decoración.", usos: ["Muebles", "Decoración"] },
    { id: "mdf-chino", g: "mdf", n: "MDF chino", m: "m_mdf_chino", esp: [3, 4.5, 9, 12, 15, 18], origen: "China",
      txt: "Tablero de fibra de densidad media, opción económica.", usos: ["Muebles", "Decoración"] },

    /* MDF enchapado y recubierto */
    { id: "ench-encino", g: "enchapado", n: "MDF enchapado encino", m: "m_encino", foto: "mdf_chapa", esp: [4.5, 12, 15, 18],
      txt: "MDF con chapa de madera natural. Seleccionamos chapas grado A/B alto (menos nudos y parches, vetas continuas) y más gruesas, para un mejor lijado y acabado sin riesgo de traspase.",
      usos: ["Muebles finos", "Clósets", "Proyectos personalizados"], destacado: true },
    { id: "ench-nogal", g: "enchapado", n: "MDF enchapado nogal", m: "m_nogal", foto: "mdf_chapa", esp: [4.5, 12, 15, 18],
      txt: "MDF con chapa de madera natural grado A/B alto: vetas continuas y chapa más gruesa para un mejor acabado.", usos: ["Muebles finos", "Clósets", "Proyectos personalizados"] },
    { id: "ench-okume", g: "enchapado", n: "MDF enchapado okume", m: "m_okume", foto: "mdf_chapa", esp: [4.5, 12, 15, 18],
      txt: "MDF con chapa natural de okume: la estabilidad del MDF con la estética auténtica de la madera.", usos: ["Muebles", "Clósets", "Proyectos personalizados"] },
    { id: "ench-blanco", g: "enchapado", n: "MDF blanco", m: "m_blanco", esp: [4.5, 15, 18],
      txt: "MDF con recubrimiento blanco, listo para armar.", usos: ["Muebles", "Clósets", "Cocinas"] },
    { id: "ench-alto-brillo", g: "enchapado", n: "MDF alto brillo blanco", m: "m_alto_brillo", esp: [15, 18],
      txt: "MDF blanco con acabado efecto espejo.", usos: ["Cocinas", "Frentes de mueble"] },
    { id: "ench-ranurado-nacional", g: "enchapado", n: "Ranurado nacional", m: "m_ranurado", esp: [18], fmt: "1.22 × 2.44 m", origen: "México",
      txt: "Panel ranurado de 18 mm para exhibición.", usos: ["Exhibidores", "Tiendas"] },
    { id: "ench-ranurado-asiatico", g: "enchapado", n: "Ranurado asiático", m: "m_ranurado", esp: [18], fmt: "1.22 × 2.44 m", origen: "Asia",
      txt: "Panel ranurado de 18 mm para exhibición.", usos: ["Exhibidores", "Tiendas"] },

    /* Aglomerados y MDP */
    { id: "aglo-natural", g: "aglomerado", n: "Aglomerado natural", m: "m_aglomerado", esp: [4.5, 6, 9, 12, 15, 18],
      txt: "Tablero de partículas sin recubrimiento: económico para estructura y fondos de mueble.", usos: ["Estructura de muebles", "Fondos"] },
    { id: "aglo-blanco", g: "aglomerado", n: "Aglomerado laminado blanco", m: "m_aglo_blanco", esp: [4.5, 15, 18],
      txt: "Aglomerado con recubrimiento blanco, listo para armar.", usos: ["Muebles", "Clósets", "Oficina"] },
    { id: "mdp-nature", g: "aglomerado", n: "MDP Nature", m: "m_eucalipto", esp: [15, 18],
      txt: "Tablero MDP con acabado tipo madera.", usos: ["Muebles", "Clósets"] },
    { id: "mdp-unicolor", g: "aglomerado", n: "MDP Unicolor", m: "m_blanco", esp: [15, 18],
      txt: "Tablero MDP en acabado liso de un solo color.", usos: ["Muebles", "Clósets"] },

    /* Maderas aserradas */
    ...[
      ["cedro", "Cedro", "m_a_cedro"], ["caoba", "Caoba", "m_a_caoba"], ["parota", "Parota", "m_a_parota"],
      ["tzalam", "Tzalam", "m_a_tzalam"], ["nogal", "Nogal", "m_nogal"], ["tornillo", "Tornillo", "m_a_tornillo"],
      ["poplar", "Poplar", "m_a_poplar"], ["red-oak", "Encino Red Oak", "m_a_redoak"], ["banak", "Banak", "m_a_banak"],
      ["marupa", "Marupa", "m_a_marupa"],
    ].map(([id, n, m]) => ({
      id: "aserrada-" + id, g: "aserrada", n: "Madera de " + n.toLowerCase().replace("encino red oak", "encino Red Oak"), m,
      esp: ['1"', '1 ½"', '2"'], unidad: "pieza",
      txt: n + " aserrado en gruesos de 1\", 1 ½\" y 2\".", usos: ["Ebanistería", "Muebles", "Puertas"],
    })),

    /* Decks */
    { id: "deck-cumaru", g: "deck", n: "Deck de cumarú", m: "m_deck_cumaru", esp: ['¾"'], fmt: "¾\" × 3.5–5.5\" × 7' o más", unidad: "pieza",
      txt: "Madera tropical para decks y terrazas.", usos: ["Terrazas", "Exteriores"] },
    { id: "deck-teca", g: "deck", n: "Deck de teca", m: "m_deck_teca", esp: ['¾"'], fmt: "¾\" × 5.5\" × 7' o más", unidad: "pieza",
      txt: "Madera tropical para decks y terrazas.", usos: ["Terrazas", "Exteriores"] },

    /* Línea Ultra */
    { id: "ultra-melamina", g: "ultra", n: "Melamina Ultra", foto: "u_melamina", ultra: true,
      txt: "Tablero con sustrato MDF o aglomerado, recubierto con papel decorativo mediante presión y calor. La diferencia real está en la densidad: mejor corte, menor pandeo, mejor acabado y mayor vida útil de la herramienta. Catálogo curado de diseños que sí rotan, con inventario constante.",
      usos: ["Cocinas (parte baja)", "Clósets", "Muebles"], datos: [["Densidad", "690 kg/m³"]], destacado: true },
    { id: "ultra-high-gloss", g: "ultra", n: "Ultra High Gloss", foto: "u_altobrillo", ultra: true,
      txt: "Alto brillo laminado en PET sobre sustrato MDF: acabado efecto espejo, ecoamigable, con resistencia a rayos UV y resistencia estándar a rayaduras.",
      usos: ["Cocinas (parte alta)", "Frentes de mueble"], datos: [["Recubrimiento", "PET"]] },
    { id: "ultra-matt", g: "ultra", n: "Ultra Matt", foto: "u_matt", ultra: true,
      txt: "PET Matt laminado en plano sobre MDF: acabado sin reflejo, suave al tacto, que disimula huellas. Superficie uniforme, cerrada y altamente resistente.",
      usos: ["Cocinas (parte alta)", "Frentes de mueble", "Clósets"], datos: [["Recubrimiento", "PET Matt"]] },
    { id: "ultra-wpc", g: "ultra", n: "WPC para interiores", foto: "u_wpc2", ultra: true,
      txt: "Compuesto de fibra de madera y plástico: la apariencia de la madera con la resistencia del plástico. No se deforma con la humedad, no requiere mantenimiento y no le afectan las termitas. Instalación rápida en muros.",
      usos: ["Muros", "Revestimientos"] },
    { id: "ultra-pvc", g: "ultra", n: "PVC mármol", foto: "u_pvc", ultra: true, esp: [3], fmt: "122 × 290 cm",
      txt: "Lámina rígida de PVC para interiores que replica acabados tipo mármol en gran formato. Se instala con adhesivo de contacto, sin uniones visibles de piso a techo.",
      usos: ["Muros", "Baños", "Recepciones"], datos: [["Absorción de agua", "0%"], ["Resistencia al fuego", "Aprobado"], ["Formaldehído", "No detectable"]], hoja: [1.22, 2.9] },
  ],

  /* ───────── Asesor: 1ª pregunta → (2ª pregunta opcional) → productos ───────── */
  asesor: {
    q: "¿Qué vas a hacer?",
    ops: [
      { k: "Muebles y carpintería", icono: "mueble", sig: {
        q: "¿Qué buscas en el acabado?",
        ops: [
          { k: "Madera natural, acabado premium", r: ["fino-encino", "fino-nogal", "fino-parota", "ench-encino", "aserrada-tzalam"], por: "Chapas A/A y MDF enchapado con chapa grado A/B alto: vetas continuas y menos nudos." },
          { k: "Buena cara a buen precio", r: ["pino-uruguayo", "pino-argentino", "pino-chileno", "fino-caobilla"], por: "Uruply BC tiene el mejor balance costo-apariencia; CMPC y Eagon dan consistencia." },
          { k: "Pintar o laquear", r: ["mdf-arauco-nacional", "mdf-arauco-chileno", "mdf-tecnotabla"], por: "El MDF tiene superficie lisa y homogénea, ideal para pintura y fácil de fresar." },
          { k: "Lo más económico", r: ["pino-asiatico", "aglo-natural", "mdf-chino", "fino-cumala"], por: "Opciones accesibles y ligeras para mueble económico y estructura." },
        ] } },
      { k: "Cocina o clóset", icono: "cocina", sig: {
        q: "¿Qué parte del mueble?",
        ops: [
          { k: "Puertas y parte alta (lo que se luce)", r: ["ultra-high-gloss", "ultra-matt", "ench-alto-brillo"], por: "En la parte alta está el impacto visual: alto brillo o súper mate." },
          { k: "Cajonera y parte baja", r: ["ultra-melamina", "aglo-blanco", "ench-blanco"], por: "La melamina optimiza el costo del proyecto sin sacrificar acabado." },
          { k: "Todo en madera natural", r: ["ench-encino", "ench-nogal", "fino-encino"], por: "MDF enchapado: estabilidad del MDF con madera real." },
        ] } },
      { k: "Cimbra para concreto", icono: "cimbra", sig: {
        q: "¿Cuántas veces la vas a usar?",
        ops: [
          { k: "Una vez (uso temporal)", r: ["cimbra-brasil"], por: "La Brasil BG es la de precio más bajo, para 1 uso aprox." },
          { k: "3 a 4 usos", r: ["cimbra-uruguaya", "cimbra-brasil", "cimbra-argentina", "cimbra-china", "cimbra-chilena"], por: "Uruply CDX, Brasil y Argentina C+/C, China y Leonera: todas rinden de 3 a 4 usos." },
          { k: "Muchos usos (10 o más)", r: ["film-birch", "film-tulsa", "cimbra-durax"], por: "Ruso Birch hasta 100 usos, Film Tulsa hasta 20 y Dura X Natural hasta 10." },
          { k: "Concreto aparente, acabado liso", r: ["film-mdo", "film-birch", "cimbra-uruguaya"], por: "MDO Canto Plata: recubrimiento de acabado muy liso; también Uruply CDX lijado." },
        ] } },
      { k: "Muros, techos y pisos", icono: "casa", r: ["osb-americano", "osb-europeo", "osb-asiatico", "celotex"], por: "El OSB da resistencia estructural, cara antideslizante y cantos sellados contra humedad." },
      { k: "Revestir un muro", icono: "muro", r: ["ultra-pvc", "ultra-wpc", "fino-tzalam", "ench-ranurado-nacional"], por: "PVC mármol y WPC: impacto visual sin proceso, listos para instalar." },
      { k: "Terraza o exterior", icono: "sol", r: ["deck-cumaru", "deck-teca"], por: "Maderas tropicales para decks." },
      { k: "Exhibidores o tienda", icono: "tienda", r: ["ench-ranurado-nacional", "ench-ranurado-asiatico", "ench-blanco"], por: "Panel ranurado de 18 mm para exhibición." },
    ],
  },

  tiposCliente: ["Carpintero", "Constructora", "Mueblería", "Distribuidor", "Arquitecto / diseñador", "Otro"],
};
