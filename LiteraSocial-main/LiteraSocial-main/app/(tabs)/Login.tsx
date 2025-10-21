import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const router = useRouter();
  const [name, setName] = useState('eye-outline');
  const [visblity, setVisiblity] = useState(true);
  const handleView = () => {
    setVisiblity(!visblity);
    if (visblity) {
      setName("eye-off-outline");
    }
    else {
      setName("eye-outline");
    }
  }

  const handleSignUp = async () => {
    console.log("Works");
    if (!input1.trim() || !input2.trim() || !input3.trim()){
        Alert.alert("Fill all the fields","Incomplete details");
        return;
    }
    try {
      const response = await fetch("https://literasocial.onrender.com/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: input1,
          usermail: input2,
          password: input3,
        }),
      });
      const data = await response.json();
      console.log(data);
      Alert.alert("LiteraSocial",data.message);
      if(data.id == 1){
        router.push("/(tabs)/explore");
      } else if(data.id == 2){
        AsyncStorage.setItem("username",input2);
        router.push('/(tabs)/mainpage');
      }
      setInput1("");
      setInput2("");
      setInput3("");
    }
    catch (error) {
      console.error(error);
    }
  }
  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "#e3e3e334", display: "flex", alignItems: "center" }}>
      <Text style={{ fontSize: 35, paddingTop: 60, fontFamily: "sans-serif", fontWeight: 900 }}>LiteraSocial</Text>
      <Text style={{ paddingTop: 15, color: "gray" }}>Where literature meets social connection</Text>
      <View style={{ width: "85%", height: "65%", backgroundColor: "white", marginTop: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 25, paddingTop: 10, fontFamily: "sans-serif", fontWeight: 700 }}>Join LiteraSocial</Text>
        <Text style={{ paddingTop: 15, color: "gray" }}>Create your account to start sharing literature</Text>
        <View style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column", paddingTop: 50 }}>
          <Text style={{ color: "black", fontSize: 16, fontWeight: 500, alignSelf: "flex-start", paddingLeft: "8%" }}>Full Name</Text>
          <TextInput value={input1} onChangeText={setInput1} style={{ backgroundColor: "white", width: "90%", height: 50, marginTop: 10, borderWidth: 1, borderColor: "lightgray", borderRadius: 10, color: "black", paddingLeft: 50 }} placeholder="Enter your Full Name"></TextInput>
          <Text style={{ color: "black", fontSize: 16, fontWeight: 500, alignSelf: "flex-start", paddingLeft: "8%", marginTop: 20 }}>Email</Text>
          <TextInput value={input2} onChangeText={setInput2} autoCapitalize="none" style={{ backgroundColor: "white", width: "90%", height: 50, marginTop: 10, borderWidth: 1, borderColor: "lightgray", borderRadius: 10, color: "black", paddingLeft: 50, paddingRight: 45 }} placeholder="Enter your Email"></TextInput>
          <Text style={{ color: "black", fontSize: 16, fontWeight: 500, alignSelf: "flex-start", paddingLeft: "8%", marginTop: 20 }}>Password</Text>
          <TextInput value={input3} onChangeText={setInput3} disableKeyboardShortcuts secureTextEntry={visblity} style={{ backgroundColor: "white", width: "90%", height: 50, marginTop: 10, borderWidth: 1, borderColor: "lightgray", borderRadius: 10, color: "black", paddingLeft: 50, paddingRight: 45 }} placeholder="Enter your Password"></TextInput>
          <Ionicons name="person-outline" style={{ position: "absolute", left: 30, top: 95 }} size={24} color={"grey"} />
          <Ionicons name="mail-outline" style={{ position: "absolute", left: 30, top: 196 }} size={24} color={"grey"} />
          <Ionicons name="lock-closed-outline" style={{ position: "absolute", left: 30, top: 296 }} size={24} color={"grey"} />
          <Ionicons name={name} onPress={handleView} style={{ position: "absolute", right: 30, top: 298 }} size={24} color={"grey"} />
        </View>
        <TouchableOpacity onPress={handleSignUp} activeOpacity={0.8} style={{ marginTop: 30, borderWidth: 1, borderColor: "black", width: "80%", padding: 15, borderRadius: 10, backgroundColor: "black" }}><Text style={{ width: "100%", textAlign: "center", color: "white" }}>Create Account</Text></TouchableOpacity>
        <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", paddingTop: 15, gap: 8, alignItems: "center" }}><Text style={{ color: "gray" }}>Already have an account?</Text><Text style={{ color: "black", fontWeight: 600 }} onPress={() => router.push("/(tabs)/explore")}>Sign in</Text></View>
      </View>
      <Text style={{ color: "gray", fontSize: 10, paddingTop: 15 }}>By continuing, you agree to our Terms & Privacy Policy</Text>
    </View>
  );
}

