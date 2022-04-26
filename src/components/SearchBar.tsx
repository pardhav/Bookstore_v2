import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";

function SearchBar() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      "global-search": "",
    },
    onSubmit: async (values, actions) => {
      actions.setSubmitting(false);
      router.push({
        pathname: `/search/${values["global-search"]}`,
      });
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack direction="row">
          <FormControl>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.300">
                <SearchIcon />
              </InputLeftElement>
              <Input
                name="global-search"
                variant="outline"
                placeholder="Start typing to search..."
                maxW="lg"
                type="text"
                borderRightRadius="0"
                borderRight="1px"
                borderRightColor="gray.200"
                color="black"
                value={formik.values["global-search"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Button
                size="md"
                borderLeftRadius="0"
                color="gray.700"
                type="submit"
                variant="outline"
              >
                Search
              </Button>
            </InputGroup>
          </FormControl>
        </Stack>
      </form>
    </>
  );
}

export default SearchBar;
