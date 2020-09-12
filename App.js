import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import Gestures from "react-native-easy-gestures";
import * as ImagePicker from "expo-image-picker";

export default class App extends React.Component {
  state = {
    itemsdraggable: [],
    imagePicker: null,
    name: null,
    options: null,
    deleteItem: false,

    //manipulate deleted free items
    i: null,
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ imagePicker: result.uri });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  Add_item() {
    const { itemsdraggable, image, name } = this.state;
    const last_item = this.state.itemsdraggable.slice(-1).pop();
    const id = itemsdraggable.length <= 0 ? 1 : last_item.id + 1;

    itemsdraggable.push({
      name: this.state.name,
      image: this.state.imagePicker,
      id: id,
    });

    console.log(itemsdraggable);
    this.setState({ itemsdraggable });
  }

  security(item) {
    Alert.alert(
      "Card Security",
      item.name + "      TRACK: " + "OFF",
      [
        {
          text: "Track",
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  }

  balance(item) {
    Alert.alert(
      "Card Balance",
      item.name + "      BALANCE: " + Math.floor(Math.random() * 300) + 50,
      [
        {
          text: "More",
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  }

  deleteItem(index, item, id) {
    const list = this.state.itemsdraggable.filter((item) => item.id !== id);

    this.setState({ itemsdraggable: list });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignSelf: "center" }}>
          <Image
            source={{
              uri: this.state.imagePicker,
            }}
            style={{
              width: 50,
              height: 50,
              marginBottom: 10,
              resizeMode: "contain",
            }}
          />
        </View>
        <TextInput
          style={styles.name_input}
          onChangeText={(text) => this.setState({ name: text })}
          value={this.state.name}
        />
        <TouchableOpacity
          style={styles.upload_button}
          onPress={() => {
            this._pickImage();
          }}
        >
          <Text>Upload Item</Text>
        </TouchableOpacity>
        {this.state.imagePicker !== null && (
          <TouchableOpacity
            style={{
              alignItems: "center",
              backgroundColor: "#DDDDDD",
              padding: 10,
            }}
            onPress={() => {
              this.Add_item();
            }}
          >
            <Text>Add item</Text>
          </TouchableOpacity>
        )}
        {this.state.itemDelete == true && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              zIndex: 2,
              backgroundColor: "red", //delete opacity on move object
              opacity: 0.6,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        <View style={styles.dragArea}>
          {this.state.itemsdraggable.map((item, index) => {
            const id = item.id;

            return (
              <View>
                <Gestures
                  style={styles.gesture}
                  scalable={{
                    min: 1,
                    max: 2,
                  }}
                  rotatable={true}
                  ref={(c) => {
                    this.gestures = c;
                  }}
                  onStart={(event, styles) => {
                    this.setState({ itemDelete: true });
                    console.log("test");
                  }}
                  onEnd={(event, styles) => {
                    this.setState({ options: index });
                    this.setState({ itemDelete: false });

                    if (this.state.itemDelete == true) {
                      if (styles.top > 100) {
                        this.deleteItem(index, item, id);
                      }
                      if (styles.top < -150) {
                        this.deleteItem(index, item, id);
                      }
                    }
                  }}
                >
                  
                  <Image
                    source={{
                      uri: item.image,
                    }}
                    style={styles.gesture_image}
                  />

                  {this.state.options === index && (
                    <View style={styles.options_view}>
                      <View style={{ marginRight: 2 }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.security(item);
                          }}
                        >
                          <Image
                            style={styles.imageItemOpt}
                            source={require("./icons/security_icon.png")}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginLeft: 2 }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.balance(item);
                          }}
                        >
                          <Image
                            style={styles.imageItemOpt}
                            source={require("./icons/balance_icon.png")}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Gestures>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  dragArea: {
    marginTop: 15,
    backgroundColor: "blue",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 100,
    paddingHorizontal: 200,
    flex: 0.2,
    zIndex: 3,
  },
  gesture: {
    backgroundColor: "red",
    zIndex: 99,
    width: 100,
    height: 120,
    top: null,
    left: null,
  },
  gesture_image: {
    zIndex: 10,
    width: 100,
    height: 80,

    resizeMode: "contain",
  },
  name_input: {
    height: 40,
    width: 120,
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
  upload_button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginBottom: 10,
  },
  addItem_button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  options_view: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    top: -5,
  },
  imageItemOpt: {
    backgroundColor: "white",
    borderRadius: 50,
    zIndex: 9999,
    width: 40,
    height: 40,
  },
});
