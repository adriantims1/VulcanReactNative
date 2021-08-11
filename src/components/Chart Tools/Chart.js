import React, { useEffect, useCallback } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { Svg, Line, ForeignObject } from "react-native-svg";
import { Box, Center, Spinner } from "native-base";
import { scaleLinear } from "d3-scale";

//Component
import Candle from "./Candle";

//Redux
import { connect } from "react-redux";

const { width: size } = Dimensions.get("window");

const candleWidth = (size * 0.9) / 10;

const Chart = ({ candleData, marketData, webSocket }) => {
  const getDomain = () => {
    const values = candleData.data.map(({ high, low }) => [high, low]).flat();
    if (values.length === 0) return [0, 0];

    return [Math.min(...values), Math.max(...values)];
  };
  const scaleY = scaleLinear()
    .domain(getDomain())
    .range([size * 0.9, 0])
    .clamp(true);
  const scaleBody = scaleLinear()
    .domain([0, Math.max(...getDomain()) - Math.min(...getDomain())])
    .range([0, size * 0.9])
    .clamp(true);

  return !candleData.isFetching ? (
    <Box>
      <Svg width={size * 0.9} height={size}>
        {candleData.data.map((candle, index) => (
          <Candle
            key={index}
            {...{ candle, index, candleWidth }}
            scaleY={scaleY}
            scaleBody={scaleBody}
          />
        ))}
        {marketData.showAnnotation ? (
          <>
            <Line
              x1={0}
              y1={scaleY(marketData.annotationYValue)}
              x2={size}
              y2={scaleY(marketData.annotationYValue)}
              strokeWidth={2}
              stroke="#0b4870"
              strokeDasharray="6 6"
            />
            <ForeignObject x={0} y={scaleY(marketData.annotationYValue)}>
              <View style={styles.container}>
                <Text style={styles.text}>{`Predicted close price: ${
                  marketData.annotationTrend === "call" ? "higher" : "lower"
                } `}</Text>
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

const mapStateToProps = (state) => ({
  candleData: state.candleData,
  marketData: state.marketData,
  webSocket: state.webSocket,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
