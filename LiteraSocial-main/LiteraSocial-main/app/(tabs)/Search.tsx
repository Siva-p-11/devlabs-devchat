import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, FlatList, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Search() {
    const router = useRouter();
    const [option, setOption] = useState("l");
    const usermail = "yourEmail@gmail.com";
    const [litdata, setlitData] = useState([]);
    const [accdata, setAccdata] = useState([]);
    const [search, setSearch] = useState('');
    const [suggestion, setSuggestion] = useState(false);
    const [loader, setLoader] = useState(false);
    const [following, setFollowing] = useState([]);
    const [activeContent, setActiveContent] = useState({});
    const [activate, setActivate] = useState(false);
    const [liked, setLiked] = useState([{}]);
    const [likedQueue, setlikedQueue] = useState([]);
    const [comments, setComments] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [comment, setComment] = useState([]);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [ids, setIds] = useState();
    const [likedanimation, setlikedAnimations] = useState({});
    const [voiceState, setVoiceState] = useState({});
    const slideAnim = useRef(new Animated.Value(500)).current; // Start 200px below
    const slideUp = () => {
        Animated.timing(slideAnim, {
            toValue: 0, // Final position
            duration: 300,
            useNativeDriver: true, // Smoother animation
        }).start();
    };

    const slideDown = () => {
        Animated.timing(slideAnim, {
            toValue: 500, // Move back down
            duration: 300,
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

    const [bgstate, setBgState] = useState(false);


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
            flushLikes("unliked", item._id);
            setLiked(liked.filter(post => post.id != item._id));
            setlikedQueue(likedQueue.filter(post => post.id != item._id));
            return;
        } else {
            setLiked(prev => [...prev, { id: item._id }])
            setlikedQueue(prev => [...prev, { id: item._id }]);
            flushLikes("liked", item._id);
            setlikedQueue([]);
            console.log("Flush Activated");
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


    const handle_bg = async () => {
        if (bgstate) stopSound();
        else {
            console.log("BG Works!");
            const { sound } = await Audio.Sound.createAsync(require("../bg.mp3"));
            setSound(sound);
            await sound.playAsync();
            setBgState(true);
        }
    }
    async function stopSound() {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync(); // frees memory
            setSound(null);
            setBgState(false);
        }
    }


    const handle_search = async () => {
        setSuggestion(false);
        if (!search.trim()) return;
        try {
            setLoader(true);
            const response = await axios.post("https://commitments-folder-ce-curious.trycloudflare.com/search", {
                search: search,
                type: option == "l" ? "post" : "user"
            })
            console.log("Search Works");
            if (response.data.message) {
                setLoader(false);
                setlitData({ heading: "No result found", UserId: "Invalid Search", Username: "Error" });
                setAccdata({ heading: "No result found", UserId: "Invalid Search", Username: "Error" });
                return;
            }
            setLoader(false);
            option == "l" ? setlitData(response.data.result) : setAccdata(response.data.result);
        }
        catch (error) {
            setLoader(false);
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        const fetch_search = async () => {
            try {
                setLoader(true);
                const response = await axios.get("https://commitments-folder-ce-curious.trycloudflare.com/fetchsearch");
                setLoader(false);
                setlitData(response.data.result);
                setAccdata(response.data.result);

            }
            catch (error) {
                setLoader(false);
                console.error("Error:", error);
            }
        }
        fetch_search();

        const fetch_followers = async () => {
            try {
                const response = await axios.post("https://commitments-folder-ce-curious.trycloudflare.com/fetch-follow", {
                    method: "jram6269@gmail.com"
                })
                setFollowing(response.data.followers);
            }
            catch (error) {
                console.error("Error:", error);
            }
        }

        fetch_followers();
    }, []);


    const handle_custom_logo = (string) => {
        if (!string) return;
        let logo = "";
        logo += string[0].toUpperCase() + string[1].toUpperCase();
        return logo;
    }

    const handleLiterature = () => {
        if (option == "l") {
            return;
        }
        setOption("l");
    }

    const handleChange = () => {
        setSuggestion(true);
    }

    const handleSuggestionClick = (text) => {
        setSearch(text);
        setSuggestion(false);
        handle_search();
    }

    const handle_follow = async (targetid, type) => {
        try {
            const response = await axios.post("https://commitments-folder-ce-curious.trycloudflare.com/follow", {
                userid: "jram6269@gmail.com",
                targetid: targetid,
                type: type
            })
            console.log(response.data);
        }
        catch (error) {
            console.error("Error:", error);
        }

    }

    const handle_activated_post = (item) => {
        setActiveContent(item);
        setActivate(true);
    }

    const handle_comments = async () => {
        const date = new Date;
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        try {
            const response = await axios.post("https://literasocial.onrender.com/comment", {
                postId: ids,
                Email: usermail,
                Username: "Jayaram",
                UserId: "itz_jram18",
                Comment: commentInput,
                Time: time
            })
            Alert.alert("Comment Successfully added.", "Wanna comment more?");
            setCommentInput("");
        }
        catch (error) {
            console.error("Error saving comments", error);
        }
    }

    const open_comments = async (id) => {
        setComments(!comments);
        setComment([]);
        setIds(id);
        try {
            const response = await axios.post("https://literasocial.onrender.com/fetch-comments", { method: id });
            console.log(response.data);
            if (response.data.data == "No comments found.") {
                return;
            }
            setComment(response.data.data);
        }
        catch (error) {
            console.error("Error fetching comments:", error);
        }
    }

    const handleSpeech = (message, id) => {
        if (voiceState) {
            if (voiceState.id == id) {
                setVoiceState(!voiceState);
                Speech.stop();
                return;
            } else {
                Speech.stop();
            }
        }
        Speech.speak(message, { pitch: 1.2, rate: 0.9 });
        setVoiceState({ id: id });
    }


    return (
        <View style={{ flex: 1, backgroundColor: "white", display: "flex", alignItems: 'center', paddingTop: 50 }}>
            <View style={{ width: "100%", height: 70, backgroundColor: "white", display: "flex" }}>
                <Text style={{ fontSize: 26, fontWeight: 500, paddingLeft: 30 }}>Search</Text>
            </View>
            <Ionicons onPress={handle_search} name="search-outline" size={25} color={"gray"} style={{ position: "absolute", top: 132, left: 35, zIndex: 99999999999 }} />
            <TextInput onChange={handleChange} onSubmitEditing={handle_search} value={search} onChangeText={setSearch} style={{ width: "90%", height: 50, borderWidth: 1, borderColor: "gray", borderRadius: 10, padding: 10, paddingLeft: 50, paddingRight: 20 }} placeholder="Search for Poems, Stories, Users..." />
            {suggestion && <Pressable style={{ position: "absolute", top: 180, borderRadius: 20, backgroundColor: "white", elevation: 10, width: "90%", height: "50%", zIndex: 1000 }}>
                <FlatList
                    data={litdata}
                    style={{ width: "100%", height: "100%" }}
                    contentContainerStyle={{ justifyContent: "center", flexDirection: "column" }}
                    renderItem={({ item }) => (
                        <TouchableOpacity activeOpacity={0.6} onPress={() => handleSuggestionClick(item.Username)} style={{ width: "100%", padding: 18, paddingTop: 25, paddingBottom: 10, display: 'flex', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: 600, paddingLeft: 30 }}>{item.Username}</Text>
                        </TouchableOpacity>
                    )} />
            </Pressable>}
            <Pressable style={{ display: "flex", alignItems: 'center', flexDirection: 'row', width: "90%", borderRadius: 10, borderWidth: .5, borderColor: "black", justifyContent: "center", marginTop: 20, padding: 10, paddingTop: 10, paddingBottom: 10, gap: 5, backgroundColor: 'white' }}>
                <Pressable onPress={handleLiterature} style={{ width: "50%", padding: 21, backgroundColor: option == "l" ? "black" : "white", borderRadius: 10, alignItems: "center", display: "flex", flexDirection: "row", gap: 10, justifyContent: "center" }}>
                    <Ionicons name="book-outline" size={20} color={option == "a" ? "black" : "white"} />
                    <Text style={{ color: option == "l" ? "white" : "black", fontSize: 15, fontWeight: 600 }}>Literature</Text>
                </Pressable>
                <Pressable onPress={() => setOption("a")} style={{ width: "50%", padding: 20, backgroundColor: option == "a" ? "black" : "white", borderRadius: 10, alignItems: 'center', display: "flex", flexDirection: "row", justifyContent: "center", gap: 10 }}>
                    <Ionicons name="person-circle-outline" size={20} color={option == "l" ? "black" : "white"} />
                    <Text style={{ color: option == "a" ? "white" : "black", fontSize: 15, fontWeight: 600 }}>Accounts</Text>
                </Pressable>
            </Pressable>
            {loader && <View style={{ display: 'flex', alignItems: 'center' }}>
                <Pressable style={{ position: "relative", minWidth: "90%", maxWidth: "90%", width: "110%", borderWidth: 1, borderColor: 'lightgray', display: "flex", borderRadius: 10, marginTop: 20, }}>
                    <View style={{ left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                        <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "lightgray" }}>{handle_custom_logo(activeContent.Username)}</Text>
                        <View style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start', padding: 10, gap: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "left", backgroundColor: "lightgray", borderRadius: 20, color: "lightgray" }}>VoiceOfYouth</Text>
                            <Text style={{ fontSize: 12, color: "lightgray", padding: 0, backgroundColor: "lightgray", borderRadius: 20 }}>user112</Text>
                        </View>
                        <Ionicons name="ellipsis-horizontal-outline" size={20} color={"lightgray"} style={{ marginLeft: "40%", zIndex: 1000000000, backgroundColor: "lightgray", borderRadius: 20 }} />
                    </View>
                </Pressable>
            </View>}
            {loader && <View style={{ display: 'flex', alignItems: 'center' }}>
                <Pressable style={{ position: "relative", minWidth: "90%", maxWidth: "90%", width: "110%", borderWidth: 1, borderColor: 'lightgray', display: "flex", borderRadius: 10, marginTop: 20, }}>
                    <View style={{ left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                        <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "lightgray" }}>JR</Text>
                        <View style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start', padding: 10, gap: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "left", backgroundColor: "lightgray", borderRadius: 20, color: "lightgray" }}>VoiceOfYouth</Text>
                            <Text style={{ fontSize: 12, color: "lightgray", padding: 0, backgroundColor: "lightgray", borderRadius: 20 }}>user112</Text>
                        </View>
                        <Ionicons name="ellipsis-horizontal-outline" size={20} color={"lightgray"} style={{ marginLeft: "40%", zIndex: 1000000000, backgroundColor: "lightgray", borderRadius: 20 }} />
                    </View>
                </Pressable>
            </View>}
            {loader && <View style={{ display: 'flex', alignItems: 'center' }}>
                <Pressable style={{ position: "relative", minWidth: "90%", maxWidth: "90%", width: "110%", borderWidth: 1, borderColor: 'lightgray', display: "flex", borderRadius: 10, marginTop: 20, }}>
                    <View style={{ left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                        <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "lightgray" }}>JR</Text>
                        <View style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start', padding: 10, gap: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "left", backgroundColor: "lightgray", borderRadius: 20, color: "lightgray" }}>VoiceOfYouth</Text>
                            <Text style={{ fontSize: 12, color: "lightgray", padding: 0, backgroundColor: "lightgray", borderRadius: 20 }}>user112</Text>
                        </View>
                        <Ionicons name="ellipsis-horizontal-outline" size={20} color={"lightgray"} style={{ marginLeft: "40%", zIndex: 1000000000, backgroundColor: "lightgray", borderRadius: 20 }} />
                    </View>
                </Pressable>
            </View>}
            <FlatList
                data={option == "l" ? litdata : accdata}
                contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <View style={{ display: 'flex', alignItems: 'center' }}>
                        <Pressable onPress={() => { option =="l"?handle_activated_post(item):null }} style={{ minWidth: "95%", maxWidth: "95%", width: "110%", borderWidth: 1, borderColor: 'lightgray', display: "flex", alignItems: 'center', borderRadius: 10, marginTop: 20, }}>
                            <View style={{ left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                                <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "white" }}>{handle_custom_logo(item.Username)}</Text>
                                <View style={{ display: 'flex', flexDirection: option == "l" ? "column" : "row", alignItems: option != "l" ? 'center' : "flex-start", justifyContent: "center", padding: 10, gap: 10 }}>
                                    <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "left", borderRadius: 20, color: "black" }}>{option == "l" ? item.heading : item.Username}</Text>
                                    {option == "l" ? <Text style={{ fontSize: 12, color: "black", padding: 0, borderRadius: 20 }}>{option == "l" ? item.UserId : ""}</Text> : null}
                                    {option != "l" ? <Pressable onPress={() => { handle_follow(item.Email, following.includes(item.Email) ? "unfollow" : "follow"); following.includes(item.Email) ? setFollowing(following.filter(i => i != item.Email)) : setFollowing(prev => [...prev, item.Email]) }} style={{ padding: 8, marginLeft: 20, borderRadius: 10, borderWidth: 1, borderColor: "#405DE6", backgroundColor: following.includes(item.Email) ? "#405DE6" : "white" }}><Text style={{ color: following.includes(item.Email) ? "white" : "#405DE6" }}>{following.includes(item.Email) ? "Following" : "Follow"}</Text></Pressable>
                                        : null}
                                </View>
                                <Ionicons name="ellipsis-horizontal-outline" size={20} color={"black"} style={{ position: "absolute", right: 30, zIndex: 1000000000, borderRadius: 20 }} />
                            </View>
                        </Pressable>
                    </View>
                )}
            />
            {activate && activeContent && <Pressable onPress={() => { comments?null:setActivate(false);setComments(false); }} style={{ width: "100%", height: "96.5%", backgroundColor: "#00000048", zIndex: 1000000000, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "lightgray" }}>
                <Pressable onPress={ () => {setComments(false)}} style={{ backgroundColor: "white", minWidth: "90%", maxWidth: "90%", borderWidth: 1, borderColor: 'lightgray', display: "flex", marginTop: 20, borderRadius: 10, position: 'relative' }}>
                    <View style={{ width: "100%", padding: 15, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start" }}>
                        <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "white" }}>{handle_custom_logo(activeContent.Username)}</Text>
                        <View style={{ display: 'flex', flexDirection: "column", padding: 10, gap: 10 }}>
                            <Text style={{ borderRadius: 20, fontSize: 15, fontWeight: 500, textAlign: 'left', paddingLeft: 5, color: "black" }}>{activeContent.Username}</Text>
                            <Text style={{ fontSize: 12, color: "black", paddingLeft: 5, borderRadius: 20 }}>{activeContent.UserId}</Text>
                        </View>
                        <Ionicons name="ellipsis-horizontal-outline" size={20} color={"black"} style={{ position: "relative", left: "50%", borderRadius: 20 }} />
                    </View>
                    <View style={{ width: "100%", display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 500, flexWrap: "wrap", color: "black", borderRadius: 20, paddingRight: 10 }}>{activeContent.heading}</Text>
                        <Text style={{ padding: 10, fontSize: 12, borderRadius: 20, backgroundColor: "lightgray", color: "white" }}>{activeContent.tag}</Text>
                    </View>
                    <View style={{ width: "100%", display: "flex", alignItems: 'center', alignContent: 'center', padding: 20, }}>
                        <Text style={{ textAlign: "left", color: "black", padding: 10, borderRadius: 20, paddingLeft: 0, fontSize: 14, fontWeight: 500, lineHeight: 25 }}>{activeContent.content}</Text>
                    </View>
                    <View style={{ padding: 20, display: "flex", flexDirection: 'row', gap: 20, maxWidth: "100%", minWidth: "100%", position: "relative", paddingLeft: 30, borderTopWidth: 1, borderTopColor: "lightgray", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <Pressable onPressIn={() => setlikedAnimations({ id: activeContent._id })} onPressOut={() => setlikedAnimations(false)} onPress={() => handleLikes(activeContent)} style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                            <Ionicons name={liked.some(count => count.id == activeContent._id) || likedanimation.id == activeContent._id ? "heart" : "heart-outline"} size={25} color={liked.some(count => count.id == activeContent._id) || likedanimation.id == activeContent._id ? "red" : "black"} />
                            <Text style={{ fontSize: 14, paddingTop: 3 }}>{liked.some(count => count.id == activeContent._id) ? formatCount(activeContent.likes, true) : formatCount(activeContent.likes, false)}</Text>
                        </Pressable>
                        <Pressable onPress={() => { open_comments(activeContent._id) }} style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                            <Ionicons name="chatbubble-outline" size={25} color={"black"} />
                            <Text style={{ fontSize: 14, paddingTop: 3 }}>{formatCount(activeContent.comments, false)}</Text>
                        </Pressable>
                        <Pressable style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                            <Ionicons name="paper-plane-outline" size={25} color={"black"} />
                            <Text style={{ fontSize: 14, paddingTop: 3 }}>{formatCount(activeContent.share, false)}</Text>
                        </Pressable>
                        <Pressable onPress={() => { handle_bg() }} style={{ position: "absolute", right: 60, top: 23 }}>
                            <Ionicons name={bgstate?"volume-high-outline":"volume-mute-outline"}  size={20} color={"black"} />
                        </Pressable>
                        <Pressable onPress={() => handleSpeech(activeContent.content, activeContent._id)} style={{ position: "absolute", right: 20, top: 23 }}>
                            <Ionicons name={voiceState.id == activeContent._id ? "mic-off-outline" : "mic-outline"} size={20} color={"black"} />
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>}

            <Animated.View style={[{ width: "100%", height: "50%", position: "absolute", bottom: 0, left: 0, backgroundColor: "white", borderWidth: 1, borderColor: "lightgray", borderTopLeftRadius: 40, borderTopRightRadius: 40, zIndex: 99999999999, display: 'flex', alignItems: 'center', paddingBottom: 90 }, { transform: [{ translateY: slideAnim }], }]}>
                <Pressable style={{ width: "40%", height: 4, marginTop: 10, backgroundColor: "lightgray", borderRadius: 20 }}></Pressable>
                <Text style={{ paddingTop: 15, paddingBottom: 15, fontSize: 20, fontWeight: 600 }}>Comments</Text>
                <FlatList
                    data={comment}
                    keyExtractor={(item, key) => key.toString()}
                    contentContainerStyle={{ alignItems: 'center', gap: 10 }}
                    renderItem={({ item }) => (
                        <Pressable style={{ minWidth: "95%", maxWidth: "95%", borderWidth: 1, borderColor: 'lightgray', display: "flex", alignItems: 'center', borderRadius: 20, marginTop: 20 }}>
                            <View style={{ position: "absolute", left: 10, width: "100%", padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", }}>
                                <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "gray" }}>{handle_custom_logo(item.username)}</Text>
                                <View style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start', padding: 10, gap: 5 }}>
                                    <Text style={{ fontSize: 13, fontWeight: 500, textAlign: "left", borderRadius: 20, color: "black" }}>{item.username}</Text>
                                    <Text style={{ fontSize: 11, color: "gray", padding: 0, borderRadius: 20 }}>{item.time}</Text>
                                </View>
                                <Ionicons name="ellipsis-horizontal-outline" size={20} color={"gray"} style={{ position: "absolute", right: 30, zIndex: 1000000000, }} />
                            </View>
                            <View style={{ paddingTop: 65, width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: "lightgray", borderRadius: 40 }}>
                                <Text style={{ textAlign: "left", fontSize: 13, fontWeight: 500, lineHeight: 25, padding: 10, borderRadius: 50, color: "black" }}>{item.comment}</Text>
                            </View>
                        </Pressable>
                    )}
                />
                <TextInput onSubmitEditing={handle_comments} value={commentInput} onChangeText={setCommentInput} style={{ width: "95%", position: "absolute", bottom: 30, height: 45, borderWidth: 1, borderColor: "lightgray", borderRadius: 40, padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: "white" }} placeholder="Comment your thoughts..." />
                <Pressable onPress={() => handle_comments()} style={{ position: "absolute", right: 35, bottom: 40 }}><Ionicons name="paper-plane-sharp" size={20} color={"black"} /></Pressable>
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
                    <Ionicons name="chatbox-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Search")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="search" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Ai")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="person-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Profile")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="person-circle-outline" size={22} color={"black"} />
                </TouchableOpacity>
            </View>

        </View>
    )

}