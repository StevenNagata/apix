import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }
  login = (event) => {
    event.preventDefault();
    this.setState({isLoading: true})
    fetch('https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/get-user', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        clientId: 1,
        username: event.target.email.value,
        password: event.target.password.value
      })
    })
    .then(resp => resp.json())
    .then(data => {
      if(data.statusCode === 200) {
        const {info, jsonWebTok} = data
        this.props.updateAuth({
          clientId: info.CLIENT_ID,
          username: info.USERNAME,
          jsonWebTok: jsonWebTok
        })
        this.props.history.push('/interfaces')
      }
      else {
        console.log(data)
        window.alert('The username or password was incorrect')
      }
      this.setState({isLoading: false})
    })
  }
  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            <span style={{ fontSize: "2rem", margin: "0 1rem" }}>APIX</span>
            <span>Log-in to your account</span>
          </Header>
          <Form onSubmit={this.login} size="large">
            <Segment stacked>
              <Form.Input
                id="email"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
              />
              <Form.Input
                id="password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />

              <Button loading={this.state.isLoading} type="submit" color="teal" fluid size="large">
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? Sign Up
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
