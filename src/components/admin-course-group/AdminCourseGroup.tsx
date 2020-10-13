import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Form, Button, Table, Col,
} from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteCourseGroup, getCourseGroup, patchCourseGroupStudent } from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseGroup } from '../../interfaces/courseGroup';

function AdminCourseGroupComponent(): JSX.Element {
  const { groupID, courseID } = useParams<{groupID: string, courseID: string}>();

  const [t] = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [group, setGroup] = useState(new CourseGroup());
  const [sortDirection, setSortDirection] = useState(1);
  const [newStudentName, setNewStudentName] = useState('');
  const [readonly, setReadonly] = useState(true);

  const toggleEditState = async () => {
    await getAndSetCourseGroup();
    setReadonly(!readonly);
  };

  const validateAndSetCourseGroup = useCallback((cgroup: CourseGroup) => {
    const res = cgroup.validate();
    if (res.error) {
      setError(res.error);
    }
    setGroup(cgroup);
  }, []);

  const getAndSetCourseGroup = useCallback(async () => {
    try {
      setLoading(true);
      const c = await getCourseGroup(courseID, groupID);
      validateAndSetCourseGroup(new CourseGroup(c.group));
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [groupID, courseID, validateAndSetCourseGroup]);

  useEffect(() => {
    getAndSetCourseGroup();
  }, [groupID, getAndSetCourseGroup]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Form className="my-2">
        {error ? (
          <Form.Row className="error-strip">
            {`${t('COMMON.ERROR')}: ${error}`}
          </Form.Row>
        ) : ''}
        <Form.Row>
          <Button className="mx-1" onClick={() => toggleEditState()}>{readonly ? t('ADMIN.COURSE.SET_EDIT_MODE') : t('ADMIN.COURSE.SET_READONLY_MODE')}</Button>
        </Form.Row>
        <Form.Row>
          <Button
            className="mx-1"
            variant="danger"
            disabled={readonly}
            onClick={async () => {
              try {
                setLoading(true);
                await deleteCourseGroup(group._id);
                alert('course deleted succesfully');
                await getAndSetCourseGroup();
              } catch (e) {
                console.error(e);
                alert('failed to delete course, details in console');
              }
            }}
          >
            {t('ADMIN.COURSE.DELETE')}
          </Button>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Control
              type="text"
              value={newStudentName}
              disabled={readonly}
              onChange={
                (e) => setNewStudentName(e.target.value)
              }
            />
          </Col>
          <Col>
            <Button
              variant="primary"
              disabled={readonly}
              onClick={async () => {
                try {
                  setLoading(true);
                  await patchCourseGroupStudent(courseID, groupID, newStudentName);
                  await getAndSetCourseGroup();
                } catch (e) {
                  alert('failed to add student');
                  console.error(e);
                  setError(e);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {t('ADMIN.COURSE.ADD_STUDENT')}
            </Button>
          </Col>
        </Form.Row>
      </Form>
      <Table responsive>
        <thead>
          <tr>
            <th>
              {t('ADMIN.GROUP.STUDENTS_ID')}
              <Button
                variant="light"
                onClick={() => {
                  group.students.sort((a, b) => sortDirection * a._id.localeCompare(b._id));
                  setSortDirection(-sortDirection);
                }}
              >
                <FontAwesomeIcon
                  icon={faSort}
                />
              </Button>
            </th>
            <th>
              {t('ADMIN.GROUP.STUDENTS_NAME')}
              <Button
                variant="light"
                onClick={() => {
                  group.students.sort((a, b) => sortDirection * (a.name || '').localeCompare(b.name || ''));
                  setSortDirection(-sortDirection);
                }}
              >
                <FontAwesomeIcon
                  icon={faSort}
                />
              </Button>
            </th>
            <th>
              {t('ADMIN.GROUP.STUDENTS_EMAIL')}
              <Button
                variant="light"
                onClick={() => {
                  group.students.sort((a, b) => sortDirection * (a.email || '').localeCompare(b.email || ''));
                  setSortDirection(-sortDirection);
                }}
              >
                <FontAwesomeIcon
                  icon={faSort}
                />
              </Button>
            </th>
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
