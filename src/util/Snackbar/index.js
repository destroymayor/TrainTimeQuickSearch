import Snackbar from "react-native-snackbar";

export default (title, duration) => {
  Snackbar.show({
    title: title,
    duration: duration,
    action: {
      title: "確定",
      color: "rgb(57,152,137)"
    }
  });
};
