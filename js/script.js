var neighboorhood = "Vesterbro";


var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: {lat: 55.6760968, lng: 12.5683371},
        zoom: 15
    });
}