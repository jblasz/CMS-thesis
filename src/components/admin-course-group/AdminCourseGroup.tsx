import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Form, Button, Table, Col,
} from 'react-bootstrap';
import { useParams, Redirect, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  deleteCourseGroup, getCourseGroup, patchCourseGroupStudent, setCourseGroup,
} from '../../services/courses/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseGroup } from '../../interfaces/courseGroup';

function AdminCourseGroupComponent(): JSX.Element {
  const { groupID, courseID } = useParams<{groupID: string, courseID: string}>();

  const [t] = useTranslation();

  const [groupState, setCourseGroupState] = useState({
    loading: true,
    error: false,
    newStudentName: '',
    group: new CourseGroup({
      _id: groupID,
      name: '',
      students: [],
    }),
    sortDirection: 1,
  });

  const [readonly, setReadonly] = useState(true);

  const {
    group, loading, error, newStudentName, sortDirection,
  } = groupState;

  const toggleEditState = async (id: string) => {
    await getAndSetCourseGroup(id);
    setReadonly(!readonly);
  };

  const getAndSetCourseGroup = useCallback(async (id: string) => {
    try {
      setCourseGroupState({
        loading: true,
        error: false,
        group: new CourseGroup(),
        newStudentName: '',
        sortDirection: 1,
      });
      const c = await getCourseGroup(id);
      setCourseGroupState({
        loading: false,
        group: new CourseGroup(c.group),
        error: false,
        newStudentName: '',
        sortDirection: 1,

      });
    } catch (e) {
      setCourseGroupState({
        loading: false,
        group: new CourseGroup(),
        error: true,
        newStudentName: '',
        sortDirection: 1,
      });
    }
  }, []);

  useEffect(() => {
    getAndSetCourseGroup(groupID);
  }, [groupID, getAndSetCourseGroup]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Redirect to="/404" />;
  }

  return (
    <Container>
      <Form className="my-2">
        <Form.Row>
          <Button className="mx-1" onClick={() => toggleEditState(groupID)}>{readonly ? t('ADMIN.COURSE.SET_EDIT_MODE') : t('ADMIN.COURSE.SET_READONLY_MODE')}</Button>
          <Button
            className="mx-1"
            variant="primary"
            disabled={readonly}
            onClick={async () => {
              await setCourseGroup(group);
              toggleEditState(groupID);
            }}
          >
            {t('ADMIN.COURSE.SAVE_CHANGES')}
          </Button>
        </Form.Row>
        <Form.Row>
          <Button
            className="mx-1"
            variant="danger"
            disabled={readonly}
            onClick={async () => {
              try {
                setCourseGroupState({
                  loading: true,
                  group: new CourseGroup(),
                  error: true,
                  newStudentName,
                  sortDirection,
                });
                await deleteCourseGroup(group._id);
                alert('course deleted succesfully');
                setCourseGroupState({
                  loading: false,
                  group: new CourseGroup(),
                  error: true,
                  newStudentName,
                  sortDirection,
                });
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
              onChange={(e) => setCourseGroupState({
                ...groupState,
                newStudentName: e.currentTarget.value,
              })}
            />
          </Col>
          <Col>
            <Button
              variant="primary"
              disabled={readonly}
              onClick={async () => {
                try {
                  setCourseGroupState({
                    loading: true,
                    group,
                    error: false,
                    newStudentName,
                    sortDirection,
                  });
                  await patchCourseGroupStudent(courseID, groupID, newStudentName);
                  await getAndSetCourseGroup(groupID);
                } catch (e) {
                  alert('failed to add student');
                  console.error(e);
                  setCourseGroupState({
                    loading: false,
                    group,
                    error: false,
                    newStudentName,
                    sortDirection,
                  });
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
                  setCourseGroupState({ ...groupState, sortDirection: -sortDirection });
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
                  setCourseGroupState({ ...groupState, sortDirection: -sortDirection });
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
                  setCourseGroupState({ ...groupState, sortDirection: -sortDirection });
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
