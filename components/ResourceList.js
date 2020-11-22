import { Card, ResourceItem, ResourceList, Stack, TextStyle, Thumbnail } from "@shopify/polaris";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import store from "store-js"

const GET_PRODUCTS_BY_IDS = gql`query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1){
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }`

function ProductList() {

    const { data, loading, error } = useQuery(GET_PRODUCTS_BY_IDS, {
        variables: {
            ids: store.get("ids")
        }
    })

    if (loading) {
        return <div>Loading</div>
    }

    if (error) {
        return <div>{error.message}</div>
    }

    console.log(data)

    return (
        <Card>
            <ResourceList
                showHeader
                resourceName={{ singular: "Products", plural: "Products" }}
                items={data.nodes}
                renderItem={item => {
                    const media = (
                        <Thumbnail
                            source={item.images.edges[0] ? item.images.edges[0].node.originalSrc : "https://images.unsplash.com/photo-1601758063541-d2f50b4aafb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1594&q=80"}
                            alt={item.images.edges[0] ? item.images.edges[0].altText : "https://images.unsplash.com/photo-1601758063541-d2f50b4aafb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1594&q=80"}
                        />
                    )
                    const price = item.variants.edges[0].node.price

                    return (
                        <ResourceItem
                            id={item.id}
                            media={media}
                            accessibilityLabel={`View details for ${item.title}`}
                        >
                            <Stack>
                                <Stack.Item fill>
                                    <h3>
                                        <TextStyle variation="strong">{item.title}</TextStyle>
                                    </h3>
                                </Stack.Item>
                                <Stack.Item>
                                    <p>${price}</p>
                                </Stack.Item>
                            </Stack>
                        </ResourceItem>
                    )
                }} />
        </Card>
    )


    {/* <div>
        <h1>This is the list of products</h1>
        {data.nodes.map(item => {
            return (
                <p key={item.id}>{item.title}</p>
            )
        })}
    </div> */}
}

export default ProductList