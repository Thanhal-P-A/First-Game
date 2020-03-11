import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Easing
} from 'react-native';

let count = 1;

class App extends React.Component {
  constructor(){
    super()
    this.state={
      isStart:false,
      score:0,
      cyclePosition:110,
      birdBottomPosition:110,
      birdPosition:660,
      isTop:false,
      isBirdTop:false,
      isBird2:false
    }
    this.birdPosition=new Animated.Value(0),
    this.duration=4000;
    this.stopTimeout=2900;
  }

  componentDidMount(){
    setInterval(() => {
      if(this.state.isStart){
      this.setState({
        score:this.state.score+10
      })
    }
    }, 100);
  }

  _onStart=()=>{
    this.setState({isStart:true,score:0,isTop:false})
    this._animationBird()
  }

_animationBird=()=>{
  if(Math.random()>.5){
    this.setState({isBirdTop:true})
  }
  else{
    this.setState({isBirdTop:false})
  }
  if(Math.random()>.8){
    this.setState({isBird2:true})
  }
  else{
    this.setState({isBird2:false})
  }
  // console.warn((parseInt(this.state.score)/count),"score",this.state.score,count);
  if((parseInt(this.state.score)/count)>500){
    count=count+1
    this.duration=this.duration-200
    this.stopTimeout=this.stopTimeout-150
  }
  this.birdPosition.setValue(0)
  Animated.timing(
    this.birdPosition,
    {
      toValue: 1,
      duration: this.duration,
      easing: Easing.linear
    }
  ).start((o) =>{if(o.finished){ this._animationBird()}})

  setTimeout(() => {
      if(this.state.isTop==this.state.isBirdTop){
        this.duration=4000;
    this.stopTimeout=2900;
    count=1;
        this.setState({isStart:false})
        // this._animationBird()
      }
      else{
      // this.setState({
      //   birdPosition:this.state.birdPosition-33,
      //   // score:this.state.score+10
      // })
    }
    }, this.stopTimeout);
}


  render(){
    const birdPosition = this.birdPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [720,-90]
    })

    const birdPosition2 = this.birdPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [765,-45]
    })
    return (
      <SafeAreaView style={styles.container} >
        <StatusBar barStyle="dark-content" backgroundColor="grey" />
        {
          this.state.isStart?
          <TouchableOpacity activeOpacity={1} onPress={()=>this.setState({isTop:!this.state.isTop})}  style={styles.main}>
          <ImageBackground 
          style={styles.imageDinausorGif}
          source={require("./assets/movingRoadRight.gif")}
          >
          </ImageBackground>
          
            <Image 
            style={{position:'absolute',height:120,width:90,left:100,bottom:this.state.isTop?220:110}}
            source={this.state.isTop?require("./assets/marioRight.gif"):require("./assets/marioRight.gif")}/>
            <Animated.Image 
            style={{position:'absolute',height:120,width:90,left:birdPosition,bottom:this.state.isBirdTop?200:110}}
            source={this.state.isBirdTop?require("./assets/birdLeft.gif"):this.state.isBird2?require("./assets/cycleDoubleLeft.gif"):require("./assets/cycleBoyLeft.gif")}/>
            {this.state.isBird2&&this.state.isBirdTop&& <Animated.Image 
            style={{position:'absolute',height:120,width:90,left:birdPosition2,bottom:this.state.isBirdTop?200:110,
            transform: [{ rotateY: '180deg' }]}}
            source={require("./assets/birdRight.gif")}/>}
          <Text style={styles.textScore}>{"Score : "+this.state.score}</Text>
          </TouchableOpacity >:
          <TouchableOpacity activeOpacity={1} style={styles.main} onPress={()=>this._onStart()}>
            <ImageBackground 
          style={styles.imageDinausorGif}
          source={require("./assets/movingRoadRight.gif")}
          >
          </ImageBackground>
            <Image 
            style={{position:'absolute',height:120,width:90,left:100,bottom:110}}
            source={require("./assets/marioRight.gif")}/>
                      <Text style={styles.textScore}>{"Last Score : "+this.state.score}</Text>
          <Text style={styles.textStart}>Touch anywhere to start</Text>
          </TouchableOpacity>
        }
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'grey'
  },
  main:{
    flex:1
  },
  imageDinausorGif:{
    flex:1,
    // flexDirection:'row',
    height:"100%",
    width:"100%",
    resizeMode:"stretch",
    justifyContent:'flex-end',
    transform: [{ rotateY: '180deg' }]
  },
  textStart:{
    position:'absolute',
    zIndex:1,
    bottom:150,
    alignSelf:'center',
    fontSize:24,
    fontWeight:'600',
    color:'white'
  },
  textScore:{
    position:'absolute',
    top:20,
    right:20,
    zIndex:1,
    fontSize:24
  }
});

export default App;
