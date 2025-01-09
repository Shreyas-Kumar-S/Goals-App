import { useState, useEffect } from 'react';
import { StyleSheet, View, Button, ImageBackground, Text } from 'react-native';
import GoalInput from './components/GoalInput';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [modalIsVisible, setModalVisible] = useState(false);
 
  //state set up for the quotes
  const [quote, setQuote] = useState(''); 
  const [author, setAuthor] = useState('');  
  
  function startAddGoalHandler() { 
    setModalVisible(true);
    fetchQuote();
  }

  function endAddGoalHandler() {
    setModalVisible(false);
  }

  async function addGoal() {
    endAddGoalHandler();
  }

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/today');
      const data = await response.json();
      if (data && data.length > 0) {
        setQuote(data[0].q || 'Stay inspired!');
        setAuthor(data[0].a || 'Anonymous');
      } else {
        setQuote('No quote available.');
        setAuthor('');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote('Error fetching quote. Please try again later.');
      setAuthor('');
    }
  };

  // Initial quote fetch when component mounts
  useEffect(() => {
    fetchQuote(); 
  }, []
);
  
  return (
    <>
      <StatusBar style='dark' />
      <View style={styles.appContainer}>
        <View style={styles.imageAndButtonContainer}>
          <ImageBackground
            style={styles.imageStyle}
            source={require('./assets/Images/goal.png')}
            resizeMode='contain'
          />
          <Text style={styles.Welcome}>Welcome to the app</Text>
          <Text style={styles.quoteText}>"{quote}"'</Text>
          {author ? <Text style={styles.authorText}>- {author}</Text> : null}
          <Button title="Add New Goal" color="#91AC8F" onPress={startAddGoalHandler} />
        </View>
        <GoalInput visible={modalIsVisible} onAddGoal={addGoal} onCancel={endAddGoalHandler} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: { 
    flex: 1,
    paddingTop: 260,
    paddingHorizontal: 16,
    backgroundColor: '#F5F4B3',
  },
  imageAndButtonContainer: {
    alignItems: 'center', 
    marginBottom: 10, 
  },
  imageStyle: {
    width: 200,
    height: 200,
    marginBottom: 10, 
  },
  Welcome: {
    marginBottom: 10,
    fontWeight: '800',
    fontSize: 20,
    color: 'black'
  },quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginHorizontal: 20,
    color: '#555',
    marginBottom: 5,
  },
  authorText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
});
