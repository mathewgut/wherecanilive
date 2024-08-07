// Initialize and add the map
let map;

async function initMap() {
  // The location of Uluru
  const position = { lat: 56.1304, lng: -106.3468 };
  // Library imports
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "DEMO_MAP_ID",
    
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Canada",
  });


  map.data.loadGeoJson(
    "./geojson/canada.geojson"
  )

  for(let i in map.data){
    console.log(i)
  }

  map.data.forEach(area => {
    map.data.overrideStyle(area, {strokeColor: 'green'})
  });

  map.data.setStyle({
    clickable: true,
    strokeColor: 'white'
  });


  map.data.addListener('mouseover', function(event) {
    const selection = event.feature.getProperty("name");
    console.log('attributes: ', selection)
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {fillColor: 'yellow'});
  });
  
  map.data.addListener('click', (event) => {
    const selection = event.feature.getProperty("name")
    alert(selection)
    console.log('lol')
  })
}

window.initMap = initMap();
