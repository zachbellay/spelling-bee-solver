import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';

import {
  StyleSheet, Text, View, SafeAreaView, TextInput, FlatList, ScrollView,
} from 'react-native';
import Button from 'react-native-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import words from './words.js';

import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import {
  AdMobBanner,
  setTestDeviceIDAsync
} from 'expo-ads-admob';

import Constants from 'expo-constants';

const testID = 'ca-app-pub-3940256099942544/2934735716';
const productionID = 'ca-app-pub-5654241706205029/1198524964';

// Is a real device and running in production.
const isProduction = Constants.isDevice && !__DEV__;
const adUnitID = isProduction ? productionID : testID;


export default function App() {
  const styles = StyleSheet.create({
    centerContainer: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      margin: 15,
    },
    bannerAdContainer: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    titleContainer: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
    },
    safeAreaContainer: {
      flex: 1,
    },
    titleText: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    solutionsTitleText: {
      fontSize: 24,
    },
    solutionsContainer: {
      marginTop: 6,
      width: 350,
      height: 300,
      flexDirection: 'column',
      borderWidth: 2,
    },
    solutionsColumn: {
      alignItems: 'center',
      flexDirection: 'column',
      flex: 1,
    },
    inputContainer: {
      alignItems: 'center',
      marginTop: 40,
    },
    textInput: {
      height: 45,
      width: 350,
      borderWidth: 2,
      fontSize: 30,
    },
    textInputTitle: {
      fontSize: 18,
    },
    item: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      flexGrow: 1,
      flex: 1,
    },
    itemText: {
      fontSize: 18
    },
    title: {
      fontSize: 32,
    },
  });

  const [state, setState] = React.useState({
    centerLetter: '',
    surroundingLetters: '',
    solutions: [],
    adsAllowed: false
  });

  useEffect(() => {
    const init = async () => {
      if (!isProduction) {
        // Set global test device ID
        await setTestDeviceIDAsync('EMULATOR');
      }

      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'granted') {
        setState({ ...state, adsAllowed: true });
        console.log('Yay! I have user permission to track data');
      }
      console.log("yes");
      console.log(status);


    }
    init();
    console.log('effect');
    // (async () => {
    //   const { status } = await requestTrackingPermissionsAsync();
    //   if (status === 'granted') {
    //     console.log('Yay! I have user permission to track data');
    //   }
    // })();

  }, []);

  const handleSurroundingLettersChange = (text: string): void => {
    const regex: RegExp = /^[A-Z]*$/;
    const valid = regex.test(text);

    // Ensure only uppercase letters are inputted
    if (!valid) return;

    // Don't allow duplicate letters in input
    const inputSet = new Set(text);
    if (inputSet.size !== text.length) return;

    // Don't allow the center letter in the surrounding letters
    if (state.centerLetter !== '' && inputSet.has(state.centerLetter)) return;

    setState({ ...state, surroundingLetters: text });
  };

  const disableButton = (): boolean => !(state.centerLetter.length === 1 && state.surroundingLetters.length === 6);

  const solvePuzzle = () => {
    const solutions: Array<string> = [];
    const centerLetter: string = state.centerLetter.toLowerCase();
    const surroundingLetters: string = state.surroundingLetters.toLowerCase();

    const inputSet: object = new Set(centerLetter + surroundingLetters);

    for (let i = 0; i < words.length; ++i) {
      const wordSet = new Set(words[i]);

      // Must contain center letter
      if (!wordSet.has(centerLetter))
        continue;

      // Set difference operation
      // set(words[i]) - set(input)
      const difference = new Set([...wordSet].filter((x) => !inputSet.has(x)));
      if (difference.size === 0)
        solutions.push(words[i]);
    }

    solutions.sort();
    const columnLength: number = solutions.length;

    // Adds empty words to round out each row
    const roundedUp = Math.round(columnLength / 3) * 3;
    const colsToAdd = roundedUp - columnLength;
    for (let i = 0; i < colsToAdd; ++i)
      solutions.push(' ');

    setState(
      {
        ...state,
        solutions,
      },
    );
  };

  return (

    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
      <SafeAreaView style={styles.safeAreaContainer}>


        {state.adsAllowed ? (
          <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.bannerAdContainer}>
              <AdMobBanner
                bannerSize="fullBanner"
                adUnitID={adUnitID}
                servePersonalizedAds={true} // true or false
              // onDidFailToReceiveAdWithError={this.bannerError} 
              />
            </View>
          </SafeAreaView>
        ) :
          <Text>Please consider enabling tracking to allow banner ads. This supports my app. Thank you!</Text>
        }


        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Spelling Bee Solver</Text>
          </View>

          <View style={styles.centerContainer}>
            <Text style={styles.solutionsTitleText}>
              Solutions
            </Text>

            <FlatList
              style={styles.solutionsContainer}
              contentContainerStyle={{ justifyContent: 'center' }}
              numColumns={3}
              data={state.solutions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={{ ...styles.item }}>
                  <Text style={{ ...styles.itemText }}>{item}</Text>
                </View>
              )}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.textInputTitle}>Enter Center Letter</Text>
              <TextInput
                style={[styles.textInput, { borderColor: '#F8D005' }]}
                onChangeText={(text) => setState({ ...state, centerLetter: text })}
                value={state.centerLetter}
                autoCorrect={false}
                autoCompleteType="off"
                maxLength={1}
                textAlign="center"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.textInputTitle}>Enter Surrounding Letters</Text>
              <TextInput
                style={[styles.textInput, { borderColor: '#E6E6E6' }]}
                onChangeText={(text) => handleSurroundingLettersChange(text)}
                value={state.surroundingLetters}
                autoCorrect={false}
                autoCompleteType="off"
                maxLength={6}
                textAlign="center"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputContainer}>
              <Button
                style={{ fontSize: 25, color: '#3679af' }}
                styleDisabled={{ color: 'gray' }}
                disabled={disableButton()}
                onPress={() => solvePuzzle()}
              >
                Solve Puzzle
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
