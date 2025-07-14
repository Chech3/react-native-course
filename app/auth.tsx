import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native"

export default function AuthScreen() {
 return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View>
            <Text>Create Acoount</Text>


            <TextInput label="Email" autoCapitalize="none" keyboardType="email-address" placeholder="example@gmail.com" />
        </View>
    </KeyboardAvoidingView>
 )   
}