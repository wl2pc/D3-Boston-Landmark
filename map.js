mapboxgl.accessToken = 'pk.eyJ1IjoicmVteTk1NjkiLCJhIjoiY2puNHd5d3dmMGR4ZDNwbzVmYTNiMHFoayJ9.I5_UHJ0WlaVOFZzmZ8LgAg';
$(document).ready(function(){
    $("#Name1").on('mousemove',function(){
        var div = $("#Name1");  
        div.animate({left: '25px'}, "slow");
        div.animate({fontSize: '1.5em'}, "slow");

    });
});

var map = new mapboxgl.Map({
    style: 'mapbox://styles/remy9569/cjobvoc552rlk2so7raclaelz',
    center: [-71.054187,42.357762],
    zoom: 13.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map'
});

// The 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function() {
    // Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#ffffff',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
        }
    }, labelLayerId);
});


                            
$("#about").on('click', function() {
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});

$(".modal>.close-button").on('click', function() {
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});

// Legend
var layers = [
    'Landmark',
    'Historical site',
    'University and College'
];

var colors = [
    '#006400',
    '#98FB98',
    '#FF69B4',
   
];

for (i=0; i<layers.length; i++) {
    var layer =layers[i];
    var color =colors[i];

   

var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added
    var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
    var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
    legendKey.css("background", color); // change the background color of the legend key
}



// POPUPS CODE
 map.on('click', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 
    
    console.log(e);
    
    var currentCoords = map.getCenter();
    var currentZoom = map.getZoom();
    var currentBearing = map.getBearing();
    var currentPitch = map.getPitch();

     var Landmark = map.queryRenderedFeatures(e.point, { 
        layers: [
            'landmarks', 
            'colleges'
        ] // any of the layers you want to query (to create a popup)
     });
    
    if (Landmark.length == 0) {
        return;
    }
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });
    
    popup.setLngLat(e.lngLat);

    console.log(Landmark[0].properties);

    var clickedLayer = Landmark[0].layer.id;
    
    // Set the contents of the popup window    
    if (clickedLayer == 'landmarks') {
        console.log(clickedLayer);
        popup.setHTML('<h2> ' + Landmark[0].properties.Name_of_Pr + '</h3><p>' + '<p>Built: ' + Landmark[0].properties.Date_Desig + Landmark[0].properties.Neighborho + '</p><img class="Landmark-image" src="img/' + Landmark[0].properties.Name_of_Pr +'.jpg">');
    } else if (clickedLayer == 'colleges') {
        console.log(clickedLayer);
        popup.setHTML('<h2> ' + Landmark[0].properties.Name+'</h3><p>Area: ' + Landmark[0].properties.City + '</h3><p>Address: ' + Landmark[0].properties.Address +'<p>Built: ' + Landmark[0].properties.YearBuilt);
    }
 
    popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
   
    map.flyTo({
        center: e.lngLat,
        zoom: 16,
        pitch: 56,
        bearing:0 ,
    })

    $(".mapboxgl-popup-close-button").on('click', function(e) {
        map.flyTo({
            center: currentCoords,
            zoom: currentZoom,
            pitch: currentPitch,
            bearing: currentBearing
        })
    });


  });


 


 map.on('mouseover', function(e) {
    // do something when you hover over the map
 })




 var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['boston-landmarks-commission-b-6taprb', 'Historical Site'],                      // layers[0]
        ['landmarks','Landmark'],                              // layers[1][1] = 'Parks'
        ['colleges', 'University'],     
        ['traffic', 'Road'],
        ['background', 'Map background']
        // add additional live data layers here as needed
    ]; 
    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }
         $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });

    // RESET MAP BUTTON
    
    $("#reset").click(function() {
        map.setCenter([-71.054187,42.357762]);
        map.setZoom(13.5);
        map.setPitch(45);
        map.setBearing(-17.6);
    
        
        // Reset all layers to visible
        for (i=0; i<layers.length; i++) {
            map.setLayoutProperty(layers[i][0], 'visibility', 'visible'); 
            $("#" + layers[i][0]).addClass('active');
        }                   

    });

    
    var width = 500;
    var height = 25;
    var marginLeft = 15;
    var marginRight = 15;

    var data = [1899, 1900, 1920, 1925, 1960, 1964, 1975, 1978, 1987, 1990, 1991, 2018];
    
    // Append SVG 
    var svg = d3.select("#timeline-labels")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Create scale
    var scale = d3.scaleLinear()
                  .domain([d3.min(data), d3.max(data)])
                  .range([marginLeft, width-marginRight]);

    // Add scales to axis
    var x_axis = d3.axisBottom()
                   .scale(scale)
                   .tickFormat(d3.format("d"));  // Formats number as a date, e.g. 2008 instead of 2,008 

    //Append group and insert axis
    svg.append("g")
       .call(x_axis);

// Timeline map filter (timeline of building permit issue dates)
    
    // Create array of  dates from Mapbox layer (in this case, Charlottesville Building Permit application dates)
    map.on('load', function () {

        // Get all data from a layer using queryRenderedFeatures
        var colleges = map.queryRenderedFeatures(null, { // when you send "null" as the first argument, queryRenderedFeatures will return ALL of the features in the specified layers
            layers: ["colleges"]
        });

        var buildDates = [];

        // push the values for a certain property to the variable declared above (e.g. push the permit dates to a permit date array)
        for (i=0; i<colleges.length; i++) {
            var yearBuilt = colleges[i].properties.YearBuilt; 
            
            buildDates.push(yearBuilt);
        }

        // Create event listener for when the slider with id="timeslider" is moved
        $("#timeslider").change(function(e) {
            var year = this.value; 

            map.setFilter("colleges", ["<=","YearBuilt", year]);
        });

    });
