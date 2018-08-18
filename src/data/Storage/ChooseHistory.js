import { AsyncStorage } from "react-native";
import Storage from "react-native-storage";

const ChooseHistory = new Storage({
  size: 4,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true
});

const Load = key =>
  new Promise((resolve, reject) => {
    ChooseHistory.load({ key: key })
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
      ChooseHistory.save({
        key: data.key,
        data: {
          name: data.name,
          code: data.code
        }
      });
      resolve();
    } catch (error) {
      reject();
    }

    return Save;
  });

const Clear = key => {
  ChooseHistory.remove({ key: key });
};

export default { Load, Save, Clear };
