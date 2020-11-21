import { ResourcePicker } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import Axios from "axios";

class Index extends React.Component {
  state = {
    open: false
  }

  render() {
    return (
      <Page
        title="Product Selector"
        primaryAction={{
          content: "Select products",
          onAction: () => this.setState({ open: true })
        }}>
        <ResourcePicker
          resourceType="Product"
          open={this.state.open}
          onCancel={() => this.setState({
            open: false
          })}
          onSelection={(resources) => this.getReviewsFromEtsy()} />
      </Page>)
  }

  handleSelection = (resources) => {
    this.setState({ open: false })
    const arrayOfIds = resources.selection.map((product) => product.id)
    console.log(arrayOfIds)
  }

  getReviewsFromEtsy = () => {
    const test = fetch("https://openapi.etsy.com/v2/users/lyxngoap/feedback/from-buyers?api_key=u1p9defkmxo3ny0znhlzjtsv", {
      mode: 'cors',
      method: 'GET',
    }).then(response => {
      console.log(response)
      return response;
    }).then(json => {
      console.log(json)
    });

    return test
  }
}

export default Index;
