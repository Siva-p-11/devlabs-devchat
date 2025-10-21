import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function AddPost() {

    const [heading, setHeading] = useState('');
    const [tag, setTag] = useState('');
    const [content, setContent] = useState('');

    const handle_addPost = async () => {
        if(!content.trim() || !heading.trim() || !tag.trim()) return;
        const date = new Date();
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) 
        const response = await axios.post("https://literasocial.onrender.com/addPost", {
            Email: "jram6269@gmail.com",
            Username: "Jayaram",
            Userid: "itz_jram18",
            tag: tag,
            heading: heading,
            content: content,
            likes: "0",
            comments: '0',
            shares: "0",
            time: time

        })
        setContent("");
        setHeading("")
        setTag("");
        Alert.alert("Post added Successfully")
    }

    return (
        <View style={{ position: "absolute", width: "100%", zIndex: 1000, backgroundColor: "white", borderBottomWidth: 1, borderColor: "lightgray", display: "flex", alignItems: "center", marginTop: 100, paddingBottom: 25 }}>
            <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
                <View style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, paddingTop: 30 }}>
                    <Ionicons name={"pencil-outline"} size={24} color={"black"} />
                    <Text style={{ fontSize: 22, fontWeight: 600 }}>Literary Manuscript</Text>
                </View>
                <Text style={{ padding: 10, color: "gray", paddingTop: 10, textAlign: "center", fontSize: 12 }}>Share your literary creation with the world. Craft your words with intention, tag with precision, and publish with pride.</Text>
                <View style={{ width: "40%", height: 20, borderBottomWidth: 1, borderColor: "black" }}></View>
            </View>
            <View style={{ width: "90%", paddingBottom: 20, borderRadius: 10, borderWidth: 1, borderColor: "lightgray", marginTop: 40 }}>
                <View style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: "100%", display: "flex", flexDirection: 'row', paddingTop: 20, paddingLeft: "10%", paddingBottom: 10, gap: 10 }}>
                        <Ionicons name={"document-outline"} size={15} color={"black"} style={{ marginTop: 2 }} />
                        <Text style={{ alignSelf: 'left', fontWeight: 600 }}>Literary Heading</Text>
                    </View>
                    <TextInput value={heading} onChangeText={setHeading} style={{ width: "90%", borderWidth: 1, borderColor: "lightgray", padding: 10, borderRadius: 10 }} placeholder="Enter the title of your literary work..." />
                </View>
                <View style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: "100%", display: "flex", flexDirection: 'row', paddingTop: 20, paddingLeft: "10%", paddingBottom: 10, gap: 10 }}>
                        <Ionicons name={"pricetag-outline"} size={15} color={"black"} style={{ marginTop: 2 }} />
                        <Text style={{ alignSelf: 'left', fontWeight: 600 }}>Literary Tag</Text>
                    </View>
                    <TextInput value={tag} onChangeText={setTag} style={{ width: "90%", borderWidth: 1, borderColor: "lightgray", padding: 10, borderRadius: 10 }} placeholder="Poetry, Short Story, Essay, Novel Excerpt..." />
                </View>
                <View style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: "100%", display: "flex", flexDirection: 'row', paddingTop: 20, paddingLeft: "10%", paddingBottom: 10, gap: 10 }}>
                        <Ionicons name={"pencil-outline"} size={15} color={"black"} style={{ marginTop: 2 }} />
                        <Text style={{ alignSelf: 'left', fontWeight: 600 }}>Literary Content</Text>
                    </View>
                    <TextInput value={content} onChangeText={setContent} multiline textAlignVertical="top" style={{ width: "90%", height: 150, borderWidth: 1, borderColor: "lightgray", padding: 10, borderRadius: 10 }} placeholder="Pour your thoughts on this digital mauscript..." />
                </View>
                <Pressable onPress={handle_addPost} style={{ padding: 15, backgroundColor: content.trim() && heading.trim() && tag.trim()?"black":"lightgray", display: "flex", flexDirection: "row", width: "50%", borderRadius: 10, gap: 10, alignSelf: "flex-end", marginRight: 20, marginTop: 20 }}>
                    <Ionicons name={"document-outline"} size={15} color={"white"} style={{ marginTop: 2 }} />
                    <Text style={{ color: "white", fontWeight: 600 }}>Publish Literature</Text>
                </Pressable>
            </View>
            <Text style={{ textAlign: "center", color: "gray", fontSize: 12, paddingTop: 20 }}>"Words have no single fixed meaning, but like prisms break into a thousand rainbows."</Text>
        </View>
    )
}