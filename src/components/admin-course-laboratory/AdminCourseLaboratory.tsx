import {
  Button, ButtonGroup, Col, Container, Form, Jumbotron, Row, ToggleButton,
} from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  deleteCourseLaboratory, getCourseLaboratory, putLaboratory,
} from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';
import { getResources } from '../../services/api/resources.service';
import { ResourceMeta } from '../../interfaces/resource';
import { CourseTask } from '../../interfaces/courseTask';

function AdminCourseLaboratoryComponent(): JSX.Element {
  const { courseID, labID } = useParams<{labID: string, courseID: string}>();

  const [t] = useTranslation();
  const [laboratory, setLaboratory] = useState(new CourseLaboratory(labID));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [readonly, setReadonly] = useState(true);
  const [chosenGroupID, setChosenGroup] = useState('');
  const [resourceNames, setResourceNames] = useState<ResourceMeta[]>([]);

  const toggleEditState = async () => {
    await getAndSetCourseLaboratory();
    setReadonly(!readonly);
  };

  const validateAndSetLaboratory = useCallback((
    lab: CourseLaboratory, taskID?: string, task?: CourseTask,
  ) => {
    if (taskID && task) {
      lab.tasks[taskID] = task;
    }
    const res = lab.validate();
    setError(res.error || '');
    setLaboratory(lab);
    const choice = taskID || (Object.keys(lab.tasks) && Object.keys(lab.tasks)[0]) || '';
    setChosenGroup(choice || '');
  }, []);

  const getAndSetCourseLaboratory = useCallback(async () => {
    try {
      setLoading(true);
      const [r, r2] = await Promise.all([getCourseLaboratory(courseID, labID), getResources()]);
      const lab = new CourseLaboratory(r.laboratory);
      validateAndSetLaboratory(lab);
      setResourceNames(r2.resources);
      const firstGroup = Object.keys(lab.tasks) && Object.keys(lab.tasks)[0];
      setChosenGroup(firstGroup || '');
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(e);
    }
  }, [courseID, labID, validateAndSetLaboratory]);

  useEffect(() => {
    getAndSetCourseLaboratory();
  }, [courseID, getAndSetCourseLaboratory]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <Container>
      <Form className="my-2">
        {error ? (
          <Form.Row className="error-strip">
            {`${t('COMMON.ERROR')}: ${error}`}
          </Form.Row>
        ) : ''}
        <Form.Row className="justify-content-between">
          <Col>
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
          </Col>
          <Button
            className="mx-1"
            variant="danger"
            disabled={readonly}
            onClick={async () => {
              try {
                setLoading(true);
                await deleteCourseLaboratory(courseID, laboratory._id);
                alert('course laboratory deleted succesfully');
                await getAndSetCourseLaboratory();
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
                  setChosenGroup(
                    groupID,
                  );
                }}
              >
                {groupID}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Form.Row>
      </Form>
      {chosenGroupID && laboratory.tasks[chosenGroupID] ? (() => {
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
                        validateAndSetLaboratory(
                          laboratory,
                          chosenGroupID,
                          task,
                        );
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
                        validateAndSetLaboratory(laboratory, chosenGroupID, task);
                      }
                    }}
                  />
                </Col>
                <Col className="text-center">
                  <Form.Group>
                    <Form.Label>{t('ADMIN.LABORATORY.TASK')}</Form.Label>
                    <Form.Control
                      as="select"
                      value={task.resourceId || ''}
                      disabled={readonly}
                      onChange={
                        (event) => {
                          task.resourceId = event.target.value;
                          validateAndSetLaboratory(laboratory, chosenGroupID, task);
                        }
                      }
                    >
                      <option value={undefined}>None</option>
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
                        validateAndSetLaboratory(laboratory, chosenGroupID, task);
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
                        validateAndSetLaboratory(laboratory, chosenGroupID, task);
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
