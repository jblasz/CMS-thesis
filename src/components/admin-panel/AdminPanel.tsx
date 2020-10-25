import React from 'react';
import {
  CardDeck, Container, Jumbotron, Row,
} from 'react-bootstrap';
import { PendingCoursesCard } from '../info-cards/PendingCoursesCard';

export function AdminPanelComponent(): JSX.Element {
  return (
    <Container>
      <Row>
        <CardDeck>
          <PendingCoursesCard />
        </CardDeck>
      </Row>
      <Jumbotron>
        Admin panel component.
      </Jumbotron>
    </Container>
  );
}

export default AdminPanelComponent;
