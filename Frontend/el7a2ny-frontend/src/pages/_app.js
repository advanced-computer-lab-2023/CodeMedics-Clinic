import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import { useEffect } from "react";
import Cookies from "js-cookie";
import socket from "src/components/socket";
import "simplebar-react/dist/simplebar.min.css";
import { SettingsConsumer, SettingsProvider } from "../contexts/settings-context";
import { SvgIcon, Box, ButtonBase } from "@mui/material";
import SunIcon from "@heroicons/react/24/solid/SunIcon";
import MoonIcon from "@heroicons/react/24/solid/MoonIcon";
import { useState } from "react";

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);
  const [icon, setIcon] = useState(true);

  useEffect(() => {
    if (Cookies.get("username") !== undefined) {
      socket.on("me", (id) => {
        Cookies.set("socketId", id);
      });
      socket.emit("iAmReady", Cookies.get("username"));
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>El7a2ny Clinic</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <AuthConsumer>
            {(auth) => (
              <SettingsProvider>
                <SettingsConsumer>
                  {(settings) => {
                    const theme = createTheme({ mode: settings.mode });
                    return (
                      <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {auth.isLoading ? (
                          <SplashScreen />
                        ) : (
                          <>
                            {getLayout(<Component {...pageProps} />)}

                            <Box
                              {...props}
                              onClick={() => {
                                settings.handleUpdate({
                                  mode: settings.mode === "dark" ? "light" : "dark",
                                });
                                setIcon(!icon);
                              }}
                              sx={{
                                backgroundColor: "background.paper",
                                borderRadius: "50%",
                                bottom: -13.5,

                                boxShadow: 16,
                                margin: (theme) => theme.spacing(4),
                                position: "fixed",
                                right: 0,
                                zIndex: (theme) => theme.zIndex.speedDial,
                              }}
                            >
                              <ButtonBase
                                sx={{
                                  backgroundColor: "primary.main",
                                  borderRadius: "50%",
                                  color: "primary.contrastText",
                                  p: "10px",
                                }}
                              >
                                <SvgIcon>
                                  {settings.mode == "light" && <MoonIcon />}
                                  {settings.mode == "dark" && <SunIcon />}
                                </SvgIcon>
                              </ButtonBase>
                            </Box>
                          </>
                        )}
                      </ThemeProvider>
                    );
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            )}
          </AuthConsumer>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
