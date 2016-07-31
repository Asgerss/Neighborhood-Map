var viewmodel = {
    init: function() {
        console.log('viewModel.init run')
        //console.log(model.neighboorhood)
        model.init();
        viewmodel.getFoursquare(model.foursquareURL, 'food', 'images/icons/food.png', 4),
        viewmodel.getFoursquare(model.foursquareURL, 'drinks', 'images/icons/drinks.png', 4),
        viewmodel.getFoursquare(model.foursquareURL, 'coffee', 'images/icons/coffee.png', 4),
        viewmodel.getFoursquare(model.foursquareURL, 'sights', 'images/icons/sights.png', 4)
        console.log("adding markers")
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
    },

    addMarkers: function() {
        for (var i = 0; i < model.places().length; i++) {
            viewmodel.addMarker(model.places()[i].location, model.places()[i].name, model.places()[i].icon);
        }
    },

    addMarker: function(markerLatLng, markerTitle, icon) {
        view.markers.push(new google.maps.Marker({
            position: markerLatLng,
            map: map,
            animation: google.maps.Animation.DROP,
            title: markerTitle,
            icon: icon
        }));
        var markerIndex = view.markers.length-1;
        view.markers[markerIndex].addListener('click', function() {
            viewmodel.markerBounceStop();
            view.markers[markerIndex].setAnimation(google.maps.Animation.BOUNCE);
        });
        view.markers[markerIndex].addListener('click', function() {
            if (view.infowindow) {
                view.infowindow.close();
            };
            view.infowindow = new google.maps.InfoWindow({
                content: '<b>' + this.title + '</b>'
            });
            view.infowindow.open(map, view.markers[markerIndex]);
        });
    },

    markerBounceStop: function() {
        for (var i = 0; i < view.markers.length; i++){
            view.markers[i].setAnimation(null);
        }
    },

    getFoursquare: function(foursquareURL, query, icon, numberOfRequests) {
        var URL = foursquareURL + query
        $.ajax({
            url: URL,
            dataType: "jsonp",
            complete: function(data) {
                for (var i = 0; i < data.responseJSON.response.groups[0].items.length; i++){
                    //console.log(data.responseJSON.response.groups[0].items[i].venue.name);
                    //console.log(data.responseJSON.response.groups[0].items[i])
                    var subcategory = [];
                    for (var j = 0; j < data.responseJSON.response.groups[0].items[i].venue.categories.length; j++){
                        subcategory.push(data.responseJSON.response.groups[0].items[i].venue.categories[j].name);
                        //console.log(data.responseJSON.response.groups[0].items[i].venue.categories[j].name);
                    };
                    var place = {
                        name: data.responseJSON.response.groups[0].items[i].venue.name,
                        location: {lat: data.responseJSON.response.groups[0].items[i].venue.location.lat, lng: data.responseJSON.response.groups[0].items[i].venue.location.lng},
                        url: data.responseJSON.response.groups[0].items[i].venue.url,
                        rating: data.responseJSON.response.groups[0].items[i].venue.rating,
                        price: data.responseJSON.response.groups[0].items[i].venue.price,
                        category: [query],
                        subcategory: subcategory,
                        icon: icon
                    };
                    model.places.push(place);
                    // Check wether it's the last request
                    if (i == data.responseJSON.response.groups[0].items.length - 1) {
                        model.foursquareCounter ++;
                    };
                    if (model.foursquareCounter == numberOfRequests) {
                        viewmodel.addMarkers();
                        model.foursquareCounter = 0;
                    }
                    //var markerLoc = {lat: data.responseJSON.response.groups[0].items[i].venue.location.lat, lng: data.responseJSON.response.groups[0].items[i].venue.location.lng};
                    //var markerTitle = data.responseJSON.response.groups[0].items[i].venue.name;
                    //viewmodel.addMarker(markerLoc, markerTitle, icon);
                    console.log("foursquare data fetched")
                }
            }
        })
    }
}

var view = {
    markers: [],
    infowindow: null
}

var model = {
    init: function() {
        console.log('model.init run');
    },
    foursquareCounter: 0,
    googleApiKey: 'AIzaSyCiUDq49n825eKvj7ecY7wW_Z3M0k3b-M4',
    neighboorhood: 'Vesterbro, København',
    neighboorhoodLocation: { //55.6638947,12.54254    55.672308, 12.563953
        lat: 55.6699947,
        lng: 12.54854
    },
    places: ko.observableArray([]),
    foursquareURL: 'https://api.foursquare.com/v2/venues/explore?client_id=0ICNLWRURL412ESDGRHE1QBZ4UIPCAWSNEHZHGHKI4ERTHSC&client_secret=HNBI1JXSBGIGHUBRJT1Q14RJ1X1WW4OD5ZNZSHJWOEGSJFZQ&v=20130815&ll=55.6638947,12.54254&limit=20&query=',
    seats: ko.observableArray([
        {name: "Steve"},
        {name: "Bert"}
    ])
}


$(".cross").hide();
$(".hamburger").click(function() {
    $(".hamburger").hide();
    $(".cross").show();
    document.getElementById("list").style.display = "block";
});
$(".cross").click(function() {
    $(".cross").hide();
    $(".hamburger").show();
    document.getElementById("list").style.display = "none";
});



ko.applyBindings(model);



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
        zoom: 16,
        disableDefaultUI: true
    });
}