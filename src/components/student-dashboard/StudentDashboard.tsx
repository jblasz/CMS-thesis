import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardDeck, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CourseGroupMetaWithGrade } from '../../interfaces/api';
import { SubmissionMeta } from '../../interfaces/resource';
import { StudentCourse } from '../../interfaces/studentCourse';
import { getStudentCourse, getStudentCourses } from '../../services/api/dashboard.service';
import { getSubmissions } from '../../services/api/submissions.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';
import { StudentSubmissionListComponent } from '../submission-list/StudentSubmissionList';

export function StudentDashboardComponent(): JSX.Element {
  const [t] = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const [courses, setCourses] = useState<CourseGroupMetaWithGrade[]>([]);
  const [course, setCourse] = useState<StudentCourse>();
  const [index, setIndex] = useState(-1);
  const [submissions, setSubmissions] = useState<SubmissionMeta[]>([]);
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
      setCourse(new StudentCourse(_course));
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
    <div>
      <WarningStripComponent error={error} />
      <CardDeck>
        <Card className="chunky-width my-2">
          <Card.Header>
            {t('STUDENT.DASHBOARD.COURSES')}
          </Card.Header>
          <Card.Body>
            <ListGroup as="ul">
              {courses.map((x, ind) => (
                <ListGroup.Item
                  key={`${x.courseName}${x.groupName}`}
                  as="li"
                  active={index === ind}
                  onClick={async () => {
                    setIndex(ind);
                    getAndSetCourse(ind);
                  }}
                >
                  {`${x.courseName}, ${x.groupName} ${x.grade ? `(${x.grade})` : ''}`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
        <Card className="chunky-width my-2">
          {
            secondaryLoading
              ? <LoadingSpinner />
              : (
                <>
                  <Card.Header>
                    {t('STUDENT.DASHBOARD.COURSE_DETAILS')}
                  </Card.Header>
                  <Card.Body>
                    {course
                      ? (
                        <>
                          <Card.Title>
                            <Link to={`courses/${course._id}`}>
                              {course.name}
                            </Link>
                          </Card.Title>
                          <Card.Subtitle>
                            {`${t('STUDENT.DASHBOARD.GROUP_NAME')}: ${course.groupName}`}
                          </Card.Subtitle>
                        </>
                      )
                      : (
                        <Card.Title>
                          {t('STUDENT.DASHBOARD.SELECT_COURSE_TO_VIEW')}
                        </Card.Title>
                      )}
                  </Card.Body>
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
    </div>
  );
}
