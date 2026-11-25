import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.19.0/dist/maplibre-gl.mjs';

document.getElementById("boton-leyenda").addEventListener("click", ocultaLeyenda);
function ocultaLeyenda() {
  var x = document.getElementById("state-legend");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

const map = new maplibregl.Map({
  container: 'map', // container ID
  style: 'https://tiles.openfreemap.org/styles/positron', // style URL
  center: [-70.602, -33.471], // starting position
  zoom: 11 // starting zoom
});


//controles

// zoom y rotación
map.addControl(new maplibregl.NavigationControl(), "top-left");

//pantalla completa
map.addControl(new maplibregl.FullscreenControl(), "top-left");

//geolocalización
let geoloc = new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
});

map.addControl(geoloc, "top-left");

//capas externas
map.on("load", () => {

  //añade fuente tramos
  map.addSource('fuente-catastro', {
    'type': 'geojson',
    'data': 'datos/catastro-2025.geojson',
  });


  // añade capa tramos
  map.addLayer({
    "id": "capa-tramos",
    "type": "line",
    "source": "fuente-catastro",
    // "source-layer": "tramos",
    "filter": ["match", ["get", "_inválida"], ["1"], false, true],
    "layout": { "line-cap": "square", "line-join": "round" },
    "paint": {
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        12,
        2,
        15,
        5
      ],
      "line-opacity": 0.75,
      "line-color": "#F44336",
    }
  });

  // popup al hacer clic en un tramo
  map.on('click', 'capa-tramos', (e) => {
    const p = e.features[0].properties;

    const html = `
  <strong>EJE: ${p.nombre}</strong>
  <p>
    COMUNA: ${p._comuna}<br>
    LONGITUD (km): ${p.km}<br>
    DIRECCIONALIDAD: ${p._tipo}<br>
    EMPLAZAMIENTO: ${p._emplazamiento}<br>
    ANCHO (cm): ${p._ancho_cm}
  </p>
  <div class="contenedor-youtube">
    <iframe
      width="100%" height="100%"
      src="https://www.youtube.com/embed/${p.video_id}?autoplay=0&origin=${encodeURIComponent(location.origin)}"
      title="Video 360"
      frameborder="0"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowfullscreen>
    </iframe>
  </div>
`;

    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setMaxWidth("300px")
      .setHTML(html)
      .addTo(map);
  });

  // Cursor de puntero sobre la capa (se registra una sola vez)
  map.on('mouseenter', 'capa-tramos', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'capa-tramos', () => {
    map.getCanvas().style.cursor = '';
  });


  function colorSimple() {
    map.setPaintProperty('capa-tramos', 'line-color', "#EF6C00");

    let leyendaSimple = `
  <h5>SIMPLE</h5>
  <div><span style='background-color: #EF6C00'></span>ciclovías</div>
  `

    //cambia contenido de leyenda
    document.getElementById("leyenda-contenidos").innerHTML = leyendaSimple;
  };

  function colorNorma() {
    map.setPaintProperty('capa-tramos', 'line-color',
      [
        "match",
        ["get", "_eval_graduada_pedal_clasif"],
        ["buena"],
        "#8BC34A",
        ["regular"],
        "#ffeb3b",
        ["mala"],
        "#ff9800",
        ["muy mala"],
        "#F44336",
        "#000000"
      ]
    );

    let leyendaNormas = `
  <h5>CUMPLIMIENTO NORMAS DE DISEÑO</h5>
  <div><span style='background-color: #8BC34A'></span>alto</div>
  <div><span style='background-color: #ffeb3b'></span>medio</div>
  <div><span style='background-color: #ff9800'></span>bajo</div>
  <div><span style='background-color: #F44336'></span>muy bajo</div>
  `

    //cambia contenido de leyenda
    document.getElementById("leyenda-contenidos").innerHTML = leyendaNormas;

  };

  function colorEmplazamiento() {
    map.setPaintProperty('capa-tramos', 'line-color',
      [
        "match",
        ["get", "_emplazamiento"],
        ["calzada"],
        "#29B6F6",
        ["parque"],
        "#9CCC65",
        "#EF5350"
      ]
    );

    let leyendaEmplazamiento = `
  <h5>EMPLAZAMIENTO</h5>
  <div><span style='background-color: #29B6F6'></span>por la calle</div>
  <div><span style='background-color: #9CCC65'></span>por un parque</div>
  <div><span style='background-color: #EF5350'></span>por la acera u otro lugar</div>
  `

    //cambia contenido de leyenda
    document.getElementById("leyenda-contenidos").innerHTML = leyendaEmplazamiento;
  };

function colorAñoConstrucción() {
  map.setPaintProperty('capa-tramos', 'line-color',
    [
      "step",
      ["get", "año"],
      "#BDBDBD",       // < 1995 o sin dato: gris
      1995, "#F0F921", // 1995–1999: amarillo
      2000, "#FCA636", // 2000–2004: naranja
      2005, "#E16462", // 2005–2009: coral
      2010, "#B12A90", // 2010–2014: magenta
      2015, "#6A00A8", // 2015–2019: violeta
      2020, "#0D0887"  // 2020–2025: violeta oscuro/índigo
    ]
  );

    let leyendaAñoConstrucción = `
  <h5>EMPLAZAMIENTO</h5>
  <div><span style='background-color: #F0F921'></span>1995–1999</div>
  <div><span style='background-color: #FCA636'></span>2000–2004</div>
  <div><span style='background-color: #E16462'></span>2005–2009</div>
  <div><span style='background-color: #B12A90'></span>2010–2014</div>
  <div><span style='background-color: #6A00A8'></span>2015–2019</div>
  <div><span style='background-color: #0D0887'></span>2020–2025</div>
  `

    //cambia contenido de leyenda
    document.getElementById("leyenda-contenidos").innerHTML = leyendaAñoConstrucción;
  };

  document.getElementById("selector").onchange = changeListener;

  function changeListener() {
    var value = this.value
    console.log(value);

    if (value == "simple") {
      colorSimple()
    } else if (value == "normas") {
      colorNorma()
    } else if (value == "emplazamiento") {
      colorEmplazamiento()
    } else if (value == "año_construcción") {
      colorAñoConstrucción()
    }
  }

  // estado inicial coherente con el selector
  colorSimple();
})