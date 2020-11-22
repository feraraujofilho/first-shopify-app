import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import reviews from "../reviews.json"
import store from "store-js"
import { useState } from "react";
import { useEffect } from "react";
import ProductList from "../components/ResourceList";
import axios from "axios";

const Index = () => {

  const [open, setOpen] = useState(false)
  const [ratings, setRatings] = useState([])


  const handleSelection = (resources) => {
    const arrayOfIds = resources.selection.map((product) => product.id)

    store.set("ids", arrayOfIds)

    const selectedProducts = resources.selection

    deleteApiData()

    selectedProducts.map(product => makeApiCall(product))
    setOpen(false)
  }

  const deleteApiData = () => {
    const url = "/api/products"
    axios.delete(url)
  }

  const makeApiCall = async (product) => {
    const url = "/api/products"

    axios.post(url, product).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    })
  }

  const emptyState = !store.get("ids")

  useEffect(() => {
    setRatings(reviews)
  }, [])




  return (
    <Page
      title="Product Selector"
      primaryAction={{
        content: "Select products",
        onAction: () => setOpen(true)
      }}>
      <TitleBar
        primaryAction={{
          content: "Select new Product",
          onAction: () => setOpen(true)
        }} />

      <ResourcePicker
        resourceType="Product"
        open={open}
        onCancel={() => setOpen(false)}
        onSelection={(resources) => handleSelection(resources)} />
      <ProductList />
    </Page>)
}

export default Index;

