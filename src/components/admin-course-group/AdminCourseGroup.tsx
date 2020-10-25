import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Form, Button, Table, InputGroup,
} from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { faSort, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteCourseGroup, getCourseGroup, patchCourseGroupStudent } from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseGroup } from '../../interfaces/courseGroup';
import { getStudents } from '../../services/api/students.service';

interface BaseStudent {
  id: string
  name?: string
}

function AdminCourseGroupComponent(): JSX.Element {
  const { groupID, courseID } = useParams<{groupID: string, courseID: string}>();

  const [t] = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortDirection, setSortDirection] = useState(1);
  const [newStudent, setNewStudent] = useState<BaseStudent>();
  const [readonly, setReadonly] = useState(true);
  const [
    { students, group },
    setGroupAndStudents,
  ] = useState<{
    students: BaseStudent[],
    group: CourseGroup}>({ students: [], group: new CourseGroup() });

  const toggleEditState = async () => {
    await getAndSetBoth();
    setReadonly(!readonly);
  };

  const validateAndSetCourseGroup = useCallback((_group: CourseGroup, _students: BaseStudent[]) => {
    const res = _group.validate();
    if (res.error) {
      setError(res.error);
    }
    setGroupAndStudents({ group: _group, students: _students });
  }, []);

  const getAndSetBoth = useCallback(async () => {
    try {
      setLoading(true);
      const [{ group: _group }, { students: _students }] = await Promise.all(
        [getCourseGroup(courseID, groupID), getStudents()],
      );
      const filtered = _students
        .map((x) => ({ id: x._id, name: x.name }))
        .filter((x) => !_group.students.find((y) => y._id === x.id));
      validateAndSetCourseGroup(
        new CourseGroup(_group), filtered,
      );
      setNewStudent(filtered[0]);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [groupID, courseID, validateAndSetCourseGroup]);

  useEffect(() => {
    getAndSetBoth();
  }, [groupID, getAndSetBoth]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Form>
        {error ? (
          <Form.Row className="error-strip">
            {`${t('COMMON.ERROR')}: ${error}`}
          </Form.Row>
        ) : ''}
        <Form.Row className="justify-content-between my-2">
          <Button onClick={() => toggleEditState()}>{readonly ? t('ADMIN.COURSE.SET_EDIT_MODE') : t('ADMIN.COURSE.SET_READONLY_MODE')}</Button>
          <Button
            variant="danger"
            disabled={readonly}
            onClick={async () => {
              try {
                setLoading(true);
                await deleteCourseGroup(group._id);
                alert('course deleted succesfully');
                await getAndSetBoth();
              } catch (e) {
                console.error(e);
                setError(e);
                alert('failed to delete course, details in console');
              } finally {
                setLoading(false);
              }
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Form.Row>
        <Form.Row className="my-2">
          <InputGroup>
            <Form.Control
              style={{ maxWidth: '500px' }}
              as="select"
              value={newStudent?.id}
              disabled={readonly}
              onChange={
                (e) => setNewStudent(students.find((x) => x.id === e.target.value))
              }
            >
              {students.map(
                (student) => (
                  <option key={student.id} value={student.id}>
                    {student.name || student.id}
                  </option>
                ),
              )}
            </Form.Control>
            <InputGroup.Append>
              <Button
                variant="primary"
                disabled={readonly}
                onClick={async () => {
                  try {
                    if (!newStudent) {
                      return;
                    }
                    setLoading(true);
                    await patchCourseGroupStudent(courseID, groupID, newStudent?.id);
                    await getAndSetBoth();
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
            </InputGroup.Append>
          </InputGroup>
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
