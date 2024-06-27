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
import { useSelector } from 'react-redux';

export default function HomeScreen() {
  const posts = useSelector((state) => state.posts.posts);

  const [inputVisible, setInputVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredPosts(posts);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = posts.filter((post) =>
        post.tags.some((tags) => tags.toLowerCase().includes(lowercasedQuery)),
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const toggleInput = () => {
    setInputVisible((prev) => !prev);
    setSearchQuery('');
  };

  const hideInput = () => {
    setInputVisible(false);
    setSearchQuery('');
  };

  return (
    <TouchableWithoutFeedback onPress={hideInput}>
      <View style={styles.appBody}>
        <Posts posts={filteredPosts} />
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
