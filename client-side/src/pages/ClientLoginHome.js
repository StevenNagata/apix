import React from "react";
import "./ClientLoginHome.css";
import {
  Button,
  Grid,
  Icon,
  Menu
} from "semantic-ui-react";
import AllInterfaces from '../components/AllInterfaces'
import Admin from '../components/Admin'

class ClientLoginHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        activeItem: 'Interfaces',
      dropdownMenuStyle: {
        display: "none"
      }
    };
  }
  logout = () => {
    this.props.history.push("./");
  };
  handleItemClick = (name) => {
      this.handleToggleDropdownMenu()
      this.setState({ activeItem: name })

  }
  handleToggleDropdownMenu = () => {
    let newState = Object.assign({}, this.state);
    if (newState.dropdownMenuStyle.display === "none") {
      newState.dropdownMenuStyle = { display: "flex" };
    } else {
      newState.dropdownMenuStyle = { display: "none" };
    }

    this.setState(newState);
  };
  render() {

    const { activeItem } = this.state

    let currentComponent = null
    
    if(activeItem === 'Interfaces') {
        currentComponent = <AllInterfaces props={this.props} />
    } else if(activeItem === 'Reports') {
        currentComponent = <AllInterfaces props={this.props} />
    } else if( activeItem ==='Admin') {
        currentComponent = <Admin props={this.props} />
    }

    return (
      <div className="App">
        <Grid padded className="tablet computer only">
          <Menu  inverted fluid fixed="top">
            <Menu.Item header as="a">
              APIX
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item onClick={() => this.logout()} as="a">
                Logout
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Grid>
        <Grid padded className="mobile only">
          <Menu borderless inverted fluid fixed="top">
            <Menu.Item header as="a">
              APIX
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Button
                  basic
                  inverted
                  icon
                  toggle
                  onClick={this.handleToggleDropdownMenu}
                >
                  <Icon name="content" />
                </Button>
              </Menu.Item>
            </Menu.Menu>
            <Menu
              borderless
              fluid
              inverted
              vertical
              style={this.state.dropdownMenuStyle}
            >
              <Menu.Item as="a"
              active={activeItem === 'Interfaces'}
              onClick={() => this.handleItemClick('Interfaces')}>Interfaces</Menu.Item>
              <Menu.Item as="a"
              active={activeItem === 'Reports'}
              onClick={() =>  this.handleItemClick('Reports')}>Reports</Menu.Item>
              <Menu.Item as="a"
              active={activeItem === 'Admin'}
              onClick={() =>  this.handleItemClick('Admin')}>Admin</Menu.Item>
              <Menu.Item onClick={() => this.logout()} as="a">
                Logout
              </Menu.Item>
            </Menu>
          </Menu>
        </Grid>
        <Grid padded>
          <Grid.Column
            tablet={3}
            computer={3}
            only="tablet computer"
            id="sidebar"
          >
            <Menu vertical borderless fluid text>
              <Menu.Item 
              as="a"
              active={activeItem === 'Interfaces'}
              onClick={() => this.handleItemClick('Interfaces')}>
                Interfaces
              </Menu.Item>
              <Menu.Item 
              as="a"
              active={activeItem === 'Reports'}
              onClick={() => this.handleItemClick('Reports')}>Reports
              </Menu.Item>
              <Menu.Item 
              as="a"
              active={activeItem === 'Admin'}
              onClick={() => this.handleItemClick('Admin')}>Admin
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column
            mobile={16}
            tablet={13}
            computer={13}
            floated="right"
            id="content"
          > 
       
          
          {currentComponent}

          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default ClientLoginHome;
