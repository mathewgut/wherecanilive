// Initialize and add the map
let map;

const regions = {
  ontario: {coord: [44.468994, -78.150035], oneBed: 'value', twoBed: 'value', color:'value'},
  bColumbia: {coord: [50.212122, -121.980777], oneBed: 'value', twoBed: 'value', color:'value'},
  //nWTerritories: {coord: 'value', oneBed: 'value', twoBed: 'value', color:'value'},
  alberta: {coord: [52.203687, -113.643362], oneBed: 'value', twoBed: 'value', color:'value'},
  manitoba: {coord: [50.272672, -98.293368], oneBed: 'value', twoBed: 'value', color:'value'},
  nScotia: {coord: [63.5467,-45.0778], oneBed: 'value', twoBed: 'value', color:'value'},
  sask: {coord: [50.538716, -104.938586], oneBed: 'value', twoBed: 'value', color:'value'},
  //PEI: {coord: 'value', oneBed: 'value', twoBed: 'value', color:'value'},
  quebec: {coord: [45.970168, -72.634898], oneBed: 'value', twoBed: 'value', color:'value'},
};


async function initMap() {
  // The location of Uluru
  const position = { lat: 56.1304, lng: -106.3468 };
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "DEMO_MAP_ID",
    
  });

  map.data.loadGeoJson(
    "./maps/canada.geojson"
  )

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

  map.data.addListener('addfeature', function(event) {
    console.log('Feature added:', event.feature.getProperty('name'));
    event.feature.getProperty('name') == 'Ontario' ? map.data.overrideStyle(event.feature, {strokeColor: 'red'}) : false;
});

  
  map.data.addListener('click', (event) => {
    const selection = event.feature.getProperty("name")
    switch(selection){
      case 'Ontario':
        map.setZoom(6.5)
        map.setCenter({lat: regions.ontario.coord[0], lng: regions.ontario.coord[1]})
        break;
      case 'British Columbia':
        map.setZoom(8)
        map.setCenter({lat: regions.bColumbia.coord[0], lng: regions.bColumbia.coord[1]})
        break;
      case 'Alberta':
        map.setZoom(7)
        map.setCenter({lat: regions.alberta.coord[0], lng: regions.alberta.coord[1]})
        break;
      case 'Quebec':
        map.setZoom(8)
        map.setCenter({lat: regions.quebec.coord[0], lng: regions.quebec.coord[1]})
        break;
      case 'Saskatchewan':
        map.setZoom(8);
        map.setCenter({lat: regions.sask.coord[0], lng: regions.sask.coord[1]});
        break;
      case 'Manitoba':
        map.setZoom(8);
        map.setCenter({lat: regions.manitoba.coord[0], lng: regions.manitoba.coord[1]});
        break;
      }
    
  })
}

window.initMap = initMap();
