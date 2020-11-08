import React, {
  useState, useEffect, useCallback,
} from 'react';
import {
  Container, Form, Col, Button, Table,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { Course, CourseLanguage } from '../../interfaces/course';
import { deleteCourse, getCourse, putCourse } from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseGroup } from '../../interfaces/courseGroup';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';

function AdminCourseComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  const [t] = useTranslation();

  const [course, setCourseState] = useState<Course>(
    new Course({
      _id: id,
      description: '',
      groups: [],
      laboratories: [],
      language: CourseLanguage.EN,
      links: [],
      name: '',
      semester: '',
      active: true,
      shown: true,
    }),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateAndSetCourse = useCallback((crs: Course) => {
    const res = crs.validate();
    setError(res.error || '');
    setCourseState(new Course(crs));
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
        <Form.Row className="justify-content-between">
          <Col>
            <Button
              className="mx-1"
              variant="primary"
              type="submit"
              onClick={async (event) => {
                event.preventDefault();
                await putCourse(course);
                await getAndSetCourse();
              }}
            >
              {t('ADMIN.COURSE.SAVE_CHANGES')}
            </Button>
          </Col>
          <Button
            className="mx-2"
            variant="danger"
            onClick={async () => {
              try {
                setLoading(true);
                await deleteCourse(course._id);
                alert('course deleted successfully');
              } catch (e) {
                setError(e);
              } finally {
                setLoading(false);
              }
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} key="name">
            <Form.Label>{t('ADMIN.COURSE.NAME')}</Form.Label>
            <Form.Control
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
              onChange={(event) => {
                course.language = event.target.value as CourseLanguage;
                validateAndSetCourse(course);
              }}
            >
              <option>en</option>
              <option>pl</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} key="semester">
            <Form.Label>{t('ADMIN.COURSE.SEMESTER')}</Form.Label>
            <Form.Control
              type="string"
              value={course.semester}
              onChange={(event) => {
                course.semester = event.target.value;
                validateAndSetCourse(course);
              }}
            />
          </Form.Group>
          <Form.Group as={Col} key="active">
            <Form.Label>{t('ADMIN.COURSE.ACTIVE')}</Form.Label>
            <div>
              <BootstrapSwitchButton
                width={100}
                checked={course.active}
                onlabel={t('ADMIN.COURSE.ACTIVE')}
                offlabel={t('ADMIN.COURSE.INACTIVE')}
                onChange={() => {
                  course.active = !course.active;
                  validateAndSetCourse(course);
                }}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} key="shown">
            <Form.Label>{t('ADMIN.COURSE.SHOWN')}</Form.Label>
            <div>
              <BootstrapSwitchButton
                width={100}
                checked={course.shown}
                onlabel={t('ADMIN.COURSE.SHOWN')}
                offlabel={t('ADMIN.COURSE.HIDDEN')}
                onChange={() => {
                  course.shown = !course.shown;
                  validateAndSetCourse(course);
                }}
              />
            </div>
          </Form.Group>
        </Form.Row>
        <Form.Row className="mb-2">
          <Form.Label>{t('ADMIN.COURSE.DESCRIPTION')}</Form.Label>
          <Form.Control
            as="textarea"
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
