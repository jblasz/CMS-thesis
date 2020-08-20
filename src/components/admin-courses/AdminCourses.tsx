import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Course } from '../../interfaces/course';
import { getCourses } from '../../services/courses/courses.service';

function AdminCoursesComponent(): JSX.Element {
  const [t] = useTranslation();

  const [courses, setCourses] = useState<Course[]>([]);

  const getAndSetCourses = async () => {
    setCourses((await getCourses()).courses.map((x) => new Course(x)));
  };

  useEffect(() => { getAndSetCourses(); }, []);

  return (
    <Container>
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
                  {course.name}
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
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminCoursesComponent;
