import React, { useState, useEffect, useContext, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Appearance, View, SafeAreaView, Text } from "react-native";
import { ProjectContext } from './context';
import MapView, { Circle } from "react-native-maps";
import * as Location from 'expo-location';
import { getDistance } from "geolib";

// Get light or dark mode
const colorScheme = Appearance.getColorScheme();

// Component for displaying nearest location and whether it's within 100 metres
function NearbyLocation(props) {
    if (typeof props.location != "undefined") {
      return (
        <SafeAreaView style={styles.nearbyLocationSafeAreaView}>
          <View style={styles.nearbyLocationView}>
            <Text style={styles.nearbyLocationText}>{props.location}</Text>
            {props.distance.nearby && (
              <Text
                style={{
                  ...styles.nearbyLocationText,
                  fontWeight: "bold",
                }}
              >
                Within 100 Metres!
              </Text>
            )}
          </View>
        </SafeAreaView>
      );
    }
  }

/**
 * Renders a map component for displaying user current location and the locations that have been unlocked/visited
 *
 * @returns {JSX.Element} The rendered Map component.
 */
export default function Map() {
  const { location, default_display, visitedLoc, setVisitedLoc, selectedLoc, setSelectedLoc } = useContext(ProjectContext);

  // Decide how many locations will be shown on the map
  const unlockedLoc = default_display === 'Display all locations' || visitedLoc.length === 0 ? location : visitedLoc;
 
  // Convert string-based latlong to object-based on each location
  const updatedLocations = unlockedLoc
    .filter(loc => loc?.location_position) 
    .map(loc => {
      const position = loc.location_position.replace(/[\(\)]/g, "").split(",");
      loc.coordinates = {
        latitude: parseFloat(position[0].trim()),
        longitude: parseFloat(position[1].trim()),
      };
      return loc;
    });

  // Setup state for map data
  const initialMapState = {
    locationPermission: false,
    locations: updatedLocations,
    userLocation: { latitude: -27.4977, longitude: 153.0129 }, // At UQ
    nearbyLocations: {}
  };

  const [mapState, setMapState] = useState(initialMapState);

  useEffect(() => {
    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setMapState(prevState => ({ ...prevState, locationPermission: true }));
      }
    }
    requestLocationPermission();
  }, []);

  // Update the circle radius when the player is within 100 metre 
  useFocusEffect(
    useCallback(() => {
      function calculateDistance(userLocation) {
        const nearestLocations = mapState.locations
          .map((location) => {
            const metres = getDistance(userLocation, location.coordinates);
            location["distance"] = {
              metres: metres,
              nearby: metres <= 100 ? true : false,
            };
            return location;
          })
          .sort((previousLocation, thisLocation) => {
            return (
              previousLocation.distance.metres - thisLocation.distance.metres
            );
          });
        return nearestLocations;
      }
  
      let locationSubscription = null;
  
      if (mapState.locationPermission) {
        (async () => {
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              distanceInterval: 10, // in meters
            },
            (location) => {
              const userLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              };
              const nearbyLocation = calculateDistance(userLocation);

              // Set location as visited if the user is within the radius
              nearbyLocation.forEach(loc => {
                if (loc.distance.nearby) {
                    setSelectedLoc(loc)
                }
              });

              setMapState((prevState) => ({
                ...prevState,
                userLocation,
                nearbyLocation: nearbyLocation,
              }));
            }
          );
        })();
      }

      // Cleanup function
      return () => {
        if (locationSubscription) locationSubscription.remove();
      };
    }, [mapState.locationPermission, mapState.locations, selectedLoc, setSelectedLoc])
  );
  
  return (
    <View style={[styles.container, { flexDirection: 'column' }]}>
      <View style={styles.header}>
        <Text style={{ fontSize: 23, color: 'white' }}>Map</Text>
      </View>

      <View style={{ flex: 8 }}>
        <MapView
          camera={{
            center: mapState.userLocation,
            pitch: 0,
            heading: 0,
            altitude: 3000,
            zoom: 15,
          }}
          showsUserLocation={mapState.locationPermission}
          style={styles.container}
        >
            {default_display === 'Display all locations' ? (
                // Print all the locations if the project.homescreen_display is display all locations
                location.map(loc => (
                    <Circle
                    key={loc.id}
                    center={loc.coordinates}
                    radius={100}
                    strokeWidth={3}
                    strokeColor="#A42DE8"
                    fillColor={colorScheme === "dark" ? "rgba(128,0,128,0.5)" : "rgba(210,169,210,0.5)"}
                    />
                ))
                ) : (  
                // Otherwise only print those locations that have been visited 
                visitedLoc.map(loc => (
                    <Circle
                    key={loc.id}
                    center={loc.coordinates}
                    radius={100}
                    strokeWidth={3}
                    strokeColor="#A42DE8"
                    fillColor={colorScheme === "dark" ? "rgba(128,0,128,0.5)" : "rgba(210,169,210,0.5)"}
                    />
                ))
                )}

        </MapView>
        <NearbyLocation locations={mapState.nearbyLocations} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nearbyLocationSafeAreaView: {
    backgroundColor: "black",
  },
  nearbyLocationView: {
    padding: 20,
  },
  nearbyLocationText: {
    color: "white",
    lineHeight: 25
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "#9370DB",
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  }
});
