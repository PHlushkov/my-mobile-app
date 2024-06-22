import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ButtonNavigation({ iconSource, title, onPress }) {
  return (
    <TouchableOpacity style={styles.buttonWrapper} onPress={onPress}>
      <Image style={styles.iconButton} source={iconSource} />
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'colum',
    alignItems: 'center',
    gap: 5,
    padding: 10,
    borderRadius: 5,
  },
  iconButton: {
    width: 30,
    height: 30,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
  },
});
