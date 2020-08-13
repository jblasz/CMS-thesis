import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, Container, ListGroup, CardDeck, InputGroup, FormControl,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Course } from '../../interfaces/course';

export interface CourseListComponentProps {
  courses: Course[];
}

function CourseListComponent(props: CourseListComponentProps): JSX.Element {
  const [t] = useTranslation();
  const { courses } = props;

  const [languageFilter, setLanguageFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  return (
    <Container>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>
            {t('COURSE.FILTER.LANGUAGE')}
          </InputGroup.Text>
          <FormControl
            as="select"
            placeholder={t('COURSE.FILTER.LANGUAGE')}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => setLanguageFilter(e.target.value)}
          >
            {
              ['', ...new Set<string>(courses.map((c) => c.language))]
                .map((language) => (<option key={language}>{language}</option>))
            }
          </FormControl>
          <InputGroup.Text>
            {t('COURSE.FILTER.SEMESTER')}
          </InputGroup.Text>
          <FormControl
            as="select"
            placeholder={t('COURSE.FILTER.SEMESTER')}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => setSemesterFilter(e.target.value)}
          >
            {
              ['', ...new Set<string>(courses.map((c) => c.semester))]
                .map((semester) => (<option key={semester}>{semester}</option>))
            }
          </FormControl>
        </InputGroup.Prepend>
      </InputGroup>
      <CardDeck>
        {courses
          .filter(
            (course) => course.language.includes(languageFilter)
              && course.semester.includes(semesterFilter),
          )
          .map((course) => (
            <Card className="mb-4" style={{ minWidth: '350px', maxWidth: '350px' }} key={course._id}>
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
                  {t('COURSE.LABORATORY.GOTO')}
                </Link>
              </Card.Body>
            </Card>
          ))}
      </CardDeck>
    </Container>
  );
}

export default CourseListComponent;
