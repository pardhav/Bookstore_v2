import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  toast,
  useBoolean,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Layout } from "components/Layout";
import { useFormik } from "formik";
import { FIREBASE_ADMIN } from "modules/firebase/adminApp";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import nookies from "nookies";
import { EditIcon } from "@chakra-ui/icons";
import { updateUserInfo } from "modules/firebase/userServices";

interface IFormValues {
  mobile: string;
  firstName: string;
  email: string;
  lastName: string;
  street: string;
  state: string;
  postalCode: string;
  city: string;
}
export default function MyAccount(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
): JSX.Element {
  const {
    mobile,
    email,
    firstName,
    lastName,
    state,
    street,
    city,
    postalCode,
  } = props as IFormValues;
  const [submitting, setSubmitting] = React.useState(false);
  const [isEdit, setEdit] = useBoolean();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      mobile,
      firstName,
      lastName,
      state,
      street,
      city,
      postalCode,
    },
    // validationSchema: LoginSchema,
    onSubmit: async (values, actions) => {
      try {
        actions.setSubmitting(true);
        setSubmitting(true);
        await updateUserInfo(values, email);
        toast({
          status: "success",
          position: "top",
          title: "Account Info Updated Successfully",
        });
        setEdit.off();
      } catch (error: any) {
        toast({
          status: "error",
          position: "top",
          title: "Unknown Error Occurred!",
          description: error?.message,
        });
      } finally {
        actions.setSubmitting(false);
        setSubmitting(false);
      }
    },
  });
  return (
    <Layout>
      <Flex align={"center"} justify={"center"}>
        <Stack
          spacing={8}
          w={"full"}
          maxW={"xl"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={8}
        >
          <Heading
            fontSize={{ base: "3xl", sm: "2xl" }}
            color={"gray.700"}
            textAlign={"center"}
          >
            My Account
          </Heading>
          <form onSubmit={formik.handleSubmit}>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-around"}
              alignItems={"baseline"}
              spacing={4}
            >
              <FormControl id="firstName" mr={6} isDisabled={!isEdit}>
                <FormLabel>First Name</FormLabel>
                <Input
                  placeholder="First Name"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
              </FormControl>
              <FormControl id="lastName" isRequired isDisabled={!isEdit}>
                <FormLabel>Last name</FormLabel>
                <Input
                  placeholder="Last Name"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
              </FormControl>
            </Stack>

            <FormControl id="email" mt={4} isReadOnly isDisabled>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="your-email@example.com"
                _placeholder={{ color: "gray.500" }}
                type="email"
                value={email}
              />
            </FormControl>
            <FormControl id="mobile" mt={4} isRequired isDisabled={!isEdit}>
              <FormLabel>Phone</FormLabel>
              <Input
                placeholder="Phone"
                _placeholder={{ color: "gray.500" }}
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
              />
            </FormControl>
            <FormControl id="street" mt={4} isRequired isDisabled={!isEdit}>
              <FormLabel>Street</FormLabel>
              <Input
                placeholder="Street"
                _placeholder={{ color: "gray.500" }}
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.street}
              />
            </FormControl>
            <FormControl id="city" mt={4} isRequired isDisabled={!isEdit}>
              <FormLabel>City</FormLabel>
              <Input
                placeholder="City"
                _placeholder={{ color: "gray.500" }}
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
              />
            </FormControl>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-around"}
              alignItems={"baseline"}
              mt={4}
            >
              <FormControl id="state" isRequired mr={6} isDisabled={!isEdit}>
                <FormLabel>State</FormLabel>
                <Input
                  placeholder="State"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.state}
                />
              </FormControl>
              <FormControl id="postalCode" isRequired isDisabled={!isEdit}>
                <FormLabel>Zip/Postal Code</FormLabel>
                <Input
                  placeholder="Zip/Postal Code"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.postalCode}
                />
              </FormControl>
            </Stack>
            <Flex w={"full"} mt={10} justifyContent={"flex-end"}>
              {isEdit ? (
                <Stack spacing={6} direction={["column", "row"]}>
                  <Button
                    bg={"red.400"}
                    color={"white"}
                    w="full"
                    _hover={{
                      bg: "red.500",
                    }}
                    onClick={() => {
                      formik.resetForm();
                      setEdit.off();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme={"blue"}
                    w="full"
                    type="submit"
                    isLoading={submitting}
                  >
                    Submit
                  </Button>
                </Stack>
              ) : (
                <Button
                  onClick={() => setEdit.on()}
                  alignSelf={"flex-end"}
                  colorScheme={"blue"}
                  rightIcon={<EditIcon />}
                >
                  Edit
                </Button>
              )}
            </Flex>
          </form>
        </Stack>
      </Flex>
    </Layout>
  );
}
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await FIREBASE_ADMIN.auth().verifyIdToken(cookies.token);

    // the user is authenticated!
    const { uid, email } = token;
    console.log({ uid });
    if (uid) {
      const userRef = FIREBASE_ADMIN.firestore()
        .collection("Users")
        .doc(email as string);
      const userRecord = await userRef.get();
      if (userRecord.exists) {
        const userData = userRecord.data() as IFormValues;
        return { props: userData };
      } else {
        // return if user record is not found
        ctx.res.writeHead(302, { Location: "/login" });
        ctx.res.end();
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
