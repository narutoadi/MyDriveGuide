      function initMap() {
        var origin_place_id = null;
        var destination_place_id = null;
        var path = null;
        var markcolor = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
        var marker1;
        var marker1LatLng;
        var marker1Array = [];
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
        var infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        origin_autocomplete.bindTo('bounds', map);
        var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
        destination_autocomplete.bindTo('bounds', map);

       function optcheck(e) {
       	var thing1 = e.target;
       	if(thing1.value == 'atm')
          	{ 
          		markcolor = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      		}
          	else if(thing1.value == 'gas_station')
          	{
          		markcolor = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
          	}
          	else
          	{
          		markcolor = 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png';	
          	}

       		antshant(path,thing1.value);
		    
		}

        function addListeners(e) {
		  addEvent(document.getElementById('rb1'), 'click', optcheck, false);
		  addEvent(document.getElementById('rb2'), 'click', optcheck, false);
		  addEvent(document.getElementById('rb3'), 'click', optcheck, false);
		 }

		 function addEvent(elm, evType, fn, useCapture)
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
      		document.getElementById("rb1").disabled = false;
	       	document.getElementById("rb2").disabled = false;
	       	document.getElementById("rb3").disabled = false;
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
		       
		       if(path.length > 70)
		       {
		       	alert("Path is too long_!! Use the orange-draggable marker_!!");
		       	document.getElementById("rb1").disabled = true;
		       	document.getElementById("rb2").disabled = true;
		       	document.getElementById("rb3").disabled = true;
		       		marker1 = new google.maps.Marker({
					  draggable: true,
					  position: path[10], 
					  map: map,
					  icon: markcolor,
					  title: "Your location"
					  });
		       		google.maps.event.addListener(marker1, 'dragend', function (event) {
		       			marker1LatLng = this.getPosition();
		       			infowindow = new google.maps.InfoWindow();
			        	service.nearbySearch({
				        location: marker1LatLng,
				        radius: 300,
				        type: ['atm']
				        }, callback1);
					});
		       }          
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });

          }


          function antshant(path,keyword){
          	
	          	for(var i=0; i<path.length; i+=5)
	          	{
	          		infowindow = new google.maps.InfoWindow();
			        service.nearbySearch({
			          location: path[i],
			          radius: 150,
			          type: [keyword]
			        }, callback);

	          	}
	        
          }

	      function callback(results, status) {
	        if (status == google.maps.places.PlacesServiceStatus.OK) {
	          for (var i = 0; i < results.length; i++) {
	            createMarker(results[i]);
	          }
	        }
	      }

	      function callback1(results, status) {
	        if (status == google.maps.places.PlacesServiceStatus.OK) {
	          for (var i = 0; i < results.length; i++) {
	            createMarker1(results[i]);
	          }
	            service.nearbySearch({
				        location: marker1LatLng,
				        radius: 300,
				        type: ['gas_station']
				        }, callback2);
	        }
	      }

	      function callback2(results, status) {
	        if (status == google.maps.places.PlacesServiceStatus.OK) {
	          for (var i = 0; i < results.length; i++) {
	            createMarker2(results[i]);
	          }
	            service.nearbySearch({
				        location: marker1LatLng,
				        radius: 300,
				        type: ['restaurant']
				        }, callback3);
	        }
	      }

	      function callback3(results, status) {
	        if (status == google.maps.places.PlacesServiceStatus.OK) {
	          for (var i = 0; i < results.length; i++) {
	            createMarker3(results[i]);
	          }
	        }
	      }

	      function createMarker(place) {
	        var placeLoc = place.geometry.location;
	        var marker = new google.maps.Marker({
	          map: map,
	          position: place.geometry.location,
	          icon : markcolor
	        });
	       	google.maps.event.addListener(marker, 'click', function() {
	          infowindow.setContent(place.name);
	          infowindow.open(map, this);
	        });
	      }

	       	function createMarker1(place) {
	        var placeLoc = place.geometry.location;
	        var marker = new google.maps.Marker({
	          map: map,
	          position: place.geometry.location,
	          icon : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
	        });
	        google.maps.event.addListener(marker, 'click', function() {
	          infowindow.setContent(place.name);
	          infowindow.open(map, this);
	        });
	      }

	       	function createMarker2(place) {
	        var placeLoc = place.geometry.location;
	        var marker = new google.maps.Marker({
	          map: map,
	          position: place.geometry.location,
	          icon : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	        });
	        google.maps.event.addListener(marker, 'click', function() {
	          infowindow.setContent(place.name);
	          infowindow.open(map, this);
	        });
	      }

	        function createMarker3(place) {
	        var placeLoc = place.geometry.location;
	        var marker = new google.maps.Marker({
	          map: map,
	          position: place.geometry.location,
	          icon : 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
	        });
	        google.maps.event.addListener(marker, 'click', function() {
	          infowindow.setContent(place.name);
	          infowindow.open(map, this);
	        });
	      }
 }     