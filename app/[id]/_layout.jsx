import React, {useState} from 'react'
import { Tabs, router } from 'expo-router'
import { Feather, MaterialIcons, Fontisto } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { ProjectContext } from './context';

/**
 * The _layout component provides the main structure for the application,
 * managing state and tabbed navigation for the specific project screen.
 *
 * @returns {JSX.Element} The rendered layout component containing the tabbed 
 * interface and the context provider for managing project state.
 */

export default function _layout() {
  const [location, setLocation ] = useState([])
  const [project, setProject ] = useState([])
  const [default_display, setDefaultDisplay] = useState('Display initial clue')
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentPoint, setCurrentPoint] = useState(0)
  const [numVisited, setNumVisited] = useState(0)
  const [location_id, setScannedData] = useState('');
  const [visitedLoc, setVisitedLoc] = useState([])
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [points, setScorePoints] = useState(0);


  return (
    <ProjectContext.Provider value={{location, setLocation, default_display, setDefaultDisplay, project, setProject, totalPoints, setTotalPoints, 
      currentPoint, setCurrentPoint, numVisited, setNumVisited, location_id, setScannedData, visitedLoc, setVisitedLoc, selectedLoc, setSelectedLoc,
      points, setScorePoints
    }}>
      <Tabs screenOptions={{headerLeft: () => <DrawerToggleButton tintColor='#000' />}}>
          <Tabs.Screen name='project_home' options={{
            tabBarIcon: ({color}) => (
              <Fontisto name="preview" size={24} color={color} />
            ),
            tabBarLabel: 'Project Home',
            headerTitle: 'Project Home'
          }} 
          />
          <Tabs.Screen name='map' options={{
            tabBarIcon: ({color}) => (
              <Feather name="map-pin" size={24} color={color} />
            ),
            tabBarLabel: 'Map',
            headerTitle: 'Map'
          }}   />
          <Tabs.Screen name='QRCode' options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons name="qr-code-scanner" size={24} color={color} />
            ),
            tabBarLabel: 'QR Code Scanner',
            headerTitle: 'QR Code Scanner'
          }}  />
          <Tabs.Screen name='location_content' options={{
            tabBarIcon: ({color}) => (
              <Feather name="file-text" size={24} color={color} />
            ),
            tabBarLabel: 'Location Content',
            headerTitle: 'Location Content',
          }}  />
        </Tabs>
    </ProjectContext.Provider>
   
  )
}