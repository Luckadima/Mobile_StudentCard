import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { getDocs, collection, doc, deleteDoc, updateDoc } from "firebase/firestore"; // Import updateDoc
import { db } from './Firebase'; 

const AdminLogin = () => {
    const Login = () => {
        router.push('/Login');
    }


    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({ name: '', studentNumber: '', email: '', course: '', year: '' });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const colRef = collection(db, 'users'); 
                const snapshot = await getDocs(colRef); 
                let randomcollection = [];
                snapshot.docs.forEach((doc) => {
                    randomcollection.push({ ...doc.data(), id: doc.id });
                });
                setStudents(randomcollection);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'users', id)); 
            setStudents((prevStudents) => prevStudents.filter(student => student.id !== id)); 
            Alert.alert('Success', 'User deleted successfully');
        } catch (error) {
            console.error("Error deleting user: ", error);
            Alert.alert('Error', 'Could not delete user');
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({ 
            name: student.name, 
            studentNumber: student.studentNumber, 
            email: student.email, 
            course: student.course, 
            year: student.year 
        });
    };

    const handleUpdate = async () => {
        try {
            await updateDoc(doc(db, 'users', editingStudent.id), formData); // Update Firestore
            setStudents((prevStudents) => 
                prevStudents.map(student => 
                    student.id === editingStudent.id ? { ...student, ...formData } : student
                )
            );
            Alert.alert('Success', 'User updated successfully');
            setEditingStudent(null); // Clear editing state
        } catch (error) {
            console.error("Error updating user: ", error);
            Alert.alert('Error', 'Could not update user');
        }
    };

    return (
        <>
            <View style={{ marginLeft: '37%', marginTop: '5%' }}>
                <Text style={{ fontSize: 20, }}>Admin information</Text>
            </View>

            <ScrollView style={styles.container}>
                {students.map((student) => ( 
                    <View key={student.id} style={styles.detailBox}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.info}>{student.name}</Text>
                        <Text style={styles.label}>Student ID:</Text>
                        <Text style={styles.info}>{student.studentNumber}</Text>
                        <Text style={styles.label}>Course:</Text>
                        <Text style={styles.info}>{student.course}</Text>
                        <Text style={styles.label}>Year:</Text>
                        <Text style={styles.info}>{student.year}</Text>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.info}>{student.email}</Text>
                        <View style={styles.buttonContainer}>
                            <Pressable 
                                style={styles.deleteButton}
                                onPress={() => handleDelete(student.id)} 
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </Pressable>
                            <Pressable 
                                style={styles.editButton}
                                onPress={() => handleEdit(student)} 
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
                
                {/* Editing Form */}
                {editingStudent && (
                    <View style={styles.editForm}>
                        <Text style={styles.editTitle}>Edit Student</Text>
                        <TextInput
                            placeholder="Name"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Student ID"
                            value={formData.studentNumber}
                            onChangeText={(text) => setFormData({ ...formData, studentNumber: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Course"
                            value={formData.course}
                            onChangeText={(text) => setFormData({ ...formData, course: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Year"
                            value={formData.year}
                            onChangeText={(text) => setFormData({ ...formData, year: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            style={styles.input}
                        />
                        <Pressable style={styles.updateButton} onPress={handleUpdate}>
                            <Text style={styles.buttonText}>Update</Text>
                        </Pressable>
                    </View>
                )}
                
                <Animated.View style={[styles.button, { opacity: fadeAnim }]}>
                    <TouchableOpacity onPress={Login}>
                        <Text style={styles.buttonText}>Return To Home</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    detailBox: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    info: {
        fontSize: 16,
        color: 'black',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 8,
        padding: 10,
        width: '45%',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: 'green',
        borderRadius: 8,
        padding: 10,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    editForm: {
        marginTop: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    editTitle: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        borderRadius: 5,
    },
    updateButton: {
        backgroundColor: 'blue',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
    },
    button: {
        backgroundColor: "lightgray",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 200,
        borderRadius: 22,
        marginTop: 50,
        marginLeft: '25%',
    },
});

export default AdminLogin;



