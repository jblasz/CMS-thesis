import { faDownload, faTasks, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card, CardDeck, Col, Container, ListGroup, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ICourseGroupMetaWithGrade } from '../../interfaces/api';
import { ISubmissionMeta } from '../../interfaces/resource';
import { IStudentCourse, StudentCourse } from '../../interfaces/studentCourse';
import { getStudentCourse, getStudentCourses } from '../../services/api/dashboard.service';
import { getSubmissions } from '../../services/api/submissions.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';
import { StudentSubmissionListComponent } from '../submission-list/StudentSubmissionList';

// import './StudentDashboard.scss';

export function StudentDashboardComponent(): JSX.Element {
  const [t] = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const [courses, setCourses] = useState<ICourseGroupMetaWithGrade[]>([]);
  const [course, setCourse] = useState<IStudentCourse>();
  const [index, setIndex] = useState(-1);
  const [submissions, setSubmissions] = useState<ISubmissionMeta[]>([]);
  const getAndSetCourses = useCallback(async () => {
    try {
      setLoading(true);
      const [
        { courses: _courses },
        { submissions: _submissions },
      ] = await Promise.all([getStudentCourses(), getSubmissions('', '', 0)]);
      setSubmissions(_submissions);
      setCourses(_courses);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAndSetCourse = useCallback(async (i) => {
    try {
      setSecondaryLoading(true);
      const { course: _course } = await getStudentCourse(courses[i].courseId);
      setCourse(StudentCourse(_course));
    } catch (e) {
      setError(e);
    } finally {
      setSecondaryLoading(false);
    }
  }, [courses]);

  useEffect(() => {
    getAndSetCourses();
  }, [getAndSetCourses]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <WarningStripComponent error={error} />
      <Row className="course-list p-2">
        <Col>
          <Row className="course-tabs">
            <ul className="nav">
              {courses.map((x, ind) => (
                <li
                  key={x.courseId}
                  className="nav-item"
                >
                  <Button
                    className={`nav-link ${index === ind ? 'active' : ''}`}
                    onClick={async () => {
                      setIndex(ind);
                      getAndSetCourse(ind);
                    }}
                  >
                    {x.courseName}
                  </Button>
                </li>
              ))}
            </ul>
          </Row>
          <Row className="course-details">
            {course
              ? (
                <div>
                  <Link to={`courses/${course._id}`}>
                    {course.name}
                  </Link>
                  {course.groupName}
                  {course.grade ? (
                    <h6>
                      {`${t('STUDENT.DASHBOARD.GRADE')}: ${course.grade}`}
                    </h6>
                  ) : <></>}
                  <ListGroup>
                    {course.laboratories.map((lab) => (
                      <ListGroup.Item key={lab._id}>
                        <Row>
                          <Col>
                            <Link to={`courses/${course._id}/lab/${lab._id}`}>
                              {lab.name}
                            </Link>
                          </Col>
                          <Col>
                            {lab.grade || t('STUDENT.DASHBOARD.NO_GRADE_YET')}
                          </Col>
                          <Col>
                            <ButtonGroup>
                              <Button
                                title={t('STUDENT.DASHBOARD.DOWNLOAD_TASK')}
                                disabled={
                                  lab.dateFrom
                                            && lab.dateFrom.valueOf() < new Date().valueOf()
                                }
                              >
                                <FontAwesomeIcon icon={faTasks} />
                              </Button>
                              <Button
                                title={t('STUDENT.DASHBOARD.UPLOAD_SUBMISSION')}
                                disabled={
                                  (lab.dateTo && lab.dateFrom)
                                            && (lab.dateFrom.valueOf() > new Date().valueOf()
                                            || lab.dateTo.valueOf() < new Date().valueOf()
                                            )
                                }
                              >
                                <FontAwesomeIcon icon={faUpload} />
                              </Button>
                              <Button
                                disabled={!lab.latestSubmissionId}
                                title={t('STUDENT.DASHBOARD.DOWNLOAD_SUBMISSION')}
                              >
                                <FontAwesomeIcon icon={faDownload} />
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )
              : (
                <p>{t('STUDENT.DASHBOARD.SELECT_COURSE_TO_VIEW')}</p>
              )}
          </Row>
        </Col>
      </Row>
      <Row>
        <CardDeck>
          <Card className="chunky-width my-2">
            {
              secondaryLoading
                ? <LoadingSpinner />
                : (
                  <>
                    <Card.Header>
                      {t('STUDENT.DASHBOARD.COURSE_DETAILS')}
                    </Card.Header>
                    <Card.Body />
                  </>
                )
            }
          </Card>
          <Card className="chunky-width my-2">
            <Card.Header>
              {t('STUDENT.DASHBOARD.SUBMISSIONS')}
            </Card.Header>
            <Card.Body>
              <StudentSubmissionListComponent
                submissions={submissions}
              />
            </Card.Body>
          </Card>
        </CardDeck>
      </Row>
    </Container>
  );
}
