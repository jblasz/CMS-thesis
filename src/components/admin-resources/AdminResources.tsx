import React, {
  useState, useEffect, useCallback, Fragment,
} from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Form, Col, Button, Table, Collapse, InputGroup, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboard,
  faDownload, faSave, faTrash, faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinner } from '../loading-spinner';
import { Permission, IResourceMeta } from '../../interfaces/resource';
import { WarningStripComponent } from '../info/WarningStrip';
import {
  deleteAdminResource, getAdminResource, getAdminResources, patchAdminResource, putAdminResource,
} from '../../services/api/resources.service';
import { appEnv } from '../../appEnv';

function AdminResourcesComponent(): JSX.Element {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resources, setResources] = useState<IResourceMeta[]>([]);
  const [uncollapsedIndex, setUncollapsedIndex] = useState(-1);
  const [newResource, setNewResource] = useState<IResourceMeta>({
    _id: '', name: '', usedBy: [], permission: Permission.ALL,
  });
  const [renames, setRenames] = useState<{[key: string]: string}>({});
  const [uploadPrompt, setUploadPrompt] = useState(false);
  const [file, setFile] = useState<FormData>();

  const getAndSetResources = useCallback(async (index = 0) => {
    try {
      setLoading(true);
      const r = await getAdminResources();
      setResources(r.resources);
      setRenames(r.resources.reduce((agg, curr) => ({ ...agg, [curr._id]: curr.name }), {}));
      if (r.resources.length) {
        setUncollapsedIndex(index);
      } else {
        setUncollapsedIndex(-1);
      }
    } catch (e) {
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

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container>
      <Form>
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
                      setUploadPrompt(false);
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
                    }}
                  >
                    <td>
                      <Collapse in={uncollapsedIndex === index}>
                        <div>
                          <Form.Row>
                            <Col md="auto" className="m-2 text-center">
                              <ButtonGroup>
                                <Button
                                  onClick={async (event) => {
                                    try {
                                      setLoading(true);
                                      event.preventDefault();
                                      await getAdminResource(resource._id);
                                    } catch (e) {
                                      setError(e);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                >
                                  <FontAwesomeIcon icon={faDownload} />
                                </Button>
                                <Button
                                  onClick={() => {
                                    setUploadPrompt(!uploadPrompt);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faUpload} />
                                </Button>
                                <Button title={t('ADMIN.RESOURCES.COPY_LINK_TO_CLIPBOARD')}>
                                  <FontAwesomeIcon
                                    icon={faClipboard}
                                    onClick={() => {
                                      navigator.clipboard.writeText(`${appEnv().backendAddress}/resource/${resource._id}`);
                                    }}
                                  />
                                </Button>
                              </ButtonGroup>
                            </Col>
                            <Col className="m-2 text-center">
                              <InputGroup className="mx-2">
                                <InputGroup.Prepend>
                                  <InputGroup.Text>
                                    {t('ADMIN.RESOURCES.RENAME')}
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                  value={renames[resource._id]}
                                  key={resource._id}
                                  onChange={(event) => {
                                    renames[resource._id] = event.target.value;
                                    setRenames({ ...renames });
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
                                      await patchAdminResource(
                                        resource._id, renames[resource._id] || '', resource.permission,
                                      );
                                      await getAndSetResources(uncollapsedIndex);
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
                                onClick={async () => {
                                  try {
                                    setLoading(true);
                                    await deleteAdminResource(resource._id);
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
                            <Collapse in={uploadPrompt}>
                              <div>
                                <Button className="my-2">
                                  <input
                                    type="file"
                                    onChange={(event) => {
                                      if (
                                        event
                                    && event.target
                                    && event.target.files
                                    && event.target.files[0]
                                      ) {
                                        const f = new FormData();
                                        f.append('file', event.target.files[0]);
                                        setFile(f);
                                      }
                                    }}
                                  />
                                </Button>
                                <Button
                                  className="my-2"
                                  disabled={!file}
                                  onClick={async (event) => {
                                    try {
                                      if (!file || !resource._id) {
                                        throw new Error('Cant sest resource, file or res id missing');
                                      }
                                      event.preventDefault();
                                      setLoading(true);
                                      await putAdminResource(resource._id, file);
                                    } catch (e) {
                                      setError(e);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                >
                                  {t('ADMIN.RESOURCE.UPLOAD')}
                                </Button>
                              </div>
                            </Collapse>
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
                            await patchAdminResource('', newResource.name, newResource.permission);
                            await getAndSetResources(uncollapsedIndex);
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
