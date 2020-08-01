import React from 'react';
import Switch from 'react-bootstrap/esm/Switch';
import { Route, Link } from 'react-router-dom';
import { Card, Container, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import CourseComponent from '../course/Course';
import { Course } from '../../interfaces/course';

export interface CourseListComponentProps {
  courses: Course[];
}

function CourseListComponent(props: CourseListComponentProps): JSX.Element {
  const [t] = useTranslation();
  const { courses } = props;

  return (
    <Container>
      {courses.map((course) => (
        <Card style={{ width: '30rem' }} key={course._id}>
          <Card.Body>
            <Card.Title>{course.name}</Card.Title>
            <Card.Text>{course.description}</Card.Text>
            <ListGroup>
              <ListGroup.Item>
                {`${t('COURSE.CONDUCTED_IN_LANGUAGE')}: ${
                  course.language
                }`}
              </ListGroup.Item>
              <ListGroup.Item>
                {`${t('COURSE.SEMESTER')}: ${course.semester}`}
              </ListGroup.Item>
              <ListGroup.Item>
                {`${t('COURSE.LABORATORIES_DEFINED')}: ${course.laboratories.length}`}
              </ListGroup.Item>
            </ListGroup>
            <Link
              to={`courses/${course._id}`}
              className="mt-2 btn btn-primary btn-lg active"
              role="button"
              aria-pressed="true"
            >
              {t('COURSE.GOTO')}
            </Link>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

interface CoursesComponentProps {
  courses: Course[];
}

function CoursesComponent(props: CoursesComponentProps): JSX.Element {
  const { courses } = props;
  return (
    <Switch>
      <Route
        exact
        path="/courses"
        component={() => <CourseListComponent courses={courses} />}
      />
      <Route path="/courses/:id" component={CourseComponent} />
    </Switch>
  );
}

export default CoursesComponent;
