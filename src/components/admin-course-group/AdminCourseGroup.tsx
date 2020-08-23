import React, { useState, useEffect } from 'react';
import {
  Container, Form, Button, Table,
} from 'react-bootstrap';
import { useParams, Redirect, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCourseGroup, setCourseGroup } from '../../services/courses/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseGroup } from '../../interfaces/courseGroup';

function AdminCourseGroupComponent(): JSX.Element {
  const { groupID } = useParams();

  const [t] = useTranslation();

  const [groupState, setCourseGroupState] = useState({
    loading: true,
    error: false,
    group: new CourseGroup({
      _id: groupID,
      name: '',
      students: [],
    }),
  });

  const [readonly, setReadonly] = useState(true);

  const { group, loading, error } = groupState;

  const toggleEditState = async () => {
    setCourseGroupState({
      loading: true,
      error: false,
      group,
    });
    await getAndSetCourseGroup(groupID);
    setReadonly(!readonly);
  };

  const getAndSetCourseGroup = async (id: string) => {
    try {
      const c = await getCourseGroup(id);
      setCourseGroupState({
        loading: false,
        group: new CourseGroup(c),
        error: false,
      });
    } catch (e) {
      setCourseGroupState({
        loading: false,
        group: new CourseGroup(),
        error: true,
      });
    }
  };

  useEffect(() => {
    getAndSetCourseGroup(groupID);
  }, [groupID]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Redirect to="/404" />;
  }

  return (
    <Container>
      <Form>
        <Form.Row>
          <Button className="mx-1" onClick={() => toggleEditState()}>{readonly ? t('ADMIN.COURSE.SET_EDIT_MODE') : t('ADMIN.COURSE.SET_READONLY_MODE')}</Button>
          <Button
            className="mx-1"
            variant="primary"
            type="submit"
            disabled={readonly}
            onClick={async (event) => {
              event.preventDefault();
              await setCourseGroup(group);
              toggleEditState();
            }}
          >
            {t('ADMIN.COURSE.SAVE_CHANGES')}
          </Button>
        </Form.Row>
      </Form>
      <Table responsive>
        <thead>
          <tr>
            <th>{t('ADMIN.GROUP.STUDENTS_ID')}</th>
            <th>{t('ADMIN.GROUP.STUDENTS_NAME')}</th>
            <th>{t('ADMIN.GROUP.STUDENTS_EMAIL')}</th>
          </tr>
        </thead>
        <tbody>
          {group.students.map((student) => (
            <tr key={student._id}>
              <td><Link to={`/admin/student/${student._id}`}>{student._id}</Link></td>
              <td>{student.name || t('ADMIN.GROUP.STUDENT_NA')}</td>
              <td>{student.email || t('ADMIN.GROUP.STUDENT_NA')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminCourseGroupComponent;
