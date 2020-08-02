import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import {
  Container, Jumbotron, ListGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Course, CourseLanguage } from '../../interfaces/course';
import { LoadingSpinner } from '../loading-spinner';
import { getCourse } from '../../services/courses/courses.service';

function CourseComponent(): JSX.Element {
  const { id } = useParams();
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
    }),
  });

  const { course, loading, error } = courseState;

  const getAndSetCourse = async (courseID: string) => {
    try {
      const c = await getCourse(courseID);
      setCourseState({
        loading: false,
        course: new Course(c),
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
          <h1>
            {course.name}
          </h1>
          <small>
            {`${t('COURSE.ID')}: ${id}`}
          </small>
          <p>
            {course.description}
          </p>

        </Jumbotron>
      </Container>
      <ListGroup>
        {course.laboratories.map((lab) => (
          <ListGroup.Item key={lab._id}>
            <h1>{`${t('COURSE.LABORATORY.NUMBER')} ${lab.nameShort}`}</h1>
            <h2>{lab.name}</h2>
            <small>{lab._id}</small>
            <p>{lab.description}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default CourseComponent;
