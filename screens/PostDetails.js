import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image } from 'react-native';
import {
  db,
  collection,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  doc
} from '../Operations/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { DataContext } from "../stateManagment/ContextApi";

const PostDetails = ({ route }) => {
  const { postId, uid, userName, image } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
const imagePth = image.toString()
// console.log("poster Image details:", imagePth)

// Fetch post details
  const fetchPostDetails = async () => {
    try {
      const postDoc = await getDoc(doc(db, 'event_posts', postId));
      if (postDoc.exists()) {
        setPost({ id: postDoc.id, ...postDoc.data() });
      } else {
        console.error('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    try {


      const querySnapshot = await getDocs(collection(db, `event_posts/${postId}/comments`));
      const fetchedComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));



      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Function to handle adding a new comment
  const handleAddComment = async () => {
    try {
      const commentData = {
        user_id: userName, // Replace with the actual user ID
        content: newComment.trim(),
        created_at: serverTimestamp(),
        userImage:imagePth || "loading....",
      };

      await addDoc(collection(db, `event_posts/${postId}/comments`), commentData);
      setNewComment('');
      // Refetch comments to update the view
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({ title: "Event Post" }); // Set the page title to the user's name
  }, [navigation]);


  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, []);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postContainer}>
        <Text style={styles.postContent}>{post.content}</Text>
        {/* Render image or video if available */}
        {/* Add your code here to render image or video */}
      </View>
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsHeading}>All Comments</Text>
        {comments.map(comment => (
          <View key={comment.id} style={styles.commentContainer}>
           <View style={styles.flexMe}>
                  <Image
                  source={{uri:(comment?.userImage)}}
                  style={styles.image_user}
                />
                <View>
                     <Text style={styles.commentUser}>{comment.user_id}</Text>
        {/* //created_at    */}
        <Text style={styles.commentUser2}>{new Date(comment.created_at?.toDate()).toLocaleDateString()}</Text>

                </View>
         
        
           </View>
        
            <Text style={styles.commentContent}>{comment.content}</Text>
          </View>
        ))}
        {/* Add a text input and button for adding new comments */}
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          multiline
        />
        {/* <Button style={styles.btn} onPress={handleAddComment} title="Post Comment" /> */}
        <TouchableOpacity onPress={handleAddComment} style={styles.postBtn}>
              <Text style={styles.btnText}>Comment</Text>
            </TouchableOpacity>  
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  postBtn: {
    backgroundColor: "#131314",
    borderRadius: 20,
    height: 44,
    width: "50%",
    justifyContent: "center",
    alignSelf: "center",
  },

  btnText: {
    color: "white",
    textAlign: "center",
  },

  container: {
    flex: 1,
    padding: 10,
  },
  postContainer: {
    marginBottom: 20,
  },
  postContent: {
    fontSize: 16,
  },
  commentsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  commentsHeading: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
  commentContainer: {
    marginBottom: 10,
  },

  flexMe:{
display:"flex",
flexDirection:"row",
marginBottom:5
  },

  image_user: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight:10,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  commentUser2: {
    fontWeight: "400",
    marginBottom: 3,
    fontSize:11,
    color:"gray",
    marginTop:-5
  

  },
  commentContent: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
});

export default PostDetails;
