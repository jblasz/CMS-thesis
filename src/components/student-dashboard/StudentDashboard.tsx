import React, { useCallback, useState } from 'react';
import {
  Card,
  CardDeck, Container, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { PendingCoursesComponent } from '../info-cards/PendingCoursesComponent';
import { StudentSubmissionListComponent } from '../submission-list/StudentSubmissionList';
import { StudentCourseListComponent } from './StudentCourseList';

export function StudentDashboardComponent(): JSX.Element {
  const [t] = useTranslation();
  const focus = new URLSearchParams(useLocation().search).get('focus');
  const [flip, setFlip] = useState(0);
  const onUpload = useCallback(() => {
    setFlip(flip + 1);
  }, [flip]);

  return (
    <Container>
      <CardDeck>
        <Row>
          <Card className="p-0 m-2 col-sm-5" style={{ minWidth: '300px' }}>
            <Card.Header>
              {t('PENDING.LABS.TITLE')}
            </Card.Header>
            <Card.Body>
              <PendingCoursesComponent />
            </Card.Body>
          </Card>
          <Card className="p-0 m-2 col-sm-7">
            <Card.Header>
              {t('STUDENT.DASHBOARD.YOUR_COURSES')}
            </Card.Header>
            <Card.Body>
              <StudentCourseListComponent focus={focus || ''} onUpload={onUpload} />
            </Card.Body>
          </Card>
          <div className="w-100" />
          <Card className="p-0 m-2 col-sm-12">
            <Card.Header>
              {t('STUDENT.DASHBOARD.YOUR_SUBMISSIONS')}
            </Card.Header>
            <Card.Body>
              <StudentSubmissionListComponent flip={flip} />
            </Card.Body>
          </Card>
        </Row>
      </CardDeck>
    </Container>
  );
}
