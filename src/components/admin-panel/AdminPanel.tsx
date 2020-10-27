import React from 'react';
import {
  CardDeck, Container, Row,
} from 'react-bootstrap';
import { AdminSummaryCard } from '../info-cards/AdminSummaryCard';
import { PendingCoursesCard } from '../info-cards/PendingCoursesCard';

export function AdminPanelComponent(): JSX.Element {
  return (
    <Container>
      <Row>
        <CardDeck>
          <PendingCoursesCard />
          <AdminSummaryCard />
        </CardDeck>
      </Row>
    </Container>
  );
}

export default AdminPanelComponent;
