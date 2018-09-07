import { AsyncStorage } from "react-native";
import Storage from "react-native-storage";

const FavoriteRouteHistory = new Storage({
  size: 10,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true
});

const Load = key =>
  new Promise((resolve, reject) => {
    FavoriteRouteHistory.load({ key: key })
      .then(ret => {
        console.log("load success", ret);
        resolve(ret);
      })
      .catch(err => {
        switch (err.name) {
          case "NotFoundError":
            console.log("NotFoundError", err.message);
            break;
          case "ExpiredError":
            console.log("ExpiredError", err.message);
            break;
        }
        reject(err);
      });
    return Load;
  });

const Save = data =>
  new Promise((resolve, reject) => {
    try {
      FavoriteRouteHistory.save({
        key: data.key,
        data: {
          PointOfDeparture: data.PointOfDeparture,
          PointOfDepartureCode: data.PointOfDepartureCode,
          ArrivalPoint: data.ArrivalPoint,
          ArrivalPointCode: data.ArrivalPointCode
        }
      });
      resolve();
    } catch (error) {
      reject();
    }

    return Save;
  });

const Clear = key => {
  FavoriteRouteHistory.remove({ key: key });
};

export default { Load, Save, Clear };
