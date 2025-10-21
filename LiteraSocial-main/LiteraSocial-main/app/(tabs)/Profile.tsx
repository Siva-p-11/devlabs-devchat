import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
    const router = useRouter();
    const [name, setName] = useState("reorder-three-outline");
    const [option, setOption] = useState("l");
    const [nav, setNav] = useState(false);
    const handlenav = () => {
        setNav(!nav);
        if (!nav) {
            setName("close-outline")
        } else {
            setName("reorder-three-outline");
        }

    }
    return (
        <View style={{ flex: 1, backgroundColor: "white", position: "relative" }}>
            <View style={{ width: "100%", height: 100, paddingTop: 20, display: "flex", flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "lightgray" }}>
                <Ionicons name="book-outline" color={"black"} size={24} style={{ fontWeight: 600, paddingLeft: 26, paddingTop: 5 }} />
                <Text style={{ fontSize: 24, fontWeight: 600, paddingLeft: 10 }}>LiteraSocial</Text>
                <Ionicons onPress={handlenav} name={name} size={24} color={"black"} style={{ paddingTop: 5, position: "absolute", top: 45, right: 20 }} />
            </View>
            <View style={{ width: "100%", display: "flex", alignItems: 'center', position: "relative" }}>
                <Pressable style={{ position: 'absolute', top: 15, right: 15, padding: 15, backgroundColor: "black", borderRadius: 20 }}>
                    <Text style={{ color: "white" }}>Edit Profile</Text>
                </Pressable>
                <View style={{ width: 120, height: 120, marginTop: 20, borderRadius: 100, backgroundColor: "lightgray", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 25, color: "gray" }}>JR</Text>
                </View>
                <Text style={{ fontSize: 25, fontWeight: 500, paddingTop: 10 }}>Jayaram</Text>
                <Text style={{ fontSize: 18, paddingTop: 10, }}>Passionate thinker</Text>
                <View style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "20%", paddingTop: 20 }}>
                    <View style={{ display: "flex", alignItems: 'center', justifyContent: "center", gap: 5 }}>
                        <Text style={{ fontSize: 25, fontWeight: "500" }}>1.2K</Text>
                        <Text>Followers</Text>
                    </View>
                    <View style={{ display: "flex", alignItems: 'center', justifyContent: "center", gap: 5 }} >
                        <Text style={{ fontSize: 25, fontWeight: "500" }}>384</Text>
                        <Text>Following</Text>
                    </View>
                </View>
                <Pressable style={{ display: "flex", alignItems: 'center', flexDirection: 'row', width: "90%", borderRadius: 10, justifyContent: "center", marginTop: 20, padding: 10, paddingTop: 10, paddingBottom: 10, gap: 5, backgroundColor: 'white' }}>
                    <Pressable onPress={() => setOption("l")} style={{ width: "50%", padding: 21, backgroundColor: option == "l" ? "black" : "white", borderRadius: 10, alignItems: "center", display: "flex", flexDirection: "row", gap: 10, justifyContent: "center" }}>
                        <Ionicons name="book-outline" size={20} color={option == "a" ? "black" : "white"} />
                        <Text style={{ color: option == "l" ? "white" : "black", fontSize: 15, fontWeight: 600 }}>My Literature</Text>
                    </Pressable>
                    <Pressable onPress={() => setOption("a")} style={{ width: "50%", padding: 20, backgroundColor: option == "a" ? "black" : "white", borderRadius: 10, alignItems: 'center', display: "flex", flexDirection: "row", justifyContent: "center", gap: 10 }}>
                        <Ionicons name="person-circle-outline" size={20} color={option == "l" ? "black" : "white"} />
                        <Text style={{ color: option == "a" ? "white" : "black", fontSize: 15, fontWeight: 600 }}>My Thoughts</Text>
                    </Pressable>
                </Pressable>
                {option == "l" ? <Pressable style={{ minWidth: "90%", maxWidth: "90%", borderWidth: 1, borderColor: 'lightgray', display: "flex", marginTop: 20, borderRadius: 10, position: 'relative' }}>
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
                </Pressable> : <Pressable style={{ minWidth: "85%", maxWidth: "85%", width: "110%", borderWidth: 1, borderColor: 'lightgray', display: "flex", alignItems: 'center', borderRadius: 10, marginTop: 20 }}>
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
                    <Ionicons name="person-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => router.push("/(tabs)/Profile")} style={{ width: "19%", height: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                    <Ionicons name="person-circle" size={22} color={"black"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}