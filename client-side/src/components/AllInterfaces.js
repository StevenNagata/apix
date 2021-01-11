import React from "react";
import { Button, Grid, Header, Card, Loader, Input } from "semantic-ui-react";
import { debounce } from "throttle-debounce";

class AllInterfaces extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      interfaces: [],
      filteredInterfaces: [],
      isLoadingInterfaces: false
    };
    this.filterDebounced = debounce(400, this.filterInterfaces);
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    if (!this.props.props.userInfo) {
      return null;
    } else {
      this.setState({ isLoadingInterfaces: true });
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
          this.setState({
            interfaces: data.body.interfaces,
            filteredInterfaces: data.body.interfaces,
            isLoadingInterfaces: false
          });
        });
    }
  }
  callFilter = e => {
    this.filterDebounced(e.target.value);
  };
  filterInterfaces = lookup => {
    const filteredInterfaces = this.state.interfaces.filter(
      item => item.NAME.toLowerCase().indexOf(lookup.toLowerCase()) !== -1
    );
    this.setState({ filteredInterfaces });
  };
  render() {
    const { filteredInterfaces } = this.state;
    return (
      <Grid padded>
        <Header
          style={{
            position: "realtive",
            marginBottom: 0,
            paddingTop: "1.5rem"
          }}
          dividing
          size="huge"
          as="h1"
        >
          All Interfaces
          {this.state.width >= 400 && (
            <Button
              onClick={() => this.props.props.history.push("/create")}
              style={{
                backgroundColor: "rgb(33,133,208)",
                color: "white",
                float: "right"
              }}
            >
              Create New
            </Button>
          )}
        </Header>
        {this.state.width < 400 && (
          <div style={{ marginTop: "1rem" }}>
            <Button
              onClick={() => this.props.props.history.push("/create")}
              style={{
                backgroundColor: "rgb(33,133,208)",
                color: "white"
              }}
            >
              Create New
            </Button>
          </div>
        )}
        <div style={{ marginTop: "1rem", width: "100%" }}>
          <Input
            fluid
            icon="search"
            placeholder="Search..."
            onChange={event => this.callFilter(event)}
          />
        </div>
        {this.state.isLoadingInterfaces && (
          <Loader
            style={{ marginTop: "25%" }}
            active
            inline="centered"
            content="Loading Interfaces..."
          />
        )}

        <Grid.Row style={{ marginLeft: 0 }}>
          {filteredInterfaces.length < 1 && !this.state.isLoadingInterfaces && (
            <h5
              style={{ textAlign: "center", marginTop: "1rem", width: "100%" }}
            >
              No Interfaces...
            </h5>
          )}
          {filteredInterfaces.map(face => {
            return (
              <div
                onClick={() => {
                  this.props.props.history.push(
                    `./detail#${face.INTERFACE_ID}`
                  );
                }}
                id="api"
                key={face.NAME}
                className="col-xs-2 col-sm-4 col-md-4 col-lg-4 col-xl-2 mt-4 interfaceCard"
              >
                <Card style={{ margin: "0 auto" }}>
                  <Card.Content>
                    <Card.Header>{face.NAME}</Card.Header>
                    <Card.Description>
                      {face.SOURCE_SYSTEM} -> {face.TARGET_SYSTEM}
                    </Card.Description>
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
