import React from "react";
import { Button, Grid, Header, Card } from "semantic-ui-react";

class AllInterfaces extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interfaces: []
    };
  }
  componentDidMount() {
    if (!this.props.props.userInfo) {
      return null;
    } else {
      fetch(
        "https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/get-interfaces",
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ clientId: this.props.props.userInfo.clientId })
        }
      )
        .then(resp => resp.json())
        .then(data => {
          this.setState({ interfaces: data.body.interfaces });
        });
    }
  }
  render() {
    const { interfaces } = this.state;

    return (
      <Grid padded>
        <Header
          style={{ position: "realtive", marginBottom: 0 }}
          dividing
          size="huge"
          as="h1"
        >
          All Interfaces
          <Button
            onClick={() => this.props.props.history.push("/create")}
            color="teal"
            style={{ float: "right" }}
          >
            Create New
          </Button>
        </Header>

        <Grid.Row textAlign="center">
          {interfaces.map(face => {
            return (
              <div
                onClick={() => {
                  this.props.props.history.push(`./detail#${face.INTERFACE_ID}`);
                }}
                id="api"
                key={face.NAME}
                className="col-sm-6 col-md-4 col-lg-3 mt-4"
              >
                <Card style={{ margin: "0 auto" }}>
                  <Card.Content>
                    <Card.Header>{face.NAME}</Card.Header>
                  </Card.Content>
                </Card>
              </div>
            );
          })}
        </Grid.Row>
      </Grid>
    );
  }
}

export default AllInterfaces;
