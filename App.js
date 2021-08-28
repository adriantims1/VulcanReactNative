import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { StyleSheet, TouchableOpacity } from "react-native";
import { NativeBaseProvider, extendTheme, StatusBar } from "native-base";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";

//icons
import HomeIcon from "./src/components/icons/HomeIcon";
import TradingIcon from "./src/components/icons/TradingIcon";
import SettingIcon from "./src/components/icons/SettingIcon";
import ProfileIcon from "./src/components/icons/ProfileIcon";

//Screens
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TradingScreen from "./src/screens/TradingScreen";
import SettingScreen from "./src/screens/SettingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

//Redux
import { Provider } from "react-redux";
import store from "./src/store/store";

const navigator = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Trading: TradingScreen,
    Settings: SettingScreen,
    Profile: ProfileScreen,
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: ({ navigation }) => ({
      cardStyle: { backgroundColor: "#FFFFFF" },
      headerMode: "screen",
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === "Home") {
          return <HomeIcon color={tintColor} />;
        } else if (routeName === "Settings") {
          return <SettingIcon color={tintColor} />;
        } else if (routeName === "Trading") {
          return <TradingIcon color={tintColor} />;
        } else if (routeName === "Profile") {
          return <ProfileIcon color={tintColor} />;
        }
      },
      tabBarButtonComponent: (props) => {
        return (
          <TouchableOpacity
            {...props}
            style={[
              ...props.style,
              {
                width: 50,
                alignItems: "stretch",
                flex: 0,
                borderRadius: 25,
              },
            ]}
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: "white",
      activeBackgroundColor: "#0b4870",
      inactiveBackgroundColor: "white",
      inactiveTintColor: "#0b4870",
      showLabel: false,
      style: {
        bottom: 20,
        position: "absolute",
        borderTopColor: "transparent",
        backgroundColor: "transparent",
        height: 50,
        width: "90%",
        alignSelf: "center",
        borderRadius: 50,
        justifyContent: "space-around",
      },
      tabStyle: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      keyboardHidesTabBar: false,
    },
  }
);

const inApp = createAppContainer(navigator);

const stack = createStackNavigator(
  {
    Signup: SignupScreen,
    Login: LoginScreen,
    InApp: inApp,
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: "#FFFFFF" },
      useNativeDriver: true,
      headerShown: false,
    },
  }
);

const App = createAppContainer(stack);

const WrapperApp = () => {
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (err) {
        console.log(err);
      }
    }
    prepare();
  }, []);
  return <App />;
};

export default function () {
  const theme = extendTheme({
    components: {
      Input: {
        variants: {
          outline: ({ theme }) => {
            return {
              borderColor: "primary.800",
              borderWidth: 3,
              _focus: {
                borderColor: "primary.400",
              },
            };
          },
        },
      },

      Button: {
        variants: {
          solid: ({ colorScheme }) => {
            return {
              bg: `${colorScheme}.800`,
              _pressed: { color: `${colorScheme}.500` },
            };
          },
        },
      },
    },
    colors: {
      primary: {
        50: "#d1eafa",
        100: "#a2d4f6",
        200: "#74bff1",
        300: "#5db4ef",
        400: "#2e9fea",
        500: "#1586d1",
        600: "#1068a2",
        700: "#0e598b",
        800: "#0b4870",
        900: "#072d46",
      },
    },
  });
  return (
    <>
      <StatusBar backgroundColor="#0b4870" />
      <Provider store={store}>
        <NativeBaseProvider theme={theme}>
          <SafeAreaProvider>
            <NavigationContainer>
              <WrapperApp />
            </NavigationContainer>
          </SafeAreaProvider>
        </NativeBaseProvider>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
});
