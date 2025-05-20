import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from 'expo-router';
import Project from "./project";
import { getProjects } from "./api";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

/**
 * Renders a list of published projects with a loading indicator.
 *
 * This component fetches projects from an API and displays them in a list format. 
 * If no published projects are found, it shows a message prompting the user to 
 * add new projects. While projects are being fetched, a loading indicator is displayed.
 *
 * @returns {JSX.Element} A view containing either a loading indicator, a message 
 *                       when no projects are available, or a list of published 
 *                       projects rendered by the Project component.
 */
export default function ProjectList() {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const fetchedProjects = await getProjects();
                const filteredProjects = fetchedProjects.filter(project => project.is_published);
                setProjects(filteredProjects);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false); // Set loading to false after the data is fetched
            }
        };
        fetchProjects();
    }, []);

    // Show the loading screen when the projects are still fetching
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ba55d3" />
                <Text style={styles.loadingText}>Loading Projects...</Text>
            </View>
        );
    }

    return (
        projects.length == 0 ? 
        // When there is no published project
        <View style={{ flex: 2,
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: "center",
            }}>
            <MaterialIcons name="announcement" size={40} color={"purple"}></MaterialIcons>
            <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 20, color:"purple" }}>
                You don't have any published projects. Add new project to start your adventures!
            </Text> 
        </View>
        :
        <View style={{ flex: 1, backgroundColor: "white", flexDirection: 'column' }}>
            <View style={styles.header}>
                <FontAwesome name="th-list" size={80} color={"purple"} />
                <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 20, color: '#ba55d3' }}>Projects</Text>
            </View>
            <View style={styles.projectContainer}>
                <FlatList
                    data={projects}
                    keyExtractor={project => project.id.toString()} 
                    renderItem={({ item }) => (
                        <Project
                            project={item}
                            onPress={() => router.push(`${item.id}/project_home`)}
                        />
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "white",
        borderBottomColor: "#D3D3D3",
        borderBottomWidth: 2,
        paddingTop: 5,
    },
    projectContainer: {
        paddingHorizontal: 12,
        flex: 4,
        backgroundColor: "#f2f2f2",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#ba55d3',
    },
});
