import { Grid, GridItem, Text } from "@chakra-ui/react";
import algoliasearch from "algoliasearch/lite";
import { Layout, Tile } from "@/components";
import { useRouter } from "next/router";
import React from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

function Search(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { hits, nbHits, processingTimeMS } = props;
  return (
    <>
      <Layout>
        <Text>
          Showing {nbHits} Results for
          {
            <span>
              {router.query.query_param} in {processingTimeMS}ms
            </span>
          }
        </Text>
        <Grid templateColumns="repeat(5, 1fr)" mt="10">
          {hits &&
            hits.map((doc: any, index: number) => (
              <GridItem key={index}>
                <Tile
                  title={doc.title}
                  imageUrl={`https://covers.openlibrary.org/b/isbn/${doc.isbn}-M.jpg`}
                  isbn={doc.isbn as string}
                />
              </GridItem>
            ))}
        </Grid>
      </Layout>
    </>
  );
}

export default Search;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
      process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY as string
    );
    const index = client.initIndex("Books");
    const searchData = await index.search(ctx?.params?.query_param as string);

    return {
      props: { ...searchData },
    };
  } catch (err) {
    console.error({ err });
    // redirect to the home page on error
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.write({ err });
    ctx.res.end();

    // `as never` prevents inference issues
    // with InferGetServerSidePropsType.
    // The props returned here don't matter because we've
    // already redirected the user.
    return { props: {} as never };
  }
};
