import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from './firebase';
import { setPosts } from '../redux/slice/postsSlice';

const storage = getStorage(app);
const db = getFirestore();

export const getVideoList = async (dispatch) => {
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
};

export const uploadVideo = async ({ uri, title, description, tags, userId }) => {
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
            reject(error);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
      );
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};
