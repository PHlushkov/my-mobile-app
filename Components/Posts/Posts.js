import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Video } from 'expo-av';
import { useDispatch, useSelector } from 'react-redux';
import ButtonNavigation from '../../UiComponents/ButtonNavigation/ButtonNavigation';
import Navigation from '../Navigation/Navigation';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import { app } from '../../firebase/firebase';
import { getVideoList, setPosts } from '../../redux/slice/postsSlice';
import { getAuth } from 'firebase/auth';

const { height } = Dimensions.get('window');

const storage = getStorage(app);

export default function Posts() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.posts);

  const auth = getAuth();

  const togglePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
  };

  useEffect(() => {
    dispatch(getVideoList());
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.postBody}>
      <TouchableOpacity onPress={togglePlayPause}>
        <Video
          source={{ uri: item.url }}
          resizeMode="cover"
          shouldPlay={isPlaying && activeIndex === index}
          isLooping
          style={{ height: height, width: '100%' }}
        />
      </TouchableOpacity>
      <View style={styles.postButton}>
        <ButtonNavigation
          iconSource={require('../../assets/icons/like.png')}
          title={`${item.likes}`}
        />
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={{ position: 'relative' }}>
      {posts.length > 0 && (
        <FlatList
          data={posts}
          renderItem={({ item, index }) => renderItem({ item, index })}
          pagingEnabled
          keyExtractor={(_, ind) => ind}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={({ viewableItems }) => {
            if (viewableItems && viewableItems.length > 0) {
              setActiveIndex(viewableItems[0].index);
            } else {
              setActiveIndex(null);
            }
          }}
        />
      )}
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  postBody: {
    height: { height },
    backgroundColor: 'silver',
  },
  postTitle: {
    position: 'absolute',
    left: 15,
    bottom: 160,
    fontSize: 30,
    fontWeight: '500',
    color: '#fff',
  },

  postDescription: {
    position: 'absolute',
    left: 15,
    bottom: 130,
    color: '#fff',
    fontSize: '15px',
    fontWeight: '300',
  },
  postButton: {
    position: 'absolute',
    right: 15,
    bottom: 400,
  },
});
