import {
  faTasks, faUpload, faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  Fragment,
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  Button,
  ButtonGroup,
  Col,
  Container, Row, Table,
} from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import { useTranslation } from 'react-i18next';
import { Link, Redirect } from 'react-router-dom';
import { ICourseGroupMetaWithGrade } from '../../interfaces/misc';
import { IStudentCourse, StudentCourse } from '../../interfaces/studentCourse';
import { postSubmission } from '../../services/api/courses.service';
import { getStudentCourse, getStudentCourses } from '../../services/api/dashboard.service';
import { getAdminResource } from '../../services/api/resources.service';
import { getSubmission } from '../../services/api/submissions.service';
import { AppContext } from '../../services/contexts/app-context';
import { formatDate, stringifyDatePair } from '../../utils';
import { CollapseUploadComponent } from '../collapse-upload/CollapseUpload';
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
  const [uncollapsedIndex, setUncollapsedIndex] = useState(-1);
  const { user } = useContext(AppContext);

  const getAndSetCourse = useCallback(async (id: string) => {
    try {
      if (!user || !user.student) {
        return;
      }
      setLoading(true);
      const { course: _course } = await getStudentCourse(user.student._id, id);
      console.log(_course);
      setCourse(StudentCourse(_course));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getAndSetCourses = useCallback(async () => {
    try {
      if (!user || !user.student._id) {
        return;
      }
      setLoading(true);
      const { courses: _courses } = await getStudentCourses(user.student._id);
      setCourses(_courses);
      const match = focus || (_courses && _courses[0] && _courses[0].courseId);
      if (match) {
        setCourseId(match);
        const { course: _course } = await getStudentCourse(user.student._id, match);
        setCourse(StudentCourse(_course));
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [focus, user]);

  useEffect(() => {
    getAndSetCourses();
  }, [getAndSetCourses]);

  if (!user || !user.student) {
    return <Redirect to="/404" />;
  }

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
                      </tr>
                    </thead>
                    <tbody>
                      {course.laboratories.map((lab, index) => (
                        <Fragment key={lab._id}>
                          <tr key={lab._id}>
                            <td>
                              <Row>
                                <Col className="col-sm-8">
                                  <Link to={`courses/${course._id}/laboratory/${lab._id}`}>
                                    <p>{lab.name}</p>
                                  </Link>
                                </Col>
                                <Col className="col-sm-4">
                                  <p>{lab.grade || t('STUDENT.DASHBOARD.NO_GRADE_YET')}</p>
                                </Col>
                                <Col className="col-sm-8">
                                  <ButtonGroup>
                                    <Button
                                      title={t('STUDENT.DASHBOARD.DOWNLOAD_TASK')}
                                      disabled={!lab.taskId}
                                      onClick={async () => {
                                        getAdminResource(lab.taskId as string);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTasks} />
                                    </Button>
                                    <Button
                                      title={t('STUDENT.DASHBOARD.UPLOAD_SUBMISSION')}
                                      disabled={
                                        !lab.dateFrom
                                        || lab.dateFrom.valueOf() > new Date().valueOf()
                                      }
                                      onClick={() => {
                                        setUncollapsedIndex(index);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faUpload} />
                                    </Button>
                                    <Button
                                      disabled={!lab.latestSubmissionId}
                                      title={t('STUDENT.DASHBOARD.DOWNLOAD_SUBMISSION')}
                                      onClick={async () => {
                                        await getSubmission(lab.latestSubmissionId as string);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faDownload} />
                                    </Button>
                                  </ButtonGroup>
                                </Col>
                                <Col className="col-sm-4">
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
                                </Col>
                              </Row>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <CollapseUploadComponent
                                uncollapsed={uncollapsedIndex === index}
                                onUpload={async (data: FormData, note: string) => {
                                  try {
                                    setLoading(true);
                                    await postSubmission(
                                      course._id,
                                      lab._id,
                                      data,
                                      user.student._id,
                                      note,
                                    );
                                  } catch (e) {
                                    setError(e);
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        </Fragment>
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
