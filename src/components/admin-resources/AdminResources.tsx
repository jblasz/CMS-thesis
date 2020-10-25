import React, {
  useState, useEffect, useCallback, Fragment,
} from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Form, Col, Button, Table, Collapse, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload, faSave, faTrash, faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinner } from '../loading-spinner';
import { Permission, ResourceMeta } from '../../interfaces/resource';
import {
  getResources, putResource, patchResource, deleteResource,
} from '../../services/api/resources.service';
import './AdminResources.css';

function AdminResourcesComponent(): JSX.Element {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resources, setResources] = useState<ResourceMeta[]>([]);
  const [uncollapsedIndex, setUncollapsedIndex] = useState(0);
  const [newResource, setNewResource] = useState<ResourceMeta>({
    _id: '', name: '', usedBy: [], permission: Permission.ALL,
  });
  const [rename, setRename] = useState('');

  const getAndSetResources = useCallback(async () => {
    try {
      setLoading(true);
      const r = await getResources();
      setResources(r.resources);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAndSetResources();
  }, [getAndSetResources]);

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
          <Table responsive>
            <thead>
              <tr>
                <th>{t('ADMIN.RESOURCES.HEADER')}</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, index) => (
                <Fragment key={resource._id}>
                  <tr
                    className="clickable-row"
                    onClick={() => {
                      if (index !== uncollapsedIndex) {
                        setUncollapsedIndex(index);
                      } else {
                        setUncollapsedIndex(-1);
                      }
                    }}
                  >
                    <td>
                      {resource.name}
                      {' '}
                      <small>{resource._id}</small>
                    </td>
                    <td>{}</td>
                  </tr>
                  <tr
                    className="hide-row"
                    onClick={() => {
                      setUncollapsedIndex(index);
                      setRename(resources[index].name);
                    }}
                  >
                    <td>
                      <Collapse in={uncollapsedIndex === index}>
                        <div>
                          <Form.Row>
                            <Col md="auto" className="m-2 text-center">
                              <Button className="mx-2"><FontAwesomeIcon icon={faDownload} /></Button>
                              <Button className="mx-2"><FontAwesomeIcon icon={faUpload} /></Button>
                            </Col>
                            <Col className="m-2 text-center">
                              <InputGroup className="mx-2">
                                <InputGroup.Prepend>
                                  <InputGroup.Text>
                                    {t('ADMIN.RESOURCES.RENAME')}
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                  value={rename}
                                  onChange={(event) => {
                                    setRename(event.target.value);
                                  }}
                                />
                                <InputGroup.Prepend>
                                  <InputGroup.Text>
                                    {t('ADMIN.RESOURCES.PERMISSIONS')}
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                  value={resource.permission}
                                  as="select"
                                  onChange={(event) => {
                                    resource.permission = event.target.value as Permission;
                                    setResources([...resources]);
                                  }}
                                >
                                  <option value={Permission.ALL}>{t('ADMIN.RESOURCES.PERMISSIONS_ALL')}</option>
                                  <option value={Permission.LOGGED_IN}>{t('ADMIN.RESOURCES.PERMISSIONS_LOGGEDIN')}</option>
                                  <option value={Permission.TASK_GROUP}>{t('ADMIN.RESOURCES.PERMISSIONS_TASKGROUP')}</option>
                                  <option value={Permission.NONE}>{t('ADMIN.RESOURCES.PERMISSIONS_NONE')}</option>
                                </Form.Control>
                                <InputGroup.Append>
                                  <Button onClick={async () => {
                                    try {
                                      setLoading(true);
                                      await patchResource(
                                        resource._id, rename, resource.permission,
                                      );
                                      await getAndSetResources();
                                    } catch (e) {
                                      setError(e);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  >
                                    <FontAwesomeIcon icon={faSave} />
                                  </Button>
                                </InputGroup.Append>
                              </InputGroup>
                            </Col>
                            <Col md="auto" className="m-2 center-block">
                              <Button
                                className="mx-2"
                                variant="danger"
                                onClick={async () => {
                                  try {
                                    setLoading(true);
                                    await deleteResource(resource._id);
                                    await getAndSetResources();
                                  } catch (e) {
                                    setError(e);
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </Col>
                          </Form.Row>
                          <Form.Row>
                            {resource.usedBy && resource.usedBy.length ? (
                              <Table responsive style={{ marginLeft: '10px' }}>
                                <thead>
                                  <tr>
                                    <th>{t('ADMIN.RESOURCES.USED_BY_COURSE')}</th>
                                    <th>{t('ADMIN.RESOURCES.USED_BY_LAB')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {resource.usedBy.map((used) => (
                                    <tr key={`${used.courseId} - ${used.labId} - ${used.groupId}`} className="hide-row">
                                      <td>
                                        <Link className="nav-link" to={`/admin/courses/${used.courseId}`}>
                                          {used.courseName}
                                        </Link>
                                      </td>
                                      <td>
                                        <Link className="nav-link" to={`/admin/courses/${used.courseId}/laboratory/${used.labId}`}>
                                          {used.labName}
                                        </Link>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            ) : t('ADMIN.RESOURCES.NOT_USED')}
                          </Form.Row>
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </Fragment>
              ))}
              <tr key="button-key">
                <td>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={newResource.name}
                      onChange={(event) => {
                        setNewResource({ ...newResource, name: event.target.value });
                      }}
                    />
                    <InputGroup.Append>
                      <Button
                        className="mx-1"
                        variant="primary"
                        type="submit"
                        onClick={async () => {
                          try {
                            setLoading(true);
                            await putResource({ ...newResource }, new ArrayBuffer(0));
                            await getAndSetResources();
                          } catch (e) {
                            console.error(e);
                            setError(e);
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        {t('ADMIN.RESOURCES.CREATE')}
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </td>
                <td />
              </tr>
            </tbody>
          </Table>
        </Form.Row>
      </Form>
    </Container>
  );
}

export default AdminResourcesComponent;
