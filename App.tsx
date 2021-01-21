import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, FlatList, ScrollView } from 'react-native';
import Button from 'react-native-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import words from "./words.js";


export default function App() {

  const handleSurroundingLettersChange = (text: string): void => {

    const regex: RegExp = /^[A-Z]*$/;
    const valid = regex.test(text);

    // Ensure only uppercase letters are inputted
    if (!valid)
      return;

    // Don't allow duplicate letters in input
    const inputSet = new Set(text);
    if (inputSet.size !== text.length)
      return;

    // Don't allow the center letter in the surrounding letters
    if (state.centerLetter !== "" && inputSet.has(state.centerLetter))
      return;

    setState({ ...state, surroundingLetters: text });

  }

  const disableButton = (): boolean => {
    return !(state.centerLetter.length === 1 && state.surroundingLetters.length === 6);
  }

  const solvePuzzle = () => {

    let solutions: Array<string> = [];
    const centerLetter: string = state.centerLetter.toLowerCase();
    const surroundingLetters: string = state.surroundingLetters.toLowerCase();

    const inputSet: object = new Set(centerLetter + surroundingLetters);

    for (var i = 0; i < words.length; ++i) {

      const wordSet = new Set(words[i]);

      // Must contain center letter
      if (!wordSet.has(centerLetter))
        continue;

      // Set difference operation
      // set(words[i]) - set(input)
      let difference = new Set([...wordSet].filter(x => !inputSet.has(x)));
      if (difference.size === 0)
        solutions.push(words[i]);

    }

    solutions.sort();
    const columnLength: number = solutions.length;

    setState(
      {
        ...state,
        solutions: solutions,
        solutionColumnOne: solutions.slice(0, columnLength/3),
        solutionColumnTwo: solutions.slice((columnLength/3)+1, (2*columnLength/3)),
        solutionColumnThree: solutions.slice((2*columnLength/3)+1, columnLength-1),
      }
    );


  }


  const [state, setState] = React.useState({
    centerLetter: "",
    surroundingLetters: "",
    solutions: [],
    solutionColumnOne: ["potato", "amama", "gabaga"],
    solutionColumnTwo: ["2potato", "a22mama", "g2222abaga"],
    solutionColumnThree: ["pota3333to", "a3m3a3ma", "gaba3ga"],
  });

  // const renderItem = ({ item }) => (
  //   <View style={styles.item}>
  //     <Text style={styles}>{item}</Text>
  //   </View>

  // );

  return (

    <KeyboardAwareScrollView>
      <SafeAreaView style={styles.safeAreaContainer}>

        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>New York Times</Text>
            <Text style={styles.titleText}>Spelling Bee Puzzle Solver</Text>

          </View>

          <View style={styles.centerContainer}>
            <Text style={styles.solutionsTitleText}>
              Solutions
            </Text>           


            <FlatList
              style={styles.solutionsContainer}
              contentContainerStyle={{justifyContent: 'center'}}
              numColumns={3}
              // horizontal={false}
              data={state.solutions}
              keyExtractor={item => item}
              renderItem={({item})=>
                <View style={{...styles.item}}>
                  <Text>{item}</Text>
                </View>
              }
              
            />

            <View style={styles.inputContainer}>
              <Text style={styles.textInputTitle}>Enter Center Letter</Text>
              <TextInput
                style={[styles.textInput, { borderColor: '#F8D005' }]}
                onChangeText={text => setState({ ...state, centerLetter: text })}
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
                // onChangeText={text => setState({...state, surroundingLetters:text})}
                onChangeText={text => handleSurroundingLettersChange(text)}
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
                style={{ fontSize: 25, color: "#3679af" }}
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

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 15,
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 48
  },
  safeAreaContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold"
  },
  solutionsTitleText: {
    fontSize: 18,
  },
  solutionsContainer: {

    
    // flexWrap: 'wrap',

    // padding: 10,
    marginTop: 6,
    width: 350,
    height: 300,
    flexDirection: "column",
    borderWidth: 2,
    // flex: 1, 
    // alignItems: "center"
  },
  solutionsColumn: {
    alignItems: "center",
    flexDirection: "column",
    flex: 1
  },
  inputContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  textInput: {
    height: 45,
    width: 350,
    borderWidth: 2,
    fontSize: 30
  },
  textInputTitle: {
    fontSize: 18
  },
  solutionText: {
    fontSize: 16
  },

  item: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexGrow: 1,
    flex: 1,
  },
  title: {
    fontSize: 32,
  },
});


{/*               
  <View style={styles.solutionsContainer}>
    <View style={styles.solutionsColumn}>
      {state.solutionColumnOne.map(solution => (
        <Text style={styles.solutionText} key={solution}>{solution}</Text>
      ))}
    </View>



    <View style={styles.solutionsColumn}>
      {state.solutionColumnTwo.map(solution => (
        <Text style={styles.solutionText} key={solution}>{solution}</Text>
      ))}
    </View>

    <View style={styles.solutionsColumn}>
      {state.solutionColumnThree.map(solution => (
        <Text style={styles.solutionText} key={solution}>{solution}</Text>
      ))}
    </View>

  </View> */}