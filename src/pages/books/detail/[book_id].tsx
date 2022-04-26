import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Text,
  useBoolean,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Layout } from "@/components";
import { useRouter } from "next/router";
import React from "react";
import axios from "axios";
import {
  GET_ISBN_COVER_S,
  GET_WORKS_INFO,
  GET_ISBN_INFO,
  addBookToCart,
} from "@/modules";
import { AiFillStar } from "react-icons/ai";
import { FIREBASE_ADMIN } from "modules/firebase/adminApp";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useAuth } from "modules/firebase/AuthProvider";

function BooksDetail(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  console.log({ props });
  const { firebase, isbn, works } = props;
  const [isAdding, setAdding] = useBoolean();
  const toast = useToast();
  const router = useRouter();
  const auth = useAuth();

  const addToCart = async () => {
    try {
      setAdding.on();
      if (auth.user) {
        await addBookToCart({
          title: firebase.title,
          isbn: router.query.book_id,
          price: firebase.price,
        });
        toast({
          status: "success",
          description: "Book Added to Cart",
          position: "top",
        });
      } else {
        router.push("/login");
      }
      setAdding.off();
    } catch (error) {}
  };
  return (
    <Layout>
      <Grid templateColumns="repeat(5, 1fr)" column={2}>
        <GridItem colSpan={2}>
          <Box maxW="400" maxH="600">
            <Image
              borderRadius="md"
              src={GET_ISBN_COVER_S(router.query.book_id as string)}
              width="250"
              height="400"
              alt={`ISBN ${router.query.book_id} cover`}
            />
          </Box>
        </GridItem>
        <GridItem colSpan={3}>
          <VStack alignItems="flex-start">
            <HStack>
              <Text color={"gray.600"} fontSize={"md"}>
                {firebase.average_rating}
              </Text>
              <span>
                <AiFillStar size={"20px"} color={"#4A5568"} />
              </span>
              <Text color={"gray.600"} fontSize={"md"}>
                {`(${firebase.ratings_count})`}
              </Text>
            </HStack>

            <Heading fontFamily={"body"} fontWeight={500} fontSize={"3xl"}>
              {firebase.title}
            </Heading>
            <Text
              fontSize={"2xl"}
              fontWeight={500}
            >{`$${firebase.price}`}</Text>
            <Text
              fontSize={"lg"}
              fontWeight={500}
            >{`First Publish Date: ${firebase.publication_date}`}</Text>
            <Text fontSize={"lg"} fontWeight={500}>
              {`Number of Pages ${firebase.num_pages}`}
            </Text>
            <Text>{firebase.publisher}</Text>
            <Text>{firebase.authors_array.join(", ")}</Text>
            <Text>
              {typeof works.description === "object"
                ? (works.description?.value as string)
                : works.description}
            </Text>
            <Button
              isFullWidth
              isLoading={isAdding}
              onClick={async () => {
                await addToCart();
              }}
              colorScheme="blue"
            >
              Add to Cart
            </Button>
          </VStack>
        </GridItem>
      </Grid>
    </Layout>
  );
}
export default BooksDetail;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const bookId = ctx?.params?.book_id as string;
    const bookRef = FIREBASE_ADMIN.firestore().collection("Books2").doc(bookId);
    const bookData = (await bookRef.get()).data();
    const res = await axios({
      method: "GET",
      url: GET_ISBN_INFO(bookId),
    });
    const isbnRes = res.data;
    console.log(isbnRes);
    let workRes;
    if (isbnRes && isbnRes.works && isbnRes.works[0] && isbnRes.works[0].key) {
      workRes = (
        await axios({
          method: "GET",
          url: GET_WORKS_INFO(isbnRes.works[0].key),
        })
      ).data;
    }

    return {
      props: {
        firebase: { ...bookData },
        isbn: { ...isbnRes },
        works: { ...workRes },
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
