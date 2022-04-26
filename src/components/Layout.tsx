import { Box } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import FullPageSpinner from "./FullPageSpinner";
import Header from "./header";

interface ILayoutProps {
  children?: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}
export function Layout(props: ILayoutProps) {
  return (
    <>
      <Head>{props.title && <title>{props.title}</title>}</Head>
      <FullPageSpinner />

      {props.hideHeader ?? <Header />}

      <Box width={{ "2xl": "75%", xl: "85%" }} m="auto" paddingTop="10" mb="5">
        {props.children}
      </Box>
    </>
  );
}
