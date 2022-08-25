function ocultaLeyenda() {
  var x = document.getElementById("state-legend");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

mapboxgl.accessToken = 'pk.eyJ1IjoiaWduYWNpb2FiZSIsImEiOiJsTDV0dWFJIn0.Og513NMky_08_sXUUDsrbA';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/ignacioabe/ckvslac5d15mq15pbeyn3nsfi', // style URL
  center: [-70.602, -33.471], // starting position
  zoom: 11 // starting zoom
});

// 11.04-33.471,

//controles

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(), "top-left");

//pantalla completa
map.addControl(new mapboxgl.FullscreenControl(), "top-left");

//geolocalización
let geoloc = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
});

map.addControl(geoloc, "top-left");

//capas externas
map.on("load", () => {

  //añade fuente tramos
  map.addSource("tramos", {
    "type": "vector",
    "url": "mapbox://ignacioabe.cldezmae"
  })


  // añade capa tramos
  map.addLayer({
    "id": "catastro-4kfr3c",
    "type": "line",
    "source": "tramos",
    "source-layer": "catastro-4kfr3c",
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
      "line-color": "#ff0000",
    }
  });

  //interactividad capa líneas
  // When a click event occurs on a feature in the states layer,
  // open a popup at the location of the click, with description
  // HTML from the click event's properties.
  map.on('click', 'catastro-4kfr3c', (e) => {
    let nombre = e.features[0].properties.nombre;
    let longitud = e.features[0].properties.km;
    let ancho = e.features[0].properties._ancho_cm
    let comuna = e.features[0].properties._comuna;
    let video = e.features[0].properties.video;
    // let ganancia_elev_neta = e.features[0].properties.ganancia_elev_neta;
    // let altura_inicial = e.features[0].properties.altura_inicial;
    // let altura_final = e.features[0].properties.altura_final;

    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`
      <strong>EJE: ${nombre}</strong>
      <p>
      COMUNA: ${comuna}<br>
      LONGITUD (km): ${longitud}<br>
      ANCHO (cm): ${ancho}<br>
      VIDEO: <a href="${video}" target="_blank">VIDEO</a>
      </p>
      `
      )
      .addTo(map);
  });

  // Change the cursor to a pointer when
  // the mouse is over the states layer.
  map.on('mouseenter', 'catastro-4kfr3c', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change the cursor back to a pointer
  // when it leaves the states layer.
  map.on('mouseleave', 'catastro-4kfr3c', () => {
    map.getCanvas().style.cursor = '';
  });

});

function colorEvaluación() {
  map.setPaintProperty('catastro-4kfr3c', 'line-color',
    [
      "interpolate",
      ["linear"],
      ["get", "_eval_estricta"],
      0,
      "hsl(0, 100%, 49%)",
      1,
      "hsl(230, 97%, 46%)"
    ]
  );
};

function colorEmplazamiento() {
  map.setPaintProperty('catastro-4kfr3c', 'line-color',
  [
    "match",
    ["get", "_emplazamiento"],
    ["calzada"],
    "#1976D2",
    ["parque"],
    "#388E3C",
    "#D32F2F"
  ]
  );
};
