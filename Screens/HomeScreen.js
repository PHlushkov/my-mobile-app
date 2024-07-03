import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import Posts from '../Components/Posts/Posts';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserData, getVideoList, resetUserData, toggleLike } from '../redux/slice/postsSlice';

export default function HomeScreen() {
  const posts = useSelector((state) => state.posts.posts);
  const user = useSelector((state) => state.posts.user);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(getUserData(user.uid));
      } else {
        dispatch(resetUserData());
      }
      dispatch(getVideoList());
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const filteredByLikes = posts.filter((post) => !user.likedPosts.includes(post.name));
      setFilteredPosts(filteredByLikes);
    } else {
      setFilteredPosts(posts);
    }
  }, [user, posts]);

  useEffect(() => {
    if (searchQuery === '') {
      if (user) {
        const filteredByLikes = posts.filter((post) => !user.likedPosts.includes(post.name));
        setFilteredPosts(filteredByLikes);
      } else {
        setFilteredPosts(posts);
      }
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const updatedPosts = filteredPosts.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase().includes(lowercasedQuery)),
      );
      setFilteredPosts(updatedPosts);
    }
  }, [searchQuery, user, posts]);

  const toggleInput = () => {
    setInputVisible((prev) => !prev);
    setSearchQuery('');
  };

  const hideInput = () => {
    setInputVisible(false);
    setSearchQuery('');
  };

  const handleLike = (postId, liked) => {
    if (currentUser) {
      dispatch(toggleLike({ postId, userId: currentUser.uid, liked }));
      // Delay the update of filteredPosts until re-fetching user data
    } else {
      alert('Please sign in to like the post.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={hideInput}>
      <View style={styles.appBody}>
        <Posts posts={filteredPosts} onLike={handleLike} />
        <TouchableOpacity style={styles.searchBtn} onPress={toggleInput}>
          <Image style={styles.img} source={require('../assets/icons/search.png')} />
        </TouchableOpacity>
        {inputVisible && (
          <TextInput
            onChangeText={(text) => setSearchQuery(text)}
            placeholder="Search"
            style={styles.input}
            autoFocus
          />
        )}
        <StatusBar theme="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  appBody: {
    position: 'relative',
    height: '100%',
  },
  searchBtn: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 20,
  },
  img: {
    width: 35,
    height: 35,
  },
  input: {
    width: '80%',
    position: 'absolute',
    top: 45,
    left: 60,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 10,
  },
});
