import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { getParticipantCount } from "./api";

/**
 * Renders a project card with its title and participant count.
 *
 * This component displays the project's title, the number of participants 
 * associated with the project, and an icon indicating that it can be pressed 
 * for further actions. It fetches the number of participants entering this project before.
 *
 * @param {Object} project - The project object containing details about the project.
 * @param {function} onPress - Callback function to be executed when the project 
 *                             item is pressed.
 * @returns {JSX.Element} A pressable view displaying the project title, number 
 *                       of participants, and an icon.
 */
export default function Project({ project, onPress }) {
    const [numberParticipants, setNumberParticipants] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            if (project.id) {
                const fetchParticipant = async () => {
                    try {
                        const participants = await getParticipantCount(project.id);
                        setNumberParticipants(participants?.[0]?.number_participants ?? 0);
                    } catch (error) {
                        console.error("Failed to fetch participants for project:", error);
                    }
                };
                fetchParticipant();
            }
        }, [project.id])
    );

    return (
        <Pressable
            style={({ pressed }) => ({
                padding: 16,
                marginTop: 13,
                borderRadius: 15,
                backgroundColor: pressed ? "#EFEFEF" : "white",
            })}
            onPress={onPress}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                }}
            >
                {/* Project Title */}
                <Text style={{ flex: 3, fontSize: 16, color: "black" }}>
                    {project.title}
                </Text>
                
                {/* Number of Participants */}
                <View
                    style={{
                        flex: 2,
                        backgroundColor: "#9370DB",
                        padding: 2,
                        borderRadius: 15,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "white" }}>
                        Participants: {numberParticipants}
                    </Text>
                </View>

                {/* Icon */}
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Feather name="chevron-right" size={40} color="#9400D3" />
                </View>
            </View>
        </Pressable>
    );
}
