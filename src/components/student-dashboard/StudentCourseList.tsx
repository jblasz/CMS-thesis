import {
  faTasks, faUpload, faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Container, Row, Table,
} from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ICourseGroupMetaWithGrade } from '../../interfaces/misc';
import { IStudentCourse, StudentCourse } from '../../interfaces/studentCourse';
import { getStudentCourse, getStudentCourses } from '../../services/api/dashboard.service';
import { formatDate, stringifyDatePair } from '../../utils';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

interface StudentCourseListComponentProps {
  focus: string
}

export function StudentCourseListComponent(props: StudentCourseListComponentProps): JSX.Element {
  const { focus } = props;
  const [t] = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<ICourseGroupMetaWithGrade[]>([]);
  const [course, setCourse] = useState<IStudentCourse>();
  const [courseId, setCourseId] = useState(focus || '');

  const getAndSetCourse = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const { course: _course } = await getStudentCourse(id);
      setCourse(StudentCourse(_course));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAndSetCourses = useCallback(async () => {
    try {
      setLoading(true);
      const { courses: _courses } = await getStudentCourses();
      setCourses(_courses);
      const match = focus || (_courses && _courses[0] && _courses[0].groupId);
      if (match) {
        setCourseId(match);
        const { course: _course } = await getStudentCourse(match);
        setCourse(StudentCourse(_course));
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [focus]);

  useEffect(() => {
    getAndSetCourses();
  }, [getAndSetCourses]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  if (!courses || !courses.length) {
    return (
      <Container className="course-list">
        <p>{t('STUDENT.DASHBOARD.NO_COURSES_SIGNED')}</p>
      </Container>
    );
  }

  return (
    <Container className="box-wrapper course-list">
      <div className="box">
        <div className="box-inner">
          <Row className="mb-2">
            <Dropdown
              options={
                courses.map((crs) => ({
                  value: crs.courseId,
                  label: crs.courseName,
                }))
              }
              value={{
                value: courseId,
                label: course && course._id === courseId && course.name,
              }}
              onChange={(event) => {
                setCourseId(event.value);
                getAndSetCourse(event.value);
              }}
              placeholder={t('STUDENT.DASHBOARD.PICK_COURSE')}
            />
          </Row>
          {
            course
              ? (
                <>
                  <Row>
                    <Link to={`courses/${course._id}`}>
                      <h3>{course.name}</h3>
                    </Link>
                  </Row>
                  <Row>
                    <h4>
                      {`${t('STUDENT.DASHBOARD.GROUP')}: ${course.groupName || t('STUDENT.DASHBOARD.NO_GROUP')}`}
                    </h4>
                  </Row>
                  <Row>
                    <h4>
                      {course.grade ? `${t('STUDENT.DASHBOARD.GRADE')}: ${course.grade}` : t('STUDENT.DASHBOARD.NO_GRADE_YET')}
                    </h4>
                  </Row>
                  <Table>
                    <thead>
                      <tr>
                        <th>
                          {t('STUDENT.DASHBOARD.TABLE_LABORATORY')}
                        </th>
                        <th>
                          {t('STUDENT.DASHBOARD.TABLE_GRADE')}
                        </th>
                        <th>
                          {t('STUDENT.DASHBOARD.TABLE_DATES')}
                        </th>
                        <th>
                          {' '}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.laboratories.map((lab) => (
                        <tr key={lab._id}>
                          <td>
                            <Link to={`courses/${course._id}/laboratory/${lab._id}`}>
                              {lab.name}
                            </Link>
                          </td>
                          <td>
                            <p>{lab.grade || t('STUDENT.DASHBOARD.NO_GRADE_YET')}</p>
                          </td>
                          <td>
                            <p>
                              {
                                lab.dateFrom && lab.dateTo
                                  ? stringifyDatePair(lab.dateFrom, lab.dateTo)
                                  : `
                            ${lab.dateFrom ? formatDate(lab.dateFrom, true) : '?'} -
                             ${lab.dateTo ? formatDate(lab.dateTo, true) : '?'}
                          `
                              }
                            </p>
                          </td>
                          <td>
                            <ButtonGroup>
                              <Button
                                title={t('STUDENT.DASHBOARD.DOWNLOAD_TASK')}
                                disabled={
                                  lab.dateFrom
                                && lab.dateFrom.valueOf() > new Date().valueOf()
                                }
                              >
                                <FontAwesomeIcon icon={faTasks} />
                              </Button>
                              <Button
                                title={t('STUDENT.DASHBOARD.UPLOAD_SUBMISSION')}
                                disabled={
                                  !lab.dateFrom
                              || !lab.dateTo
                              || lab.dateFrom.valueOf() > new Date().valueOf()
                              || lab.dateTo.valueOf() < new Date().valueOf()
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )
              : <p>{t('STUDENT.DASHBOARD.NO_COURSE_SELECTED')}</p>
          }
        </div>
      </div>
    </Container>
  );
}
