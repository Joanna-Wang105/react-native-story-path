import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { getTracking } from './api';
import { UserContext } from './context';

const { width } = Dimensions.get("window");

/**
 * Renders the user profile screen.
 *
 * This component allows users to view and edit their profile. It displays 
 * the user's profile picture (which can be added or removed) and a text input 
 * field for entering the participant's username. The profile picture can be 
 * selected from the device's image library.
 *
 * @returns {JSX.Element} A view containing the profile header, profile picture, 
 * and input field for the username. Username will be set as 'unknown' in default.
 */

export default function Profile() {
  const [photoState, setPhotoState] = useState({});
  const { participant_username, setParticipantUsername } = useContext(UserContext); 

  useEffect(() => {
    const fetchTrack = async () => {
      const fetchedTracking = await getTracking();
      setParticipantUsername(fetchedTracking.participant_username); 
    };
    fetchTrack();
  }, [setParticipantUsername]);

  async function handleChangePress() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoState(result.assets[0]);
    }
  }

  async function handleRemovePress() {
    setPhotoState({});
  }

  const hasPhoto = Boolean(photoState.uri);

  // Handle the image picker
  function Photo() {
    if (hasPhoto) {
      return (
        <View style={styles.photoFullView}>
          <Image
            style={styles.photoFullImage}
            resizeMode="cover"
            source={{ uri: photoState.uri }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.photoEmptyView}>
          <Text style={styles.placeholderText}>Tap to add photo</Text>
        </View>
      );
    }
  }

  return (
    <View style={[styles.container, { flexDirection: 'column' }]}>
      <View style={styles.header}>
        <FontAwesome name="user-circle" size={80} color={"purple"} />
        <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 20, color: '#ba55d3' }}>Your Profile</Text>
      </View>

      <View style={{ flex: 4 }}>
        {/* Add/remove photo */}
        <View style={[styles.photoContainer, { marginTop: 40 }]}>
          <TouchableOpacity onPress={handleChangePress}>
            <Photo />
          </TouchableOpacity>
          {hasPhoto && (
            <TouchableOpacity style={styles.removeButton} onPress={handleRemovePress}>
              <Text style={{ color: 'red' }}>Remove Photo</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Set username */}
        <View style={[styles.input, { marginTop: 20, alignItems: "center" }]}>
          <TextInput
            placeholder={"Enter your name"}
            value={participant_username}
            onChangeText={setParticipantUsername} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "white",
    paddingTop: 20,
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 2,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoFullView: {
    marginBottom: 20,
  },
  photoEmptyView: {
    borderWidth: 3,
    borderRadius: 100,
    borderColor: "#999",
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFullImage: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 10,
  },
  placeholderText: {
    color: "#999",
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    padding: 15,
    margin: 30,
    borderRadius: 30,
    backgroundColor: 'white',
    borderColor: '#D3D3D3'
  }
});
