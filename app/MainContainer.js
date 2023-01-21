import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';

const homeName = 'Home';
const quizName = 'Quiz';
const Tab = createBottomTabNavigator();

function MainContainer() {
    return(
        <NavigationContainer>
            <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if(rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === quizName) {
                        iconName = focused ? 'list' : 'list-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarLabelStyle: { paddingBottom: 10, fontSize: 17},
                tabBarStyle: {padding: 10, height: 70}
            })}>

            <Tab.Screen name={homeName} component={HomeScreen} />
            <Tab.Screen name={quizName} component={QuizScreen} />

            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default MainContainer;