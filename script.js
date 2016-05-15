      function initMap() {
        var origin_place_id = null;
        var destination_place_id = null;
        var path = null;
        var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: 28.6139, lng: 77.2090},
          zoom: 9,
          scrollwheel:false,
           
           mapTypeId:google.maps.MapTypeId.ROADMAP
        });
        addEvent(window, 'load', addListeners, false);
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#8b0013", editable:false,strokeOpacity:0.8,strokeWeight:2 } });
        directionsDisplay.setMap(map);

        var origin_input = document.getElementById('pac-input');
        var destination_input = document.getElementById('pac-input2');
        var form = document.getElementById('radio-button-form');
        var radios = document.forms["display"].elements["key"];
		
// Antshant function displays on route stuff (atm/petrol-pump/restra)
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(form);
        var infowindow;
        var service = new google.maps.places.PlacesService(map);
        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        origin_autocomplete.bindTo('bounds', map);
        var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
        destination_autocomplete.bindTo('bounds', map);
        
       function optcheck(e) {
       	var thing1 = e.target;
       	antshant(path,thing1.value);
		    
		}

        function addListeners(e) {
		  addEvent(document.getElementById('rb1'), 'click', optcheck, false);
		  addEvent(document.getElementById('rb2'), 'click', optcheck, false);
		  addEvent(document.getElementById('rb3'), 'click', optcheck, false);
		 }

		 function addEvent(elm, evType, fn, useCapture)
		// cross-browser event handling for IE5+, NS6+ and Mozilla/Gecko
		// By Scott Andrew
		{
		  if (elm.addEventListener) {
		    elm.addEventListener(evType, fn, useCapture);
		    return true;
		  } else if (elm.attachEvent) {
		    var r = elm.attachEvent('on' + evType, fn);
		    return r;
		  } else {
		    elm['on' + evType] = fn;
		  }
		}


        function expandViewportToFitPlace(map, place) {
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
        }

        origin_autocomplete.addListener('place_changed', function() {
          var place = origin_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          origin_place_id = place.place_id;
          route(origin_place_id, destination_place_id,
                directionsService, directionsDisplay);
        });

        destination_autocomplete.addListener('place_changed', function() {
          var place = destination_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          destination_place_id = place.place_id;
          route(origin_place_id, destination_place_id,
                directionsService, directionsDisplay);
        });
       // var routeboxer = new RouteBoxer();
	//	var dist = 0.01; // km

        function route(origin_place_id, destination_place_id, directionsService, directionsDisplay) {
          if (!origin_place_id || !destination_place_id) {
            return;
          }
          directionsService.route({
            origin: {'placeId': origin_place_id},
            destination: {'placeId': destination_place_id},
            travelMode: google.maps.TravelMode.DRIVING,
    		avoidTolls: true,
 			 unitSystem: google.maps.UnitSystem.METRIC
          }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
		       // Box around the overview path of the first route
		       path = response.routes[0].overview_path;
		       alert(path.length);
	//	       bounds = routeBoxer.box(path, distance);

	//	       searchBounds(bounds);              
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });

          }


          function antshant(path,keyword){
          	for(var i=0; i<path.length; i=i+5)
          	{
          		infowindow = new google.maps.InfoWindow();
		        service.nearbySearch({
		          location: path[i],
		          radius: 200,
		          type: [keyword]
		        }, callback);

          	}
          	//alert(path.length);
          }
	      function callback(results, status) {
	        if (status == google.maps.places.PlacesServiceStatus.OK) {
	          for (var i = 0; i < results.length; i++) {
	            createMarker(results[i]);
	          }
	        }
	      }

	      function createMarker(place) {
	        var placeLoc = place.geometry.location;
	        var marker = new google.maps.Marker({
	          map: map,
	          position: place.geometry.location
	        });

	        google.maps.event.addListener(marker, 'click', function() {
	          infowindow.setContent(place.name);
	          infowindow.open(map, this);
	        });
	      }

}   