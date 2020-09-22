import React, { useState, useEffect } from 'react';
import {
  Container, ListGroup, Col, Row,
} from 'react-bootstrap';
import { useParams, Redirect, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';
import { Course } from '../../interfaces/course';
import { getCourse, getLaboratory } from '../../services/courses/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { formatDate } from '../../utils';

function LaboratoryComponent(): JSX.Element {
  const { id, labID } = useParams();
  const [t] = useTranslation();

  const [courseState, setCourseState] = useState({
    loading: true,
    error: false,
    course: new Course(),
    laboratory: new CourseLaboratory(),
  });

  const {
    laboratory, course, loading, error,
  } = courseState;

  useEffect(() => {
    const getAndSetLaboratoryAndCourse = async () => {
      try {
        const [crs, lab] = await Promise.all([getCourse(id), getLaboratory(labID)]);
        setCourseState({
          loading: false,
          course: new Course(crs.course),
          laboratory: new CourseLaboratory(lab.laboratory),
          error: false,
        });
      } catch (e) {
        setCourseState({
          loading: false,
          course: new Course(),
          laboratory: new CourseLaboratory(),
          error: true,
        });
      }
    };

    getAndSetLaboratoryAndCourse();
  }, [id, labID]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Redirect to="/404" />;
  }
  return (
    <Container>
      <h1>{`${t('COURSE.LABORATORY.NUMBER')} ${laboratory.nameShort}`}</h1>
      <h2>{laboratory.name}</h2>
      <small>{laboratory._id}</small>
      <p>{laboratory.description}</p>
      <Link
        className="mt-2 btn btn-primary btn-lg active"
        role="button"
        aria-pressed="true"
        to={`/courses/${course._id}`}
      >
        {t('COURSE.LABORATORY.BACK_TO_COURSE')}
      </Link>
      <h4>{t('COURSE.LABORATORY.PER_GROUP_TASKS')}</h4>
      <ListGroup variant="flush">
        {Object.keys(laboratory.tasks).map((groupID) => {
          const task = laboratory.tasks[groupID];
          const group = course.groups.find((x) => x._id === groupID);
          if (!group) {
            throw new Error('Group not defined in laboratory');
          }
          return (
            <ListGroup.Item key={task._id}>
              <Col>
                <Row>
                  <h4>
                    {`${t('COURSE.LABORATORY.TASK.GROUP_NAME')}: ${
                      group.name
                    }`}
                  </h4>
                </Row>
                <Row>
                  <small>
                    {`${t('COURSE.LABORATORY.TASK.GROUP_ID')}: ${
                      group._id
                    }`}
                  </small>
                </Row>
                <Row>
                  {task.description}
                </Row>
                <Row>
                  <small>
                    {task.dateFrom
                      ? `${t(
                        'COURSE.LABORATORY.TASK.STARTS_AT',
                      )}: ${formatDate(task.dateFrom, true)}`
                      : t('COURSE.LABORATORY.TASK.START_NOT_DEFINED')}
                  </small>
                </Row>
                <Row>
                  <small>
                    {task.dateTo
                      ? `${t(
                        'COURSE.LABORATORY.TASK.ENDS_AT',
                      )}: ${formatDate(task.dateTo, true)}`
                      : t('COURSE.LABORATORY.TASK.END_NOT_DEFINED')}
                  </small>
                </Row>
              </Col>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
}

export default LaboratoryComponent;
