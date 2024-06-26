import * as ImagePicker from 'expo-image-picker';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { getVideoList, uploadVideo } from '../redux/slice/postsSlice';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';

export default function AddPostScreen() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const pickVideo = async () => {
    const currentUser = getAuth().currentUser;

    if (!currentUser) {
      Alert.alert('Authentication Required', 'Please sign in or register to upload videos.');
      return;
    }

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
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      Alert.alert('Authentication Required', 'Please sign in or register to upload videos.');
      return;
    }

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

  // const handleUpload = async () => {
  //   if (!userId) {
  //     Alert.alert('Authentication Required', 'Please sign in to upload a video.');
  //     return;
  //   }

  //   if (!result.canceled) {
  //     const actionResult = await dispatch(
  //       uploadVideo({ uri: result.assets[0].uri, title, description, tags, userId }),
  //     );
  //     if (uploadVideo.fulfilled.match(actionResult)) {
  //       Alert.alert('Success', 'Video uploaded successfully!');
  //     } else {
  //       Alert.alert('Error', 'Failed to upload video.');
  //     }
  //   }
  // };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChange={(value) => setTitle(value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChange={(value) => setDescription(value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(value) => setTags(value)}
      />
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
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: '80%',
  },
});
