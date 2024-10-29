import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { getDocs, collection } from "firebase/firestore"; // Import the necessary Firestore functions
import { db } from './Firebase'; // Import the db object from Firebase setup

function Server() {
  const [students, setStudents] = useState([]);



  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const colRef = collection(db, 'users'); // Correctly referencing the collection
        const snapshot = await getDocs(colRef); // Fetch documents from the collection
        let randomcollection = [];
        snapshot.docs.forEach((doc) => {
          randomcollection.push({ ...doc.data(), id: doc.id }); // Collect document data
        });
        console.log(randomcollection);
        setStudents(randomcollection); // Update state to display in the app
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.row}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Email</Text>
        <Text style={styles.headerCell}>StudentNumber</Text>
      </View>

      {/* Table Rows */}
      {students.map((student) => (
        <View key={student.id} style={styles.row}>
          <Text style={styles.cell}>{student.name}</Text>
          <Text style={styles.cell}>{student.email}</Text>
          <Text style={styles.cell}>{student.studentNumber}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  headerCell: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default Server;






































































// import { deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
// import { addDoc, collection } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { Button, Text, TextInput, View } from "react-native";

// import { db } from './Firebase';

// function Server() {
// 	const [newTodo, setNewTodo] = useState("");
// 	const [todos, setTodos] = useState([]);

// 	async function deleteTodo(id) {
// 		// Delete a document by ID.
// 		await deleteDoc(doc(db, "randomProject", id));
// 	}

// 	async function completeTodo(id) {
// 		await updateDoc(doc(db, "randomProject", id), {
// 			isCompleted: true,
// 		});
// 	}
// 	async function unCompleteTodo(id) {
// 		const docRef = doc(db, "randomProject", id);

// 		await updateDoc(docRef, {
// 			isCompleted: false,
// 		});
// 	}

// 	async function addTodo() {
// 		// Add a new document with a generated id.
// 		const docRef = await addDoc(collection(db, "randomProject"), {
// 			name: newTodo,
// 			isCompleted: false,
// 		});
// 		console.log("Document written with ID: ", docRef.id);
// 	}

// 	useEffect(() => {
// 		const q = query(
// 			collection(db, "randomProject") /*, where("isCompleted", "==", true)*/
// 		);

// 		const unsubscribe = onSnapshot(q, (querySnapshot) => {
// 			const todos_ = [];
// 			querySnapshot.forEach((doc) => {
// 				const data = {
// 					...doc.data(),
// 					id: doc.id,
// 				};
// 				todos_.push(data);
// 			});
// 			setTodos(todos_);
// 		});

// 		return unsubscribe;
// 	}, []);

// 	return (
// 		<View
// 			style={{
// 				flex: 1,
// 				// justifyContent: "center", 2
// 				alignItems: "center",
// 			}}
// 		>
// 			<View
// 				style={{
// 					justifyContent: "center",
// 					// alignItems: "center",
// 					marginTop: 50,
// 					gap: 10,
// 					width: 300,
// 				}}
// 			>
// 				<TextInput
// 					style={{
// 						height: 40,
// 						width: 300,
// 						borderColor: "gray",
// 						borderWidth: 1,
// 						padding: 10,
// 					}}
// 					placeholder="New Todo"
// 					value={newTodo}
// 					onChangeText={setNewTodo}
// 				/>
// 				<Button
// 					title="Add Todo"
// 					onPress={addTodo}
// 				/>
// 			</View>

// 			<View>
// 				{
// 					todos.map((todo) => (
// 						<View
// 							key={todo.id}
// 							style={{
// 								flexDirection: "row",
// 								justifyContent: "space-between",
// 								width: 300,
// 								marginBottom: 10,
// 							}}
// 						>
// 							<Text
							
// 						style={{
// 							textDecorationLine: todo.isCompleted ? "line-through" : "none",
// 						}}
// 							>{todo.name}</Text>
// 							<View
// 							style={{
// 								flexDirection: "row",
// 								gap: 10,
// 							}}
// 							>
// 							<Button
// 								title="Delete"
// 								onPress={() => deleteTodo(todo.id)}
// 							/>
// 							<Button
// 								title={todo.isCompleted ? "Uncomplete" : "Complete"}
// 								onPress={() => {
// 									if (todo.isCompleted) {
// 										unCompleteTodo(todo.id);
// 									} else {
// 										completeTodo(todo.id);
// 									}
// 								}}
// 							/>
// 							</View>
							
// 						</View>
// 					))
// 				}
// 			</View>
// 		</View>
// 	);
// }

// export default Server;