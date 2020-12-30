import React, { useState, useEffect } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Course } from '../../interfaces/course';
import { getAdminCourses, putAdminCourse } from '../../services/api/courses.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

function AdminCoursesComponent(): JSX.Element {
  const [t] = useTranslation();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAndSetCourses = async () => {
    try {
      setLoading(true);
      setCourses((await getAdminCourses()).courses.map((x) => new Course(x)));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAndSetCourses(); }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <WarningStripComponent error={error} />
      <Table responsive>
        <thead>
          <tr>
            <th>{t('ADMIN.COURSES.NAME')}</th>
            <th>{t('ADMIN.COURSES.SEMESTER')}</th>
            <th>{t('ADMIN.COURSES.LANGUAGE')}</th>
            <th>{t('ADMIN.COURSES.GROUPS_COUNT')}</th>
            <th>{t('ADMIN.COURSES.STUDENTS_COUNT')}</th>
            <th>{t('ADMIN.COURSES.LAB_COUNT')}</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>
                <Link to={`/admin/courses/${course._id}`}>
                  {course.name || t('ADMIN.COURSES.UNNAMED')}
                  <br />
                  <small>{course._id}</small>
                </Link>
              </td>
              <td>
                {course.semester}
              </td>
              <td>
                {course.language}
              </td>
              <td>
                {course.groups.length}
              </td>
              <td>
                {course.groups.reduce((agg, curr) => agg + curr.students.length, 0)}
              </td>
              <td>
                {course.laboratories.length}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <Button
                className="mx-1"
                variant="primary"
                type="submit"
                onClick={async () => {
                  if (courses.find((x) => x.name === '')) { return; }
                  await putAdminCourse(new Course());
                  await getAndSetCourses();
                }}
              >
                {t('ADMIN.COURSES.CREATE_COURSE')}
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminCoursesComponent;
