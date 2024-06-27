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

export const uploadVideo = createAsyncThunk(
  'posts/uploadVideo',
  async ({ uri, title, description, tags, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const blob = await response.blob();

      const videoName = `${Date.now()}.mp4`;
      const storageRef = ref(storage, `video/${videoName}`);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error('Upload error:', error);
            rejectWithValue(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await addDoc(collection(db, 'videos'), {
                name: videoName,
                title,
                description,
                tags: tags.split(',').map((tag) => tag.trim()),
                userId,
                url: downloadURL,
                likes: 0,
              });
              resolve(downloadURL);
            } catch (error) {
              console.error('Error setting video document:', error);
              rejectWithValue(error);
            }
          },
        );
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      return rejectWithValue(error);
    }
  },
);

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
