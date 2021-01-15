import React from 'react';
import {
  Card,
  CardDeck, Container, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AdminCodesCardComponent } from '../info-cards/AdminCodesCard';
import { AdminSummaryCard } from '../info-cards/AdminSummaryCard';
import { PendingCoursesComponent } from '../info-cards/PendingCoursesComponent';

export function AdminPanelComponent(): JSX.Element {
  const [t] = useTranslation();
  return (
    <Container>
      <Row>
        <CardDeck>
          <Card className="chunky-width my-2">
            <Card.Header>
              {t('PENDING.LABS.TITLE')}
            </Card.Header>
            <Card.Body>
              <PendingCoursesComponent />
            </Card.Body>
          </Card>
          <AdminCodesCardComponent />
          <AdminSummaryCard />
        </CardDeck>
      </Row>
    </Container>
  );
}

export default AdminPanelComponent;
