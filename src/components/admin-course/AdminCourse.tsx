import React, {
  useState, useEffect, useCallback,
} from 'react';
import {
  Container, Form, Col, Button, Table,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { Course, CourseLanguage } from '../../interfaces/course';
import { getCourse, setCourse } from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseGroup } from '../../interfaces/courseGroup';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';

function AdminCourseComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  const [t] = useTranslation();

  const [course, setCourseState] = useState(
    new Course({
      _id: id,
      description: '',
      groups: [],
      laboratories: [],
      language: CourseLanguage.EN,
      links: [],
      name: '',
      semester: '',
    }),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [readonly, setReadonly] = useState(true);
  const toggleEditState = async () => {
    await getAndSetCourse();
    setReadonly(!readonly);
  };

  const validateAndSetCourse = useCallback((crs: Course) => {
    const res = crs.validate();
    if (!res.ok) {
      setError(res.error || '');
    }
    setCourseState(crs);
  }, []);

  const getAndSetCourse = useCallback(async () => {
    try {
      setLoading(true);
      const c = await getCourse(id);
      validateAndSetCourse(new Course(c.course));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(e);
    }
  }, [id, validateAndSetCourse]);

  useEffect(() => {
    getAndSetCourse();
  }, [getAndSetCourse]);

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
        <Form.Row>
          <Button className="mx-1" onClick={() => toggleEditState()}>{readonly ? t('ADMIN.COURSE.SET_EDIT_MODE') : t('ADMIN.COURSE.SET_READONLY_MODE')}</Button>
          <Button
            className="mx-1"
            variant="primary"
            type="submit"
            disabled={readonly}
            onClick={async (event) => {
              event.preventDefault();
              await setCourse(course);
              await toggleEditState();
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
                validateAndSetCourse(course);
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
                validateAndSetCourse(course);
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
              validateAndSetCourse(course);
            }}
          />
        </Form.Row>
        <Form.Row>
          <Table responsive>
            <thead>
              <tr>
                <th>{t('ADMIN.COURSE.LAB_NAME')}</th>
              </tr>
            </thead>
            <tbody>
              {course.laboratories.map((lab) => (
                <tr key={lab._id}>
                  <td>
                    <Link to={`/admin/courses/${course._id}/laboratory/${lab._id}`}>
                      {`${lab.name || t('ADMIN.COURSE.LAB_NAME_NOT_DEFINED')} `}
                      <small>{lab._id}</small>
                    </Link>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <Button
                    className="mx-1"
                    variant="primary"
                    type="submit"
                    disabled={readonly}
                    onClick={(event) => {
                      event.preventDefault();
                      if (course.laboratories.find((x) => x.name === '')) { return; }
                      course.laboratories.push(new CourseLaboratory());
                      validateAndSetCourse(course);
                    }}
                  >
                    {t('ADMIN.COURSE.CREATE_LAB')}
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
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
              <tr>
                <td>
                  <Button
                    className="mx-1"
                    variant="primary"
                    type="submit"
                    disabled={readonly}
                    onClick={(event) => {
                      event.preventDefault();
                      if (course.groups.find((x) => x.name === '')) { return; }
                      course.groups.push(new CourseGroup());
                      validateAndSetCourse(course);
                    }}
                  >
                    {t('ADMIN.COURSE.CREATE_GROUP')}
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Form.Row>
      </Form>
    </Container>
  );
}

export default AdminCourseComponent;
