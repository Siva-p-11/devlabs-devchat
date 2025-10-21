import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";


export default function HomeScreen() {
  const [button1, setButton1] = useState(false);
  const [button2, setButton2] = useState(false);
  const [button3, setButton3] = useState(false);
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={{alignItems:'center', flexDirection: "column"}} style={{ width:"100%", backgroundColor: "#e3e3e334"}}>
      <Text style={{ fontSize: 35, paddingTop: 60, fontFamily: "sans-serif", fontWeight: '800' }}>LiteraSocial</Text>
      <Text style={{textAlign:"center", padding:20, color:"gray"}}>The social platform where literature comes alive. Share thoughts, discover writers, and connect through the power of words.</Text>
      <Pressable onPress={() => router.push("/(tabs)/explore")}  onPressIn={() => setButton1(true)} onPressOut={() => setButton1(false)} style={button1?{padding:20,marginTop:20,borderRadius:10,backgroundColor:"#333333",borderWidth:1,borderColor:"black",width:"90%"}:{padding:20,marginTop:20,borderRadius:10,backgroundColor:"black",borderWidth:1,borderColor:"black",width:"90%",}}><Text style={{color:"white", textAlign:'center'}}>Get Started</Text></Pressable>
      <Pressable onPressIn={() => setButton2(true)} onPressOut={() => setButton2(false)} style={button2?{padding:20,marginTop:20,borderRadius:10,backgroundColor:"lightgray",borderWidth:1,borderColor:"black",width:"90%"}:{padding:20,marginTop:20,borderRadius:10,borderWidth:1,borderColor:"black",width:"90%",}}><Text style={{color:"black", textAlign:'center'}}>Learn More</Text></Pressable>
      <View style= {{width:"85%", height:180, borderRadius:20,backgroundColor:"white", marginTop:40, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <Ionicons name="book-outline" size={24} color="black" />
      <Text style={{fontWeight:600, paddingTop:10, textAlign:"center"}}>Share Literature</Text>
        <Text style={{fontSize:12, paddingTop:10,lineHeight:20,color:"gray", textAlign:"center"}}>Post your favorite quotes, poems, and literary thoughts</Text>
      </View>
      <View style= {{width:"85%", height:180, borderRadius:20, backgroundColor:"white",marginTop:40, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <Ionicons name="people-outline" size={24} color="black" />
        <Text style={{fontWeight:600, paddingTop:10, textAlign:"center"}}>Connect</Text>
        <Text style={{fontSize:12, paddingTop:10,lineHeight:20,color:"gray", textAlign:"center"}}>Follow writers and literature enthusiasts</Text>
      </View>
      <View style= {{width:"85%", height:180, borderRadius:20,backgroundColor:"white", marginTop:40, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Ionicons name="chatbox-outline" size={24} color="black" />
        <Text style={{fontWeight:600, paddingTop:10, textAlign:"center"}}>Discuss</Text>
        <Text style={{fontSize:12, paddingTop:10,lineHeight:20,color:"gray", textAlign:"center"}}>Engage in meaningful conversations about literature</Text>
      </View>
      <View style= {{width:"85%", height:180, borderRadius:20,backgroundColor:"white", marginTop:40, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Ionicons name="sparkles-outline" size={24} color="black" />
        <Text style={{fontWeight:600, paddingTop:10, textAlign:"center"}}>AI Assistant</Text>
        <Text style={{fontSize:12, paddingTop:10,lineHeight:20,color:"gray", textAlign:"center"}}>Get writing inspiration and literary insights</Text>
      </View>
      <Text style={{color:"black", fontSize:25,textAlign:"center",fontWeight:700, paddingTop:40, paddingBottom:20}}>Ready to join the literary community?</Text>
      <Text  style={{color:"gray", paddingLeft:20,paddingRight:20,paddingTop:0, paddingBottom:20, lineHeight:20 ,textAlign:'center'}}>Connect with fellow readers, share your favorite passages, and discover new perspectives on literature.</Text>
      <Pressable onPress={() => router.push("/(tabs)/Login")}  onPressIn={() => setButton3(true)} onPressOut={() => setButton3(false)} style={button3?{padding:20,marginTop:20,borderRadius:10,backgroundColor:"#333333",borderWidth:1,borderColor:"black",width:"90%"}:{padding:20,marginTop:20,borderRadius:10,backgroundColor:"black",borderWidth:1,borderColor:"black",width:"90%",}}><Text style={{color:"white", textAlign:'center'}}>Join LiteraSocial</Text></Pressable>
      <View style={{height:40}}></View>
      </ScrollView>
  );
}

