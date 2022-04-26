import React from "react";
import { Layout } from "@/components";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import { signInWithEmail } from "@/modules";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

// TODO: navigate to home on suceesful login

//"nect7479@gmail.com", "Marvel@3000"

const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid Email"),
  password: Yup.string()
    .min(8, "Must be at least 8 charecters")
    .max(16, "Must be less than 16 charecters")
    .required("Password is Required"),
});
function Login() {
  const toast = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, actions) => {
      try {
        actions.setSubmitting(true);
        setSubmitting(true);
        await signInWithEmail(values.email, values.password);
        router.push("/");
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
  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <Layout hideHeader title="NECT - Login">
      <Center h="100vh">
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
          borderRadius={10}
          p={8}
          boxShadow="md"
        >
          <Box minW={{ base: "90%", md: "468px" }}>
            <Box pb="5">
              <Text
                fontFamily="Poppins, sans-serif"
                fontSize="3xl"
                fontWeight="medium"
              >
                Login
              </Text>
              <Text
                fontFamily="Poppins, sans-serif"
                fontSize="md"
                color="gray.500"
              >
                Login to explore, shop from millions of books.
              </Text>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900">
                <FormControl
                  isRequired
                  isInvalid={
                    formik.errors["email"] !== undefined &&
                    formik.errors["email"] !== null &&
                    formik.errors["email"] !== "" &&
                    formik.touched.email
                  }
                >
                  <FormLabel htmlFor="email">Email</FormLabel>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.300">
                      <EmailIcon />
                    </InputLeftElement>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    formik.errors["password"] !== undefined &&
                    formik.errors["password"] !== null &&
                    formik.errors["password"] !== "" &&
                    formik.touched.password
                  }
                >
                  <FormLabel htmlFor="password">Password</FormLabel>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.300">
                      <LockIcon />
                    </InputLeftElement>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>

                  <FormHelperText textAlign="right">
                    <Link>forgot password?</Link>
                  </FormHelperText>
                </FormControl>
                <Box pt="5">
                  <Button
                    isLoading={submitting}
                    type="submit"
                    colorScheme="blue"
                    width="full"
                  >
                    Login
                  </Button>
                </Box>
              </Stack>
            </form>
            <Divider m="3" color="gray.300" />
            <Center mt="6">
              <Link colorScheme="blue" href="signup">
                New user? Sign Up
              </Link>
            </Center>
          </Box>
        </Stack>
      </Center>
    </Layout>
  );
}

export default Login;
