import { ProjectContext } from './context';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useEffect, useState, useContext } from 'react';
import { Fontisto } from '@expo/vector-icons';
import { UserContext } from '../context';
import { getLocation, createTracking, getTracking, getLocationParticipantCount } from '../api';
import RNPickerSelect from 'react-native-picker-select';

/**
 * LocationContent component renders the user interface for displaying 
 * location-related content when the location is unlocked, including visited locations, points, and 
 * participant information. It manages state and interacts with APIs to fetch and update tracking data.
 *
 * @returns {JSX.Element} The rendered component containing the location 
 * content, a dropdown menu allowing users to see all the unlocked locations, and participant stats (scores and visited locations).
 */

export default function LocationContent() {
    const { location, project, totalPoints, currentPoint, setCurrentPoint, numVisited, setNumVisited, location_id, 
        visitedLoc, setVisitedLoc, selectedLoc, setSelectedLoc, points, setScorePoints} = useContext(ProjectContext);
    const [tracking, setTracking] = useState([])
    const [number_participants, setNumParticipant] = useState(0)
    const [selectedValue, setSelectedValue] = useState(location_id)

    const { participant_username } = useContext(UserContext);

    const project_id = project.id

    useEffect(() => {
        if (location_id) {
            const location = visitedLoc.find(loc => loc.id === location_id);
            if (location) {
                setScorePoints(currentPoint);
                setSelectedLoc(location);
                setSelectedValue(location.id);
            } else {
                // Fetch only if not found in visitedLoc
                const fetchLocation = async () => {
                    try {
                        let location = await getLocation(location_id);
                        location = location[0];
                        setScorePoints(location.score_points);
                        setSelectedLoc(location);
                        setSelectedValue(location.id);
                    } catch (error) {
                        console.error('Error:', error);
                        Alert.alert('Error', 'Failed to get location');
                    }
                };
                fetchLocation();
            }
        }
    }, [location_id, visitedLoc]); 
    

    useEffect(() => {
        const fetchTrackings = async () => {
            try {
                const fetchedTracking = await getTracking();
                setTracking(fetchedTracking);
            } catch (error) {
                console.error('Error fetching tracking:', error);
            }
        };
        fetchTrackings();
    }, []);
    
   
    useEffect(() => {
        const trackings = { project_id, location_id, points, participant_username };

        if (location_id) {
            const checkAndCreateTracking = async () => {
                try {
                    const existingTracking = tracking.find(t => 
                        t.location_id === location_id && 
                        t.project_id === project_id && 
                        t.participant_username === participant_username
                    );
        
                    if (!existingTracking) {
                        const newTracking = await createTracking(trackings);
                        setTracking(prevTracking => [...prevTracking, newTracking]);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Alert.alert('Error', 'Failed to create tracking');
                }
            };
            checkAndCreateTracking();
        }
    }, [location_id, points, participant_username, project_id]);

    // Increment the point and visited location when unlock a location
    useEffect(() => {
        if (selectedLoc && !visitedLoc.some(loc => loc.id === selectedLoc.id)) {
            setCurrentPoint(currentPoint + selectedLoc.score_points);
            setNumVisited(numVisited + 1);
            setVisitedLoc([...visitedLoc, selectedLoc]);
        }
    }, [selectedLoc]);
    

    // This is for the dropdown menu
    const options = visitedLoc.map((loc) => {
        if (loc && loc.location_name && loc.id) { 
            return { label: loc.location_name, value: loc.id };
        }
        return null; 
    }).filter(item => item !== null); 
    

    // Get number of visited participants in that location
    useEffect(() => {
        if (location_id) {
            const fetchParticipant = async () => {
                try {
                    let participants = await getLocationParticipantCount(location_id); 
                    participants = participants[0];
                    setNumParticipant(participants?.number_participants ?? 0); 
                } catch (error) {
                    console.error("Failed to fetch participants for project:", error);
                }
            }
            fetchParticipant();
        }
        }, [location_id]);


    return (
        <View style={[styles.container, { flexDirection: 'column' }]}>
            {/* When no location has been unlocked */}
            {numVisited === 0 ? (
                <View style={{flex: 2, flexDirection: 'column',
                    justifyContent: "center",
                    alignItems: "center",}}>
                    <Fontisto name='locked' size={50} color={'#D99CC4'}></Fontisto>
                    <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 10, paddingHorizontal: 20, color:"purple" }}>No locations visited yet. Scan your QR code or visit the place to unlock your location!</Text>
                </View>
            ) : (
            <>
                <View style={styles.header}>
                    <Text style={styles.title}>Locations</Text>
                </View>

                {/* The drop down menu */}
                <Text style={{marginHorizontal: 30, marginTop: 10}}>Press the drop down menu to change content</Text>
                <Text style={{marginHorizontal: 30, fontSize: 12}}>(Note: sometimes might need to press multiple times for menu to display)</Text>

                <View style={styles.dropdown}>
                    {/* I used ChatGPT to find out how to change content when location is selected in the drop down menu
                        I also used RNPickerSelect from here
                        https://medium.com/@abdurrehman1/how-to-make-a-dropdown-in-react-native-21271e6f923b */}
                    <RNPickerSelect
                        placeholder={{ label: 'Select a visited location...', value: null }}
                        items={options}
                        onValueChange={async (value) => {
                            setSelectedValue(value);
                            const selectedLocation = visitedLoc.find(loc => loc.id === value);
                            setSelectedLoc(selectedLocation);
                        }}
                        value={selectedValue} // Set the initial selected location
                    />
                </View>

                {/* The content */}
                <View style={styles.card}>
                    <View style={styles.content}>
                        <Text style={styles.locName}>{selectedLoc?.location_name}</Text>
                        {/* Adding style to the html: https://medium.com/nerd-for-tech/custom-style-to-vs-code-extension-f0c48a259926 */}
                        <View style={{flex: 2}}>
                        <WebView 
                            originWhitelist={['*']}
                            source={{
                                html: `
                                    <html>
                                        <head>
                                            <style>
                                                body { font-size: 42px; font-family: Arial, Helvetica, sans-serif } 
                                            </style>
                                        </head>
                                        <body>
                                            ${selectedLoc?.location_content}
                                        </body>
                                    </html>
                                `
                            }}
                        ></WebView>
                        </View>
                        
                        {selectedLoc?.clue && (
                            <View style={styles.clue}>
                                <Text style={{fontSize: 16, color:'#CF4FC4', paddingBottom: 6}}>Clue for next location</Text>
                                <Text>{selectedLoc?.clue}</Text>
                            </View>
                        )}
                    </View>

                    <View style={{flexDirection: 'column'}}>

                    <View style={styles.small_container}>
                        {/* Display and track points */}
                        {project?.participant_scoring !== 'Not Scored' && (
                            <View style={styles.small_card}>
                                <Text style={styles.card_info}>Points</Text>
                                <Text style={styles.card_info}>{currentPoint}/{totalPoints}</Text>
                            </View>
                        )}
                        {/* Display and track locations */}
                        <View style={styles.small_card}>
                            <Text style={styles.card_info}>Locations Visited</Text>
                            <Text style={styles.card_info}>
                                {numVisited}/{location.length}
                            </Text>
                        </View>
                    </View>
                        <View style={styles.participantContainer}>
                            <Text style={styles.participantText}>Number of Participants: {number_participants}</Text>
                        </View>                    
                    </View>
                </View>
            </>
        )}
    </View>
);
        
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "#9370DB",
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
    padding: 15
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
      height: '55%'
    },
    content: {
      padding: 15,
      flex: 1,
    },
    small_container: {
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
    },
    dropdown: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: 5,
        padding: 15,
        borderRadius: 40,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
    },
    locName: {
        fontSize: 20,
        textAlign: 'center',
        paddingBottom: 10,
        color: '#6A44B1',
        fontWeight: 'bold'
    },
    clue: {
        flex: 1,
    },
    participantContainer: {
        margin: 15,
        backgroundColor: '#8981DD',
        padding: 10,
        borderRadius: 10,  
    },
    participantText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
  });
  