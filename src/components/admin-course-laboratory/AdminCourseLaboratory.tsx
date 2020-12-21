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
import { IResourceMeta } from '../../interfaces/resource';
import { CourseTask } from '../../interfaces/courseTask';
import { WarningStripComponent } from '../info/WarningStrip';
import { EditorComponent } from '../editor/Editor';

function AdminCourseLaboratoryComponent(): JSX.Element {
  const { courseID, labID } = useParams<{labID: string, courseID: string}>();

  const [t] = useTranslation();
  const [laboratory, setLaboratory] = useState(new CourseLaboratory(labID));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chosenGroupID, setChosenGroup] = useState('');
  const [resourceNames, setResourceNames] = useState<IResourceMeta[]>([]);
  const [editorText, setEditorText] = useState('');

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
    setEditorText((lab.tasks[choice] && lab.tasks[choice].description) || '');
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
      setEditorText((lab.tasks[firstGroup] && lab.tasks[firstGroup].description) || '');
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
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
        <WarningStripComponent error={error} />
        <Form.Row className="justify-content-between">
          <Col>
            <Button
              className="mx-1"
              onClick={async () => {
                await putLaboratory(courseID, laboratory);
              }}
            >
              {t('ADMIN.LABORATORY.UPLOAD')}
            </Button>
          </Col>
          <Button
            className="mx-1"
            variant="danger"
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
                  setEditorText((laboratory.tasks[groupID] && laboratory.tasks[groupID].description) || '');
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
                    <div>
                      <EditorComponent
                        text={editorText}
                        key={chosenGroupID}
                        setText={(text) => {
                          task.description = text;
                          setEditorText(text);
                          validateAndSetLaboratory(laboratory, chosenGroupID, task);
                        }}
                      />
                    </div>
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
