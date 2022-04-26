import { useGlobalContext } from "modules/context";
import { Center, ScaleFade, Spinner } from "@chakra-ui/react";
import React from "react";

function FullPageSpinner() {
  const context = useGlobalContext();

  return (
    <>
      <ScaleFade
        initialScale={0.9}
        in={context.state.spinnerStatus}
        unmountOnExit
      >
        <Center
          bg="gray.100"
          zIndex={9999}
          w="100vw"
          h="100vh"
          position="absolute"
          opacity={0.8}
        >
          <Spinner size="xl" />
        </Center>
      </ScaleFade>
    </>
  );
}

export default FullPageSpinner;
