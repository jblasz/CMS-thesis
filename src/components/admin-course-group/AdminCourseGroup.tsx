import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Form, Button, Table, Col,
} from 'react-bootstrap';
import { useParams, Redirect, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteCourseGroup, getCourseGroup, patchCourseGroupStudent } from '../../services/api/courses.service';
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

  const toggleEditState = async () => {
    await getAndSetCourseGroup();
    setReadonly(!readonly);
  };

  const getAndSetCourseGroup = useCallback(async () => {
    try {
      setCourseGroupState({
        loading: true,
        error: false,
        group: new CourseGroup(),
        newStudentName: '',
        sortDirection: 1,
      });
      const c = await getCourseGroup(courseID, groupID);
      setCourseGroupState({
        loading: false,
        group: new CourseGroup(c.group),
        error: false,
        newStudentName: '',
        sortDirection: 1,

      });
    } catch (e) {
      console.error(e);
      setCourseGroupState({
        loading: false,
        group: new CourseGroup(),
        error: true,
        newStudentName: '',
        sortDirection: 1,
      });
    }
  }, [groupID, courseID]);

  useEffect(() => {
    getAndSetCourseGroup();
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
          <Button className="mx-1" onClick={() => toggleEditState()}>{readonly ? t('ADMIN.COURSE.SET_EDIT_MODE') : t('ADMIN.COURSE.SET_READONLY_MODE')}</Button>
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
                  await getAndSetCourseGroup();
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
