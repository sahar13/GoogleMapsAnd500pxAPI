//Constants
const consumerKey = 'SIwRLq0AwiEydJeCT8NLk3chVNyEMgweH52bQVx5';
const baseURL = 'https://api.500px.com/v1/'
const photoURL = 'photos/search'
const geo = '43.653226,-79.383184,50km'

//Globals
let map = {}
let toronto = {lat: 43.653226, lng: -79.383184}; // Initial value so we can check if the user has searched
let markers = [];
let photos = [];
let query = []

//Helper functions
const getLatLng = pic => new google.maps.LatLng(pic.latitude, pic.longitude);
const clearMarkers = markers => markers.forEach( marker => marker.setMap(null));

// Initialize app and call functions to render map and handle user input
var initMap = () => {
  renderMap();
  handleUserInput();
};

// Display map that's large enough to show a 50km radius around Toronto
const renderMap = () => {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: toronto
  });
}

// Clear all markers then fetch data after user submits entry by clicking button or pressing enter
const handleUserInput = () => {
  //create on click event when user clicks search button
  document.querySelector('#button').addEventListener('click', () => {
    clearMarkers(markers);
    query = document.querySelector('#userKeyword').value;
    fetchData(query)
  });
  //create keypress event when user clicks hits enter
  document.querySelector('#userKeyword').addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      //get user input and use value as paramater to fetch data
      clearMarkers(markers);
      query = document.querySelector('#userKeyword').value;
      fetchData(query);
    };
  });
};

// Fetch data using paramaters to search by keyword and within a radius, then call on functions to display markers and infowindows
const fetchData = () => {
  fetch(`${baseURL}${photoURL}?consumer_key=${consumerKey}&term=${query}&geo=${geo}`)
    .then( response => response.json() )
    .then( jsonData => {
      photos = jsonData.photos;
      renderMarkers();
      renderInfoWindows()
    });
};

// Dislay markers for each photo
const renderMarkers = () => {
  const newMarkers = photos.map(getLatLng);
  markers = newMarkers.map(latlng => new google.maps.Marker({ position: latlng, map}));
  map.setCenter(toronto)
}

// Assign click event on each marker to display infowindow with more info
const renderInfoWindows = () => {
  const photoInfo = photos.map( pic => new google.maps.InfoWindow({
      content: `
      <div class="container">
        <div class="imgContainer">
          <img class="image" src="${pic.image_url}">
        </div>
        <div class="infoContainer">
          <h1 class="title"> ${pic.name} </h1>
          <h2 class="artist"> ${pic.user.fullname} </h2>
          <p class="description"> ${pic.description} </p>
        </div>
      </div>
      `
    })
  );
  markers.forEach( (marker, i) => {
    marker.addListener('click', () => {
      photoInfo[i].open(map, marker);
    });
  });
}
