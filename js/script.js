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
	// getLatLng: function(location) {
	// 	var latlngURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location;
	// 	var result;
	// 	$.getJSON(latlngURL, function (data) {
	// 		var location = data.results[0].geometry.location;
	// 		console.log('fetching location')
	// 	}).done(function(e) {
	// 		console.log('location fetched')
	// 		return location
	// 	}).error(function(e) {
	// 		alert("Unable to fetch coordinates from google");
	// 	});
		//console.log(result)
		//return result
	//},

	addMarkers: function() {
		for (var i = 0; i < model.places().length; i++) {
			viewmodel.addMarker(model.places()[i]);
		}
	},

	addMarker: function(place) {
		view.markers.push(new google.maps.Marker({
			position: place.location,
			map: map,
			animation: google.maps.Animation.DROP,
			title: place.name,
			icon: place.icon
		}));
		view.markers[place.index].addListener('click', function() {
			viewmodel.openInfoWindow(place);
		});
	},

	openInfoWindow: function(place) {
		if (view.infowindow) {
			view.infowindow.close();
		};
		var website = 'No website';
		if (place.url) {
			website = '<a href="' + place.url + '">Website</a>';
		};
		view.infowindow = new google.maps.InfoWindow({
			content: '<b>' + place.name + '</b>' + '<br>' + 'Rating: ' + place.rating + '<br>' + website + '<br><i id="review">"' + place.review + '"</i>',
			maxWidth: 200
		});
		view.infowindow.open(map, view.markers[place.index]);
		view.markers[place.index].setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {view.markers[place.index].setAnimation(null); }, 750);
	},

	hideMarker: function(i) {
		view.markers[i].setMap(null);
	},

	showMarker: function(i) {
		view.markers[i].setMap(map);
	},

	listClick: function(data) {
		viewmodel.openInfoWindow(data);

	},

	listCatClick: function(index) {
		if (view.listExpand[index]()) {
			view.listExpand[index](false);
			for (var i = 0; i < model.places().length; i++) {
				if (model.places()[i].category == model.categories[index]) {
					viewmodel.hideMarker(i);
				}
			}
		} else {
			view.listExpand[index](true);
			for (var i = 0; i < model.places().length; i++) {
				if (model.places()[i].category == model.categories[index]) {
					viewmodel.showMarker(i);
				}
			}
		}
	},

	getFoursquare: function(foursquareURL, query, icon, numberOfRequests) {
		var URL = foursquareURL + query
		$.ajax({
			url: URL,
			dataType: "jsonp",
			error: function() {
				alert("Unable to fetch data from Foursquare");
			},
			complete: function(data) {
				for (var i = 0; i < data.responseJSON.response.groups[0].items.length; i++){
					//console.log(data.responseJSON.response.groups[0].items[i].venue.name);
					//console.log(data.responseJSON.response.groups[0].items[i].tips[0].text)
					var place = {
						name: data.responseJSON.response.groups[0].items[i].venue.name,
						location: {lat: data.responseJSON.response.groups[0].items[i].venue.location.lat, lng: data.responseJSON.response.groups[0].items[i].venue.location.lng},
						url: data.responseJSON.response.groups[0].items[i].venue.url,
						rating: data.responseJSON.response.groups[0].items[i].venue.rating,
						price: data.responseJSON.response.groups[0].items[i].venue.price,
						category: [query],
						icon: icon,
						index: model.places().length,
						review: data.responseJSON.response.groups[0].items[i].tips[0].text
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
	listExpand: [ko.observable(true),ko.observable(true),ko.observable(true),ko.observable(true)],
	infowindow: null
}

var model = {
	init: function() {
		console.log('model.init run');
		ko.applyBindings(model);
	},
	categories: ["food", "drinks", "coffee", "sights"],
	foursquareCounter: 0,
	listOpen: ko.observable(false),
	googleApiKey: 'AIzaSyCiUDq49n825eKvj7ecY7wW_Z3M0k3b-M4',
	//neighboorhood: 'Vesterbro, København',
	neighboorhoodLocation: { //55.6638947,12.54254    55.672308, 12.563953
		lat: 55.6699947,
		lng: 12.54854
	},
	places: ko.observableArray([]),
	foursquareURL: 'https://api.foursquare.com/v2/venues/explore?client_id=0ICNLWRURL412ESDGRHE1QBZ4UIPCAWSNEHZHGHKI4ERTHSC&client_secret=HNBI1JXSBGIGHUBRJT1Q14RJ1X1WW4OD5ZNZSHJWOEGSJFZQ&v=20130815&ll=55.6638947,12.54254&limit=20&query='
}

document.querySelector( "#nav-toggle" )
  .addEventListener( "click", function() {
	this.classList.toggle( "active" );
	if (model.listOpen() == false) {
		model.listOpen(true);
	} else {
		model.listOpen(false);
	}
  });




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