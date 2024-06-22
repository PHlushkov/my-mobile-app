import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
// import styled from 'styled-components/native';
// import Posts from '../Posts/Posts';
// import Navigation from '../Navigation/Navigation';
import Posts from '../Components/Posts/Posts';
import Navigation from '../Components/Navigation/Navigation';

// const AppBody = styled.View`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   height: 100%;
// `;

export default function HomeScreen() {
  return (
    <View style={styles.appBody}>
      <Posts />
      {/* <Navigation /> */}
      <StatusBar theme="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  appBody: {
    position: 'relative',
    height: '100%',
  },
});
