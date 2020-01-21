import React from "react";
import { Container, List, Grid, Header, Segment } from "semantic-ui-react";

const Footer = () => {
  return (
    <div>
      <Segment inverted vertical style={{ padding: "5em 0em" }}>
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={5}>
                <Header inverted as="h4" content="About" />
                <List link inverted>
                  <List.Item as="a">Contact Us</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={5}>
                <Header inverted as="h4" content="Services" />
                <List link inverted>
                <List.Item as="a">API Creation</List.Item>
                  <List.Item as="a">Integration</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={5}>
                <p>
                Copyright © 2019 – APIX, Inc. All rights reserved.
                </p>
                <p>
                All services provided by APIX, INC. APIX is not a contractor, lender, or real estate broker.
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </div>
  );
};

export default Footer;