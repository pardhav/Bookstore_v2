import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Img,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Layout, Notfound } from "@/components";
import React from "react";
import {
  GET_ISBN_COVER_S,
  deleteCartItem,
  updateCartQuantity,
} from "@/modules";
import nookies from "nookies";
import emptyCart from "../../../public/empty_cart.png";
//dp_buyer_pp_US_1650783977532505@paypal.com
//kbH7Fz(mjDj@$QW
import { BsTrash } from "react-icons/bs";
import PaypalButtons from "./paypalButtons";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { FIREBASE_ADMIN } from "modules/firebase/adminApp";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

interface ICartData {
  title: string;
  price: number;
  quantity: number;
  isbn: string;
}
export interface IFormValues {
  mobile: string;
  firstName: string;
  email: string;
  lastName: string;
  street: string;
  state: string;
  postalCode: string;
  city: string;
  userId: string;
}
function Detail(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isUpdatingQuantity, setUpdatingQuantity] = React.useState(false);
  // console.log({ props });
  const router = useRouter();
  const auth = getAuth();
  if (Object.keys(props).length === 0) {
    return (
      <Notfound
        tagline="Oops!! Your cart is empty"
        image={emptyCart}
        alt={"Empty Cart cartoon illustration"}
      />
    );
  }
  const {
    cart,
    userInfo,
    amounts,
    subTotal,
    taxes,
    shipping,
    totalBeforeTax,
    mainTotal,
  } = props;

  const updateQuantity = async (
    cartId: string,
    oldValue: number,
    newValue: string
  ) => {
    if (oldValue !== Number(newValue)) {
      setUpdatingQuantity(true);
      await updateCartQuantity(
        auth.currentUser?.uid as string,
        cartId,
        newValue
      );
      setUpdatingQuantity(false);
      router.reload();
    }
  };
  return (
    <>
      <Layout>
        <>
          <Grid templateColumns="repeat(5, 1fr)" column={2}>
            <GridItem colSpan={3}>
              <Heading
                fontFamily={"heading"}
                fontSize={"2xl"}
                fontWeight={"bold"}
                color={"gray.700"}
              >
                Shopping Cart
              </Heading>
              {cart && Object.values(cart).length > 0 && (
                <VStack spacing={6} mt={10}>
                  {Object.keys(cart)?.map((cartId: string, index: number) => {
                    const item = cart[cartId] as ICartData;
                    return (
                      <Box w={"100%"} key={index}>
                        <HStack
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <HStack w={"full"}>
                            <Box
                              width="125px"
                              height="125px"
                              display={"flex"}
                              justifyContent={"center"}
                            >
                              <Img
                                borderRadius="lg"
                                src={GET_ISBN_COVER_S(item.isbn)}
                                maxWidth="125"
                                maxHeight="125"
                                alt={`ISBN ${item.isbn} cover`}
                                objectFit={"cover"}
                              />
                            </Box>

                            <Text
                              fontSize={"md"}
                              fontFamily={"body"}
                              fontWeight={"medium"}
                            >{`${item.title}`}</Text>
                          </HStack>
                          <HStack
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            w={"full"}
                          >
                            <Box>
                              <Select
                                defaultValue={item.quantity}
                                isDisabled={isUpdatingQuantity}
                                onChange={async (
                                  event: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                  await updateQuantity(
                                    cartId,
                                    item.quantity,
                                    event.target.value
                                  );
                                }}
                              >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                              </Select>
                            </Box>

                            <Text
                              fontWeight={"medium"}
                              color={"gray.700"}
                            >{`$${item.price}`}</Text>
                            <IconButton
                              aria-label="Search database"
                              icon={<BsTrash color="red" />}
                              onClick={async () => {
                                console.log("on clicked");
                                await deleteCartItem(
                                  auth.currentUser?.uid as string,
                                  cartId
                                );
                                router.reload();
                              }}
                            />
                          </HStack>
                        </HStack>
                      </Box>
                    );
                  })}
                </VStack>
              )}
            </GridItem>
            <GridItem colSpan={1}></GridItem>
            <GridItem colSpan={1}>
              <Center h={"75%"} mt={10}>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  borderRadius={"lg"}
                  borderWidth={"1px"}
                  padding={8}
                  width={"full"}
                >
                  <Heading fontWeight={"bold"} fontSize={"xl"} lineHeight={1.2}>
                    Order Summary
                  </Heading>
                  <Box marginTop={8} display={"flex"} flexDirection={"column"}>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Text fontWeight={"medium"} color={"gray.600"}>
                        Subtotal
                      </Text>
                      <Text
                        fontWeight={"medium"}
                        color={"gray.600"}
                      >{`$${subTotal}`}</Text>
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Text fontWeight={"medium"} color={"gray.600"}>
                        Shipping Charges
                      </Text>
                      <Text
                        fontWeight={"medium"}
                        color={"gray.600"}
                      >{`$${shipping}`}</Text>
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Text fontWeight={"medium"} color={"gray.600"}>
                        Total Before Taxes
                      </Text>
                      <Text
                        fontWeight={"medium"}
                        color={"gray.600"}
                      >{`$${totalBeforeTax}`}</Text>
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Text fontWeight={"medium"} color={"gray.600"}>
                        Taxes
                      </Text>
                      <Text
                        fontWeight={"medium"}
                        color={"gray.600"}
                      >{`$${taxes}`}</Text>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      mt={6}
                    >
                      <Text fontWeight={"semibold"} fontSize={"lg"}>
                        Total
                      </Text>
                      <Text
                        fontWeight={"semibold"}
                        fontSize={"lg"}
                      >{`$${mainTotal}`}</Text>
                    </Box>
                  </Box>
                  <Box mt={8}>
                    <PaypalButtons
                      amount={mainTotal}
                      userInfo={userInfo}
                      amounts={amounts}
                    />
                  </Box>
                </Box>
              </Center>
            </GridItem>
          </Grid>
        </>
      </Layout>
    </>
  );
}

export default Detail;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await FIREBASE_ADMIN.auth().verifyIdToken(cookies.token);

    // the user is authenticated!
    const { uid, email } = token;
    if (uid) {
      const userRef = FIREBASE_ADMIN.firestore()
        .collection("Users")
        .doc(email as string);
      const userData = (await userRef.get()).data() as IFormValues;
      console.log({ userData });
      const cartRef = FIREBASE_ADMIN.firestore().collection("Cart").doc(uid);

      const cartResponse = await cartRef.get();
      const cartData = cartResponse.data() as ICartData[];
      if (cartResponse.exists && Object.keys(cartData).length !== 0) {
        let total = 0;
        Object.values(cartData).forEach((data: ICartData) => {
          total = total + data.price * data.quantity;
        });
        let tempTotals = {} as any;
        tempTotals.subTotal = total.toFixed(2);
        tempTotals.taxes = (total * (6.25 / 100)).toFixed(2);
        tempTotals.shipping = 4.99;
        tempTotals.totalBeforeTax = (total + 4.99).toFixed(2);
        tempTotals.mainTotal = (total + 4.99 + total * (6.25 / 100)).toFixed(2);
        return {
          props: {
            cart: { ...cartData },
            amounts: { ...tempTotals },
            userInfo: { ...userData },
            ...tempTotals,
          },
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
