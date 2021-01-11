import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ClientLoginHome from "./pages/ClientLoginHome";
import CreateInterface from "./pages/CreateInterface";
import APIdetail from "./pages/APIdetail";

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientData: null,
      userInfo: null,
      redirect: false
    };
  }
  componentDidMount() {
    this.getClient();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      this.setState({ userInfo: userInfo });
    } else {
      this.setState({ redirect: true });
    }
  }
  getClient = () => {
    var pathSnippet = window.location.host.split(".")[0];
    fetch(
      `https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/get-client`,
      {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subdomain: pathSnippet })
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if (data.client) {
          this.setState({ clientData: data.client });
        } else {
          window.alert('please use a valid subdomain')
        }
      });
  };
  updateAuth = userInfo => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    this.setState({ userInfo });
  };
  logout = () => {
    localStorage.removeItem("userInfo");
    this.setState({ userInfo: null });
  };
  updateClient = () => {
    this.getClient();
  };
  render() {
    const auth = this.props;
    const { userInfo, clientData } = this.state;
    if(!clientData) {
      return null
    }
    return (
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
            render={props => <Home {...props} fetchInitialData={auth} />}
          />

          <Route
            path="/login"
            exact
            render={props => (
              <Login
                {...props}
                updateAuth={this.updateAuth}
                clientData={this.state.clientData}
              />
            )}
          />

          <Route
            path="/interfaces"
            exact
            render={props =>
              userInfo ? (
                <ClientLoginHome
                  {...props}
                  userInfo={this.state.userInfo}
                  clientData={this.state.clientData}
                  logout={this.logout}
                  updateClient={this.updateClient}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />

          <Route
            path="/detail"
            exact
            render={props =>
              userInfo ? (
                <APIdetail {...props} userInfo={this.state.userInfo} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />

          <Route
            path="/create"
            exact
            render={props =>
              this.state.userInfo && this.state.clientData ? (
                <CreateInterface
                  {...props}
                  userInfo={this.state.userInfo}
                  clientData={this.state.clientData}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
