import React, {
  useState, useEffect, useCallback,
} from 'react';
import {
  Container, Form, Col, Button, Table, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { Course, CourseLanguage } from '../../interfaces/course';
import {
  deleteAdminCourse, getAdminCourse, putAdminCourse, putAdminLaboratory, putAdminCourseGroup,
} from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';
import { WarningStripComponent } from '../info/WarningStrip';
import { EditorComponent } from '../editor/Editor';

function AdminCourseComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  const [t] = useTranslation();

  const [course, setCourseState] = useState<Course>(
    new Course(id),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [newName, setNewName] = useState('');
  const [newLabName, setNewLabName] = useState('');
  const history = useHistory();

  const validateAndSetCourse = useCallback((crs: Course) => {
    const res = crs.validate();
    setWarning(res.error || '');
    setCourseState(new Course(crs));
  }, []);

  const getAndSetCourse = useCallback(async () => {
    try {
      setLoading(true);
      const c = await getAdminCourse(id);
      setCourseState(new Course(c.course));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getAndSetCourse();
  }, [getAndSetCourse]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container>
      {warning ? <WarningStripComponent error={warning} warning /> : <></>}
      <Form>
        <Form.Row className="justify-content-between">
          <Col>
            <Button
              className="mx-1"
              variant="primary"
              type="submit"
              onClick={async (event) => {
                event.preventDefault();
                await putAdminCourse(course);
                await getAndSetCourse();
              }}
            >
              {t('ADMIN.COURSE.SAVE_CHANGES')}
            </Button>
          </Col>
          <Button
            className="mx-2"
            onClick={async (event) => {
              let succeeded = false;
              try {
                event.preventDefault();
                setLoading(true);
                await deleteAdminCourse(course._id);
                succeeded = true;
              } catch (e) {
                setError(e);
              } finally {
                setLoading(false);
              }
              if (succeeded) {
                history.push('/admin/courses');
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
          <Form.Label>{t('ADMIN.COURSE.DESCRIPTION_SHORT')}</Form.Label>
          <EditorComponent
            text={course.descriptionShort}
            setText={(text) => {
              course.descriptionShort = text;
              validateAndSetCourse(course);
            }}
          />
        </Form.Row>
        <Form.Row className="mb-2">
          <Form.Label>{t('ADMIN.COURSE.DESCRIPTION')}</Form.Label>
          <EditorComponent
            text={course.description}
            setText={(text) => {
              course.description = text;
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
            </tbody>
          </Table>
        </Form.Row>
        <Form.Row>
          <InputGroup>
            <Form.Control
              type="text"
              value={newLabName}
              onChange={(event) => {
                setNewLabName(event.target.value);
              }}
            />
            <InputGroup.Append>
              <Button
                className="mx-1"
                variant="primary"
                type="submit"
                disabled={!newLabName}
                onClick={async (event) => {
                  event.preventDefault();
                  await putAdminLaboratory(course._id, new CourseLaboratory({
                    _id: '',
                    description: '',
                    descriptionShort: '',
                    name: newLabName || '',
                    tasks: {},
                  }));
                  await getAndSetCourse();
                }}
              >
                {t('ADMIN.COURSE.CREATE_LAB')}
              </Button>
            </InputGroup.Append>
          </InputGroup>
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
        </Form.Row>
        <Form.Row>
          <InputGroup>
            <Form.Control
              type="text"
              value={newName}
              onChange={(event) => {
                setNewName(event.target.value);
              }}
            />
            <InputGroup.Append>
              <Button
                className="mx-1"
                variant="primary"
                type="submit"
                disabled={!newName}
                onClick={async (event) => {
                  try {
                    setLoading(true);
                    event.preventDefault();
                    await putAdminCourseGroup(course._id, {
                      _id: '',
                      name: newName,
                    });
                    await getAndSetCourse();
                  } catch (e) {
                    setError(e);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {t('ADMIN.COURSE.CREATE_GROUP')}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Row>
      </Form>
    </Container>
  );
}

export default AdminCourseComponent;
