import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProject, getLocations } from '../api';
import { Ionicons } from '@expo/vector-icons';
import { ProjectContext } from './context';

/**
 * Renders the Project Home screen based on the project user selected in the list of projects, 
 * displaying project details, instructions, initial clues, and visited locations. 
 * It also manages fetching project data and locations from an API,
 * calculating total points, and displaying them on the screen.
 *
 * @returns {JSX.Element} The rendered ProjectHome component containing project details.
 */

export default function ProjectHome() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  const { location, setLocation, setDefaultDisplay, project, setProject, totalPoints, setTotalPoints,
           currentPoint, numVisited
   } = useContext(ProjectContext);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fetchedProjects = await getProject(id); 
        setProject(fetchedProjects[0]);
        setDefaultDisplay(fetchedProjects[0]?.homescreen_display || 'Display initial clue'); 
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        let fetchedLocations = await getLocations();
        fetchedLocations = fetchedLocations.filter((loc) => loc.project_id == (id)); 
        setLocation(fetchedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchProject();
    fetchLocations();
  }, [id]); 

  // Sum all the points to display total points
  useEffect(() => {
    if (location.length > 0) {
        const sum = location.reduce((acc, loc) => acc + (loc.score_points), 0);
        setTotalPoints(sum);
    }
  }, [location]);

  // Display the project homepage content based on the project.homescreen_display setting
  const renderContext = () => {
    return project?.homescreen_display === 'Display initial clue' && project?.initial_clue !== '' ? (
      <View>
        <Text style={styles.section}>Instructions</Text>
        <Text style={styles.info}>                
          {project?.instructions}
        </Text>
        <Text style={styles.section}>Inital Clue</Text>
        <Text style={styles.info}>                
          {project.initial_clue}
        </Text>
      </View>
    ) : project?.homescreen_display === 'Display all locations' ? (
      <View>
        <Text style={styles.section}>Instructions</Text>
        <Text style={styles.info}>                
          {project?.instructions}
        </Text>
        <Text style={styles.section}>
          All Locations
        </Text>
        <View style={styles.info}>
          {location.map((place) => (
            <Text key={place.id} style={{ lineHeight: 20 }}>
              {place.location_name}
            </Text>
          ))}
        </View>
      </View>
    ) :  <View>
          <Text style={styles.section}>
            Instructions
          </Text>
          <Text style={styles.info}>
          {project?.instructions}
          </Text> 
    </View>
  }


  return (
    <View style={styles.container}>
      {/* Going back to the projectList page without needing to do it from the drawer */}
       <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              backgroundColor: '#9370DB',
            },
          ]}
          onPress={() => router.push('../projectList')}
        >
          <View style={{paddingLeft: 5, paddingTop: 5}}>
            <Ionicons name='arrow-back' size={15} >
              <Text
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                  color: 'black',
                  fontWeight: "bold",
                },
              ]}
              >
                Back
              </Text>
            </Ionicons>
          </View>
        </Pressable>

      {/* Project name */}
      <View style={styles.header}>
        <Text style={styles.title}>{project?.title}</Text>
      </View>

      {/* Content of the project */}
      <View style={styles.card}>        
        <View style={styles.content}>
          {renderContext()}
        </View>

        <View style={styles.small_container}>
          {/* Display and track points */}
          {project?.participant_scoring !== 'Not Scored' && 
            <View style={styles.small_card}>
              <Text style={styles.card_info}>Points</Text>
              <Text style={styles.card_info}>{currentPoint}/{totalPoints}</Text>
            </View>
          }
          
          {/* Display and track locations */}
          <View style={styles.small_card}>
            <Text style={styles.card_info}>Locations Visited</Text>
            <Text style={styles.card_info}>
              {numVisited}/{location.length}
            </Text>
          </View>
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
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: '#9370DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 23,
    color: 'white',
  },
  card: {
    flexDirection: 'column',
    margin: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    height: '60%'
  },
  content: {
    padding: 15,
    flex: 2,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 8
  },
  info: {
    paddingBottom: 13,
    lineHeight: 25,
    fontSize: 14
  },
  small_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  small_card: {
    width: 160,
    height: 80,
    backgroundColor: '#CF9CD9',
    borderRadius: 10
  },
  card_info: {
    textAlign: 'center',
    paddingTop: 12,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  }
});
