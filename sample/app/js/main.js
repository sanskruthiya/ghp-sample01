const map = L.map('map', {
    zoomControl: true,
    zoomSnap: 1,
    minZoom: 1,
    maxZoom: 28
}).setView([35.7815,139.6922],15);

const bounds = [[90,-180], [-90,180]];
map.setMaxBounds(bounds);

const basemap_osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors,<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',maxZoom: 28});
const basemap_gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',maxZoom: 18});

L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

//const svg1 = 'vending.svg'
//const iconURL = 'data:app/css/svg/svg1+xml;base64,' + btoa(svg1);
//const iconURL = 'app/css/svg/vending.svg';

//const venderIcon = L.icon({iconUrl:iconURL})

const shelter_Marker = L.AwesomeMarkers.icon({icon:'heart', markerColor:'red'});
const power_Marker = L.AwesomeMarkers.icon({icon:'plug', markerColor:'orange'});
const water_Marker = L.AwesomeMarkers.icon({icon:'tint', markerColor:'blue'});
//const power_Marker = L.icon({icon:iconUrl});
//const water_Marker = L.icon({icon:iconUrl});

const boundary_style = {"fillColor":"red", "color":"transparent"};
const hazard_layer = new L.geoJson(json_hazard, {style:boundary_style});


function onEachFeature_shelter(feature, layer){
    if (feature.properties && feature.properties.name){
        const popupContent = feature.properties.name;
        const popupStyle = L.popup({autoPan:false}).setContent(popupContent);
        layer.bindPopup(popupStyle);
    }
}

function onEachFeature_power(feature, layer){
    if (feature.properties && feature.properties.name){
        const popupContent = feature.properties.name;
        const popupStyle = L.popup({autoPan:false}).setContent(popupContent);
        layer.bindPopup(popupStyle);
    }
}

function onEachFeature_water(feature, layer){
    if (feature.properties && feature.properties.name){
        const popupContent = feature.properties.name;
        const popupStyle = L.popup({autoPan:false}).setContent(popupContent);
        layer.bindPopup(popupStyle);
    }
}

const position_Marker = L.icon.pulse({iconSize:[20,20],fillColor:'rgba(144,238,144,0.8)',color:'green',heartbeat:1.5, animate:true});
const position_layer = L.marker([35.7815,139.6922], {icon: position_Marker});

const shelter_layer = new L.geoJson(json_shelter, {
                            onEachFeature: onEachFeature_shelter,
                            pointToLayer: function(feature, latlng){
                            return L.marker(latlng, {icon: shelter_Marker});
                            }
                        });

const power_layer = new L.geoJson(json_power, {
                            onEachFeature: onEachFeature_power,
                            pointToLayer: function(feature, latlng){
                            return L.marker(latlng, {icon: power_Marker});
                            }
                        });

const water_layer = new L.geoJson(json_water, {
                            onEachFeature: onEachFeature_water,
                            pointToLayer: function(feature, latlng){
                            return L.marker(latlng, {icon: water_Marker});
                            }
                        });

basemap_gsi.addTo(map);
hazard_layer.addTo(map);
shelter_layer.addTo(map);
power_layer.addTo(map);
water_layer.addTo(map);
position_layer.addTo(map);

const overlayMaps = {
    '避難所': shelter_layer,
    '電力': power_layer,
    '給水': water_layer,
    '危険区域': hazard_layer
};

const baseMaps = {  
    'マップ': basemap_osm,
    '衛星画像': basemap_gsi
};

L.control.layers(baseMaps, overlayMaps,{collapsed:true}).addTo(map);

L.control.locate({position:'topleft'}).addTo(map);
L.control.scale({maxWidth:150, metric:true, imperial:false, position: 'bottomleft'}).addTo(map);
