(function () {
  var google = {
    maps: {
      ControlPosition: {
        BOTTOM_CENTER: 11,
        BOTTOM_LEFT: 10,
        BOTTOM_RIGHT: 12,
        LEFT_BOTTOM: 6,
        LEFT_CENTER: 4,
        LEFT_TOP: 5,
        RIGHT_BOTTOM: 9,
        RIGHT_CENTER: 8,
        RIGHT_TOP: 7,
        TOP_CENTER: 2,
        TOP_LEFT: 1,
        TOP_RIGHT: 3,
      },
      event: {
        addDomListener: function() {},
        addDomListenerOnce: function() {},
        addListener: function() {},
        addListenerOnce: function() {},
        bind: function() {},
        clearInstanceListeners: function() {},
        clearListeners: function() {},
        forward: function() {},
        removeListener: function() {},
        trigger: function() {},
        vf: function() {}
      }
    }
  };

  function GoogleMapsMock() {};
  GoogleMapsMock.prototype.setMap = function() {};
  GoogleMapsMock.prototype.getMap = function() {};

  function LatLng(lat, lng) {}
  Object.setPrototypeOf(LatLng.prototype, GoogleMapsMock.prototype); // inherit
  LatLng.prototype.lat = function() {};
  LatLng.prototype.lng = function() {};
  LatLng.prototype.toJSON = function() {};

  google.maps.LatLng = LatLng;

  function LatLngBounds(ne, sw) {}
  Object.setPrototypeOf(LatLngBounds.prototype, GoogleMapsMock.prototype); // inherit
  LatLngBounds.prototype.getSouthWest = function() {};
  LatLngBounds.prototype.getNorthEast = function() {};

  google.maps.LatLngBounds = LatLngBounds;

  google.maps.OverlayView = GoogleMapsMock;

  function Marker() {};
  Object.setPrototypeOf(Marker.prototype, GoogleMapsMock.prototype); // inherit
  Marker.prototype.getAnimation = function() {};
  Marker.prototype.getClickable = function() {};
  Marker.prototype.getCursor = function() {};
  Marker.prototype.getDraggable = function() {};
  Marker.prototype.getFlat = function() {};
  Marker.prototype.getIcon = function() {};
  Marker.prototype.getPosition = function() {};
  Marker.prototype.getShadow = function() {};
  Marker.prototype.getShape = function() {};
  Marker.prototype.getTitle = function() {};
  Marker.prototype.getVisible = function() {};
  Marker.prototype.getZIndex = function() {};
  Marker.prototype.setAnimation = function() {};
  Marker.prototype.setClickable = function() {};
  Marker.prototype.setCursor = function() {};
  Marker.prototype.setDraggable = function() {};
  Marker.prototype.setFlat = function() {};
  Marker.prototype.setIcon = function() {};
  Marker.prototype.setPosition = function() {};
  Marker.prototype.setShadow = function() {};
  Marker.prototype.setShape = function() {};
  Marker.prototype.setTitle = function() {};
  Marker.prototype.setVisible = function() {};
  Marker.prototype.setZIndex = function() {};
  Marker.prototype.setMap = function() {};
  Marker.prototype.getMap = function() {};

  google.maps.Marker = Marker;

  google.maps.MarkerImage = GoogleMapsMock;

  function Map() {}
  Object.setPrototypeOf(Map.prototype, GoogleMapsMock.prototype); // inherit
  Map.prototype.controls = [[], [], [], [], [], []];
  Map.prototype.setCenter = function() {};

  google.maps.Map = Map;

  google.maps.MapMouseEvent = GoogleMapsMock;

  function MVCArray(array) {}
  MVCArray.prototype.push = function() {};
  google.maps.MVCArray = MVCArray;

  google.maps.Point = GoogleMapsMock;

  google.maps.Size = GoogleMapsMock;

  google.maps.InfoWindow = GoogleMapsMock;

  window.google = window.google || google;
})();
