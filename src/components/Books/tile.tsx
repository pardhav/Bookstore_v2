import {
  Box,
  Center,
  useColorModeValue,
  Text,
  Stack,
  Image,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

interface ITileProps {
  imageUrl: string;
  title: string;
  isbn: string;
}
export function Tile(props: ITileProps) {
  const { imageUrl, title, isbn } = props;
  const router = useRouter();
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        mr={6}
        minW={"200px"}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"md"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${imageUrl})`,
            filter: "blur(8px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"fill"}
            src={imageUrl}
            alt={`${title}-cover`}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Text
            fontSize={"md"}
            fontFamily={"body"}
            fontWeight={500}
            noOfLines={2}
          >
            {title}
          </Text>
          <Stack direction={"row"} align={"center"} w={"100%"}>
            <Button
              isFullWidth
              variant={"ghost"}
              onClick={() => router.push(`/books/detail/${isbn}`)}
            >
              View Book
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
