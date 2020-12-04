/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import {
  Container, ListGroup, Col, Row,
} from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';
import { Course } from '../../interfaces/course';
import { getCourse, getCourseLaboratory } from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { formatDate } from '../../utils';
import { WarningStripComponent } from '../info/WarningStrip';

function LaboratoryComponent(): JSX.Element {
  const { id, labID } = useParams<{ id: string, labID: string }>();
  const [t] = useTranslation();
  const [course, setCourse] = useState<Course>(new Course());
  const [laboratory, setLaboratory] = useState<CourseLaboratory>(new CourseLaboratory());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAndSetLaboratoryAndCourse = async () => {
      try {
        setLoading(true);
        const [{ course: _course }, { laboratory: _laboratory }] = await Promise.all([
          getCourse(id), getCourseLaboratory(id, labID),
        ]);
        setCourse(new Course(_course));
        setLaboratory(new CourseLaboratory(_laboratory));
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    getAndSetLaboratoryAndCourse();
  }, [id, labID]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container>
      <div className="box-wrapper">
        <div className="box">
          <div className="box-inner">
            <h1>{laboratory.name}</h1>
            <small>{laboratory._id}</small>
            <div dangerouslySetInnerHTML={{ __html: laboratory.description }} />
            <div className="float-right">
              <Link
                className="btn btn-primary p-2"
                role="button"
                aria-pressed="true"
                to={`/courses/${course._id}`}
              >
                {t('COURSE.LABORATORY.BACK_TO_COURSE')}
              </Link>
            </div>
          </div>
        </div>
      </div>
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
