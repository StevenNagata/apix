import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ClientLoginHome from "./pages/ClientLoginHome";
import CreateInterface from "./pages/CreateInterface";
import APIdetail from "./pages/APIdetail";

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null
    };
  }
  componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if(userInfo.username) {
      this.setState({userInfo: userInfo})
    }
  }
  updateAuth = userInfo => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    this.setState({ userInfo });
  };
  render() {
    const auth = this.props;
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
            render={props => <Login {...props} updateAuth={this.updateAuth} />}
          />
          {this.state.userInfo && (
            <Route
            path="/interfaces"
            exact
            render={props => <ClientLoginHome {...props} userInfo={this.state.userInfo} />}
          />
          )}
          {this.state.userInfo && (
            <Route
            path="/detail"
            exact
            render={props => <APIdetail {...props} userInfo={this.state.userInfo} />}
          />
          )}
          <Route path="/create" component={CreateInterface} />
        </Switch>
      </BrowserRouter>
    );
  }
}
