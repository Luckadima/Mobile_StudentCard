import { router } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db, firebase_auth } from './Firebase';

export default function About() {

    const Landingpage = async () => { // Make the function asynchronous
        const userId = firebase_auth.currentUser?.uid;
        if (userId) {
            try {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef); // Use getDoc to retrieve the document for the user
                if (userDoc.exists()) {
                    const role = userDoc.data().ifstudent; // Assuming 'ifstudent' holds the role
                    if (role === 'Staff') {
                        router.push('/Stafflanding'); // Navigate to Stafflanding if the user is a staff
                    } else {
                        router.push('/Landingpage'); // Navigate to Landingpage otherwise
                    }
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        } else {
            console.error("User not authenticated");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>About Us</Text>
            <Text style={styles.paragraph}>
                Welcome to the University of Johannesburg Virtual Student Card - TapIn. Our university is committed 
                to embracing the Fourth Industrial Revolution (4IR), and this app represents our step towards a more 
                convenient, efficient, and technology-driven future. This app provides students and staff with a digital 
                alternative to the traditional physical student card, offering a reliable and accessible way to manage 
                campus identification needs. With this virtual card, students and staff can seamlessly access university 
                facilities, services, and resources, ensuring a smooth and efficient campus experience.
            </Text>
            <Text style={styles.paragraph}>
                At UJ, we strive to lead in innovation and digital transformation, and this virtual card app is part 
                of our dedication to providing smart, future-forward solutions for our community.
            </Text>

            <View style={styles.button}>
                <TouchableOpacity onPress={Landingpage}>
                    <Text style={styles.buttonText}>Return To Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5', // Light background color
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // Dark text color for contrast
        marginBottom: 20,
        textAlign: 'center', // Center the title
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666', // Slightly lighter text color
        marginBottom: 15,
    },
    button: {
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        height: '7%', // Responsive height
        width: '50%', // Responsive width
        borderRadius: 22,
        marginTop: '5%', // Responsive margin
        marginLeft: '25%', // Responsive margin
    },
    buttonText: {
        fontSize: 16, // Fixed font size
        color: '#fff',
    },
});
