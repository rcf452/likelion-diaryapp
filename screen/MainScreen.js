import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, AsyncStorage} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Calendar, CalendarList, Agenda} from 'react-native-calendars'
import uuid from 'uuid/v1'



export default class MainScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <MaterialCommunityIcons name="calendar-multiselect" size={30} style={{color:tintColor}}/>
    )
  }

  _storeData = async() => {
    await AsyncStorage.setItem('@diary1: state', JSON.stringify(this.state))
  }

  _getData = async() => {
    const mystate = await AsyncStorage.getItem('@diary1: state')
    if(mystate !== null) {
      this.setState(JSON.parse(mystate))
    }
  }

  state={
    selectedDate: '',
    Posts: [{
      title: '11월 18일',
      content: '본문',
      date: '2019-11-18'
    },
    {
      title: '11월 18일',
      content: '본문',
      date: '2019-11-18'
    }]
  }

  componentDidMount(){
    this._getData()
    this.props.navigation.addListener(
      'didFocus', //mainscreen이 나타나는 순간 - 첫번째 인자
      () => {// 두번째 인자 => 함수 형태
        newPost = this.props.navigation.getParam('myparam')
        signal = this.props.navigation.getParam('signal')

        if (newPost) {//false 받으면 실행 안됨
          const prevPost = [...this.state.Posts]
          this.setState({Posts: prevPost.concat(newPost)}, this._storeData)
          this.props.navigation.navigate('MainScreen', {myparam: false}) // 입력하지 않을시 myparam(입력한거)는 false
        } else if (signal) {
          const prevPost2 = [...this.state.Posts]
          deleteIndex = prevPost2.findIndex((item) => {item.id === signal})
          prevPost2.splice(deleteIndex, 1)

          this.setState({Posts : prevPost2}, this._storeData)
          this.props.navigation.navigate('MainScreen', {signal:false})
        }
      }
    )
  }








  render() {
    console.log(this.state.selectedDate)
    return (
      <SafeAreaView style={styles.container}>
        <Calendar
          onDayPress={(day) => {this.setState(this.state.selectedDate = day)}}
          current={new Date()}
        />
        <ScrollView>
          <FlatList
            data={this.state.Posts.filter(data => { return data.date == this.state.selectedDate.dateString})}
            renderItem={({item, index})=>{
              return (
                <TouchableOpacity
                  onPress={()=>{this.props.navigation.navigate('Detail', {post:item})}}>
                  <View>
                    <Text>
                      {item.title}
                    </Text>
                    <Text>
                      {item.content}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            }}
            keyExtractor={(item, index) => {return `${index}`}}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  textstyle: {
    fontSize: 40,
  }
});