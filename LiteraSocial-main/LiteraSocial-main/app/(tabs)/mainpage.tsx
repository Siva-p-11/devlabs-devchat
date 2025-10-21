import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, FlatList, Pressable, RefreshControl, Text, TextInput, TouchableOpacity, View } from "react-native";
import AddPost from "./AddPost";



export default function mainpage() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [nav, setNav] = useState(false);
    const [liked, setLiked] = useState([{}]);
    const [likedQueue, setlikedQueue] = useState([]);
    const [ids, setIds] = useState();
    const [loader, setLoader] = useState(false);
    const [comments, setComments] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [addpost, setAddpost] = useState(false);
    const [comment, setComment] = useState([]);
    const [likedanimation, setlikedAnimations] = useState({});
    const [voiceState, setVoiceState] = useState({});
    const [simple, setSimple] = useState(false);
    const [options, setOptions] = useState({});
    const [filters, setFilters] = useState('Latest');
    const [usermail, setUsermail] = useState('');
    const [following, setFollowing] = useState([]);
    const [name, setName] = useState("reorder-three-outline");
    const rotateValue = useRef(new Animated.Value(0)).current;
    const slide = useRef(new Animated.Value(-200)).current;
    const spin = rotateValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
    const slideAnim = useRef(new Animated.Value(500)).current; // Start 200px below
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [bgstate, setBgState] = useState(false);

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
        rotateValue.setValue(0);
        Animated.loop(Animated.timing(rotateValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true
        })).start();
        Animated.loop(
            Animated.timing(slide,{
                 toValue: 400,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true
            })
        ).start();
    }, [])

    useEffect(() => {
        if (comments) {
            slideUp();
        }
        else {
            slideDown();
        }
    }, [comments])

    useEffect(() => {
        const fetch_user_mail = async () => {
            const user = await AsyncStorage.getItem("username");
            if (!user) {
                router.push("/(tabs)/Login");
            } else {
                setUsermail(user);
            }
        }
        fetch_user_mail();
        const handle_fetchPosts = async () => {
            const response = await axios.post("https://linux-cbs-imposed-hoping.trycloudflare.com/Posts", { method: "latest" });
            setPosts(prev => [...prev, ...response.data.Data]);
        }
        handle_fetchPosts();

        const fetch_Liked = async () => {
            const liked = await AsyncStorage.getItem("post-likes");
            if (liked) {
                setLiked(JSON.parse(liked));
            }
        }
        fetch_Liked();


        const fetch_followers = async () => {
            try {
                const response = await axios.post("https://linux-cbs-imposed-hoping.trycloudflare.com/fetch-follow", {
                    method: "jram6269@gmail.com"
                })
                setFollowing(response.data.followers);
            }
            catch (error) {
                console.error("Error:", error);
            }
        }

        fetch_followers();


    }, [])

    const handle_fetchPosts = async (method) => {
        setPosts([]);
        const response = await axios.post("https://linux-cbs-imposed-hoping.trycloudflare.com/Posts", { method: method });
        setPosts(response.data.Data);
    }

    const Onrefresh = () => {
        setRefresh(true);
        setPosts([]);
        handle_fetchPosts("latest").finally(() => setRefresh(false));
    }



    const handlenav = () => {
        if (addpost) {
            setAddpost(!addpost);
            setName("reorder-three-outline");
            return;
        }
        setNav(!nav);
        if (!nav) {
            setName("close-outline")
        } else {
            setName("reorder-three-outline");
        }

    }

    const handle_addPost = () => {
        setAddpost(!addpost);
        setName("close-outline")
    }

    const checkOptions = () => {
        if (options) {
            setOptions(!options);
        }
        setComments(false);
    }

    let cooldown = false;
    const fetch_more_posts = async () => {
        if (posts.length < 2) return;
        if (loader && cooldown) return;
        setLoader(true);
        cooldown = true;
        try {
            const response = await axios.post("https://literasocial.onrender.com/Posts", { method: "latest" });
            setPosts(prev => [...prev, ...response.data.Data]);
        }
        catch (error) {
            console.error("Error Fetching posts, Error:", error);
        } finally {
            setLoader(false);
            setTimeout(() => { cooldown = true }, 1000)
        }
    }


    const flushLikes = async (type, id) => {
        try {
            const response = await axios.post("https://linux-cbs-imposed-hoping.trycloudflare.com/likes", {
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
            setComments(false);
            Alert.alert("Report", "Post Reported Successfully");
        }
        catch (error) {
            console.error("Error found:", error);
            if (options) {
                setOptions(!options);
            }
            setComments(false);
        }
    }

    useEffect(() => {
        const saveLikes = async () => {
            await AsyncStorage.setItem("post-likes", JSON.stringify(liked));
        }
        saveLikes()
    }, [liked])


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

    return (
        <Pressable onPress={() => { }} style={{ flex: 1, backgroundColor: "white", display: "flex", position: "relative", flexDirection: 'column', alignItems: 'center' }}>
            <View style={{ width: "100%", height: 100, paddingTop: 20, position: "fixed", display: "flex", flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "lightgray" }}>
                <Ionicons name="book-outline" color={"black"} size={24} style={{ fontWeight: 600, paddingLeft: 26, paddingTop: 5 }} />
                <Text style={{ fontSize: 24, fontWeight: 600, paddingLeft: 10 }}>LiteraSocial</Text>
                <Ionicons name="mail-unread" size={24} color={"black"} style={{ paddingTop: 5, position: "absolute", top: 45, right: 60 }} />
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
            <FlatList
                data={posts}
                ListHeaderComponent={<>
                    <View style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
                        <View style={{ width: "50%", display: "flex", alignItems: "center" }}>
                            <Text style={{ fontSize: 24, fontWeight: 700, padding: 15, paddingBottom: 0, textAlign: "left" }}>Literary Community</Text>
                            <Text style={{ color: "gray", padding: 15, textAlign: "left" }}>Share your stories, poems, and connect with fellow writers</Text>
                        </View>
                        <View style={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Pressable onPress={handle_addPost} style={{ width: "90%", gap: 10, height: 50, backgroundColor: "black", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}>
                                <Ionicons name="add-outline" size={14} color={"white"} style={{ padding: 4, borderWidth: 1, borderColor: "white", borderRadius: 50 }} />
                                <Text style={{ color: "white", fontWeight: 500, textAlign: 'center' }}>Share Your Work</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ marginLeft: "5%", width: "90%", gap: 5, marginTop: 20, borderWidth: 1, borderColor: "lightgray", borderRadius: 10, padding: 10, backgroundColor: "#e3e3e334", display: "flex", alignItems: 'center', flexDirection: "row" }}>
                        <Pressable onPress={() => { setFilters("Latest"); handle_fetchPosts("latest") }} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 3, padding: 10, backgroundColor: filters == "Latest" ? "black" : "transparent", borderRadius: 10 }}>
                            <Ionicons name="time-outline" size={15} style={{ paddingTop: 3 }} color={filters == "Latest" ? "white" : "black"} />
                            <Text style={{ fontSize: 10.5, fontWeight: 500, color: filters == "Latest" ? "white" : "black" }}>Latest</Text>
                        </Pressable>
                        <Pressable onPress={() => { setFilters("Trending"); handle_fetchPosts("trend") }} style={{ display: "flex", flexDirection: "row", backgroundColor: filters == "Trending" ? "black" : "transparent", borderRadius: 10, alignItems: "center", gap: 8, padding: 10, }}>
                            <Ionicons name="trending-up-outline" size={15} style={{ paddingTop: 3 }} color={filters == "Trending" ? "white" : "black"} />
                            <Text style={{ fontSize: 10.5, fontWeight: 500, color: filters == "Trending" ? "white" : "black" }}>Trending</Text>
                        </Pressable>
                        <Pressable onPress={() => { setFilters("Poems"); handle_fetchPosts("poems") }} style={{ display: "flex", flexDirection: "row", borderRadius: 10, alignItems: "center", gap: 8, padding: 10, backgroundColor: filters == "Poems" ? "black" : "transparent" }}>
                            <Ionicons name="book-outline" size={15} color={filters == "Poems" ? "white" : "black"} style={{ paddingTop: 3 }} />
                            <Text style={{ fontSize: 10.5, fontWeight: 500, color: filters == "Poems" ? "white" : "black" }}>Poems</Text>
                        </Pressable>
                        <Pressable onPress={() => { setFilters("Stories"); handle_fetchPosts("stories") }} style={{ display: "flex", flexDirection: "row", borderRadius: 10, alignItems: "center", gap: 8, padding: 10, backgroundColor: filters == "Stories" ? "black" : "transparent" }}>
                            <Ionicons name="book-outline" size={15} color={filters == "Stories" ? "white" : "black"} style={{ paddingTop: 3 }} />
                            <Text style={{ fontSize: 10.5, fontWeight: 500, color: filters == "Stories" ? "white" : "black", padding: 0 }}>Stories</Text>
                        </Pressable>
                    </View>
                    <Pressable onPressIn={() => setSimple(true)} onPressOut={() => setSimple(false)} style={{ elevation: simple ? 6 : 0, marginLeft: "5%", width: "90%", borderWidth: 1, borderRadius: 10, borderColor: "lightgray", marginTop: 20, backgroundColor: "white", padding: 20, gap: 25 }}>
                        <View style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Ionicons name="at-circle-outline" size={20} color={"black"} />
                            <Text style={{ fontSize: 20, fontWeight: 500 }}>Featured Today</Text>
                        </View>
                        <Text style={{ color: "gray", fontSize: 15 }}>"The best stories are the ones that remind us why we fell in love with words in the first place."</Text>
                        <Text style={{ color: "black", fontSize: 17, fontWeight: 500 }}>Explore featured collections →</Text>
                    </Pressable>
                    {posts.length < 1 ? <Pressable style={{ marginLeft: "5%", minWidth: "90%", maxWidth: "90%", borderWidth: 1, borderColor: 'lightgray', display: "flex", marginTop: 20, borderRadius: 10, position: 'relative' }}>
                        <View style={{ width: "100%", padding: 15, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start" }}>
                            <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "lightgray" }}>JR</Text>
                            <View style={{ display: 'flex', flexDirection: "column", padding: 10, gap: 10 }}>
                                <Text style={{ backgroundColor: "lightgray", borderRadius: 20, fontSize: 15, fontWeight: 500, textAlign: 'left', paddingLeft: 5, color: "lightgray" }}>sadklmas</Text>
                                <Text style={{ fontSize: 12, color: "lightgray", padding: 0, backgroundColor: "lightgray", borderRadius: 20 }}>lsmd</Text>
                            </View>
                            <Ionicons name="ellipsis-horizontal-outline" size={20} color={"lightgray"} style={{ position: "relative", left: "50%", backgroundColor: "lightgray", borderRadius: 20 }} />
                        </View>
                        <View style={{ width: "100%", display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 500, flexWrap: "wrap", color: "lightgray", backgroundColor: "lightgray", borderRadius: 20, paddingRight: 10 }}>saldkmasdlkasdsal;dksad;la</Text>
                            <Text style={{ padding: 10, fontSize: 12, borderRadius: 20, backgroundColor: "lightgray", color: "lightgray" }}>sadkas</Text>
                        </View>
                        <View style={{ width: "100%", display: "flex", alignItems: 'center', alignContent: 'center', padding: 20, }}>
                            <Text style={{ textAlign: "left", color: "lightgray", padding: 10, backgroundColor: "lightgray", borderRadius: 20, paddingLeft: 0, fontSize: 14, fontWeight: 500, lineHeight: 25 }}>
                                The sky blushed as the first light crept over the sleeping hills, each ray a gentle finger unbuttoning the night’s dark coat. Birds began their hesitant songs, not quite ready to wake, yet unable to resist the pull of the sun’s warm breath.
                            </Text>
                        </View>
                    </Pressable> : null}
                </>}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 50, gap: 20 }}
                style={{ flex: 1, display: "flex", position: "relative" }}
                ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
                onEndReached={fetch_more_posts}
                onEndReachedThreshold={0.8}
                renderItem={({ item }) => (
                    <Pressable onPress={checkOptions} style={{ minWidth: "90%",overflow:"hidden", maxWidth: "90%", borderWidth: 1, borderColor: 'lightgray', display: "flex", marginTop: 0, borderRadius: 10, position: 'relative' }}>
                        {options.id == item._id ? <View style={{ padding: 20, right: 20, top: 20, zIndex: 100000000, borderRadius: 10, backgroundColor: "white", position: "absolute", elevation: 6 }}>
                            <Pressable onPress={() => handle_report(item._id)} style={{ backgroundColor: "red", borderRadius: 10, padding: 10 }}>
                                <Text style={{ color: "white", fontSize: 13 }}>Report</Text>
                            </Pressable>
                        </View> : null}
                        <View style={{ width: "100%", padding: 15, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start" }}>
                            <Text style={{ padding: 15, borderRadius: 40, backgroundColor: "lightgray", color: "gray" }}>{handle_custom_logo(item.Username)}</Text>
                            <View style={{ display: 'flex', flexDirection: "column", padding: 10 }}>
                                <Text style={{ fontSize: 15, fontWeight: 500, textAlign: 'left', paddingLeft: 5 }}>{item.Username}</Text>
                                <Text style={{ fontSize: 12, color: "gray", padding: 5 }}>{item.time}</Text>
                            </View>
                            <Pressable onPress={() => { handle_follow(item.Email, following.includes(item.Email) ? "unfollow" : "follow"); following.includes(item.Email) ? setFollowing(following.filter(i => i != item.Email)) : setFollowing(prev => [...prev, item.Email]) }} style={{ padding: 10, marginLeft: 40, borderRadius: 10, borderWidth: 1, borderColor: "#405DE6", backgroundColor: following.includes(item.Email) ? "#405DE6" : "white" }}><Text style={{ color: following.includes(item.Email) ? "white" : "#405DE6" }}>{following.includes(item.Email) ? "Following" : "Follow"}</Text></Pressable>
                            <Ionicons onPress={() => setOptions({ id: item._id })} name="ellipsis-horizontal-outline" size={20} color={"black"} style={{ marginLeft: following.includes(item.Email) ? 40 : 50 }} />
                        </View>
                        <View style={{ width: "100%", display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 500, flexWrap: "wrap" }}>{item.heading}</Text>
                            <Text style={{ padding: 10, fontSize: 12, borderRadius: 20, backgroundColor: "lightgray", color: "black" }}>{item.tag}</Text>
                        </View>
                        <View style={{ width: "100%", display: "flex", alignItems: 'center', alignContent: 'center', padding: 20, }}>
                            <Text style={{ textAlign: "left", paddingLeft: 0, fontSize: 14, fontWeight: 500, lineHeight: 25 }}>
                                {item.content}</Text>
                        </View>
                        <View style={{ padding: 20, display: "flex", flexDirection: 'row', gap: 20, maxWidth: "100%", minWidth: "100%", position: "relative", paddingLeft: 30, borderTopWidth: 1, borderTopColor: "lightgray", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <Pressable onPressIn={() => setlikedAnimations({ id: item._id })} onPressOut={() => setlikedAnimations(false)} onPress={() => handleLikes(item)} style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                                <Ionicons name={liked.some(count => count.id == item._id) || likedanimation.id == item._id ? "heart" : "heart-outline"} size={25} color={liked.some(count => count.id == item._id) || likedanimation.id == item._id ? "red" : "black"} />
                                <Text style={{ fontSize: 14, paddingTop: 3 }}>{liked.some(count => count.id == item._id) ? formatCount(item.likes, true) : formatCount(item.likes, false)}</Text>
                            </Pressable>
                            <Pressable onPress={() => { open_comments(item._id) }} style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                                <Ionicons name="chatbubble-outline" size={25} color={"black"} />
                                <Text style={{ fontSize: 14, paddingTop: 3 }}>{formatCount(item.comments, false)}</Text>
                            </Pressable>
                            <Pressable onPress={() => handle_comments(item._id)} style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                                <Ionicons name="paper-plane-outline" size={25} color={"black"} />
                                <Text style={{ fontSize: 14, paddingTop: 3 }}>{formatCount(item.share, false)}</Text>
                            </Pressable>
                            <Pressable onPress={() => { handle_bg() }} style={{ position: "absolute", right: 60, top: 23 }}>
                                <Ionicons name={bgstate?"volume-high-outline":"volume-mute-outline"} size={20} color={"black"} />
                            </Pressable>
                            <Pressable onPress={() => handleSpeech(item.content, item._id)} style={{ position: "absolute", right: 20, top: 23 }}>
                                <Ionicons name={voiceState.id == item._id ? "mic-off-outline" : "mic-outline"} size={20} color={"black"} />
                            </Pressable>
                        </View>
                        <Animated.View style={{display:"flex",flexDirection:"row",transform:[{translateX:slide}]}}>
                            <Text style={{fontSize:15,padding:10,color:"black", fontWeight:600}}><Ionicons name="musical-note-outline" size={15} color={"black"}/> Channa Meraya</Text>
                        </Animated.View>
                    </Pressable>
                )}
                ListFooterComponent={<>
                    {posts.length > 2 && <Animated.View style={[{ width: 30, height: 30, borderWidth: 1.5, borderBottomWidth: 0, borderLeftWidth: 0, borderColor: 'black', borderTopColor: '#333', borderRadius: 20 }, { transform: [{ rotate: spin }] }]}></Animated.View>}
                </>}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={Onrefresh} />
                }
            />
            <View style={{ width: "100%", height: 80, bottom: 0, position: "absolute", zIndex: 10000000, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "lightgray", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/mainpage")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="home" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Thoughts")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="chatbox-outline" size={22} color={"black"} />
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
            {addpost && <AddPost />}
            <View style={{ padding: 30 }}>

            </View>
        </Pressable>
    )

}