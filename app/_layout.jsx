import { Stack } from "expo-router";
import { usercontext } from "./Context";
import { useState } from "react";
import { ImageProvider } from './ImageContext';
import OrientationAwareComponent from './OrientationAwareComponent';

export default function RootLayout() {
    const [user, setuser] = useState("");
    const [users, setusers] = useState("");

    return (
        <ImageProvider>
            <usercontext.Provider value={{ user, setuser, users, setusers }}>
                <OrientationAwareComponent>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                    </Stack>
                </OrientationAwareComponent>
            </usercontext.Provider>
        </ImageProvider>
    );
}




// import { Stack } from "expo-router";
// import { usercontext } from "./Context";
// import { useState } from "react";

// export default function RootLayout() {

//   const [user, setuser] = useState("");
//   const [users, setusers] = useState("");
//   const [emails , setemails] = useState("");


//   return (
//     <usercontext.Provider value={{user, setuser , users , setusers, emails, setemails}}>
//     <Stack screenOptions={{headerShown: false}}>
//       <Stack.Screen name="index" />

//     </Stack>
//     </usercontext.Provider>
//   );
// }