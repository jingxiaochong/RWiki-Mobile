import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Home extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>主页</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default Home;
