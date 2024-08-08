let map;

const regions = {
  ontario: {coord: [44.468994, -78.150035], oneBed: 'value', twoBed: 2638, color:'value', title: 'Ontario'},
  bColumbia: {coord: [49.396733, -123.419986], oneBed: 'value', twoBed: 2902, color:'value', title: 'British Columbia'},
  //nWTerritories: {coord: 'value', oneBed: 'value', twoBed: 'value', color:'value'},
  alberta: {coord: [52.203687, -113.643362], oneBed: 'value', twoBed: 1986, color:'value', title: 'Alberta'},
  manitoba: {coord: [50.272672, -98.293368], oneBed: 'value', twoBed: 1781, color:'value', title: 'Manitoba'},
  nScotia: {coord: [63.5467,-45.0778], oneBed: 'value', twoBed: 2670, color:'value', title: 'Nova Scotia'},
  sask: {coord: [50.538716, -104.938586], oneBed: 'value', twoBed: 1432, color:'value', title: 'Saskatchewan'},
  //PEI: {coord: 'value', oneBed: 'value', twoBed: 'value', color:'value'},
  quebec: {coord: [45.970168, -72.634898], oneBed: 'value', twoBed: 2159, color:'value', title: 'Quebec'},
};

const setRegionColor = () => {
  const entries = Object.entries(regions);

  // Calculate the fraction value
  const fraction = 255 / entries.length;

  // Sort entries based on `twoBed` value
  entries.sort((a, b) => a[1].twoBed - b[1].twoBed);

  // Iterate over the sorted entries and assign colors
  entries.forEach((entry, index) => {
    const redValue = Math.round(fraction * index);
    const blueValue = 255 - Math.round(fraction * index);

    // Ensure color values are within the 0-255 range
    const clampedRed = Math.min(255, Math.max(0, redValue));
    const clampedBlue = Math.min(255, Math.max(0, blueValue));

    // Update the color property
    entry[1].color = `rgb(${clampedRed}, 0, ${clampedBlue})`;
  });

  // Convert sorted entries back to an object
  const sortedRegions = Object.fromEntries(entries);

  return sortedRegions;
};

console.log(setRegionColor())


async function initMap() {
  // The location of Uluru
  const position = { lat: 56.1304, lng: -106.3468 };
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "CANADA_MAP",
    gestureHandling: "none",
    zoomControl: false,
  });

  map.data.loadGeoJson(
    "./maps/canada.geojson"
  )

  map.data.setStyle({
    clickable: true,
    strokeColor: 'white',
    fillOpacity: 0,
  });

  map.data.addListener('mouseover', function(event) {
    const selection = event.feature.getProperty("name");
    console.log('attributes: ', selection)

    const areas = Object.entries(regions);
    areas.forEach((item,index)=>{
      item[1].title == event.feature.getProperty('name') ? map.data.overrideStyle(event.feature, {fillColor: item[1].color, fillOpacity: 0.3}) : false;
      
    })
    
    map.data.addListener('mouseout', event => {
      map.data.overrideStyle(event.feature, {fillOpacity: 0})
    })
  });

  map.data.addListener('addfeature', function(event) {
    // TODO: replace with a foreach method
    console.log('Feature added:', event.feature.getProperty('name'));
    event.feature.getProperty('name') == 'Ontario' ? map.data.overrideStyle(event.feature, {strokeColor:regions.ontario.color}) : false;
    event.feature.getProperty('name') == 'Saskatchewan' ? map.data.overrideStyle(event.feature, {strokeColor:regions.sask.color}) : false;
    event.feature.getProperty('name') == 'Manitoba' ? map.data.overrideStyle(event.feature, {strokeColor:regions.manitoba.color}) : false;
    event.feature.getProperty('name') == 'Alberta' ? map.data.overrideStyle(event.feature, {strokeColor:regions.alberta.color}) : false;
    event.feature.getProperty('name') == 'British Columbia' ? map.data.overrideStyle(event.feature, {strokeColor:regions.bColumbia.color}) : false;
    event.feature.getProperty('name') == 'Quebec' ? map.data.overrideStyle(event.feature, {strokeColor:regions.quebec.color}) : false;
    event.feature.getProperty('name') == 'Nova Scotia' ? map.data.overrideStyle(event.feature, {strokeColor:regions.nScotia.color}) : false;
    if(event.feature.getProperty('name') == 'Northwest Territories' 
    || event.feature.getProperty('name') == 'Newfoundland and Labrador' 
    || event.feature.getProperty('name') == 'Nunavut'
    || event.feature.getProperty('name') == 'New Brunswick'
    || event.feature.getProperty('name') == 'Prince Edward Island'
    || event.feature.getProperty('name') == 'Yukon Territory'){
      map.data.overrideStyle(event.feature, {strokeOpacity: 0})
    }
  });

  // TODO: Replace with foreach method
  map.data.addListener('click', (event) => {
    const selection = event.feature.getProperty("name")
    switch(selection){
      case 'Ontario':
        map.setZoom(6.5)
        map.setCenter({lat: regions.ontario.coord[0], lng: regions.ontario.coord[1]});
        break;
      case 'British Columbia':
        map.setZoom(8)
        map.setCenter({lat: regions.bColumbia.coord[0], lng: regions.bColumbia.coord[1]});
        break;
      case 'Alberta':
        map.setZoom(7)
        map.setCenter({lat: regions.alberta.coord[0], lng: regions.alberta.coord[1]});
        break;
      case 'Quebec':
        map.setZoom(8)
        map.setCenter({lat: regions.quebec.coord[0], lng: regions.quebec.coord[1]});
        break;
      case 'Saskatchewan':
        map.setZoom(8);
        map.setCenter({lat: regions.sask.coord[0], lng: regions.sask.coord[1]});
        break;
      case 'Manitoba':
        map.setZoom(8);
        map.setCenter({lat: regions.manitoba.coord[0], lng: regions.manitoba.coord[1]});
        break;
      case 'Nova Scotia':
        map.setZoom(8);
        map.setCenter({lat: regions.nScotia.coord[0], lng: regions.nScotia.coord[1]});
      }
    
  })
  const areaInfo = document.createElement('div');
  const areaLocation = ''
  areaInfo.setAttribute('class','info-div');
  
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(areaInfo);
}



window.initMap = initMap();
