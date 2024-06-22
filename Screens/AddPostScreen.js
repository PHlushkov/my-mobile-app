import * as ImagePicker from 'expo-image-picker';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { getVideoList, uploadVideo } from '../redux/slice/postsSlice';

export default function AddPostScreen() {
  const dispatch = useDispatch();

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const actionResult = await dispatch(uploadVideo(result.assets[0].uri));
      if (uploadVideo.fulfilled.match(actionResult)) {
        Alert.alert('Success', 'Video uploaded successfully!');
        dispatch(getVideoList());
      } else {
        Alert.alert('Error', 'Failed to upload video.');
      }
    }
  };

  const getCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return false;
    }
    return true;
  };


  const getCameraRollPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const takeVideo = async () => {
    const hasCameraPermission = await getCameraPermissions();
    const hasCameraRollPermission = await getCameraRollPermissions();

    if (!hasCameraPermission || !hasCameraRollPermission) {
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {

      const actionResult = await dispatch(uploadVideo(result.assets[0].uri));
      if (uploadVideo.fulfilled.match(actionResult)) {
        dispatch(getVideoList());
        Alert.alert('Success', 'Video uploaded successfully!');
      } else {
        Alert.alert('Error', 'Failed to upload video.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a Video from Gallery" onPress={pickVideo} />
      <Button title="Take a Video" onPress={takeVideo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
