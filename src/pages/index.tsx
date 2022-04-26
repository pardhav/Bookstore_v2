import { Box, Heading } from "@chakra-ui/react";
import { Layout, Tile } from "@/components";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import React from "react";
import { IOpenLibraryDoc } from "@/modules";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FIREBASE_ADMIN } from "modules/firebase/adminApp";

interface IObjectKeys {
  [key: string]: any;
}
const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { listKeys, responsive, lists } = props;
  const listKey = listKeys as IObjectKeys;
  const tempList = lists as IObjectKeys;

  return (
    <Layout>
      <>
        <Heading
          color={"gray.500"}
          fontSize={"sm"}
          textTransform={"uppercase"}
          mb={6}
        >
          Curated Lists made for You
        </Heading>
        {lists &&
          Object.keys(lists).length > 0 &&
          Object.keys(lists).map((key, index) => {
            return (
              <Box key={index}>
                <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
                  {listKey[key]}
                </Heading>
                <Carousel responsive={responsive}>
                  {tempList[key].map((doc: IOpenLibraryDoc, index: number) => {
                    return (
                      <Tile
                        key={index}
                        title={doc.title}
                        imageUrl={`https://covers.openlibrary.org/b/isbn/${doc.isbn}-M.jpg`}
                        isbn={doc.isbn as string}
                      />
                    );
                  })}
                </Carousel>
              </Box>
            );
          })}
      </>
    </Layout>
  );
};

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const listKeys = {
      dc_comics: "DC Comics",
      marvel: "Marvel Comics",
      webDev: "Web Development",
      cambridgePress: "Cambridge Press",
      harryPotter: "Harry Potter Series",
    };

    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
        slidesToSlide: 3, // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2, // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1, // optional, default to 1.
      },
    };
    const dcList: any = [];
    const camList: any = [];
    const harryList: any = [];
    const webDevList: any = [];
    const marvelList: any = [];

    const cambridge = FIREBASE_ADMIN.firestore()
      .collection("Home_Lists")
      .doc("Cambridge")
      .collection("items");
    const harryPotter = FIREBASE_ADMIN.firestore()
      .collection("Home_Lists")
      .doc("Harry_Potter")
      .collection("items");
    const marvel = FIREBASE_ADMIN.firestore()
      .collection("Home_Lists")
      .doc("Marvel")
      .collection("items");
    const webDev = FIREBASE_ADMIN.firestore()
      .collection("Home_Lists")
      .doc("Web_Dev")
      .collection("items");
    const dcComics = FIREBASE_ADMIN.firestore()
      .collection("Home_Lists")
      .doc("dc_comics")
      .collection("items");

    const cambridgeRes = await cambridge.get();
    cambridgeRes.forEach((collection) => {
      camList.push(collection.data());
    });
    const harryPotterRes = await harryPotter.get();
    harryPotterRes.forEach((collection) => {
      harryList.push(collection.data());
    });
    const marvelRes = await marvel.get();
    marvelRes.forEach((collection) => {
      marvelList.push(collection.data());
    });
    const webDevRes = await webDev.get();
    webDevRes.forEach((collection) => {
      webDevList.push(collection.data());
    });

    const dcComicsRes = await dcComics.get();
    dcComicsRes.forEach((collection) => {
      dcList.push(collection.data());
    });
    return {
      props: {
        lists: {
          dc_comics: dcList,
          marvel: marvelList,
          webDev: webDevList,
          cambridgePress: camList,
          harryPotter: harryList,
        },
        listKeys,
        responsive,
      },
    };
  } catch (err) {
    console.error({ err });
    ctx.res.end();

    // `as never` prevents inference issues
    // with InferGetServerSidePropsType.
    // The props returned here don't matter because we've
    // already redirected the user.
    return { props: {} as never };
  }
};
