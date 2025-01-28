// MakeSummaryMap.js
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import PropTypes from 'prop-types';

const GOOGLE_API_KEY = "AIzaSyClg9TxNOL9ZSdJyfldk_ZGtXQ3rDqqfwI";

const MakeSummaryMap = ({ pickupCoords, destinationCoords, onDistanceCalculated }) => {
  const [error, setError] = useState('');
  const [routeReady, setRouteReady] = useState(false);
  const [isMapLocked, setIsMapLocked] = useState(false); // State to lock the map
  const mapRef = useRef(null);

  console.log("In MakeSummaryMap: pickupCoords=", pickupCoords, "destinationCoords=", destinationCoords);

  // Helper to validate lat/lng
  const isValidCoordinate = (location) => {
    return (
      location &&
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number' &&
      !isNaN(location.latitude) &&
      !isNaN(location.longitude)
    );
  };

  // Once route is drawn, lock the map
  useEffect(() => {
    if (mapRef.current && routeReady && isValidCoordinate(pickupCoords) && isValidCoordinate(destinationCoords)) {
      mapRef.current.fitToCoordinates([pickupCoords, destinationCoords], {
        edgePadding: { right: 50, bottom: 50, left: 50, top: 50 },
        animated: true,
      });
      setIsMapLocked(true);
    }
  }, [routeReady, pickupCoords, destinationCoords]);

  // Show an error if the coordinates are invalid
  if (!isValidCoordinate(pickupCoords) || !isValidCoordinate(destinationCoords)) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid pickup or destination coordinates.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        scrollEnabled={!isMapLocked}
        zoomEnabled={!isMapLocked}
        pitchEnabled={!isMapLocked}
        rotateEnabled={!isMapLocked}
        showsMyLocationButton={false}
        showsBuildings={false}
        showsScale={false}
        showsPointsOfInterest={false}
        initialRegion={{
          latitude: (pickupCoords.latitude + destinationCoords.latitude) / 2,
          longitude: (pickupCoords.longitude + destinationCoords.longitude) / 2,
          latitudeDelta: Math.abs(pickupCoords.latitude - destinationCoords.latitude) * 1.5,
          longitudeDelta: Math.abs(pickupCoords.longitude - destinationCoords.longitude) * 1.5,
        }}
      >
        {/* Pickup Marker */}
        <Marker
          coordinate={pickupCoords}
          title="Pickup Location"
          description="Your starting point"
          image={require('../assets/map-pin64.png')}
        />

        {/* Destination Marker */}
        <Marker
          coordinate={destinationCoords}
          title="Destination"
          description="Your destination"
          image={require('../assets/circle64.png')}
        />

        {/* SINGLE Route Directions */}
        <MapViewDirections
          origin={pickupCoords}
          destination={destinationCoords}
          apikey={GOOGLE_API_KEY}
          strokeWidth={5}
          strokeColor="rgba(0,0,0,0.8)"
          optimizeWaypoints
          onError={(errMessage) => {
            console.error('Directions Error:', errMessage);
            setError("Failed to fetch directions. Please try again.");
          }}
          onReady={(result) => {
            console.log('Directions Ready:', result);
            setRouteReady(true);

            // Fit the map to the route
            if (mapRef.current && result.coordinates.length) {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: { right: 30, bottom: 30, left: 30, top: 30 },
                animated: true,
              });
            }

            // Now retrieve the distance in km
            const distance = result.distance;
            console.log("Calculated distance (km) =", distance);
            if (onDistanceCalculated) {
              onDistanceCalculated(distance);
            }
          }}
        />
      </MapView>
    </View>
  );
};

MakeSummaryMap.propTypes = {
  pickupCoords: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  destinationCoords: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  onDistanceCalculated: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').height * 0.42,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
    alignSelf: 'center',
  },
  errorText: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255,0,0,0.7)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
    textAlign: 'center',
  },
});

export default MakeSummaryMap;