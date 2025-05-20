import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

/**
 * Renders the welcome/home screen for the StoryPath application.
 *
 * This component displays an icon, a welcome message, a description of the app, 
 * and buttons to navigate to the profile and project list screens.
 *
 * @returns {JSX.Element} A view containing the welcome message, description, 
 * text input for app features, and navigation buttons.
 */
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FontAwesome name="flag" size={40} color={"#9400D3"}></FontAwesome>
      <Text 
        style={{
          color: "purple",       
          fontSize: 30
        }}>
          Welcome to StoryPath</Text>
      <Text 
       style={{fontSize: 18, marginVertical: 15}}>Explore Unlimited Experience On Locations</Text>
       <View style={{
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 35,
        paddingHorizontal: 10,
        width: '85%',
        marginVertical: 10,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
       }}>
        <TextInput style={{
            lineHeight: 22,
            textAlign: "center", 
          }} multiline={true} // Allow multiple lines
          >With StoryPath, you can unlock and create endless location-based adventures! Whether it's exploring city tours or embarking on thrilling treasure hunts, the possibilities for fun and excitement are limitless! 
        </TextInput>
       </View>
      
      {/* Profile button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/profile");
        }}
      >
        <Text style={styles.buttonText}>CREATE PROFILE</Text>
      </TouchableOpacity>

      {/* Project list button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/projectList");
        }}
      >
        <Text style={styles.buttonText}>EXPLORE PROJECTS</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
    backgroundColor: '#D5CAEB',
    width: 350,
    paddingVertical: 8,
    borderRadius: 20
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center"
  }
});


