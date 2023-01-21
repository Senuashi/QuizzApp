import * as React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);

    // token
    const [dataToken, setToken] = useState([]);
    
    // kategorie
    const [dataCategory, setCategory] = useState([]);
    const [valueCategory, setCategoryValue] = useState(9);
    const [openCategory, setOpenCategory] = useState(false);

    // obtiznost
    const [formatedNumber, setFormatedNumber] = useState([])
    const [valueNumber, setNumberValue] = useState('easy');
    const [openNumber, setOpenNumber] = useState(false);

    // pocet otazek
    const [questionCount, setQuestionCount] = useState([]);
    const [valueCount, setCountValue] = useState(10);
    const [openCount, setOpenCount] = useState(false);

    const getCategory = async () => {
        try {
            const response = await fetch('https://opentdb.com/api_category.php');
            const json = await response.json();
            setCategory(json.trivia_categories);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getToken = async () => {
        try {
            const response = await fetch('https://opentdb.com/api_token.php?command=request');
            const json = await response.json();
            setToken(json.token);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('otazky', jsonValue)
            await AsyncStorage.setItem('otherP', valueCount.toString())
            await AsyncStorage.setItem('otherP2', valueCategory.toString())
            await AsyncStorage.setItem('otherP3', valueNumber.toString())
        } catch (e) {
            console.log("an error");
        }
    }

    const getDifficulty = async () => {
        try {
            const response = await fetch(`https://opentdb.com/api_count.php?category=${valueCategory}`);
            const json = await response.json();
            setFormatedNumber([
                {label: `Easy (${json.category_question_count.total_easy_question_count} questions)`, value: 'easy'},
                {label: `Medium (${json.category_question_count.total_medium_question_count} questions)`, value: 'medium'},
                {label: `Hard (${json.category_question_count.total_hard_question_count} questions)`, value: 'hard'},
        ]);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    // pri zmene promenne valueCategory / neboli pri zmene kategorie
    useEffect(() => {
        getDifficulty(); 
    }, [valueCategory])
    
    // jen pri spusteni programu
    useEffect(() => {
        console.log("START //////////////////////////////////////////////////////////////////////////////");
        getCategory(); // fetchneme vsechny kategorie
        getToken(); // ziskame token
        getDifficulty(); // fetchneme pocet otazek kazde obtiznosti vybrane kategorie
        setQuestionCount([
        {label: 10, value: 10},
        {label: 25, value: 25},
        {label: 50, value: 50}
        ]);
    }, []);

    return (
        <View style={{ flex: 1, padding: 30, zIndex: 0 }}>
            <Text style={styles.text}>Category:</Text>
            {isLoading ? <ActivityIndicator/> : (
                <DropDownPicker
                    open={openCategory}
                    value={valueCategory}
                    items={dataCategory.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))}
                    setValue={setCategoryValue}
                    setItems={setCategory}
                    setOpen={setOpenCategory}
                    autoScroll={true}
                    zIndex={3}
                    selectedItemLabelStyle={{
                        fontWeight:'bold'
                    }}
                />
            )}
            <Text style={styles.text}>Difficulty:</Text>
            {isLoading ? <ActivityIndicator/> : (
                <DropDownPicker
                    open={openNumber}
                    value={valueNumber}
                    items={formatedNumber}
                    setValue={setNumberValue}
                    setItems={setFormatedNumber}
                    setOpen={setOpenNumber}
                    zIndex={2}
                    selectedItemLabelStyle={{
                        fontWeight:'bold'
                    }}
                />
            )}
            <Text style={styles.text}>Question count:</Text>
            {isLoading ? <ActivityIndicator/> : (
                <DropDownPicker
                    open={openCount}
                    value={valueCount}
                    items={questionCount}
                    setValue={setCountValue}
                    setItems={setQuestionCount}
                    setOpen={setOpenCount}
                    zIndex={1}
                    selectedItemLabelStyle={{
                        fontWeight:'bold'
                    }}
                />
            )}
            <View style={{ paddingTop: 45, paddingHorizontal: 50}}>
                <Button onPress={async () => {
                    const response = await fetch(`https://opentdb.com/api.php?amount=${valueCount}&category=${valueCategory}&difficulty=${valueNumber}`);
                    const json = await response.json();
                    if(json.response_code === 1) {
                        alert('Not enough questions. Please choose a different category or difficulty.')
                    }

                    storeData(json.results);
                    navigation.navigate('Quiz', {
                        otherParam: valueCount,
                        otherParam2: valueCategory,
                        otherParam3: valueNumber
                    })
                }
            } 
            title={'Generate'}
            color={'purple'}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
      fontSize: 24,
      lineHeight: 50,
    }
})