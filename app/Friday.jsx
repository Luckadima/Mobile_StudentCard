import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity  } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
export default function Friday() {

  const Landingpage = () =>{
    router.push('/Landingpage')
  }

  const Fri = () => {
    router.push('/Friday');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Class Timetable</Text>
        <Text style={styles.subtitle}>APB Auckland Park Bunting Road Campus</Text>
        <AntDesign style={styles.sub2} name="back" size={24} color="white"  onPress={Landingpage }/>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity onPress={Fri}>
          <Text style={styles.tab}>Fri</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.table}>
        {[
          { time: '08:00 - 08:45' },
          { time: '08:50 - 09:35', subject: '(CMN02B1)COMMUNICATION NETWORKS 2B', location: 'APB BLOCK G PURPLE 3 COMP LAB', type: 'Practical' },
          { time: '09:40 - 10:25', subject: '(CMN02B1)COMMUNICATION NETWORKS 2B', location: 'APB BLOCK G PURPLE 3 COMP LAB', type: 'Practical' },
          { time: '10:30 - 11:15', subject: '(CMN02B1)COMMUNICATION NETWORKS 2B', location: 'APB BLOCK G PURPLE 3 COMP LAB', type: 'Practical' },
          { time: '11:20 - 12:05', subject: '(CMN02B1)COMMUNICATION NETWORKS 2B', location: 'APB BLOCK G PURPLE 3 COMP LAB', type: 'Practical' },
          { time: '12:10 - 12:55' },
        ].map((entry, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.time}>{entry.time}</Text>
            {entry.subject ? (
              <View style={styles.details}>
                <Text style={styles.subject}>{entry.subject}</Text>
                <Text style={styles.location}>{entry.location}</Text>
                <Text style={styles.type}>{entry.type}</Text>
              </View>
            ) : (
              <View style={styles.emptySlot} />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#f37021',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
  },
  tab: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeTab: {
    color: '#f37021',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#f37021',
  },
  table: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  time: {
    width: '30%',
    fontWeight: 'bold',
    color: '#000',
  },
  details: {
    width: '70%',
    backgroundColor: '#d1c4e9',
    borderRadius: 5,
    padding: 10,
  },
  subject: {
    fontWeight: 'bold',
    color: '#000',
  },
  location: {
    color: '#555',
  },
  type: {
    color: '#777',
    fontStyle: 'italic',
  },
  emptySlot: {
    width: '70%',
    height: 40,
  },
  sub2: {
    marginRight:'94%',
    marginTop:'-6%'
  }
});