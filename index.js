let map;

// bool for triggering event listeners on window
let activeWindow = false; 

// allows functions to reference current city
let activeCity = ''

// default position`
const canadaDefault = { lat: 56.1304, lng: -106.3468 };

// allows functions to know which region is focused on
let focusedRegion = 'Canada'

// equals true when zoomed on a region, equals false when zoomed out
let regionZoom = false;

// rinky dinky and super inefficent db
// TODO: all cities now must have a color, title, and window value
// so drop marker can be placed for cities
const regions = {
  bColumbia: {coord: [54.324821, -124.861467], oneBed: 'value', twoBed: 2902, color:'value', title: 'British Columbia', window : {},
    cities: {vancouver: {coord: [49.259500, -123.106539], boundry: './maps/vancouver.geojson', color: '', window: {}, title: 'Vancouver', oneBed: 2761, twoBed: 3666}, burnaby: {coord: [49.233502, -122.985689], oneBed: 2566, twoBed: 3184}}},
  alberta: {coord: [55.648427, -115.083635], oneBed: 'value', twoBed: 1986, color:'value', title: 'Alberta', window : {},
    cities: {calgary: {coord: [51.038020, -114.073305], boundry: './maps/calgary.geojson', color: '', window: {}, title: 'Calgary', oneBed: 1751, twoBed: 2157}, edmonton: {coord: [53.538191, -113.497395], oneBed: 1389, twoBed: 1789}}},
  sask: {coord: [54.503829, -105.986955], oneBed: 'value', twoBed: 1432, color:'value', title: 'Saskatchewan', window : {},
    cities: {regina: {coord: [50.450855, -104.618047], boundry: './maps/regina.geojson', color: '', window: {}, title: 'Regina', oneBed: 1334, twoBed: 1541}, saskatoon: {coord: [52.134032, -106.646741]}}},
  manitoba: {coord: [55.636027, -97.022111], oneBed: 'value', twoBed: 1781, color:'value', title: 'Manitoba', window : {},
    cities: {winnipeg: {coord: [49.887948, -97.138026], boundry: './maps/winnipeg.geojson', color: '', window: {}, title: 'Winnipeg', oneBed: 1442, twoBed: 1799}}},
  ontario: {coord: [51.269352, -86.514159], oneBed: 'value', twoBed: 2638, color:'value', title: 'Ontario', window : {},
    cities: {toronto: {coord: [43.710820, -79.394462], boundry: './maps/toronto.geojson', color: '', window: {}, title: 'Toronto', oneBed: 2443, twoBed: 3198}, mississauga: {coord: [43.595824, -79.652415], oneBed: 2364, twoBed: 2764}}},
  quebec: {coord: [51.120750, -72.991588], oneBed: 'value', twoBed: 2159, color:'value', title: 'Quebec', window : {},
    cities: {montreal: {coord:[45.521425, -73.619292], boundry: './maps/montreal.geojson', color: '', window: {}, title: 'Montreal', oneBed: 1756, twoBed: 2295}, gatineau: {coord:[45.451650, -75.698136], oneBed: 1736, twoBed: 1937}}},
  nScotia: {coord: [45.0778, -63.5467], oneBed: 'value', twoBed: 2670, color:'value', title: 'Nova Scotia', window : {},
    cities: {halifax: {coord: [44.649121, -63.591530], boundry: './maps/halifax.geojson', color: '', window: {}, title: 'Halifax', oneBed: 2050, twoBed: 2506}}},
};

// region name list to search
const createRegionNamesArray = () => {
  const regionsObject = Object.entries(regions);
  let namesArray = [];
  regionsObject.forEach(item => namesArray.push(item[1].title));
  return namesArray;
} 

// drops a marker with given position and content
function dropMarker (position, content='lol'){
  let coord = { lat: position[0], lng: position[1] }
  const regionInfoWindow = new google.maps.InfoWindow();
  regionInfoWindow.setPosition(coord);
  regionInfoWindow.open(map);
  regionInfoWindow.setContent(content);
  return regionInfoWindow
}

function setWindowContent(region = regions){
  const windowContainer = document.createElement('div');
  windowContainer.setAttribute('class','window-container');
  
  const areaDetailsContainer = document.createElement('div');
  areaDetailsContainer.setAttribute('id','area-details-container')

  const areaName = document.createElement('h2');
  areaName.textContent = region.title;
 
  // adds an h4 under region name to identify its expensive-ness
  const areaAnalysis = document.createElement('h4');
  const redColorValue = region.color.slice(4).split(',')[0]
  
  // assigns text based on how red (expensive) the region is
  if(redColorValue > -1 && redColorValue < 50){
    areaAnalysis.textContent = 'Very affordable';
  } else if (redColorValue > 50 && redColorValue < 100){
    areaAnalysis.textContent = 'Affordable';
  } else if (redColorValue > 100 && redColorValue < 150){
    areaAnalysis.textContent = 'Not affordable';
  } else if (redColorValue > 150 && redColorValue < 200){
    areaAnalysis.textContent = 'Expensive';
    areaAnalysis.style = ('font-weight: bold;')
  } else {
    areaAnalysis.textContent = 'EXTREMELY EXPENSIVE'
    areaAnalysis.style = ('font-weight: bolder; font-size: 1.1rem')
  }

  areaAnalysis.style = (`color: ${region.color};`);
  

  const areaCost = document.createElement('p');
  areaCost.textContent = `Two bedroom cost: $${region.twoBed}`;
  areaDetailsContainer.appendChild(areaCost);

  if(region.cities != undefined){
    const areaCities = document.createElement('div');
    areaCities.setAttribute('id','area-cities');
    areaCities.textContent = 'Cities:'

    Object.entries(Object.keys(region.cities)).forEach((item, index) => {
      const cityName =  item[1].charAt(0).toUpperCase() + item[1].slice(1);
      const city = document.createElement('p');
      city.textContent = cityName;
      city.setAttribute('id',`city-${item[1]}`)
      areaCities.appendChild(city); 
    })

    areaDetailsContainer.appendChild(areaCities);
} 
  const backButton = document.createElement('button');
  backButton.textContent = 'back'

  backButton.addEventListener('click', (event) => {
    map.setOptions({gestureHandling: 'auto'})
    map.setCenter(canadaDefault);
    map.setZoom(4);
    regionZoom = false;
    region.window.close()
    activeWindow = false;
  })

  windowContainer.appendChild(areaName);
  windowContainer.appendChild(areaAnalysis)
  windowContainer.appendChild(areaDetailsContainer);
  windowContainer.appendChild(backButton);

  activeWindow = true;
  return windowContainer
}

// sets default content and parameters for a specified region
function regionFocus(name){
  const regionObjects = Object.entries(regions);
  regionObjects.forEach((item) => {
    if(item[1].title == name){
      map.setZoom(6)
      map.setCenter({lat: item[1].coord[0], lng: item[1].coord[1]});
      // using unupdated focusedRegion value to close last region window
      regionObjects.forEach((item)=>{
        if (item[1].title == focusedRegion){
          item[1].window.close() 
          activeWindow = false
        }
      })
      focusedRegion = item[1].title;
      regionZoom = true;
      map.setOptions({gestureHandling: 'none'})
      const windowContainer = setWindowContent(item[1])

      const infoMarker = dropMarker(item[1].coord, windowContainer);

      item[1].window = infoMarker;
    }
  })

}

// basic sleep helper function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// assign a colour value to each region based off rent cost
// TODO: refactor for use based off of average income
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

// async map function, is called based on map events
async function initMap() {

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
  
  // provincial geojson load
  map.data.loadGeoJson(
    "./maps/canada.geojson"
  )

  // set default styles for provinces
  map.data.setStyle({
    clickable: true,
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

  // hover colour state
  map.data.addListener('mouseover', function(event) {
    // store name if over a region (province)
    const selection = event.feature.getProperty("name");
    console.log('Selection:', selection)

    // make object parsable
    const areas = Object.entries(regions);
    areas.forEach((item)=>{
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

 // for each region it will zoom in, set center, and update info text
  map.data.addListener('mouseup', (event) => {
    const selection = event.feature.getProperty("name")
    Object.entries(regions).forEach((item, index)=>{
      const cityCost = ` City: ${Object.keys(item[1].cities)[0]} onebed: ${Object.values(item[1].cities)[0].oneBed} two bed: ${Object.values(item[1].cities)[0].twoBed}`
      item[1].title == selection ? currentRegionInfo.textContent = cityCost: currentRegion.textcontent = 'Canada';})
      regionFocus(selection);
      currentRegion.textContent = `Current region: ${selection}`;
  })

  // city targeting if name clicked
  const mapDiv = document.getElementById('map');
  mapDiv.addEventListener('click',(event)=>{
    if (activeWindow){
      if(event.target.id.search('city') != -1){
        console.log(focusedRegion)
        const cityKey = event.target.textContent.toLowerCase();
        let currRegion = Object;
        Object.entries(regions).forEach((item,index) => {
          if(item[1].title == focusedRegion){
            currRegion = item[1];
          }
        })
        console.log(currRegion)
        Object.entries(currRegion.cities).forEach((city)=>{
          if (city[0] == cityKey){
            map.setCenter({lat: city[1].coord[0], lng: city[1].coord[1]})
            map.setZoom(11);
            map.data.setStyle({
              clickable: true,
              fillOpacity: 0,
              strokeOpacity: 0,
              clickable: false,
            });
           
            // create new data layer so styles can be edited seperately
            // from region data layer
            const cityDataLayer = new google.maps.Data();
            cityDataLayer.loadGeoJson(city[1].boundry);
            cityDataLayer.setMap(map);
            cityDataLayer.setStyle({
              fillOpacity: 0, 
              strokeOpacity: 0.25,
              visible: true,
            })
            city[1].window = dropMarker(city[1].coord,setWindowContent(city[1]))
            
            map.setOptions({gestureHandling: 'auto'})
            
            // this is just for testing so i can get back to country map
            // replace with button on city info window
            cityDataLayer.addListener('click',event =>{
              cityDataLayer.setMap(null)
              regionFocus(focusedRegion);
              city[1].window.close()
            })
          }
        })
      }
  };
})

  
  // supporting element creation
  const areaInfo = document.createElement('div');
  const defaultZoom = document.createElement('button');
  const currentRegion = document.createElement('p');
  const currentRegionInfo = document.createElement('p')
  currentRegion.textcontent = 'Current region: Canada'
  defaultZoom.textContent = 'return to canada';

  //interface ui
  const interfaceContainer = document.createElement('div');
  interfaceContainer.setAttribute('id','interface');

  // create left navigate button
  const navigateLeft = document.createElement('button');
  navigateLeft.setAttribute('id','nav-left');
  navigateLeft.textContent = '<-';
  interfaceContainer.appendChild(navigateLeft);

  navigateLeft.addEventListener('click',() => {
    const names = createRegionNamesArray();
    const currentPosition = names.indexOf(focusedRegion);
    console.log('left arrow click, current position: ', currentPosition);
    currentPosition == 0 ? regionFocus(names[names.length-1]) : regionFocus(names[currentPosition-1]);
  })

  // add info in the middle so buttons are on left and right
  interfaceContainer.appendChild(areaInfo);

  // create right navigate button
  const navigateRight = document.createElement('button');
  navigateRight.setAttribute('id','nav-right');
  navigateRight.textContent = '->';
  interfaceContainer.appendChild(navigateRight);
  navigateRight.addEventListener('click',(event)=>{
    const names = createRegionNamesArray();
    const currentPosition = names.indexOf(focusedRegion);
    console.log('right arrow click, current position: ', currentPosition);
    currentPosition == names.length-1 ? regionFocus(names[0]) : regionFocus(names[currentPosition+1])
  })

 

  // legacy info, to be factored out
  areaInfo.appendChild(currentRegion);
  areaInfo.appendChild(currentRegionInfo);
  areaInfo.appendChild(defaultZoom);
  areaInfo.setAttribute('class','info-div');
  areaInfo.setAttribute('id', 'info-div')
  
  
  // add elements to map at given position for overlay
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(interfaceContainer);
}



window.initMap = initMap();
