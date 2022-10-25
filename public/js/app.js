// Global objects
const leafletMap = L.map('leaflet-map').setView([63.4206897, 10.4372859], 16);
let requestInterval;
let flipped = false;
let targetURL = localStorage.getItem('targetUrl');/* === "" ?
    "coap://californium.eclipseprojects.io/echo/cali.Ali.nRF9160" :
    localStorage.getItem('targetUrl');*/

let intervalTimer = null;
let lastTime = '';
let markers = [];
const markerStackSize = 10;
let circle = null;

const defaultTitle = 'nRF91 Simple Tracker'


// Setup the map
leafletMap.addLayer(L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19,
}));

[[63.4206897, 10.4372859], [59.919378, 10.686381]].forEach(latlng => {
	L.marker(latlng, {
		icon: L.icon({
			iconUrl: '/images/nordic_logo_small.png',
			iconSize: [20, 20],
			iconAnchor: [10, 20]
		})
	}).addTo(leafletMap);
})

leafletMap.on('popupopen', function(ev) {
	resetAccuracyCircle();

	const radius = ev.popup._content.split("Accuracy: ")[1].split(" ")[0];
	circle = L.circle(ev.popup._latlng, {radius: radius}).addTo(leafletMap);
});

leafletMap.on('popupclose', () => resetAccuracyCircle());

function resetAccuracyCircle(){
	if (circle !== null) {
		leafletMap.removeLayer(circle);
		circle = null;
	}
}

function stopPolling(){
	if (intervalTimer !== null) {
		clearInterval(intervalTimer);
		intervalTimer = null;
	}
	
	$("#connectionBtn").attr('data-connection-status', 'false');
	$("#connectionBtn").text("Connect");
}

function clearMarkers() {
	markers.forEach(marker => leafletMap.removeLayer(marker));
	markers = [];
	lastTime = '';
}

function clearMarker(markerToDelete) {
	var new_markers = [];
	leafletMap.removeLayer(markerToDelete);
	markers.forEach(marker => {
	  if (marker !== markerToDelete) new_markers.push(marker);
	})
	markers = new_markers;
}

// Show toast message
function showToast(title, subtitle, content, type, delay) {
	$.toast({ title, subtitle, content, type, delay });
}



function initPolling() {

    stopPolling();
    if (!checkValidURL(targetURL)) {
        console.warn('Invalid target URL');
        return;
    }

	
	$("#connectionBtn").text("Connecting...");
	$("#connectionBtn").attr('data-connection-status', 'true');

	getData();

	intervalTimer = setInterval(() => {
		getData();
	}, 4000);
}

function getData() {
	$.ajax({
		type : "POST",
		url : "/data",
		data: JSON.stringify({targetURL}),
		contentType: 'application/json',
		dataType: 'json',
		timeout : 2000,
		success: response => {
			$("#connectionBtn").text("Disconnect");
			if (lastTime !== response.time) {
					const temp = new Date(response.time);
					const timestamp = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate(), temp.getHours(), temp.getMinutes(), temp.getSeconds()));
		
					lastTime = response.time;
					const marker = L.marker(response.latlng, {
						icon: L.icon({
							iconUrl: '/images/icons8-location-50.png',
							iconSize: [34, 34],
							iconAnchor: [17, 17]
						})
					})
						.addTo(leafletMap)
						.bindPopup("Lat: " + response.latlng[0] + " Lng: " + response.latlng[1] +
									"<br>Time: " + timestamp + 
									"<br>Accuracy: " + response.acc + " m", {
						
					});

					markers.push(marker);
					
					leafletMap.setView(response.latlng);
					if (markers.length > markerStackSize) {
						clearMarker(markers[0]);
					}
			}
		},
		error:  e => {
			showToast("COAP Connection Error",
				'',
				"Connection Failed, Ensure COAP target is correct and try to connect again.",
				'Error',
				10000,
			);

			stopPolling();
		} 
		});
}

function updateConnectButton() {
    // Enable/disable button
    if (checkValidURL(targetURL)) {
        $('#trackBtn').removeClass('disabled');
        $('#trackBtn').prop('disabled', false);
    } else {
        $('#trackBtn').addClass('disabled');
        $('#trackBtn').prop('disabled', true);
    }
}

function checkValidURL(URL) {
    // coap url
    const urlRegExp = /^coap:\/\/[(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(\/[-a-zA-Z0-9()@:%_\+.~#?&=]+)+$/i
    console.log(URL);
    console.log(urlRegExp.test(targetURL));
    return urlRegExp.test(targetURL);
}

function showView(id) {

    // Code for all other keys
    ['track', 'settings']
        .filter(key => key !== id)
        .forEach(key => {
            $(`#${key}View`).removeClass('d-flex').addClass('d-none');
        });

    // Code for current key
    $(`#${id}Btn`).removeClass('nrf-light-blue').addClass('nrf-blue');
    $(`#${id}View`).removeClass('d-none').addClass('d-flex');

    // Explicit code
    if (id === 'settings') {
        targetURL = $('#target-url').val().trim();
        $('#target-url').focus();

        // Hide settings-button, as you are now in settings
        $("#settingsBtn").css("visibility", "hidden");

        // Remove all toasts, as they are now in the way
        $(".toast").remove();

        localStorage.setItem('targetUrl',  targetURL);
        stopPolling();	

    } else if (id === 'track' || id === 'connectToMap') {

        targetURL = localStorage.getItem('targetUrl');/* === "" ?
        "coap://californium.eclipseprojects.io/echo/cali.Ali.nRF9160" :
        localStorage.getItem('targetUrl');*/

        $("#deviceNameTitle").text(targetURL.split("/").pop());
        
        // Show settings-button
        $("#settingsBtn").css("visibility", "visible");

        clearMarkers();
        leafletMap.invalidateSize();
        initPolling();
    }
}

// Main function
$(document).ready(() => {
    $('#target-url').focus();

	// Set initial values 
	$('#target-url').val(targetURL);
	$("#deviceNameTitle").text(defaultTitle);
    updateConnectButton()
    
    document.getElementsByClassName('.view-btn')

	// Tab bar view selector buttons:
	$('.view-btn').click(({ target }) => {
		const id = target.id.replace('Btn', '');

        showView(id);
	});

    // Syntax is different because the elements appear after document load
    $("body").on("click", ".toastBtn", (({ target }) => {
        showView("settings");
    }));

    $("body").on("click", ".reconnectBtn", (({ target }) => {
        $(".toast").remove(); // Remove toasts, as we are updating
        if ($('#connectionBtn').attr('data-connection-status') === 'true') {
			stopPolling();
		} else {
			initPolling();
		}
    }));

	$('#connectionBtn').click( () => {
        $(".toast").remove(); // Remove toasts, as we are updating
		if ($('#connectionBtn').attr('data-connection-status') === 'true') {
			stopPolling();
		} else {
			initPolling();
		}
	});
	
	// Settings view, api key change:
	$('#target-url').on('input', () => {
		targetURL = $('#target-url').val().trim();
        localStorage.setItem('targetUrl', targetURL);
        leafletMap.invalidateSize();
        updateConnectButton()
	});
});
