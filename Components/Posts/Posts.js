import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Video } from 'expo-av';
import { useDispatch } from 'react-redux';
import Navigation from '../Navigation/Navigation';
import { getStorage } from 'firebase/storage';
import { app } from '../../firebase/firebase';
import { getVideoList, toggleLike } from '../../redux/slice/postsSlice';
import { getAuth } from 'firebase/auth';

const { height } = Dimensions.get('window');

export default function Posts({ posts }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const dispatch = useDispatch();

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const togglePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
  };

  useEffect(() => {
    dispatch(getVideoList());
  }, []);

  const handleToggleLike = (postId, liked) => {
    if (userId) {
      dispatch(toggleLike({ postId, userId, liked }));
    } else {
      alert('Please sign in to like the post.');
    }
  };

  const renderItem = ({ item, index }) => {
    const likes = item.likes || [];
    const liked = likes.includes(userId);

    return (
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
          <TouchableOpacity onPress={() => handleToggleLike(item.id, liked)}>
            <Image
              style={styles.likeIcon}
              source={
                liked
                  ? require('../../assets/icons/like-filled.png')
                  : require('../../assets/icons/like.png')
              }
            />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likes.length}</Text>
        </View>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDescription}>{item.description}</Text>
        <Text style={styles.postTags}>
          {item.tags && item.tags.length > 0 ? `#${item.tags.join(' #')}` : ''}
        </Text>
      </View>
    );
  };

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
  likeIcon: {
    width: 35,
    height: 35,
  },
  likeCount: {
    textAlign: 'center',
    color: '#fff',
  },
  postTags: {
    color: '#fff',
    position: 'absolute',
    left: 15,
    bottom: 100,
  },
});
