import React, {
  useState, useEffect, useCallback, Fragment,
} from 'react';
import {
  Container, Form, Col, Button, Table, Collapse, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload, faSave, faTrash, faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinner } from '../loading-spinner';
import { ResourceMeta } from '../../interfaces/resource';
import { getResources, putResource, patchResourceName } from '../../services/api/resources.service';
import './AdminResources.css';

function AdminResourcesComponent(): JSX.Element {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [sortDirection, setSortDirection] = useState(1);
  const [resources, setResources] = useState<ResourceMeta[]>([]);
  const [uncollapsedIndex, setUncollapsedIndex] = useState(0);
  const [newResource, setNewResource] = useState<ResourceMeta>({ _id: '', name: '', usedBy: [] });
  const [rename, setRename] = useState('');

  const getAndSetResources = useCallback(async () => {
    try {
      setLoading(true);
      const r = await getResources();
      setResources(r.resources);
      setLoading(false);
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
                {t('ADMIN.RESOURCES.NAME')}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, index) => (
                <Fragment key={resource._id}>
                  <tr
                    onClick={() => {
                      setUncollapsedIndex(index);
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
                        <Form.Row>
                          <Col md="auto" className="m-2 text-center">
                            <Button className="mx-2"><FontAwesomeIcon icon={faDownload} /></Button>
                            <Button className="mx-2"><FontAwesomeIcon icon={faUpload} /></Button>
                          </Col>
                          <Col className="m-2 text-center">
                            <InputGroup className="mx-2">
                              <InputGroup.Prepend>
                                <InputGroup.Text>
                                  {t('ADMIN.COURSES.RENAME')}
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                value={rename}
                                onChange={(event) => {
                                  setRename(event.target.value);
                                }}
                              />
                              <InputGroup.Append>
                                <Button onClick={async () => {
                                  try {
                                    setLoading(true);
                                    await patchResourceName(resource._id, rename);
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
                            <Button className="mx-2" variant="danger"><FontAwesomeIcon icon={faTrash} /></Button>
                          </Col>
                          {/* {resource.usedBy && resource.usedBy.length
                          ? resource.usedBy.map((used) => (
                            <Form.Row key={used.courseId}>
                              <Link className="nav-link" to={`/admin/courses/${used.labId}`}>
                                {`${t('ADMIN.COURSES.USED_BY_COURSE')} ${used.courseName}
                                ${t('ADMIN.COURSES.USED_BY_LAB')} ${used.labId}`}
                              </Link>
                            </Form.Row>
                          )) : t('ADMIN.COURSES.RESOURCE_NOT_USED')} */}
                        </Form.Row>
                      </Collapse>
                    </td>
                  </tr>
                </Fragment>
              ))}
              <tr key="button-key">
                <td>
                  <Button
                    className="mx-1"
                    variant="primary"
                    type="submit"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await putResource({ ...newResource, resource: new ArrayBuffer(0) });
                        await getAndSetResources();
                      } catch (e) {
                        setError(e);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {t('ADMIN.RESOURCES.CREATE')}
                  </Button>
                  <Form.Control
                    type="text"
                    value={newResource.name}
                    onChange={(event) => {
                      setNewResource({ ...newResource, name: event.target.value });
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </Form.Row>
      </Form>
    </Container>
  );
}

export default AdminResourcesComponent;
