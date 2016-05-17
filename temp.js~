function initMap() {
        var origin_place_id = null;
        var destination_place_id = null;
        
        var path = null;
        var markcolor = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
        var marker1 = null; // This is the draggable marker
        var marker1LatLng = null;
        // Used to implement deleting the previous-draggable markers.
      //  var marker1Array = [];
        // Used to implement deleting the useless markers.
        var markerArray = [];
        // Initializing the map 
        var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: 28.6139, lng: 77.2090},
          zoom: 9,
          scrollwheel:false,
           mapTypeId:google.maps.MapTypeId.ROADMAP
        });

   		// Initializations for route() function.
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#8b0013", editable:false,strokeOpacity:0.8,strokeWeight:2 } });
        directionsDisplay.setMap(map);

        // Putting HTML elements over the map
        var origin_input = document.getElementById('pac-input');
        var destination_input = document.getElementById('pac-input2');
        var symbols = document.getElementById('radio-button-form');

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(symbols);

        // Initializations for auto-complete feature
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


        function route(origin_place_id, destination_place_id, directionsService, directionsDisplay) {
          if (!origin_place_id || !destination_place_id) {
            return;
          }
      		// Call deleteMarkers function to delete all previous markers
      		deleteMarkers();
          directionsService.route({
            origin: {'placeId': origin_place_id},
            destination: {'placeId': destination_place_id},
            travelMode: google.maps.TravelMode.DRIVING,
    		avoidTolls: true,
 			 unitSystem: google.maps.UnitSystem.METRIC
          }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {

              directionsDisplay.setDirections(response);
		       path = response.routes[0].overview_path;
		       // Lets create a draggable marker 
		       marker1 = new google.maps.Marker({
					  draggable: true,
					  position: path[0], 
					  map: map,
					  icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
					  title: "Your location"
					  });
		       markerArray.push(marker1);

		       marker1.addListener('dragend', function() {
		    	marker1LatLng = marker1.getPosition();  
		    	infowindow = new google.maps.InfoWindow();
        	service = new google.maps.places.PlacesService(map);

        	service.nearbySearch({
				        location: marker1LatLng,
				        radius: '200',
				        type: ['atm']
				        }, callback1);

        	service = new google.maps.places.PlacesService(map);
        	service.nearbySearch({
				        location: marker1LatLng,
				        radius: '200',
				        type: ['gas_station']
				        }, callback2);

			service = new google.maps.places.PlacesService(map);
        	service.nearbySearch({
				        location: marker1LatLng,
				        radius: '200',
				        type: ['restaurant']
				        }, callback3);
 	
		       }); 

            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });

          }

      
          function callback1(results, status){
         // 	window.alert(status);
          	if (status == google.maps.places.PlacesServiceStatus.OK) {
     //     		window.alert(results.length);
	          for (var i = 0; i < results.length; i++) {
	      		var place = results[i];       
	            var mark2 = new google.maps.Marker({
					  position: place.geometry.location, 
					  map: map,
					  icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
					  });
	            	            markerArray.push(mark2);
	          google.maps.event.addListener(mark2, 'click', function() {
        		var	infowindow = new google.maps.InfoWindow();	          	
	          infowindow.setContent(place.name);
	          infowindow.open(map, this);
	       });

	          }
	        }

          }

          function callback2(results, status){
          	if (status == google.maps.places.PlacesServiceStatus.OK) {
        //  		window.alert(results.length);
	          for (var i = 0; i < results.length; i++) {
	      		var place = results[i];	            
	            var mark2 = new google.maps.Marker({
					  position: results[i].geometry.location, 
					  map: map,
					  icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
					  });
	            	            markerArray.push(mark2);
	            google.maps.event.addListener(mark2, 'click', function() {
	            	infowindow = new google.maps.InfoWindow();
	          infowindow.setContent(place.name);
	          infowindow.open(map, this);
	        });

	          }
	        }

          }

          function callback3(results, status){
          	if (status == google.maps.places.PlacesServiceStatus.OK) {
    //      		window.alert(results.length);
	          for (var i = 0; i < results.length; i++) {
	            var place = results[i];
	            var mark2 = new google.maps.Marker({
					  position: results[i].geometry.location, 
					  map: map,
					  icon: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
					  });
	            	            markerArray.push(mark2);
	            google.maps.event.addListener(mark2, 'click', function() {
	            	infowindow = new google.maps.InfoWindow();
	          infowindow.setContent(place.name);
	          infowindow.open(map, this);
	        });

	          }
	        }

          }

          function deleteMarkers(){
          	for(var i=0; i<markerArray.length; i++){
          		markerArray[i].setMap(null);
          	}
          	markerArray = [];
          }
          
     }