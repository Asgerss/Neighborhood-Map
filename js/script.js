var viewmodel = {
	// Function for initialize foursquare data fetch
	init: function() {
		console.log('viewModel.init run');
		ko.applyBindings(model);
		viewmodel.getFoursquare(model.foursquareURL, 'food', 'images/icons/food.png', 4);
		viewmodel.getFoursquare(model.foursquareURL, 'drinks', 'images/icons/drinks.png', 4);
		viewmodel.getFoursquare(model.foursquareURL, 'coffee', 'images/icons/coffee.png', 4);
		viewmodel.getFoursquare(model.foursquareURL, 'sights', 'images/icons/sights.png', 4);
	},
	// Function for handling hamburger icon animation and opening and closing the list
	menuToggle: function(){
		document.querySelector( "#nav-toggle" ).classList.toggle( "active" );
		if (model.listOpen() === false) {
			model.listOpen(true);
		} else {
			model.listOpen(false);
		}
	},
	// Function for adding markers for all places
	addMarkers: function() {
		for (var i = 0; i < model.places().length; i++) {
			viewmodel.addMarker(model.places()[i]);
		}
	},
	// Function for adding a marker to the map
	addMarker: function(place) {
		view.markers.push(new google.maps.Marker({
			position: place.location,
			map: model.map,
			animation: google.maps.Animation.DROP,
			title: place.name,
			icon: place.icon
		}));
		view.markers[place.index].addListener('click', function() {
			viewmodel.openInfoWindow(place);
		});
	},
	// Function for creating info windows and animating markers
	openInfoWindow: function(place) {
		if (view.infowindow) {
			view.infowindow.close();
		}
		var website = 'No website';
		if (place.url) {
			website = '<a href="' + place.url + '">Website</a>';
		}
		view.infowindow = new google.maps.InfoWindow({
			content: '<b>' + place.name + '</b>' + '<br>' + 'Rating: ' + place.rating + '<br>' + website + '<br><i id="review">"' + place.review + '"</i>',
			maxWidth: 200
		});
		view.infowindow.open(model.map, view.markers[place.index]);
		view.markers[place.index].setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {view.markers[place.index].setAnimation(null); }, 750);
	},
	// Function for hiding a single marker
	hideMarker: function(i) {
		view.markers[i].setMap(null);
	},
	// Function for showing a single marker
	showMarker: function(i) {
		view.markers[i].setMap(model.map);
	},
	// Function for opening a info window when a place in the list is clicked
	listClick: function(data) {
		viewmodel.openInfoWindow(data);
	},
	// Function for collapsing and expanding the list categories and hiding and showing the corresponding markers on the map
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
	// Function for fetching data from foursquare
	getFoursquare: function(foursquareURL, query, icon, numberOfRequests) {
		var URL = foursquareURL + query;
		$.ajax({
			url: URL,
			dataType: "jsonp",
			error: function() {
				alert("Unable to fetch data from Foursquare");
			},
			complete: function(data) {
				for (var i = 0; i < data.responseJSON.response.groups[0].items.length; i++){
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
					// Check whether it's the last request
					if (i == data.responseJSON.response.groups[0].items.length - 1) {
						model.foursquareCounter ++;
					}
					if (model.foursquareCounter == numberOfRequests) {
						viewmodel.addMarkers();
						model.foursquareCounter = 0;
					}
				}
			}
		});
	}
};

var view = {
	markers: [],
	listExpand: [ko.observable(true),ko.observable(true),ko.observable(true),ko.observable(true)],
	infowindow: null
};

var model = {
	categories: ["food", "drinks", "coffee", "sights"],
	foursquareCounter: 0,
	listOpen: ko.observable(false),
	googleApiKey: 'AIzaSyCiUDq49n825eKvj7ecY7wW_Z3M0k3b-M4',
	neighboorhoodLocation: {
		lat: 55.6699947,
		lng: 12.54854
	},
	places: ko.observableArray([]),
	map: null,
	// Function for creating a new map in the mapContainer div
	initMap: function() {
		console.log('initMapRun');
		model.map = new google.maps.Map(document.getElementById('mapContainer'), {
			center: {lat: model.neighboorhoodLocation.lat, lng: model.neighboorhoodLocation.lng},
			zoom: 16,
			disableDefaultUI: true
		});
	},
	foursquareURL: 'https://api.foursquare.com/v2/venues/explore?client_id=0ICNLWRURL412ESDGRHE1QBZ4UIPCAWSNEHZHGHKI4ERTHSC&client_secret=HNBI1JXSBGIGHUBRJT1Q14RJ1X1WW4OD5ZNZSHJWOEGSJFZQ&v=20130815&ll=55.6638947,12.54254&limit=20&query='
};

viewmodel.init();