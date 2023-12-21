import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapboxGL, {Logger} from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import {TOKEN_MAPBOX} from '@env';

MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(TOKEN_MAPBOX);
MapboxGL.setConnected(true);

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: WIDTH * 0.8,
    width: WIDTH * 0.9,
  },
  map: {
    flex: 1,
  },
  noPermissionsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const IS_ANDROID = Platform.OS === 'android';

export default class Mapbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false,
      activeExample: -1,
    };
  }

  onPress(event) {
    const {geometry} = event;
    this.props.setLong(
      parseFloat(geometry.coordinates[0].toString().slice(0, -9)),
    );
    this.props.setLat(
      parseFloat(geometry.coordinates[1].toString().slice(0, -9)),
    );
  }

  async componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
      // if (isGranted) {
      //   this.getCoordinate();
      // }
    }

    Logger.setLogCallback(log => {
      const {message} = log;

      if (
        message.match('Request failed due to a permanent error: Canceled') ||
        message.match(
          'Request failed due to a permanent error: Socket Closed',
        ) ||
        message.match(
          'Request failed due to a permanent error: exhausted all routes ',
        )
      ) {
        return true;
      }
      return false;
    });
  }

  getCoordinate = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position.coords.latitude.toString().slice(0, -5));
        this.props.setLong(position.coords.longitude);
        this.props.setLat(position.coords.latitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
      },
    );
  };
  render() {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      if (this.state.isFetchingAndroidPermission) {
        return null;
      }
      return (
        <SafeAreaView
          style={[sheet.matchParent, {backgroundColor: colors.primary.blue}]}
          forceInset={{top: 'always'}}>
          <View style={sheet.matchParent}>
            <Text style={styles.noPermissionsText}>
              You need to accept location permissions in order to use this
              example applications
            </Text>
          </View>
        </SafeAreaView>
      );
    }
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView
            attributionEnabled={false}
            style={styles.map}
            onPress={e => this.onPress(e)}
            // onWillStartLoadingMap={this.getCoordinate}
            logoEnabled={false}>
            <MapboxGL.Camera
              zoomLevel={16}
              centerCoordinate={[this.props.long, this.props.lat]}
            />

            <MapboxGL.PointAnnotation
              coordinate={[this.props.long, this.props.lat]}
              selected={true}
              id="pt-ann"></MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
          <TouchableOpacity
            onPress={this.getCoordinate}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            <Icon name="my-location" size={24}/>
            <Text style={{fontWeight: '600', marginLeft: 5}}>
              Gunakan Lokasi Saat Ini
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
