import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Layout, Notfound } from "@/components";
import { FIREBASE_ADMIN } from "modules/firebase/adminApp";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import nookies from "nookies";
import emptyOrderImg from "../../public/no_orders.png";

interface ShippingAddress {
  line1: string;
  countryCode: string;
  recipientName: string;
  state: string;
  postalCode: string;
  city: string;
}

interface Details {
  lastName: string;
  firstName: string;
  email: string;
  countryCode: string;
  shippingAddress: ShippingAddress;
  payerId: string;
}

interface Transaction {
  nonce: string;
  type: string;
  details: Details;
}

interface Item {
  title: string;
  isbn: string;
  price: number;
  quantity: number;
}

interface IOrder {
  transaction: Transaction;
  items: Item[];
}

export default function MyOrders(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if (Object.keys(props).length === 0) {
    return (
      <Notfound
        image={emptyOrderImg}
        tagline="Oops! No orders found"
        alt="No order found cartoon image"
      />
    );
  }

  return (
    <Layout>
      <>
        <Box
          maxW={{ base: "3xl", lg: "7xl", "2xl": "75%" }}
          mx="auto"
          px={{ base: "4", md: "8", lg: "12" }}
          // py={{ base: "6", md: "8", lg: "12" }}
        >
          <Heading
            fontFamily={"heading"}
            fontSize={"2xl"}
            fontWeight={"bold"}
            color={"gray.700"}
            mb={8}
          >
            My Orders
          </Heading>

          {Object.keys(props).map((order_key, index) => {
            const order = props[order_key] as IOrder;
            return (
              <Box borderRadius={"lg"} boxShadow={"md"} p={6} key={index}>
                <Heading
                  fontFamily={"body"}
                  fontSize={"lg"}
                  fontWeight={"bold"}
                  color={"gray.700"}
                  mb={8}
                >
                  Order ID: {order_key}
                </Heading>
                <Stack
                  direction={"row"}
                  align={{ lg: "flex-start" }}
                  spacing={{ base: "8", md: "16" }}
                >
                  <>
                    <Stack spacing={{ base: "8", md: "10" }} flex="2">
                      <Heading
                        fontFamily={"body"}
                        fontSize={"md"}
                        fontWeight={"bold"}
                        color={"gray.700"}
                      >
                        Items
                      </Heading>
                      {order.items.map((item, index) => {
                        return (
                          <Stack
                            direction="row"
                            spacing="5"
                            width="full"
                            key={index}
                          >
                            <Box minWidth="120px" minHeight="120px">
                              <Image
                                rounded="lg"
                                width="120px"
                                height="120px"
                                fit="fill"
                                src={`https://covers.openlibrary.org/b/isbn/${item.isbn}-M.jpg`}
                                alt={item.isbn}
                                draggable="false"
                                loading="lazy"
                              />
                            </Box>

                            <Box flex="1">
                              <Stack spacing="0.5">
                                <Text fontWeight="medium">{item.title}</Text>
                                <Text fontFamily={"mono"}>
                                  ISBN ID: {item.isbn}
                                </Text>
                              </Stack>
                            </Box>
                            <Box>
                              <Text>Quantity: {item.quantity}</Text>
                              <Text>Price: {formatPrice(item.price)}</Text>
                            </Box>
                          </Stack>
                        );
                      })}
                    </Stack>
                    <Center height={"10rem"}>
                      <Divider orientation={"vertical"} />
                    </Center>

                    <Flex direction="column" align="center" flex="1">
                      <Heading
                        fontFamily={"body"}
                        fontSize={"md"}
                        fontWeight={"bold"}
                        color={"gray.700"}
                        alignSelf={"flex-end"}
                      >
                        Transaction Details
                      </Heading>
                      <Stack spacing={6} mt={3}>
                        <Box>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color={"gray.600"}
                          >
                            Mode of Payment
                          </Text>
                          <Text fontSize="md" fontWeight="medium">
                            {order.transaction.type}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color={"gray.600"}
                          >
                            Shipping Address
                          </Text>
                          <Text fontSize="md" fontWeight="medium">
                            {
                              order.transaction.details.shippingAddress
                                .recipientName
                            }
                            , {order.transaction.details.shippingAddress.line1},{" "}
                            {order.transaction.details.shippingAddress.city},{" "}
                            {order.transaction.details.shippingAddress.state},{" "}
                            {
                              order.transaction.details.shippingAddress
                                .postalCode
                            }
                          </Text>
                        </Box>
                      </Stack>
                    </Flex>
                  </>
                </Stack>
              </Box>
            );
          })}
        </Box>
      </>
    </Layout>
  );
}
export function formatPrice(value: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await FIREBASE_ADMIN.auth().verifyIdToken(cookies.token);

    // the user is authenticated!
    const { uid, email } = token;
    if (uid) {
      const orderRef = FIREBASE_ADMIN.firestore().collection("Orders").doc(uid);
      const orders = await orderRef.get();

      if (orders.exists) {
        const orderData = orders.data();
        console.log({ orderData });
        return {
          props: orderData,
        };
      } else {
        return {
          props: {},
        };
      }
    } else {
      // return if user is not authenticated
      ctx.res.writeHead(302, { Location: "/login" });
      ctx.res.end();
    }
  } catch (err) {
    console.error({ err });
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    ctx.res.writeHead(302, { Location: "/login" });
    ctx.res.end();

    // `as never` prevents inference issues
    // with InferGetServerSidePropsType.
    // The props returned here don't matter because we've
    // already redirected the user.
    return { props: {} as never };
  }
};
