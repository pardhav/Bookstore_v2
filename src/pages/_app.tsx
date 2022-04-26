import type { AppProps } from "next/app";
import { ChakraProvider, useBoolean, useDisclosure } from "@chakra-ui/react";
import theme from "styles/theme";
import React, { useState } from "react";
import { GlobalContext, FIREBASE_AUTH } from "@/modules";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthProvider } from "modules/firebase/AuthProvider";

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useBoolean();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState({} as User | null);

  // const toggleHeader = () => setShowHeader((val) => !val);
  // onAuthStateChanged(FIREBASE_AUTH, (user) => {
  //   console.log({ user });
  //   if (user) {
  //     setIsLoggedIn.on();
  //     setUserData(user);
  //   } else {
  //     setIsLoggedIn.off();
  //     setUserData(null);
  //   }
  // });
  return (
    <GlobalContext.Provider
      value={{
        state: {
          isLoggedIn,
          user: userData as User,
          spinnerStatus: isOpen,
          showSpinner: onOpen,
          hideSpinner: onClose,
        },
      }}
    >
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
    </GlobalContext.Provider>
  );
}

export default MyApp;
