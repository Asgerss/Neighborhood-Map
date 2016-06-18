var viewmodel = {
    init: function() {
        console.log('viewModel.init run')
        //console.log(model.neighboorhood)
        model.init();
        //console.log(model.neighboorhoodLocation);
    },
    // get lat and lng from google
    // skal kunne håndtere flere resultater
    getLatLng: function(location) {
        var latlngURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location;
        var result;
        $.getJSON(latlngURL, function (data) {
            var location = data.results[0].geometry.location;
            console.log('fetching location')
        }).done(function(e) {
            console.log('location fetched')
            return location
        }).error(function(e) {
            console.log("error");
        });
        //console.log(result)
        //return result
    }
}

var view = {

}

var model = {
    init: function() {
        console.log('model.init run');
    },
    googleApiKey: 'AIzaSyCiUDq49n825eKvj7ecY7wW_Z3M0k3b-M4',
    neighboorhood: 'Vesterbro, København',
    neighboorhoodLocation: {
        lat: 55.6638947,
        lng: 12.54254
    }
}


var foursquareURL = 'https://api.foursquare.com/v2/venues/explore?client_id=0ICNLWRURL412ESDGRHE1QBZ4UIPCAWSNEHZHGHKI4ERTHSC&client_secret=HNBI1JXSBGIGHUBRJT1Q14RJ1X1WW4OD5ZNZSHJWOEGSJFZQ&v=20130815&ll=55.6638947,12.54254&query=resturant';
var getFoursquare = function(foursquareURL) {
    $.ajax({
        url: foursquareURL,
        dataType: "jsonp",
        complete: function(data) {
            for (var i = 0; i < data.responseJSON.response.groups[0].items.length; i++){
                //console.log(data.responseJSON.response.groups[0].items[i].venue);
                var markerLoc = {lat: data.responseJSON.response.groups[0].items[i].venue.location.lat, lng: data.responseJSON.response.groups[0].items[i].venue.location.lng};
                var markerTitle = data.responseJSON.response.groups[0].items[i].venue.name;
                addMarker(markerLoc, markerTitle);
            }
        }
    })
};

var markerLatLng = {lat: 55.6638947, lng: 12.54254};
var infowindow;
var addMarker = function(markerLatLng, markerTitle) {
    infowindow = new google.maps.InfoWindow({
        content: markerTitle
    });
    var marker = new google.maps.Marker({
        position: markerLatLng,
        map: map,
        title: markerTitle
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

getFoursquare(foursquareURL);
// var changeLoc = function(){
//     console.log("change location");
//     map.map.setCenter(new google.maps.LatLng( 45, 19 ) )
// }
//console.log(model.neighboorhoodLocation)
//test = viewmodel.getLatLng(model.neighboorhood);

viewmodel.init();

var map;
function initMap() {
    console.log('initMapRun')
    map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: {lat: model.neighboorhoodLocation.lat, lng: model.neighboorhoodLocation.lng},
        zoom: 15
    });
}