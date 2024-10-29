import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
export default function Wednesday() {

  const Landingpage = () =>{
    router.push('/Landingpage')
  }

  const Weds = () => {
    router.push('/Wedensday');
  };

  const Thurs = () => {
    router.push('/Thursday');
  };

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
        <TouchableOpacity onPress={Weds}>
          <Text style={styles.tab}>Wed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={Thurs}>
          <Text style={styles.tab}>Thu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={Fri}>
          <Text style={styles.tab}>Fri</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.table}>
        {[
          { time: '08:00 - 08:45' },
          { time: '08:50 - 09:35' },
          { time: '09:40 - 10:25' },
          { time: '10:30 - 11:15' },
          { time: '11:20 - 12:05', subject: '(DSW02B1) DEVELOPMENT SOFTWARE 2B', location: 'APB CON COWAN COMP LAB G10', type: 'Practical' },
          { time: '12:10 - 12:55', subject: '(DSW02B1) DEVELOPMENT SOFTWARE 2B', location: 'APB CON COWAN COMP LAB G10', type: 'Practical' },
          { time: '13:00 - 13:45', subject: '(DSW02B1) DEVELOPMENT SOFTWARE 2B', location: 'APB CON COWAN COMP LAB G10', type: 'Practical' },
          { time: '13:50 - 14:35', subject: '(DSW02B1) DEVELOPMENT SOFTWARE 2B', location: 'APB CON COWAN COMP LAB G10', type: 'Tutorial' },
          { time: '14:40 - 15:25', subject: '(DSW02B1) DEVELOPMENT SOFTWARE 2B', location: 'APB CON COWAN COMP LAB G10', type: 'Tutorial' },
          { time: '15:30 - 16:15', subject: '(DSW02B1) DEVELOPMENT SOFTWARE 2B', location: 'APB CON COWAN COMP LAB G10', type: 'Tutorial' },
          { time: '16:20 - 17:05' },
          { time: '17:10 - 17:55' },
          { time: '18:00 - 18:45' },
        ].map((entry, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.time}>{entry.time}</Text>
            {entry.subject ? (
              <View
                style={[
                  styles.details,
                  entry.type === 'Practical' ? styles.practical : styles.tutorial,
                ]}
              >
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
    borderRadius: 5,
    padding: 10,
  },
  practical: {
    backgroundColor: '#d1c4e9', // Light purple for practical sessions
  },
  tutorial: {
    backgroundColor: '#c8e6c9', // Light green for tutorial sessions
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