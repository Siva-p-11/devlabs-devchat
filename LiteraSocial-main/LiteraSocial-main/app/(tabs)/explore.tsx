import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function TabTwoScreen() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [name, setName] = useState('eye-outline');
  const [visblity, setVisiblity] = useState(true);
  const router = useRouter();
  const handleView = () => {
    setVisiblity(!visblity);
    if (visblity) {
      setName("eye-off-outline");
    }
    else {
      setName("eye-outline");
    }
  }
  const handleLogin = async () => {
    if (!input1.trim() || !input2.trim()) {
      Alert.alert("Fill all the fields", "Incomplete details");
      return;
    }
    console.log("works");
    try {
      const response = await axios.post("https://uploaded-unlike-estates-launched.trycloudflare.com/login", 
        {Email: input1, Password: input2 })
      const data = response.data;
      console.log(data);
      console.log(data.Message);
      Alert.alert("LiteraSocial",data.Message);
      if (data.id == 123) {
        AsyncStorage.setItem("username",input1)
        router.push("/(tabs)/mainpage");
      }
      setInput1("");
      setInput2("");
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
        <Text style={{ fontSize: 25, paddingTop: 0, fontFamily: "sans-serif", fontWeight: 700 }}>Welcome Back</Text>
        <Text style={{ paddingTop: 15, color: "gray" }}>Sign in to LitreaSocial</Text>
        <View style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column", paddingTop: 50 }}>
          <Text style={{ color: "black", fontSize: 16, fontWeight: 500, alignSelf: "flex-start", paddingLeft: "8%" }}>Email</Text>
          <TextInput value={input1} onChangeText={setInput1} autoCapitalize="none" style={{ backgroundColor: "white", width: "90%", height: 50, marginTop: 10, borderWidth: 1, borderColor: "lightgray", borderRadius: 10, color: "black", paddingLeft: 50 }} placeholder="Enter your Mail"></TextInput>
          <Text style={{ color: "black", fontSize: 16, fontWeight: 500, alignSelf: "flex-start", paddingLeft: "8%", marginTop: 20 }}>Password</Text>
          <TextInput value={input2} onChangeText={setInput2} disableKeyboardShortcuts secureTextEntry={visblity} style={{ backgroundColor: "white", width: "90%", height: 50, marginTop: 10, borderWidth: 1, borderColor: "lightgray", borderRadius: 10, color: "black", paddingLeft: 50, paddingRight: 45 }} placeholder="Enter your Password"></TextInput>
          <Ionicons name="mail-outline" style={{ position: "absolute", left: 30, top: 95 }} size={24} color={"grey"} />
          <Ionicons name="lock-closed-outline" style={{ position: "absolute", left: 30, top: "108%" }} size={24} color={"grey"} />
          <Ionicons name={name} onPress={handleView} style={{ position: "absolute", right: 30, top: "108%" }} size={24} color={"grey"} />
        </View>
        <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} style={{ marginTop: 30, borderWidth: 1, borderColor: "black", width: "80%", padding: 15, borderRadius: 10, backgroundColor: "black" }}><Text style={{ width: "100%", textAlign: "center", color: "white" }}>Sign In</Text></TouchableOpacity>
        <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", paddingTop: 30, gap: 8, alignItems: "center" }}><Text style={{ color: "gray" }}>Dont Have an account?</Text><Text style={{ color: "black", fontWeight: 600 }} onPress={() => router.push("/(tabs)/Login")}>Sign Up</Text></View>
      </View>
      <Text style={{ color: "gray", fontSize: 10, paddingTop: 15 }}>By continuing, you agree to our Terms & Privacy Policy</Text>
    </View>
  );
}

