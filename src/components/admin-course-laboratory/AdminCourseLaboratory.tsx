import {
  Button, ButtonGroup, Container, Form, ToggleButton,
} from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Redirect } from 'react-router-dom';
import {
  deleteCourseLaboratory, getCourseLaboratory,
} from '../../services/api/courses.service';
import { LoadingSpinner } from '../loading-spinner';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';

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
    sortDirection: 1,
  }), [labID]);

  const [state, setState] = useState(getDefaultState());

  const [readonly, setReadonly] = useState(true);

  const [chosenGroupID, setChosenGroupID] = useState('');

  const {
    loading, error, laboratory,
  } = state;

  const toggleEditState = async () => {
    await getAndSetCourseLaboratory();
    setReadonly(!readonly);
  };

  const getAndSetCourseLaboratory = useCallback(async () => {
    try {
      setState({ ...getDefaultState(), loading: true });
      const r = await getCourseLaboratory(courseID, labID);
      setState({ ...getDefaultState(), laboratory: new CourseLaboratory(r.laboratory) });
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
                setState(getDefaultState());
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
            {t('ADMIN.LABORATORY.TASKS')}
          </p>
        </Form.Row>
        <Form.Row>
          <ButtonGroup toggle>
            {Object.keys(laboratory.tasks).map((groupID) => (
              <ToggleButton
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
          <Form>
            <Form.Label>
              {`${t('ADMIN.LABORATORY.TASK_GROUP')} ${chosenGroupID}`}
            </Form.Label>
            <Form.Text>
              {task.description}
            </Form.Text>
          </Form>
        );
      })() : ''}
    </Container>
  );
}

export default AdminCourseLaboratoryComponent;
