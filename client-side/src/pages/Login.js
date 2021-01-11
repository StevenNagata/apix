import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
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
    if(!event.target.email.value || !event.target.password.value ) {
      window.alert('Please enter email and password')
      return null
    }
    event.preventDefault();
    this.setState({isLoading: true})
    fetch('https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/get-user', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        clientId: this.props.clientData.CLIENT_ID,
        username: event.target.email.value,
        password: event.target.password.value
      })
    })
    .then(resp => resp.json())
    .then(data => {
      if(data.statusCode === 200) {
        const {info, jsonWebTok} = data
        const isAdmin = info.ROLE.indexOf(9) !== -1 ? true : false
        this.props.updateAuth({
          clientId: info.CLIENT_ID,
          username: info.USERNAME,
          jsonWebTok: jsonWebTok,
          isAdmin: isAdmin
        })
        this.setState({isLoading: false})
        this.props.history.push('/interfaces')
      }
      else {
        window.alert('The username or password was incorrect')
        this.setState({isLoading: false})
      }
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
          <Header as="h2" textAlign="center">
            <span className="primaryColor" style={{ fontSize: "2rem", margin: "0 1rem" }}>APIX</span>
            <span className="primaryColor" >Log-in to your account</span>
          </Header>
          <Form onSubmit={this.login} size="large">
            <Segment stacked style={{margin: '0 1rem'}}>
              <Form.Input
              autoComplete="userName"
                id="email"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
              />
              <Form.Input
                autoComplete="current-password"
                id="password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />

              <Button style={{backgroundColor: 'rgb(33, 133, 208)', color: 'white' }} 
              loading={this.state.isLoading} 
              type="submit"  
              fluid 
              size="large">
                Login
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
