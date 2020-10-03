import {
  Button, ButtonGroup, Col, Container, Form, Jumbotron, Row, ToggleButton,
} from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import {
  deleteCourseLaboratory, getCourseLaboratory, putLaboratory,
} from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';
import { getResources } from '../../services/api/resources.service';
import { ResourceMeta } from '../../interfaces/resource';

function AdminCourseLaboratoryComponent(): JSX.Element {
  const { courseID, labID } = useParams<{labID: string, courseID: string}>();

  const [t] = useTranslation();

  const getDefaultState = useCallback(() => ({
    loading: false,
    error: false,
    laboratory: new CourseLaboratory({
      _id: labID,
      name: '',
      description: '',
      nameShort: '',
      tasks: {},
    }),
    resourceNames: [] as ResourceMeta[],
    sortDirection: 1,
  }), [labID]);

  const [state, setState] = useState(getDefaultState());

  const [readonly, setReadonly] = useState(true);

  const [chosenGroupID, setChosenGroupID] = useState('');

  const {
    loading, error, laboratory, resourceNames,
  } = state;

  const toggleEditState = async () => {
    await getAndSetCourseLaboratory();
    setReadonly(!readonly);
  };

  const getAndSetCourseLaboratory = useCallback(async () => {
    try {
      setState({ ...getDefaultState(), loading: true });
      const [r, r2] = await Promise.all([getCourseLaboratory(courseID, labID), getResources()]);
      setState({
        ...getDefaultState(),
        laboratory: new CourseLaboratory(r.laboratory),
        resourceNames: r2.resources,
      });
    } catch (e) {
      console.error(e);
      setState({ ...getDefaultState(), error: true });
    }
  }, [courseID, labID, getDefaultState]);

  useEffect(() => {
    getAndSetCourseLaboratory();
  }, [courseID, getAndSetCourseLaboratory]);

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
          <Button className="mx-1" onClick={() => toggleEditState()}>{readonly ? t('ADMIN.LABORATORY.SET_EDIT_MODE') : t('ADMIN.LABORATORY.SET_READONLY_MODE')}</Button>
          <Button
            className="mx-1"
            disabled={readonly}
            onClick={async () => {
              await putLaboratory(courseID, laboratory);
              await toggleEditState();
            }}
          >
            {t('ADMIN.LABORATORY.UPLOAD')}
          </Button>
        </Form.Row>
        <Form.Row>
          <Button
            className="mx-1"
            variant="danger"
            disabled={readonly}
            onClick={async () => {
              try {
                setState({ ...getDefaultState(), loading: true });
                await deleteCourseLaboratory(courseID, laboratory._id);
                alert('course deleted succesfully');
                await getAndSetCourseLaboratory();
              } catch (e) {
                console.error(e);
                alert('failed to delete course, details in console');
              }
            }}
          >
            {t('ADMIN.LABORATORY.DELETE')}
          </Button>
        </Form.Row>
        <Form.Row>
          <p>
            {t('ADMIN.LABORATORY.GROUP_TASKS')}
          </p>
        </Form.Row>
        <Form.Row>
          <ButtonGroup toggle>
            {Object.keys(laboratory.tasks).map((groupID) => (
              <ToggleButton
                key={groupID}
                type="checkbox"
                variant="secondary"
                checked={chosenGroupID === groupID}
                value={groupID}
                onClick={() => {
                  setChosenGroupID(groupID);
                }}
              >
                {groupID}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Form.Row>
      </Form>
      {chosenGroupID ? (() => {
        const task = laboratory.tasks[chosenGroupID];
        return (
          <Jumbotron>
            <h3>{`${t('ADMIN.LABORATORY.TASK_FOR_GROUP')} ${chosenGroupID}`}</h3>
            <p><small>{task._id}</small></p>
            <Form>
              <Row>
                <Col className="text-center">
                  <p>{t('ADMIN.LABORATORY.START')}</p>
                  <DatePicker
                    value={task.dateFrom?.toISOString()}
                    disabled={readonly}
                    onChange={(date) => {
                      if (date instanceof Date) {
                        task.dateFrom = new Date(date);
                        setState({ ...state });
                      }
                    }}
                  />
                </Col>
                <Col className="text-center">
                  <p>{t('ADMIN.LABORATORY.END')}</p>
                  <DatePicker
                    value={task.dateTo?.toISOString()}
                    disabled={readonly}
                    onChange={(date) => {
                      if (date instanceof Date) {
                        task.dateTo = new Date(date);
                        setState({ ...state });
                      }
                    }}
                  />
                </Col>
                <Col className="text-center">
                  <Form.Group>
                    <Form.Label>{t('ADMIN.LABORATORY.TASK')}</Form.Label>
                    <Form.Control
                      as="select"
                      value={task.resourceId}
                      disabled={readonly}
                      onChange={
                        (event) => {
                          task.resourceId = event.target.value;
                          setState({ ...state });
                        }
                      }
                    >
                      <option>{undefined}</option>
                      {resourceNames.map((resource) => (<option value={resource._id} key={resource._id}>{`${resource.name} - ${resource._id}`}</option>))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col className="text-center">
                  <p>{t('ADMIN.LABORATORY.GRACE')}</p>
                  <input
                    type="number"
                    min="0"
                    value={task.gracePeriod}
                    disabled={readonly}
                    onChange={
                      (event) => {
                        const v = parseFloat(event.target.value);
                        // eslint-disable-next-line no-restricted-globals
                        task.gracePeriod = isNaN(v) ? 0 : v;
                        setState({ ...state });
                      }
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t('ADMIN.LABORATORY.PUBLIC_DESCRIPTION')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      value={task.description}
                      disabled={readonly}
                      onChange={(event) => {
                        task.description = event.target.value;
                        setState({ ...state });
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Jumbotron>
        );
      })() : ''}
    </Container>
  );
}

export default AdminCourseLaboratoryComponent;
