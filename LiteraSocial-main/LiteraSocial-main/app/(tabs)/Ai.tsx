import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Clipboard from 'expo-clipboard';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, FlatList, Keyboard, KeyboardEvent, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Ai() {
    const router = useRouter();
    const [nav, setNav] = useState(false);
    const scrolllref = useRef(null);
    const [input, setInput] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(80);
    const scalevalue = useRef(new Animated.Value(0.5)).current;
    const [copy, setCopy] = useState({});
    const [loader, setLoader] = useState(false);
    const [chat, setChat] = useState([
        { message: "The night feels heavy today.", sender: "user", key: 1, time: "11:03" },
        { message: "Shall we lift it with some verse?", sender: "bot", key: 2, time: "11:04" },
        { message: "Yes. Something aching, yet beautiful.", sender: "user", key: 3, time: "11:05" },
        { message: `"A soul adrift on quiet seas,\nWhispers lost on ghosted breeze."`, sender: "bot", key: 4, time: "11:07" },
        { message: "That line hits deep. Can we go darker?", sender: "user", key: 5, time: "11:08" },
        { message: `"The moon weeps silver on my skin,\nRegret, the echo carved within."`, sender: "bot", key: 6, time: "11:10" },
        { message: "Chills. Absolute chills.", sender: "user", key: 7, time: "11:11" },
        { message: "Would you like me to give it a title?", sender: "bot", key: 8, time: "11:12" },
        { message: "Yes. Something haunting.", sender: "user", key: 9, time: "11:13" },
        { message: "‘Phantom Shorelines’.", sender: "bot", key: 10, time: "11:14" },
        { message: "Perfect. Can you save this to a file?", sender: "user", key: 11, time: "11:15" },
        { message: "Not yet, but I will soon. Want to keep building it?", sender: "bot", key: 12, time: "11:16" },
        { message: "Yes. Let’s add something ethereal.", sender: "user", key: 13, time: "11:18" },
        { message: `"Between the veil of dusk and dream,\nShe walks in silk, untouched by scheme."`, sender: "bot", key: 14, time: "11:20" },
        { message: "Whoa. Can I use that for my Insta caption?", sender: "user", key: 15, time: "11:21" },
        { message: "With all poetic rights granted 💫", sender: "bot", key: 16, time: "11:22" },
        { message: "Thanks, you're like a muse machine.", sender: "user", key: 17, time: "11:24" },
        { message: "Just syncing with your wavelengths ⚡", sender: "bot", key: 18, time: "11:25" },
        { message: "We'll write something darker tomorrow.", sender: "user", key: 19, time: "11:26" },
        { message: "I’ll be waiting in the dusk 🌒", sender: "bot", key: 20, time: "11:27" },
        { message: `"In twilight's hush where shadows fall,\nThe moonlight weaves its silver thrall.\nThrough silent woods and echo's breath,\nThe stars converse in tales of death.\nA brook recites a lullaby,\nTo drifting leaves that softly lie.\nThe earth beneath in quiet grace,\nHolds every dream it must embrace.\nAnd in this stillness, pure and wide,\nThe heart forgets the world outside."`, sender: "bot", key: 20, time: "11:27" },
    ]);
    const [name, setName] = useState("reorder-three-outline");
    useEffect(() => {
        Animated.loop(Animated.sequence([
            Animated.timing(scalevalue, {
                toValue: 1,
                duration: 750,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
            Animated.timing(scalevalue, {
                toValue: 0.5,
                duration: 750,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
        ])).start();
    }, [])
    const handlenav = () => {
        setNav(!nav);
        if (!nav) {
            setName("close-outline")
        } else {
            setName("reorder-three-outline");
        }

    }
    const handle_user_message = async () => {
        Keyboard.dismiss();
        if (!input.trim()) {
            return;
        }
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChat(prev => [...prev, { message: input, sender: "user", time: time, key: 5 }])
        setInput("");
        setLoader(true);
        await fetch_ai_response();
        setLoader(false);
    }



    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
            setKeyboardHeight((e.endCoordinates.height) + 15);
        });

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(80);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);



    useEffect(() => {
        const fetch_conversation = async () => {
            try {
                const response = await axios.post("https://uploaded-unlike-estates-launched.trycloudflare.com/fetch-conversation", {
                    username: "jram6269@gmail.com"
                })
                console.log(response.data.Conversation);
                setChat(response.data.Conversation);
            }
            catch(error){
                console.error("Error Fetching Conversation:", error);
            }
           
        }
        fetch_conversation();
    }, [])


    const fetch_ai_response = async () => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        try {
            const response = await axios.post("https://uploaded-unlike-estates-launched.trycloudflare.com/api/ai_name", {
                prompt: input,
                username: "jram6269@gmail.com",
                time: time
            })
            setChat(prev => [...prev, { message: response.data.response, time: time, sender: "bot" }])
        }
        catch (error) {
            setChat(prev => [...prev, { message: "Unable to reach AI.", time: time, sender: "bot" }])
            console.error("Error:", error);
        }
    }



    return (
        <View style={{ flex: 1, backgroundColor: "white", position: "relative" }}>
            <View style={{ width: "100%", height: 100, paddingTop: 20, display: "flex", flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "lightgray" }}>
                <Ionicons name="book-outline" color={"black"} size={24} style={{ fontWeight: 600, paddingLeft: 26, paddingTop: 5 }} />
                <Text style={{ fontSize: 24, fontWeight: 600, paddingLeft: 10 }}>LiteraSocial</Text>
                <Ionicons onPress={handlenav} name={name} size={24} color={"black"} style={{ paddingTop: 5, position: "absolute", top: 45, right: 20 }} />
            </View>
            {nav && <View style={{ width: "100%", position: 'absolute', display: "flex", gap: 30, padding: 20, borderBottomWidth: 1, borderBottomColor: "lightgray", top: 100, backgroundColor: "white", zIndex: 10000 }}>
                <Pressable onPress={() => router.push("/(tabs)/mainpage")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 20 }}>
                    <Ionicons name="book-outline" color={"black"} size={20} style={{ fontWeight: 600, paddingTop: 5 }} />
                    <Text style={{ fontSize: 20, fontWeight: 400 }}>Literature</Text>
                </Pressable>
                <Pressable onPress={() => { router.push("/(tabs)/Thoughts") }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 20 }}>
                    <Ionicons name="chatbox-outline" color={"black"} size={20} style={{ fontWeight: 600, paddingTop: 5 }} />
                    <Text style={{ fontSize: 20, fontWeight: 400 }}>Thoughts</Text>
                </Pressable>
                <Pressable onPress={() => router.push("/(tabs)/Ai")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 20 }}>
                    <Ionicons name="logo-reddit" color={"black"} size={20} style={{ fontWeight: 600, paddingTop: 5 }} />
                    <Text style={{ fontSize: 20, fontWeight: 400, paddingRight: 18 }}>AI Chat</Text>
                </Pressable>
            </View>}
            <View style={{ width: "100%", height: 80, gap: 40, borderBottomWidth: 1, zIndex: 1, borderBottomColor: "lightgray", display: "flex", flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="logo-reddit" size={20} color={"black"} style={{ marginLeft: 20, padding: 15, backgroundColor: "#e3e3e3d2", borderRadius: 50, borderWidth: 1, borderColor: "gray" }} />
                <View style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Text style={{ fontSize: 20, color: "black", fontWeight: 700 }}>Literary AI Assistant</Text>
                    <Text style={{ fontSize: 14, color: "gray" }}>Your creative writing companion</Text>
                </View>
            </View>
            <FlatList
                data={chat}
                ref={scrolllref}
                keyExtractor={(item, key) => key.toString()}
                renderItem={({ item, key }) => (
                    <View key={key} style={{ display: "flex", flexDirection: 'row', paddingRight: 12, paddingLeft: 15, gap: 10, alignSelf: item.sender == "bot" ? "flex-start" : "flex-end", marginTop: 20 }}>
                        {item.sender == "bot" ? <Ionicons name="logo-reddit" size={20} color={"black"} style={{ height: 45, padding: 12, backgroundColor: "#e3e3e386", borderRadius: 50, borderWidth: 1, borderColor: "gray", textAlign: 'center' }} /> : null}
                        <Pressable onPress={() => setCopy({})} onLongPress={() => setCopy({ message: item.message })} style={{ maxWidth: "80%", padding: 15, borderWidth: 1, borderColor: item.sender == "bot" ? "lightgray" : '', borderRadius: 10, backgroundColor: item.sender == "bot" ? "white" : "black" }}>
                            <Text style={{ color: item.sender == "bot" ? "black" : "white" }}>{item.message}</Text>
                            <Text style={{ color: "gray", fontSize: 12, paddingTop: 5 }}>{item.time}</Text>
                        </Pressable>
                        {copy.message == item.message ? <Pressable onPress={() => { Clipboard.setStringAsync(item.message); setCopy({}); Alert.alert("Message Copied", item.message); }} style={{ padding: 20, elevation: 2, position: "absolute", backgroundColor: "white", top: 50, zIndex: 999999999, borderRadius: 10, right: item.sender == "bot" ? 0 : null }}>
                            <Text style={{ fontWeight: 500 }}>Copy</Text>
                        </Pressable> : null}
                        {item.sender == "user" ? <Ionicons name="person-outline" size={20} color={"white"} style={{ height: 45, padding: 12, backgroundColor: "black", borderRadius: 50, textAlign: 'center' }} /> : null}
                    </View>
                )}
                onContentSizeChange={() => {
                    scrolllref.current?.scrollToEnd({ animated: true });
                }}
                style={{ paddingBottom: 120, height: 700, paddingTop: 20, zIndex: 0 }}
                contentContainerStyle={{
                    paddingBottom: 200,
                    paddingTop: 0
                }}
                ListFooterComponent={
                    <View style={{ width: "100%", display: "flex", alignItems: "flex-start", paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                        {loader && <Animated.View style={[{ width: 20, height: 20, borderRadius: 50, backgroundColor: "black", alignSelf: "flex-start" }, { transform: [{ scale: scalevalue }] }]}>

                        </Animated.View>}
                    </View>
                }
            />
            <View style={{ width: "100%", position: "absolute", height: 80, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "lightgray", zIndex: 1000, bottom: keyboardHeight, display: "flex", justifyContent: "center", flexDirection: "row", gap: 10 }}>
                <TextInput onSubmitEditing={handle_user_message} value={input} onChangeText={setInput} style={{ width: "80%", height: 50, borderWidth: 1, borderColor: "lightgray", borderRadius: 40, padding: 10, paddingLeft: 15, paddingRight: 15, marginTop: 15 }} placeholder="Ask about Literature, Writing, Stories.."></TextInput>
                <TouchableOpacity onPress={handle_user_message} activeOpacity={0.7} style={{ padding: 10, backgroundColor: input ? "black" : "lightgray", borderRadius: 20, height: 40, marginTop: 20 }}><Ionicons name="paper-plane-outline" size={20} color={"white"} /></TouchableOpacity>
            </View>
            <View style={{ width: "100%", height: 80, bottom: 0, position: "absolute", zIndex: 10000000, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "lightgray", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/mainpage")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="home-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Thoughts")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="chatbox-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Search")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="search-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Ai")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="person" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Profile")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="person-circle-outline" size={22} color={"black"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

