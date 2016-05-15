      function initMap() {
        var origin_place_id = null;
        var destination_place_id = null;
        var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: 28.6139, lng: 77.2090},
          zoom: 9,
          scrollwheel:false,
           
           mapTypeId:google.maps.MapTypeId.ROADMAP
        });
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#8b0013", editable:false,strokeOpacity:0.8,strokeWeight:2 } });
        directionsDisplay.setMap(map);

        var origin_input = document.getElementById('pac-input');
        var destination_input = document.getElementById('pac-input2');
        

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
        

        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        origin_autocomplete.bindTo('bounds', map);
        var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
        destination_autocomplete.bindTo('bounds', map);

        
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
	//	       var path = result.routes[0].overview_path;
	//	       bounds = routeBoxer.box(path, distance);

	//	       searchBounds(bounds);              
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });

          }
}   