import ButtonNavigation from '../../UiComponents/ButtonNavigation/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

export default function Navigation() {
  const navigation = useNavigation();
  return (
    <View position={{ position: 'relative' }}>
      <View style={styles.navigationBody}>
        <View style={styles.navigationRow}>
          <ButtonNavigation
            onPress={() => navigation.navigate('HomeScreen')}
            iconSource={require('../../assets/icons/home.png')}
            title="Home"
          />
          <ButtonNavigation
            onPress={() => navigation.navigate('AddPostScreen')}
            iconSource={require('../../assets/icons/add.png')}
            title="Add Post"
          />
          <ButtonNavigation
            onPress={() => navigation.navigate('AuthorizationScreen')}
            iconSource={require('../../assets/icons/account.png')}
            title="My"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navigationBody: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    backgroundColor: '#000',
  },
  navigationRow: {
    height: 90,
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
