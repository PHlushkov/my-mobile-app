import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '../../firebase/firebase';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, listAll } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';

const storage = getStorage(app);
const db = getFirestore();

export const getVideoList = createAsyncThunk('posts/getVideoList', async (_, { dispatch }) => {
  try {
    const videoCollection = collection(db, 'videos');
    const videoSnapshot = await getDocs(videoCollection);

    const resultList = await Promise.all(
      videoSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const videoRef = ref(storage, `video/${data.name}`);
        const url = await getDownloadURL(videoRef);
        return {
          ...data,
          url,
        };
      }),
    );

    dispatch(setPosts(resultList));
  } catch (error) {
    console.error('Error fetching video list:', error);
  }
});

export const uploadVideo = createAsyncThunk('posts/uploadVideo', async (uri) => {
  try {
    const response = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });

    const byteCharacters = atob(response);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const fileUrl = await fetch(uri);
    const blob = await fileUrl.blob();

    const videoName = `${Date.now()}.mp4`;
    const storageRef = ref(storage, `video/${videoName}`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const docRef = await addDoc(collection(db, 'videos'), {
              name: videoName,
              title: 'New Video',
              description: 'This is a description',
              likes: 0,
              url: downloadURL,
            });
            resolve({
              name: videoName,
              title: 'New Video',
              description: 'This is a description',
              likes: 0,
              url: downloadURL,
            });
          } catch (error) {
            console.error('Error setting video document:', error);
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
});

const initialState = {
  posts: [],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, { payload }) => {
      state.posts = payload;
    },
  },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;
