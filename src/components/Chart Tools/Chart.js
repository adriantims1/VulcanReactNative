import React, { useContext, useEffect } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { Svg, Line, ForeignObject } from "react-native-svg";
import { Box, Center, Spinner } from "native-base";

//Component
import Candle from "./Candle";

//Context
import ChartDataContext from "../../context/ChartDataContext";

const { width: size, height } = Dimensions.get("window");

const candleWidth = (size * 0.9) / 10;

const Chart = () => {
  const { state } = useContext(ChartDataContext);

  return state.scaleIsReady ? (
    <Box>
      <Svg width={size * 0.9} height={size}>
        {state.data.map((candle, index) => (
          <Candle key={index} {...{ candle, index, candleWidth }} />
        ))}
        {state.showAnnotation ? (
          <>
            <Line
              x1={0}
              y1={state.scaleY(state.annotationYValue)}
              x2={size}
              y2={state.scaleY(state.annotationYValue)}
              strokeWidth={2}
              stroke="#0b4870"
              strokeDasharray="6 6"
            />
            <ForeignObject x={0} y={state.scaleY(state.annotationYValue)}>
              <View style={styles.container}>
                <Text style={styles.text}>{`Trend: ${
                  state.annotationTrend === "call" ? "Higher" : "Lower"
                }`}</Text>
              </View>
            </ForeignObject>
          </>
        ) : null}
      </Svg>
    </Box>
  ) : (
    <Center flex={1}>
      <Spinner size={50} color="primary.800" />
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    backgroundColor: "#0b4870",
    borderRadius: 4,
    padding: 4,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 4,
  },
  text: {
    color: "white",
  },
});

export default Chart;
