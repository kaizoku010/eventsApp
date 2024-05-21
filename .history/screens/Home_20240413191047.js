import { View, Text } from 'react-native'
import React from 'react'


const Home = ({route}) => {
  // console.log("data: ", props)
  const {user} = route.params;
  
  console.log("data: ", user.email)
  return (
    <View>
 
      <Text>Email Data: {user.email} </Text>
      <Text>UserName: {user.displayName} </Text>
    
     </View>
  )
}

export default Home