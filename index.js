let map;

// equals true when zoomed on a region, equals false when zoomed out
let regionZoom = false;

// rinky dinky and super inefficent db
const regions = {
  ontario: {coord: [44.468994, -78.150035], oneBed: 'value', twoBed: 2638, color:'value', title: 'Ontario', 
    cities: {toronto: {coord: [43.710820, -79.394462], oneBed: 2443, twoBed: 3198}, mississauga: {coord: [43.595824, -79.652415]}, oneBed: 2364, twoBed: 2764}},
  bColumbia: {coord: [49.396733, -123.419986], oneBed: 'value', twoBed: 2902, color:'value', title: 'British Columbia', 
    cities: {vancouver: {coord: [49.259500, -123.106539], oneBed: 2761, twoBed: 3666}, burnaby: {coord: [49.233502, -122.985689], oneBed: 2566, twoBed: 3184}}},
  alberta: {coord: [52.203687, -113.643362], oneBed: 'value', twoBed: 1986, color:'value', title: 'Alberta', 
    cities: {calgary: {coord: [51.038020, -114.073305], oneBed: 1751, twoBed: 2157}, edmonton: {coord: [53.538191, -113.497395], oneBed: 1389, twoBed: 1789}}},
  manitoba: {coord: [50.272672, -98.293368], oneBed: 'value', twoBed: 1781, color:'value', title: 'Manitoba',
    cities: {winnipeg: {coord: [49.887948, -97.138026], oneBed: 1442, twoBed: 1799}}},
  nScotia: {coord: [45.0778, -63.5467], oneBed: 'value', twoBed: 2670, color:'value', title: 'Nova Scotia', 
    cities: {halifax: {coord: [44.649121, -63.591530], oneBed: 2050, twoBed: 2506}}},
  sask: {coord: [51.118269, -105.579977], oneBed: 'value', twoBed: 1432, color:'value', title: 'Saskatchewan',
    cities: {regina: {coord: [50.450855, -104.618047], oneBed: 1334, twoBed: 1541}, saskatoon: {coord: [52.134032, -106.646741]}}},
  quebec: {coord: [45.970168, -72.634898], oneBed: 'value', twoBed: 2159, color:'value', title: 'Quebec', 
    cities: {montreal: {coord:[45.521425, -73.619292], oneBed: 1756, twoBed: 2295}, gatineau: {coord:[45.451650, -75.698136], oneBed: 1736, twoBed: 1937}}},
};

// basic sleep helper function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// get cursor position in pixels
function getCursor(event) {
    let x = event.clientX;
    let y = event.clientY;
    let _position = `X: ${x}<br>Y: ${y}`;
    console.log(_position)
    /*
    const infoElement = document.getElementById('info');
    infoElement.innerHTML = _position;
    infoElement.style.top = y + "px";
    infoElement.style.left = (x + 20) + "px";
    */
    }

// assign a colour value to each region based off rent cost
const setRegionColor = (place = regions) => {
  // make the object parsable
  const entries = Object.entries(place);

  // create fraction for how many items in colour range
  const fraction = 255 / entries.length;

  // sort regions based on twobed price low to high
  entries.sort((a, b) => a[1].twoBed - b[1].twoBed);

  // assign a colour value to each region based on its average 2 bed cost
  // blue == low, red == high
  entries.forEach((item, index) => {
    const redValue = Math.round(fraction * index);
    const blueValue = 255 - Math.round(fraction * index);
    
    const clampedRed = Math.min(255, Math.max(0, redValue));
    const clampedBlue = Math.min(255, Math.max(0, blueValue));

    item[1].color = `rgb(${clampedRed}, 0, ${clampedBlue})`;
  });
  
 
};

setRegionColor()

function createPosition (x,y){
  return { lat: x, lng: y }
}

// async map function, is called based on map events
async function initMap() {
  
  // default position on load
  const canadaDefault = { lat: 56.1304, lng: -106.3468 };
  
  // library import declarations
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");


  //map setup
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: canadaDefault,
    mapId: "CANADA_MAP",
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    scaleControl: true,
  });
  
  let markerCoord = (lat=56.1304, lng=-106.3468) => new google.maps.LatLng(lat, lng);
  
  const coordInfoWindow = new google.maps.InfoWindow();
  coordInfoWindow.setPosition(canadaDefault);
  coordInfoWindow.open(map);
  

  // provincial geojson load
  map.data.loadGeoJson(
    "./maps/canada.geojson"
  )

  // set default styles for provinces
  map.data.setStyle({
    clickable: true,
    strokeColor: 'white',
    fillOpacity: 0,
  });

  // set region line opacity to lower when zoomed,
  // and increase while zoomed out
  google.maps.event.addListener(map,'zoom_changed',(event)=>{
    const zoomLevel = map.getZoom();
        map.data.setStyle(() => {
          return {
            strokeOpacity: zoomLevel < 10 ? 0.4 : 0.7,
          };
       });
  });

  // declartions for cursor following div box
  const hoverInfo = document.createElement('div');
  document.body.appendChild(hoverInfo);

  // if mouse is on map
  map.data.addListener('mouseover', function(event) {
    // store name if over a region (province)
    const selection = event.feature.getProperty("name");
    console.log('Selection:', selection)

    // make object parsable
    const areas = Object.entries(regions);
    areas.forEach((item,index)=>{

      if(regionZoom == true){
        // turn of region fill on hover if zoomed in
        return map.data.overrideStyle(event.feature, {fillOpacity: 0})
      }else{
        // if not zoomed in, make region fill the same colour as stroke
        item[1].title == event.feature.getProperty('name') ? map.data.overrideStyle(event.feature, {fillColor: item[1].color, fillOpacity: 0.3}) : false;
      }
    }
  )
  
});

  // turn off fill when mouse not over region
  map.data.addListener('mouseout', event => {
    map.data.overrideStyle(event.feature, {fillOpacity: 0})
  })
  
// assign stroke colors for each region(feature) on load
  map.data.addListener('addfeature', function(event) {
    const area = Object.entries(regions);
    area.forEach((item, index)=>{
      item[1].title == event.feature.getProperty('name') ? map.data.overrideStyle(event.feature, {strokeColor: item[1].color}): false;
      event.feature.getProperty ('name') == 'Northwest Territories' || event.feature.getProperty ('name') ==  'Newfoundland and Labrador' 
      || event.feature.getProperty ('name') == 'Nunavut' || event.feature.getProperty ('name') == 'New Brunswick' 
      || event.feature.getProperty ('name') == 'Prince Edward Island' || event.feature.getProperty ('name') == 'Yukon Territory' 
      ? map.data.overrideStyle(event.feature, {strokeOpacity: 0, fillOpacity: 0}) : false;
    })
 
  });

 // over-complicated switch case for when a region(feature) is clicked
 // for each region it will zoom in, set center, and update info text
  map.data.addListener('mouseup', (event) => {
    const selection = event.feature.getProperty("name")
    Object.entries(regions).forEach((item, index)=>{
      const cityCost = ` City: ${Object.keys(item[1].cities)[0]} onebed: ${Object.values(item[1].cities)[0].oneBed} two bed: ${Object.values(item[1].cities)[0].twoBed}`
      console.log('title: ',item[1].title,  currentRegion.textContent, 'info: ', cityCost)
      item[1].title == selection ? currentRegionInfo.textContent = cityCost: currentRegion.textcontent = 'Canada';})
    switch(selection){
      case 'Ontario':
        map.setZoom(7)
        map.setCenter({lat: regions.ontario.coord[0], lng: regions.ontario.coord[1]});
        currentRegion.textContent = `Current region: ${selection}`;
        regionZoom = true;
        map.setOptions({gestureHandling: 'none'})
        break;
      case 'British Columbia':
        map.setZoom(8)
        map.setCenter({lat: regions.bColumbia.coord[0], lng: regions.bColumbia.coord[1]});
        currentRegion.textContent = `Current region: ${selection}`;
        map.setOptions({gestureHandling: 'none'})
        regionZoom = true;
        break;
      case 'Alberta':
        map.setZoom(7)
        map.setCenter({lat: regions.alberta.coord[0], lng: regions.alberta.coord[1]});
        currentRegion.textContent = `Current region: ${selection}`;
        map.setOptions({gestureHandling: 'none'})
        regionZoom = true;
        break;
      case 'Quebec':
        map.setZoom(8)
        map.setCenter({lat: regions.quebec.coord[0], lng: regions.quebec.coord[1]});
        currentRegion.textContent = `Current region: ${selection}`;
        map.setOptions({gestureHandling: 'none'})
        regionZoom = true;
        break;
      case 'Saskatchewan':
        map.setZoom(8);
        map.setCenter({lat: regions.sask.coord[0], lng: regions.sask.coord[1]});
        currentRegion.textContent = `Current region: ${selection}`;
        map.setOptions({gestureHandling: 'none'})
        regionZoom = true;
        break;
      case 'Manitoba':
        map.setZoom(8);
        map.setCenter({lat: regions.manitoba.coord[0], lng: regions.manitoba.coord[1]});
        currentRegion.textContent = `Current region: ${selection}`;
        map.setOptions({gestureHandling: 'none'})
        regionZoom = true;
        break;
      case 'Nova Scotia':
        map.setZoom(8);
        map.setCenter({lat: regions.nScotia.coord[0], lng: regions.nScotia.coord[1]});
        map.setOptions({gestureHandling: 'none'})
        currentRegion.textContent = `Current region: ${selection}`;
        regionZoom = true;
        break
        
      default:
        currentRegion.textContent = 'Canada';
        map.setOptions({gestureHandling: 'auto'})
    }
      
      //currentRegion.textContent = `Current region: ${selection}`;
      

    
  })

  // supporting element creation
  const areaInfo = document.createElement('div');
  const defaultZoom = document.createElement('button');
  const currentRegion = document.createElement('p');
  const currentRegionInfo = document.createElement('p')
  currentRegion.textcontent = 'Current region: Canada'
  defaultZoom.textContent = 'return to canada';
  
  areaInfo.appendChild(defaultZoom);
  areaInfo.appendChild(currentRegion);
  areaInfo.appendChild(currentRegionInfo)
  areaInfo.setAttribute('class','info-div');
  areaInfo.setAttribute('id', 'info-div')
  defaultZoom.addEventListener('click', (event) => {
    currentRegion.textContent = 'Current region: Canada'
    
    coordInfoWindow.setContent(currentRegion);
    map.setCenter(canadaDefault);
    map.setZoom(4);
    regionZoom = false;
    console.log('regionzoom: ', regionZoom)
    currentRegion.textcontent = 'Canada';
    currentRegionInfo.textContent = 'Average rent price: 2299'
  })
  
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(areaInfo);
}



window.initMap = initMap();
