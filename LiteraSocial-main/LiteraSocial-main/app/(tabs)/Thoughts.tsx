import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, FlatList, Pressable, RefreshControl, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Thoughts() {
    const router = useRouter();
    const rotateValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        rotateValue.setValue(0);
        Animated.loop(Animated.timing(rotateValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true
        })).start();
    }, [])
    const spin = rotateValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
    const [nav, setNav] = useState(false);
    const [comment, setComment] = useState([{}, {}, {}, {}, {}]);
    const [comments, setComments] = useState(false);
    const [loader, setLoader] = useState(false);
    const [thoughts, setThoughts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [liked, setLiked] = useState([{}]);
    const [likedAni, setLikedAni] = useState({});
    const [usermail, setUsermail] = useState('');
    const [userThought, setUserThought] = useState('');
    const [options, setOptions] = useState({});
    const [name, setName] = useState("reorder-three-outline");
    const slideAnim = useRef(new Animated.Value(500)).current; // Start 200px below




    const slideUp = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const slideDown = () => {
        Animated.timing(slideAnim, {
            toValue: 500,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if (comments) {
            slideUp();
        }
        else {
            slideDown();
        }
    }, [comments])

    const handlenav = () => {
        setNav(!nav);
        if (!nav) {
            setName("close-outline")
        } else {
            setName("reorder-three-outline");
        }

    }
    useEffect(() => {
        const handleSave = async () => {
            const response = await fetch("https://literasocial.onrender.com/thoughts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json();
            setThoughts(prev => [...prev, ...data.Data]);
            const poss = await AsyncStorage.getItem("usermail");
            poss ? setUsermail(poss) : null;
            console.log(poss);
        }
        handleSave();


    }, [])



    const handleSave = async () => {
        const response = await fetch("https://literasocial.onrender.com/thoughts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await response.json();
        setThoughts(prev => [...prev, ...data.Data]);
    }

    const Onrefresh = () => {
        setRefresh(true);
        setThoughts([]);
        handleSave().finally(() => setRefresh(false));
    }

    let cooldown = false;
    const handleMoreThoughts = async () => {
        if (thoughts.length < 2) return;
        if (loader && cooldown) return;
        setLoader(true);
        cooldown = true;
        try {
            const response = await fetch("https://literasocial.onrender.com/thoughts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json();
            setThoughts(prev => [...prev, ...data.Data]);
        }
        catch (error) {
            console.log("Error Fetching more thoughts. Error:", error);
        }
        finally {
            setLoader(false);
            setTimeout(() => { cooldown = true }, 1000);
        }
    }
    const checkOptions = () => {
        if (options) {
            setOptions(!options);
        }
    }
    const handle_report = async (id) => {
        try {
            const response = await axios.post("https://literasocial.onrender.com/report", {
                id: id,
                email: usermail,
                posttype: "POST"
            });
            console.log(response)
            if (options) {
                setOptions(!options);
            }
            Alert.alert("Report", "Post Reported Successfully");
        }
        catch (error) {
            console.error("Error found:", error)
        }
    }

    const flushLikes = async (type, id) => {
        try {
            const response = await axios.post("http://literasocial.onrender.com/likes", {
                id: id,
                email: usermail,
                type: type,
                content: "post"
            });
            console.log(response.data);
        }
        catch (error) {
            console.error("Error Saving Likes. Error:", error);
        }
    }

    const handleLikes = (item) => {
        if (liked.some(count => count.id == item._id)) {
            setLiked(liked.filter(post => post.id != item._id));
            flushLikes("unliked", item._id)
        } else {
            setLiked(prev => [...prev, { id: item._id }])
            flushLikes("liked", item._id);
        }
    }

    const add_thoughts = async () => {
        try {
            if (!userThought.trim()) return; 4
            const date = new Date;
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            console.log(time);
            const response = await axios.post("https://literasocial.onrender.com/addthoughts", {
                Email: 'jram6269@gmail.com',
                Username: "jram",
                UserId: "itz_jram18",
                Tag: "thoughts",
                Thought: userThought,
                Likes: 0,
                Comments: 0,
                Shares: 0,
                Time: time
            })
            console.log(response.data);
            Alert.alert("Thought posted successfully", "Have another thought?");
            setUserThought("");
        } catch (error) {
            console.error("Error:", error);
        }


    }




    const formatCount = (num, liked) => {
        if (num < 1000) {
            if (liked) {
                return (num + 1).toString();
            } else {
                return num.toString()
            }
        }

        const units = ["", "K", "M", "B", "T"];
        const order = Math.floor(Math.log10(num) / 3);
        const unitname = units[order];
        const scaled = num / Math.pow(1000, order);

        return scaled % 1 === 0 ? scaled + unitname : scaled.toFixed(1) + unitname;
    }


    const handle_custom_logo = (string) => {
        let logo = "";
        logo += string[0].toUpperCase() + string[1].toUpperCase();
        return logo;
    }

    return (
        <View style={{ flex: 1, position: "relative", backgroundColor: "white", display: "flex" }} >
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

            {thoughts && <FlatList
                data={thoughts}
                ListHeaderComponent={<>
                    <View style={{ minWidth: "100%", paddingBottom: 0, alignItems: "center", }}>
                        <View style={{ minWidth: "100%", width: "80%", display: "flex", alignItems: "center", padding: 10, paddingLeft: 15, paddingRight: 15 }}>
                            <Text style={{ fontSize: 25, fontWeight: 600, textAlign: "center", paddingTop: 10 }}>Thoughts & Reflections</Text>
                            <Text style={{ fontSize: 15, color: "gray", textAlign: "left", paddingTop: 10 }}>Share your insights, musings, and connect with fellow thinkers</Text>
                            <View style={{ minHeight: 200, maxWidth: "90%", minWidth: "90%", width: "90%", paddingBottom: 20, marginTop: 20, borderWidth: 1, borderColor: "lightgray", borderRadius: 10, display: "flex", alignItems: 'center' }}>
                                <View style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: 'row', padding: 15, gap: 10 }}>
                                    <Ionicons name="bulb-outline" size={20} color={"gold"} />
                                    <Text style={{ fontSize: 18, fontWeight: 500 }}>Share a thought</Text>
                                </View>
                                <TextInput value={userThought} onChangeText={setUserThought} multiline textAlignVertical="top" style={{ minWidth: "80%", padding: 15, borderWidth: 1, borderColor: "lightgray", borderRadius: 10, width: "80%", height: 100 }} placeholder="What's on your mind? Share your thoughts, insights or reflections..."></TextInput>
                                <Pressable onPress={add_thoughts} style={{ padding: 10, paddingTop: 15, paddingBottom: 15, backgroundColor: userThought.trim() ? "black" : "lightgray", borderRadius: 10, display: 'flex', flexDirection: 'row', gap: 10, alignSelf: 'flex-end', marginTop: 20, marginRight: 15 }}>
                                    <Ionicons name="paper-plane-outline" size={20} color={"white"} />
                                    <Text style={{ color: "white" }}>Share Thought</Text>
                                </Pressable>
                            </View>
                        </View>
                        {thoughts.length < 2 && <Pressable style={{ minWidth: "85%", maxWidth: "85%", width: "110%", borderWidth: 1, borderColor: 'lightgray', display: "flex", alignItems: 'center', borderRadius: 10, marginTop: 20 }}>
                            <View style={{ position: "absolute", left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                                <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "lightgray" }}>JR</Text>
                                <View style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start', padding: 10, gap: 10 }}>
                                    <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "left", backgroundColor: "lightgray", borderRadius: 20, color: "lightgray" }}>VoiceOfYouth</Text>
                                    <Text style={{ fontSize: 12, color: "lightgray", padding: 0, backgroundColor: "lightgray", borderRadius: 20 }}>user112</Text>
                                </View>
                                <Ionicons name="ellipsis-horizontal-outline" size={20} color={"lightgray"} style={{ position: "absolute", right: 30, zIndex: 1000000000, backgroundColor: "lightgray" }} />
                            </View>
                            <View style={{ paddingTop: 90, width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: "lightgray", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                <Text style={{ textAlign: "left", fontSize: 8, fontWeight: 500, lineHeight: 25, padding: 10, backgroundColor: "lightgray", borderRadius: 20, color: "lightgray" }}>The student protests spreading across campuses aren't just about tuition hikes or lack of funding. The student protests spreading across campuses aren't just about tuition hikes or lack of funding.The student protests spreading across campuses aren't just about tuition hikes or lack of funding </Text>
                            </View>
                        </Pressable>}
                        {thoughts.length < 2 && <Pressable style={{ minWidth: "85%", maxWidth: "85%", width: "110%", borderWidth: 1, borderColor: 'lightgray', display: "flex", alignItems: 'center', borderRadius: 10, marginTop: 20 }}>
                            <View style={{ position: "absolute", left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                                <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "lightgray" }}>JR</Text>
                                <View style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start', padding: 10, gap: 10 }}>
                                    <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "left", backgroundColor: "lightgray", borderRadius: 20, color: "lightgray" }}>VoiceOfYouth</Text>
                                    <Text style={{ fontSize: 12, color: "lightgray", padding: 0, backgroundColor: "lightgray", borderRadius: 20 }}>user112</Text>
                                </View>
                                <Ionicons name="ellipsis-horizontal-outline" size={20} color={"lightgray"} style={{ position: "absolute", right: 30, zIndex: 1000000000, backgroundColor: "lightgray" }} />
                            </View>
                            <View style={{ paddingTop: 90, width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: "lightgray", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                <Text style={{ textAlign: "left", fontSize: 8, fontWeight: 500, lineHeight: 25, padding: 10, backgroundColor: "lightgray", borderRadius: 20, color: "lightgray" }}>The student protests spreading across campuses aren't just about tuition hikes or lack of funding. The student protests spreading across campuses aren't just about tuition hikes or lack of funding.The student protests spreading across campuses aren't just about tuition hikes or lack of funding </Text>
                            </View>
                        </Pressable>}
                    </View>
                </>}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 110, gap: 40 }}
                style={{ flex: 1, display: "flex", zIndex: 1 }}
                ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
                onEndReached={handleMoreThoughts}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <Pressable onPress={checkOptions} style={{ minWidth: "85%", maxWidth: "85%", width: "110%", borderWidth: 1, borderColor: 'lightgray', display: "flex", alignItems: 'center', marginTop: 0, borderRadius: 10 }}>
                        {options.id == item._id ? <View style={{ padding: 20, right: 20, top: 20, zIndex: 10000000001, borderRadius: 10, backgroundColor: "white", elevation: 6, position: "absolute", }}>
                            <Pressable onPress={handle_report} style={{ backgroundColor: "red", borderRadius: 10, padding: 10 }}>
                                <Text style={{ color: "white", fontSize: 13 }}>Report</Text>
                            </Pressable>
                        </View> : null}
                        <View style={{ position: "absolute", left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                            <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "gray" }}>{handle_custom_logo(item.Username)}</Text>
                            <View style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start', padding: 10 }}>
                                <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "left" }}>{item.Username}</Text>
                                <Text style={{ fontSize: 12, color: "gray", paddingTop: 5 }}>{item.Time}</Text>
                            </View>
                            <Ionicons onPress={() => { setOptions({ id: item._id }) }} name="ellipsis-horizontal-outline" size={20} color={"black"} style={{ position: "absolute", right: 30, zIndex: 1000000000 }} />
                        </View>
                        <View style={{ paddingTop: 75, width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                            <Text style={{ textAlign: "left", fontSize: 14, fontWeight: 500, lineHeight: 25, padding: 10 }}>
                                {item.Thought}</Text>
                        </View>
                        <View style={{ maxWidth: "100%", minWidth: "100%", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, borderTopWidth: 1, borderTopColor: "lightgray", display: "flex", flexDirection: 'row', alignItems: "flex-start", gap: 20, paddingLeft: 30 }}>
                            <Pressable onPressIn={() => setLikedAni({ id: item._id })} onPressOut={() => setLikedAni(!likedAni)} onPress={() => handleLikes(item)} style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                                <Ionicons onPressIn={() => setLikedAni({ id: item._id })} onPressOut={() => setLikedAni(false)} name={liked.some(count => count.id == item._id) || likedAni.id == item._id ? "heart" : "heart-outline"} size={25} color={liked.some(count => count.id == item._id) || likedAni.id == item._id ? "red" : "black"} />
                                <Text style={{ fontSize: 14, paddingTop: 3 }}>{liked.some(count => count.id == item._id) ? formatCount(item.Likes, true) : formatCount(item.Likes, false)}</Text>
                            </Pressable>
                            <Pressable onPress={() => { setComments(!comments) }} style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                                <Ionicons name="chatbubble-outline" size={25} color={"black"} />
                                <Text style={{ fontSize: 14, paddingTop: 3 }}>{formatCount(item.Comments, false)}</Text>
                            </Pressable>
                            <Pressable style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                                <Ionicons name="paper-plane-outline" size={25} color={"black"} />
                                <Text style={{ fontSize: 14, paddingTop: 3 }}>{formatCount(item.Shares, false)}</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                )}
                ListFooterComponent={<>
                    {loader && thoughts.length > 2 && <Animated.View style={[{ width: 30, height: 30, borderWidth: 1.5, borderBottomWidth: 0, borderLeftWidth: 0, borderColor: 'black', borderTopColor: '#333', borderRadius: 20 }, { transform: [{ rotate: spin }] }]}></Animated.View>}
                </>}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={Onrefresh} />
                }
            />
            }


            <Animated.View style={[{ width: "100%", height: "50%", position: "absolute", bottom: 0, left: 0, backgroundColor: "white", borderWidth: 1, borderColor: "lightgray", borderTopLeftRadius: 40, borderTopRightRadius: 40, zIndex: 999999999, display: 'flex', alignItems: 'center', paddingBottom: 90 }, { transform: [{ translateY: slideAnim }], }]}>
                <Pressable style={{ width: "40%", height: 4, marginTop: 10, backgroundColor: "lightgray", borderRadius: 20 }}></Pressable>
                <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 20, fontWeight: 600 }}>Comments</Text>
                <FlatList
                    data={comment}
                    keyExtractor={(item, key) => key.toString()}
                    contentContainerStyle={{ alignItems: 'center', gap: 10 }}
                    renderItem={({ item }) => (
                        <Pressable style={{ minWidth: "95%", maxWidth: "95%", borderWidth: 1, borderColor: 'lightgray', display: "flex", alignItems: 'center', borderRadius: 20, marginTop: 20 }}>
                            <View style={{ position: "absolute", left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                                <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "gray" }}>JR</Text>
                                <View style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start', padding: 10, gap: 5 }}>
                                    <Text style={{ fontSize: 13, fontWeight: 500, textAlign: "left", borderRadius: 20, color: "black" }}>VoiceOfYouth</Text>
                                    <Text style={{ fontSize: 11, color: "gray", padding: 0, borderRadius: 20 }}>user112</Text>
                                </View>
                                <Ionicons name="ellipsis-horizontal-outline" size={20} color={"gray"} style={{ position: "absolute", right: 30, zIndex: 1000000000, }} />
                            </View>
                            <View style={{ paddingTop: 65, width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: "lightgray", borderRadius: 40 }}>
                                <Text style={{ textAlign: "left", fontSize: 13, fontWeight: 500, lineHeight: 25, padding: 10, borderRadius: 50, color: "black" }}>The student protests spreading across campuses aren't just about tuition hikes </Text>
                            </View>
                        </Pressable>
                    )}
                />
                <TextInput style={{ width: "95%", position: "absolute", bottom: 30, height: 45, borderWidth: 1, borderColor: "lightgray", borderRadius: 40, padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: "white" }} placeholder="Comment your thoughts..." />
                <Ionicons name="paper-plane-sharp" size={20} color={"black"} style={{ position: "absolute", right: 35, bottom: 40 }} />
                {loader && <Pressable style={{ minWidth: "85%", maxWidth: "85%", width: "110%", borderWidth: 1, borderColor: 'lightgray', display: "flex", alignItems: 'center', borderRadius: 10, marginTop: 20 }}>
                    <View style={{ position: "absolute", left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                        <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "lightgray" }}>JR</Text>
                        <View style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start', padding: 10, gap: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "left", backgroundColor: "lightgray", borderRadius: 20, color: "lightgray" }}>VoiceOfYouth</Text>
                            <Text style={{ fontSize: 12, color: "lightgray", padding: 0, backgroundColor: "lightgray", borderRadius: 20 }}>user112</Text>
                        </View>
                        <Ionicons name="ellipsis-horizontal-outline" size={20} color={"lightgray"} style={{ position: "absolute", right: 30, zIndex: 1000000000, backgroundColor: "lightgray" }} />
                    </View>
                    <View style={{ paddingTop: 90, width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: "lightgray", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                        <Text style={{ textAlign: "left", fontSize: 8, fontWeight: 500, lineHeight: 25, padding: 10, backgroundColor: "lightgray", borderRadius: 50, color: "lightgray" }}>The student protests spreading across campuses aren't just about tuition hikes </Text>
                    </View>
                </Pressable>}
            </Animated.View>

            <View style={{ width: "100%", height: 80, bottom: 0, position: "absolute", zIndex: 10000000, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "lightgray", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/mainpage")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="home-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Thoughts")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="chatbox" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Search")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="search-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Ai")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="person-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Profile")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="person-circle-outline" size={22} color={"black"} />
                </TouchableOpacity>
            </View>
        </View >
    )
}