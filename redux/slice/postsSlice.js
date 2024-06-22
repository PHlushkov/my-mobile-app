import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '../../firebase/firebase';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, listAll } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';

const storage = getStorage(app);

export const getVideoList = createAsyncThunk('posts/getVideoList', async (_, { dispatch }) => {
  const videoStorage = ref(storage, `video`);
  const videoList = (await listAll(videoStorage)).items.map((item) => item.name);

  const resultList = await Promise.all(
    videoList.map(async (name) => {
      const videoRef = ref(storage, `video/${name}`);
      return await getDownloadURL(videoRef);
    }),
  );

  dispatch(setPosts(resultList));
});

export const uploadVideo = createAsyncThunk('posts/uploadVideo', async (uri) => {
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

  const storageRef = ref(storage, `video/${Date.now()}.mp4`);

  const uploadTask = uploadBytesResumable(storageRef, blob);
  let URL;

  uploadTask.on(
    'state_changed',
    (error) => {
      console.log('error', error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        URL = downloadURL;
      });
    },
  );

  return URL;
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
