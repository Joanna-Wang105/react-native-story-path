import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { UserContext } from "./context"; 

/**
 * Renders custom content for the drawer navigation.
 * Displays the StoryPath title, current username, and navigation items.
 *
 * @param {Object} props - The props passed to the component.
 * @returns {JSX.Element} The rendered custom drawer content.
 */
const CustomDrawerContent = (props) => {
  const { participant_username } = useContext(UserContext);
  const pathname = usePathname();

  useEffect(() => {
    console.log("Current Path", pathname);
  }, [pathname]);

  return ( 
    <DrawerContentScrollView {...props}>
      <View style={styles.infoContainer}>
        <View style={styles.infoDetailsContainer}>
          <Text style={styles.appTitle}>StoryPath</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Feather name="user" size={30} color="black" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={{ fontWeight: 'bold', paddingLeft: 5 }}>Current User:</Text>
          <Text style={{ color: 'gray', paddingLeft: 5 }}>{participant_username || "unknown"}</Text>
        </View>
      </View>
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="home"
            size={size}
            color={pathname === "/" ? "#fff" : "#000"}
          />
        )}
        label={"Home"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/" ? "#CF9CD9" : "#fff" }}
        onPress={() => {
          router.push("/");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <FontAwesome
            name="user-circle"
            size={size}
            color={pathname === "/profile" ? "#fff" : "#000"}
          />
        )}
        label={"Profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/profile" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/profile" ? "#CF9CD9" : "#fff" }}
        onPress={() => {
          router.push("/profile");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <FontAwesome
            name="th-list"
            size={size}
            color={pathname === "/projectList" ? "#fff" : "#000"}
          />
        )}
        label={"Project"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/projectList" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/projectList" ? "#CF9CD9" : "#fff" }}
        onPress={() => {
          router.push("/projectList");
        }}
      />
    </DrawerContentScrollView>
  );
};

/**
 * Provides the layout for the StoryPath app, including the drawer navigation.
 * Manages the state for the current participant's username and 
 * wraps the drawer content with a UserContext provider.
 *
 * @returns {JSX.Element} The rendered layout component with the drawer.
 */

export default function Layout() {
  const [participant_username, setParticipantUsername] = useState("");

 return (
  <UserContext.Provider
      value={{ participant_username, setParticipantUsername }}
    >
     <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="index" options={{ headerShown: true, headerTitle: "Home" }} />
        <Drawer.Screen name="profile" options={{ headerShown: true, headerTitle: "Profile" }} />
        <Drawer.Screen name="projectList" options={{ headerShown: true, headerTitle: "Project" }} />
      </Drawer>
    </UserContext.Provider>
  );  
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  infoContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  infoDetailsContainer: {
    marginTop: 25,
    marginLeft: 10,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
