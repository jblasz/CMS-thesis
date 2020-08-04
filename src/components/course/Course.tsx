import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import {
  Container, Jumbotron, ListGroup, Row, Col,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Course, CourseLanguage } from '../../interfaces/course';
import { LoadingSpinner } from '../loading-spinner';
import { getCourse } from '../../services/courses/courses.service';
import { formatDate } from '../../utils';

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
      <Container fluid>
        <Row>
          {course.groups.map((group) => (
            <Col>
              <Row>
                {`${t('COURSE.GROUP_ID')}:`}
                <small>{group._id}</small>
              </Row>
              {group.students.map((student) => (
                <Row>
                  <small>{student._id}</small>
                </Row>
              ))}
            </Col>
          ))}
        </Row>
      </Container>
      <ListGroup>
        {course.laboratories.map((lab) => (
          <ListGroup.Item key={lab._id}>
            <h1>{`${t('COURSE.LABORATORY.NUMBER')} ${lab.nameShort}`}</h1>
            <h2>{lab.name}</h2>
            <small>{lab._id}</small>
            <p>{lab.description}</p>
            <h4>{t('COURSE.LABORATORY.PER_GROUP_TASKS')}</h4>
            <ListGroup variant="flush">
              {course.groups.map((group) => {
                const task = lab.tasks[group._id];
                return (
                  <ListGroup.Item>
                    <Col>
                      <Row>
                        <h4>{`${t('COURSE.LABORATORY.TASK.GROUP_ID')}: ${group._id}`}</h4>
                      </Row>
                      <Row>
                        <small>{task.dateFrom ? `${t('COURSE.LABORATORY.TASK.STARTS_AT')}: ${formatDate(task.dateFrom, true)}` : t('COURSE.LABORATORY.TASK.START_NOT_DEFINED')}</small>
                      </Row>
                      <Row>
                        <small>{task.dateTo ? `${t('COURSE.LABORATORY.TASK.ENDS_AT')}: ${formatDate(task.dateTo, true)}` : t('COURSE.LABORATORY.TASK.END_NOT_DEFINED')}</small>
                      </Row>
                    </Col>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default CourseComponent;
