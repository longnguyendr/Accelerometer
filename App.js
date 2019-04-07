import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accelerometerData: {},
      isRunning: false,
      acceleArray: [],
      count: 0,
    }
  };
  

  addToArray  = (accelerometerData) => {
    let {x,y,z} = accelerometerData;
    let total = Math.sqrt(x*x + y*y);
    let index = this.state.count;
    let arr = this.state.acceleArray;
    arr[index] = total;
    this.setState({
      acceleArray: arr,
    })

    // reset after 15 measures
    index += 1;
    if(index == 15) {
      this.setState({
        count: 0
      }) 
    } else {
      this.setState({
        count: index
      })
    }

    let sumAccele = 0;
    for (i=0; i< arr.length; i++) {
      sumAccele += arr[i];
      // console.log("array[i]: ", arr[i]);
    }
    let average = sumAccele/arr.length
    // console.log(average);
    this.setState({
      ...this.state, 
      speed: average,
    })


    if (average > 1.4) { 
      this.setState({
        isRunning: true
      })
    } else {
      this.setState({
        isRunning: false
      })
    }

  }


  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this.setState({
        acceleArray: [],
        count: 0,
      })
      this._subscribe();
    }
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(100); 
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({
        accelerometerData: accelerometerData
      })
      this.addToArray(accelerometerData)
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  

  render() {
    let { x, y, z } = this.state.accelerometerData;
    // console.log(this.state.speed);
    return (
      <View style={[styles.sensor, this.state.isRunning ? styles.isRunning : styles.isWalking]}>
        <Text>Accelerometer: {this.state.speed}</Text>
        <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Start / Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  isRunning: {
    backgroundColor: 'red'
  },
  isWalking: {
    backgroundColor: 'blue'
  },
});