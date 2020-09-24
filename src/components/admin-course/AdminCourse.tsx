import React, {
  useState, useEffect,
} from 'react';
import {
  Container, Form, Col, Button, Table,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, Redirect, Link } from 'react-router-dom';
import { Course, CourseLanguage } from '../../interfaces/course';
import { getCourse, setCourse } from '../../services/courses/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseGroup } from '../../interfaces/courseGroup';

function AdminCourseComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  const [t] = useTranslation();

  const [courseState, setCourseState] = useState({
    loading: true,
    error: false,
    course: new Course({
      _id: id,
      description: '',
      groups: [],
      laboratories: [],
      language: CourseLanguage.EN,
      links: [],
      name: '',
      semester: '',
    }),
  });

  const [readonly, setReadonly] = useState(true);

  const toggleEditState = async () => {
    setCourseState({
      loading: true,
      error: false,
      course,
    });
    await getAndSetCourse(id);
    setReadonly(!readonly);
  };

  const { course, loading, error } = courseState;

  const getAndSetCourse = async (courseID: string) => {
    try {
      const c = await getCourse(courseID);
      setCourseState({
        loading: false,
        course: new Course(c.course),
        error: false,
      });
    } catch (e) {
      setCourseState({
        loading: false,
        course: new Course(),
        error: true,
      });
    }
  };

  useEffect(() => {
    getAndSetCourse(id);
  }, [id]);

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
            onClick={(event) => {
              event.preventDefault();
              if (course.groups.find((x) => x.name === '')) { return; }
              course.groups.push(new CourseGroup());
              setCourseState({ loading: false, error: false, course });
            }}
          >
            {t('ADMIN.COURSE.CREATE_GROUP')}
          </Button>
          <Button
            className="mx-1"
            variant="primary"
            type="submit"
            disabled={readonly}
            onClick={async (event) => {
              event.preventDefault();
              await setCourse(course);
              toggleEditState();
            }}
          >
            {t('ADMIN.COURSE.SAVE_CHANGES')}
          </Button>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} key="name">
            <Form.Label>{t('ADMIN.COURSE.NAME')}</Form.Label>
            <Form.Control
              disabled={readonly}
              type="string"
              value={course.name}
              onChange={(event) => {
                course.name = event.target.value;
                setCourseState({ loading: false, error: false, course });
              }}
            />
          </Form.Group>
          <Form.Group as={Col} key="language">
            <Form.Label>{t('ADMIN.COURSE.LANGUAGE')}</Form.Label>
            <Form.Control
              as="select"
              value={course.language}
              disabled={readonly}
              onChange={(event) => {
                course.language = event.target.value as CourseLanguage;
                setCourseState({ loading: false, error: false, course });
              }}
            >
              <option>en</option>
              <option>pl</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row className="mb-2">
          <Form.Label>{t('ADMIN.COURSE.DESCRIPTION')}</Form.Label>
          <Form.Control
            as="textarea"
            disabled={readonly}
            rows={10}
            value={course.description}
            onChange={(event) => {
              course.description = event.target.value;
              setCourseState({ loading: false, error: false, course });
            }}
          />
        </Form.Row>
        <Form.Row>
          <Table responsive>
            <thead>
              <tr>
                <th>{t('ADMIN.COURSE.GROUP_NAME')}</th>
                <th>{t('ADMIN.COURSE.STUDENT_COUNT')}</th>
              </tr>
            </thead>
            <tbody>
              {course.groups.map((group) => (
                <tr key={group._id}>
                  <td>
                    <Link to={`/admin/courses/${course._id}/group/${group._id}`}>
                      {`${group.name || t('ADMIN.COURSE.GROUP_NAME_NOT_DEFINED')} `}
                      <small>{group._id}</small>
                    </Link>
                  </td>
                  <td>
                    {group.students.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <CardDeck>
            {course.groups.map((group) => (
              <Card className="mb-4" style={{ minWidth: '350px', maxWidth: '350px' }}
              key={group._id}>
                <Card.Body>
                  <Card.Title>
                    <Form.Group as={Col}>
                      <Form.Label>{t('ADMIN.COURSE.GROUP_NAME')}</Form.Label>
                      <Form.Control
                        type="string"
                        value={group.name}
                        // if the group doesnt have an id, it hasnt been uploaded to server yet
                        disabled={readonly || !!group._id}
                        onChange={(event) => {
                          group.name = event.target.value;
                          setCourseState({ loading: false, error: false, course });
                          event.preventDefault();
                        }}
                      />
                    </Form.Group>
                  </Card.Title>
                  <Link className="nav-link" to={`/admin/courses/${course._id}/group/${group._id}`}>
                    <Button disabled={!readonly}>
                      {t('ADMIN.COURSE.GROUP_GOTO')}
                    </Button>
                  </Link>
                  <Card.Text>{!group.students.length ? t('ADMIN.COURSE.NO_STUDENTS_YET') :
                  `${group.students.length} ${t('ADMIN.COURSE.STUDENTS_SIGNED_UP')}`}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </CardDeck> */}
        </Form.Row>
      </Form>
    </Container>
  );
}

export default AdminCourseComponent;
