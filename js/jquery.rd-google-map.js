/*
 *  RD-Google Map - v0.1
 *  Easy as hell Google Map Api Jquery plugin.
 *
 *  Made by Evgeniy Gusarov (Stmechanus || Diversant)
 *
 *  Under MIT License
 */


;
(function ($) {
    'use strict'

    var def_settings = {
            cntClass: 'map',
            mapClass: 'map_model',
            locationsClass: 'map_locations',
            marker: {
                basic: 'images/gmap_marker.png',
                active: 'images/gmap_marker_active.png'
            },
            styles: [{
        "featureType": "landscape",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 65
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 51
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 30
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 40
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -100
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffff00"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -97
            }
        ]
    }]
        },

        defaults = {
            map: {
                y: 49.1139040,
                x: 2.2085190,
                zoom: 8
            },
            locations: []
        };


    var getLocations = function ($map, settings) {
        var $locations = $map.parent().find('.' + settings.locationsClass).find('li');

        var locations = [];


        if ($locations.length > 0) {
            $locations.each(function (i) {
                var $loc = $(this);

                if ($loc.data('x') && $loc.data('y')) {
                    locations[i] = {
                        x: $loc.data('x'),
                        y: $loc.data('y'),
                        basic: $loc.data('basic') ? $loc.data('basic') : settings.marker.basic,
                        active: $loc.data('active') ? $loc.data('active') : settings.marker.active
                    }

                    if (!$.trim($loc.html())) {
                        locations[i].content = false;
                    } else {
                        locations[i].content = '<div class="iw-content">' + $loc.html() + '</div>';
                    }
                }
            });
        }
        return locations;
    }

    var calculate = function(map){
        $('#buttonDirection').on('click',function(e){
            e.preventDefault();
            var origin      = $('#depart').val(); // Le point départ
            var destination = $('#arrive').val(); // Le point d'arrivé
            if(origin && destination){
                var request = {
                    origin      : origin,
                    destination : destination,
                    travelMode  : google.maps.DirectionsTravelMode.DRIVING // Type de transport
                }
                var directionsDisplay = new google.maps.DirectionsRenderer();
                directionsDisplay.setMap(map);
                var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
                directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
                    if(status == google.maps.DirectionsStatus.OK){
                        directionsDisplay.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
                    }
                });
            }
        })
    };

    $.fn.googleMap = function (settings) {

        settings = $.extend(true, {}, def_settings, settings);
        $(this).each(function () {
            var $this = $(this);

            var options = $.extend(
                true, {}, defaults,
                {
                    map: {
                        x: $this.data('x'),
                        y: $this.data('y'),
                        zoom: $this.data('zoom')
                    },
                    locations: getLocations($this, settings)
                }
            );

            var map = new google.maps.Map(this, {
                    center: new google.maps.LatLng(
                        parseFloat(options.map.y),
                        parseFloat(options.map.x)
                    ),
                    scrollwheel: false,
                    styles: settings.styles,
                    zoom: options.map.zoom
                }),
                infowindow = new google.maps.InfoWindow(),
                markers = [];
            calculate(map);
            
            
            for (var i in options.locations) {
                markers[i] = new google.maps.Marker(
                    {
                        position: new google.maps.LatLng(
                            parseFloat(options.locations[i].y),
                            parseFloat(options.locations[i].x)),
                        map: map,
                        icon: options.locations[i].basic,
                        index: i
                    }
                );


                if (options.locations[i].content) {
                    google.maps.event.addListener(markers[i], 'click', function () {
                        for (var j in markers) {
                            markers[j].setIcon(options.locations[j].basic);
                        }

                        infowindow.setContent(options.locations[this.index].content);
                        infowindow.open(map, this);
                        $('.gm-style-iw').parent().parent().addClass("gm-wrapper");
                        this.setIcon(options.locations[this.index].active);
                    });
                    google.maps.event.addListener(infowindow, 'closeclick', function () {
                        for (var j in markers) {
                            markers[j].setIcon(options.locations[j].basic);
                        }
                    });
                }
            }
            

            google.maps.event.addDomListener(window, 'resize', function() {
                map.setCenter(new google.maps.LatLng(
                    parseFloat(options.map.y),
                    parseFloat(options.map.x)
                ));
            });
        });
    };


})(jQuery);
