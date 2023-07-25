(document).addEventListener("tangram-data-page_8d77bd68e890db-retrieved", function() {
    let search_params = new URLSearchParams(window.location.search);
    let tempMarkerSettings = [
        {
            type: "display_name",
            style: "font-family: Arial; text-align: left; margin-top: 8px; color: red; font-weight: bold"
        },
        {
            type: "avatar",
            style: "width: 100%; max-height: 90px; overflow: hidden;object-fit: cover; ",
        },

        {
            type: "rating",
            style: "font-family: Times New Roman; text-align: right; color: goldenrod; font-weight = light"
        }
    ];
    let response = window.tangram_response_page_8d77bd68e890db;
    
    if (Object.keys(response.data.users).length == 0) {
        document.querySelector("#no-results").style.display = 'block';
    }
    
    let _lat = response.latitude; // The latitude for your map center
    let _lng = response.longitude; // The longitude for your map center

    function initMap(origin) {
        let map = new google.maps.Map(document.getElementById("user-map"), {
            zoom: 11, // zoom level
            center: origin,
            mapTypeId: "roadmap",
            mapTypeControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            styles: [
                {
                    "featureType": "poi",
                    "stylers": [
                        { "visibility": "off" }
                    ]
                }
            ]
        });
    
        return map;
    };

    function drawMarkers(map, data) {
        console.log(data);
        Object.keys(data).forEach(function(key) {
            let data_instance = data[key];
            let processed_data_instance = processForMap(data_instance);
            let marker = initializeMarker(map, processed_data_instance);
            console.log(marker);
        })
    };

    function processForMap(data_instance) { 
        // ############################################################################################################
        // This function processes data from tangram into a format that can be used by the google maps API
        // It needs to be customized for every platform.
        // ############################################################################################################
        let response = {}
        response.title = data_instance.display_name;
        response.position = {lat: parseFloat(data_instance.latitude), lng: parseFloat(data_instance.longitude)};
        response.infoWindowMaxWidth = 100;
        response.infowindowContent =
                '<a href = "https://app.tangram.co/users/' + 
                data_instance.id +                     
                '" target = "_blank" style = "text-align: center; margin-bottom: 0px; text-decoration: none !important;">' +
                '<div id="content" style = "width: 200px;">';
        
        for (let i = 0; i<tempMarkerSettings.length; i++)
        {
            if (tempMarkerSettings[i].type === "avatar")
            {
                response.infowindowContent += 
                    '<img style="'+
                    tempMarkerSettings[i].style+
                    '" src = "' +
                    eval("data_instance." + tempMarkerSettings[i].type) + 
                    '">';
            }else
            {
                response.infowindowContent +=
                    '<div style="'+
                        tempMarkerSettings[i].style +
                    '">' +
                    eval("data_instance." + tempMarkerSettings[i].type) + 
                    '</div>';
            }
        }

        response.infowindowContent +=
            '</div>' +
            '</a>';
        return response;
    }

    function initializeMarker(map, marker_data) {
        let marker = new google.maps.Marker({
            map: map,
            position:  marker_data.position,
            title: marker_data.title,
            draggable: false
        });

        let infowindow = new google.maps.InfoWindow({
            content: marker_data.infowindowContent,
            maxWidth: marker_data.maxWidth
        });

        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map,
                shouldFocus: false
            });
        });

        marker.addListener("hover", () => {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        });

        return marker;
    }        

    let map = initMap({ lat: _lat, lng: _lng });
    console.log("response.data.users");
    console.log(response.data.users);
    let markets = drawMarkers(map, response.data.users);//TODO add another response.data here of preferences
});
