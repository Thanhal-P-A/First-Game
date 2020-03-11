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
  Easing,
  AppState,
} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import {moderateScale} from 'react-native-size-matters';

let count = 1;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isStart: false,
      score: 0,
      isPlayerTop: false,
      isOponentTop: false,
      isOponent2: false,
      isFailed: false,
      isMusic: true,
      disable:false
    };
    (this.oponentPosition = new Animated.Value(0)), (this.duration = 3000);
    this.stopTimeout = 2100;
    this.stopTimeout2 = 2250;
    this.stopTimeout3 = 2400;
  }

  componentDidMount() {
    AppState.addEventListener('change', state => {
      if (state === 'background') {
        SoundPlayer.stop();
      }
    });

    setInterval(() => {
      if (this.state.isStart) {
        this.setState({
          score: this.state.score + 10,
        });
      }
    }, 100);

    setInterval(() => {
      if (this.state.isMusic && this.state.isStart) {
        SoundPlayer.stop();
        SoundPlayer.playSoundFile('runonly', 'mp3');
      }
    }, 6800);
  }

  _onStart = () => {
    SoundPlayer.stop();

    if (this.state.isMusic) {
      try {
        SoundPlayer.playSoundFile('run', 'mp3');
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    }
    this.setState({
      isStart: true,
      score: 0,
      isPlayerTop: false,
      isFailed: false,
      disable:true
    });

    this._animationBird();
  };

  _animationBird = () => {
    if (Math.random() > 0.5) {
      this.setState({isOponentTop: true});
    } else {
      this.setState({isOponentTop: false});
    }
    if (Math.random() > 0.8) {
      this.setState({isOponent2: true});
    } else {
      this.setState({isOponent2: false});
    }

    if (parseInt(this.state.score) / count > 500) {
      count = count + 1;
      this.duration = this.duration - 120;
      this.stopTimeout = (this.duration * .7);
      this.stopTimeout2 = (this.duration * .75);
      this.stopTimeout3 = (this.duration * .8);
    }

    this.oponentPosition.setValue(0);
    Animated.timing(this.oponentPosition, {
      toValue: 1,
      duration: this.duration,
      easing: Easing.linear,
    }).start(o => {
      if (o.finished) {
        this._animationBird();
      }
    });

    setTimeout(() => {
      if (this.state.isPlayerTop == this.state.isOponentTop) {
        this.duration = 3000;
        this.stopTimeout = 2100;
        this.stopTimeout2 = 2250;
        this.stopTimeout3 = 2400;
        count = 1;
        SoundPlayer.stop();
        if (this.state.isMusic) {
          SoundPlayer.playSoundFile('dilwale', 'mp3');
          SoundPlayer.seek(4);
        }
        this.setState({isStart: false, isFailed: true});
        setTimeout(() => {
          this.setState({disable:false})
        }, 1500);
      }
    }, this.stopTimeout);

    setTimeout(() => {
      if ((this.state.isPlayerTop == this.state.isOponentTop)&&!this.state.isFailed) {
        this.duration = 3000;
        this.stopTimeout = 2100;
        this.stopTimeout2 = 2250;
        this.stopTimeout3 = 2400;
        count = 1;
        SoundPlayer.stop();
        if (this.state.isMusic) {
          SoundPlayer.playSoundFile('dilwale', 'mp3');
          SoundPlayer.seek(4);
        }
        this.setState({isStart: false, isFailed: true});
        setTimeout(() => {
          this.setState({disable:false})
        }, 1500);
      }
    }, this.stopTimeout2);

    setTimeout(() => {
      if ((this.state.isPlayerTop == this.state.isOponentTop)&&!this.state.isFailed) {
        this.duration = 5000;
        this.stopTimeout = 2100;
        this.stopTimeout2 = 2250;
        this.stopTimeout3 = 2400;
        count = 1;
        SoundPlayer.stop();
        if (this.state.isMusic) {
          SoundPlayer.playSoundFile('dilwale', 'mp3');
          SoundPlayer.seek(4);
        }
        this.setState({isStart: false, isFailed: true});
        setTimeout(() => {
          this.setState({disable:false})
        }, 1500);
      }
    }, this.stopTimeout3);
  };

  render() {
    const oponentPosition = this.oponentPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [moderateScale(900), moderateScale(-100)],
    });

    return (
      <SafeAreaView style={styles.container}>
        {!this.state.isStart && (
          <TouchableOpacity
            onPress={() =>
              this.setState({isMusic: !this.state.isMusic}, SoundPlayer.stop())
            }
            style={styles.touchMusic}>
            <Image
              style={styles.touchMusic}
              source={
                this.state.isMusic
                  ? require('./assets/musicOn.png')
                  : require('./assets/musicOff.png')
              }
            />
          </TouchableOpacity>
        )}
        {this.state.isFailed && (
          <TouchableOpacity
            onPress={() => this._onStart()}
            disabled={this.state.disable}
            style={styles.touchFail}
          />
        )}
        {this.state.isFailed && (
          <Text style={styles.textGameOver}>Game Over</Text>
        )}
        {this.state.isStart ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              this.setState({isPlayerTop: !this.state.isPlayerTop})
            }
            style={styles.main}>
            <ImageBackground
              style={styles.imageRoad}
              source={require('./assets/movingRoadRight.gif')}></ImageBackground>

            <Image
              style={[
                styles.imagePlayer,
                {
                  bottom: this.state.isPlayerTop
                    ? moderateScale(200)
                    : moderateScale(80),
                },
              ]}
              source={
                this.state.isPlayerTop
                  ? require('./assets/superman.gif')
                  : require('./assets/runningManRight.gif')
              }
            />
            <Animated.Image
              style={[
                styles.animatedOponent,
                {
                  left: oponentPosition,
                  bottom: this.state.isOponentTop
                    ? moderateScale(200)
                    : moderateScale(80),
                },
              ]}
              source={
                this.state.isOponentTop
                  ? this.state.isOponent2
                    ? require('./assets/birdLeft.gif')
                    : require('./assets/birdBlackLeft.gif')
                  : this.state.isOponent2
                  ? require('./assets/cycleGirlleft.gif')
                  : require('./assets/cycleBoyLeft.gif')
              }
            />
            <Text style={styles.textScore}>
              {'Score : ' + this.state.score}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.main}
            onPress={() => this._onStart()}>
            <ImageBackground
              style={styles.imageRoad}
              source={require('./assets/road.png')}></ImageBackground>
            <Image
              style={[styles.imagePlayer, {bottom: moderateScale(80)}]}
              source={require('./assets/man.png')}
            />
            {this.state.isFailed && (
              <Text style={styles.textScore}>
                {'Last Score : ' + this.state.score}
              </Text>
            )}
            {!this.state.disable&&<Text style={styles.textStart}>Tap to start</Text>}
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  main: {
    flex: 1,
  },
  touchMusic: {
    position: 'absolute',
    height: moderateScale(40),
    width: moderateScale(40),
    right: moderateScale(10),
    bottom: moderateScale(10),
    zIndex: 3,
  },
  touchFail: {
    zIndex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: 'orange',
    opacity: 0.2,
    position: 'absolute',
  },
  textGameOver: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    color: 'green',
    fontSize: moderateScale(36),
    top: moderateScale(90),
    fontWeight: 'bold',
  },
  imageRoad: {
    flex: 1,
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
    justifyContent: 'flex-end',
    transform: [{rotateY: '180deg'}],
  },
  imagePlayer: {
    position: 'absolute',
    height: moderateScale(80),
    width: moderateScale(140),
    left: moderateScale(80),
    resizeMode: 'stretch',
  },
  animatedOponent: {
    position: 'absolute',
    height: moderateScale(80),
    width: moderateScale(70),
    resizeMode: 'stretch',
  },
  textStart: {
    position: 'absolute',
    zIndex: 1,
    bottom: moderateScale(120),
    alignSelf: 'center',
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: 'white',
  },
  textScore: {
    position: 'absolute',
    top: moderateScale(20),
    right: moderateScale(20),
    zIndex: 1,
    fontSize: moderateScale(24),
    fontWeight: 'bold',
  },
});

export default App;
