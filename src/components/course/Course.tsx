import React, { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import {
  Container, Jumbotron, ListGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Course, CourseLanguage } from '../../interfaces/course';
import { LoadingSpinner } from '../loading-spinner';
import { getCourse } from '../../services/api/courses.service';

function CourseComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  const [t] = useTranslation();

  const [courseState, setCourseState] = useState({
    loading: true,
    error: false,
    course: new Course({
      _id: id,
      description: '',
      groups: [],
      laboratories: [],
      language: CourseLanguage.EN,
      links: [],
      name: '',
      semester: '',
      active: true,
      shown: true,
    }),
  });

  const { course, loading, error } = courseState;

  const getAndSetCourse = async (courseID: string) => {
    try {
      const c = await getCourse(courseID);
      setCourseState({
        loading: false,
        course: new Course(c.course),
        error: false,
      });
    } catch (e) {
      setCourseState({
        loading: false,
        course: new Course(),
        error: true,
      });
    }
  };

  useEffect(() => {
    getAndSetCourse(id);
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Redirect to="/404" />;
  }

  return (
    <Container>
      <Container fluid>
        <Jumbotron>
          <h1>{course.name}</h1>
          <small>{`${t('COURSE.ID')}: ${id}`}</small>
          <p>{course.description}</p>
        </Jumbotron>
      </Container>
      <ListGroup>
        {course.laboratories.map((lab) => (
          <ListGroup.Item key={lab._id}>
            <h1>{lab.name}</h1>
            <small>{lab._id}</small>
            <p>{lab.description}</p>
            <Link
              className="mt-2 btn btn-primary btn-lg active"
              role="button"
              aria-pressed="true"
              to={`/courses/${course._id}/laboratory/${lab._id}`}
            >
              {t('COURSE.LABORATORY.GOTO')}
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default CourseComponent;
