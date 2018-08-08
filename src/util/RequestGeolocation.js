import { Platform, PermissionsAndroid } from "react-native";

const requestGeolocation = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
          title: "需要訪問地點權限許可",
          message: "自動定位需要訪問地點權限"
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const GeolocationUrl =
                "http://maps.google.com/maps/api/geocode/json?latlng=" +
                position.coords.latitude +
                "," +
                position.coords.longitude +
                "&language=zh-TW&sensor=true";
              fetch(GeolocationUrl)
                .then(resJSON => resJSON.json())
                .then(responseData => {
                  resolve(responseData.results[0].address_components[3].long_name);
                })
                .catch(error => {
                  reject(error);
                });
            },
            error => {},
            {
              enableHighAccuracy: false,
              timeout: 5000
            }
          );
        }
      } catch (err) {}
    } else {
      navigator.geolocation.getCurrentPosition(
        position => {
          const GeolocationUrl =
            "http://maps.google.com/maps/api/geocode/json?latlng=" +
            position.coords.latitude +
            "," +
            position.coords.longitude +
            "&language=zh-TW&sensor=true";
          fetch(GeolocationUrl)
            .then(resJSON => resJSON.json())
            .then(responseData => {
              resolve(responseData.results[0].address_components[3].long_name);
            })
            .catch(error => {
              reject(error);
            });
        },
        error => {},
        {
          enableHighAccuracy: false,
          timeout: 20000
        }
      );
    }
  });

export default requestGeolocation;
