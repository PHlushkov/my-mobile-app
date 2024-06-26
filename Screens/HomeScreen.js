import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Posts from '../Components/Posts/Posts';
import Navigation from '../Components/Navigation/Navigation';

export default function HomeScreen() {
  return (
    <View style={styles.appBody}>
      <Posts />
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
