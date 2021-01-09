import React from 'react';
import {
  Card,
  CardDeck, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { PendingCoursesComponent } from '../info-cards/PendingCoursesComponent';
import { StudentSubmissionListComponent } from '../submission-list/StudentSubmissionList';
import { StudentCourseListComponent } from './StudentCourseList';

export function StudentDashboardComponent(): JSX.Element {
  const [t] = useTranslation();
  const focus = new URLSearchParams(useLocation().search).get('focus');

  return (
    <Container>
      <CardDeck>
        <Card className="chunky-width my-2">
          <Card.Header>
            {t('PENDING.LABS.TITLE')}
          </Card.Header>
          <Card.Body>
            <PendingCoursesComponent admin={false} />
          </Card.Body>
        </Card>
        <Card className="chunky-width my-2">
          <Card.Header>
            {t('STUDENT.DASHBOARD.YOUR_COURSES')}
          </Card.Header>
          <Card.Body>
            <StudentCourseListComponent focus={focus || ''} />
          </Card.Body>
        </Card>
        <Card className="chunky-width my-2">
          <Card.Header>
            {t('STUDENT.DASHBOARD.YOUR_SUBMISSIONS')}
          </Card.Header>
          <Card.Body>
            <StudentSubmissionListComponent />
          </Card.Body>
        </Card>
      </CardDeck>
    </Container>
  );
}
