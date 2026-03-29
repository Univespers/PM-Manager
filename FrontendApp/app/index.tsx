import React from "react";
import { Text, View } from "react-native";
import { CurrentStatus } from "./status";

export default function Index() {
  const status = CurrentStatus;

  const [ backendInfo, setBackendInfo ] = React.useState(null);

  const apiEndpoint = "http://localhost:3000/api";
  const getInfo = async() => {
    await fetch(`${apiEndpoint}/info`)
      .then(data => data.json())
      .then(json => {
          console.log("Info: OK");
          setBackendInfo(json);
      })
      .catch((error) => {
          console.error("Info: ERROR");
          console.error(error);
      });
  };
  getInfo();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>App version: {status.CURRENT_VERSION}</Text>
      <Text>Backend version: {backendInfo?.version}</Text>
    </View>
  );
}

