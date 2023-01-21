import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';

function QuizScreen({navigation, route}) {
    const [dataAsync, setAsync] = useState([]);
    const [isChecked, setChecked] = useState(false);
    
    const getData = async (typ) => {
        try {
            const value = await AsyncStorage.getItem(typ)
            if(value !== null && typ === 'otazky') {
                setAsync(JSON.parse(value));
            }
            else if(value !== null && typ === 'otherP') {
                setP(value);
            }
            else if(value !== null && typ === 'otherP2') {
                setP2(value);
            }
            else if(value !== null && typ === 'otherP3') {
                setP3(value);
            }
        } catch(e) {
            console.log("an error");
        }
    }
    const [p, setP] = useState(getData('otherP'));
    const [p2, setP2] = useState(getData('otherP2'));
    const [p3, setP3] = useState(getData('otherP3'));
    
    // pri zmene obtiznosti
    useEffect(() => {
        console.log('MENIM DIFF')
        getData('otazky');
    }, [p3])

    // pri zmene kategorie
    useEffect(() => {
        console.log('MENIM CATEGORY')
        getData('otazky');
    }, [p2])

    // pri zmene poctu otazek
    useEffect(() => {
        console.log('MENIM CISLA')
        getData('otazky');
    }, [p])
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView>
                {dataAsync.map(item => {
                    const index = dataAsync.findIndex(object => {
                        return object.question === item.question;
                    });
                    return (
                        <SafeAreaView key={index} style={{ paddingHorizontal: 10}}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{dataAsync[index].question}</Text>
                            <View style={styles.section}>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={isChecked}
                                    onValueChange={setChecked}
                                    color={isChecked ? '#4630EB' : undefined}
                                    />
                                <Text style={styles.paragraph}>{dataAsync[index].correct_answer}</Text>
                            </View>
                            <View style={styles.section}>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={isChecked}
                                    onValueChange={setChecked}
                                    color={isChecked ? '#4630EB' : undefined}
                                    />
                                <Text style={styles.paragraph}>{dataAsync[index].incorrect_answers[0]}</Text>
                            </View>
                            <View style={styles.section}>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={isChecked}
                                    onValueChange={setChecked}
                                    color={isChecked ? '#4630EB' : undefined}
                                    />
                                <Text style={styles.paragraph}>{dataAsync[index].incorrect_answers[1]}</Text>
                            </View>
                            <View style={styles.section}>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={isChecked}
                                    onValueChange={setChecked}
                                    color={isChecked ? '#4630EB' : undefined}
                                    />
                                <Text style={styles.paragraph}>{dataAsync[index].incorrect_answers[2]}</Text>
                            </View>
                        </SafeAreaView>
                    )
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 16,
      marginVertical: 32,
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    paragraph: {
      fontSize: 15,
    },
    checkbox: {
      margin: 8,
    },
  });

export default QuizScreen;