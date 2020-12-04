import {
  Jumbotron, Container, Button, Form,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../loading-spinner';
import { postCode } from '../../services/api/codes.service';
import { ICourseGroupMeta, PostCodeResponseType } from '../../interfaces/api';
import { AppContext } from '../../services/contexts/app-context';
import { WarningStripComponent } from '../info/WarningStrip';

interface CodeValidationComponentState {
  loading: boolean,
  code: string
  error: string
  type?: PostCodeResponseType
  courseSignup?: ICourseGroupMeta
}

function CodeValidationComponent(): JSX.Element {
  const { loggedIn } = useContext(AppContext);
  const [t] = useTranslation();
  const [state, setState] = useState<CodeValidationComponentState>({
    loading: false,
    code: '',
    error: '',
  });
  const {
    code, loading, error, type, courseSignup,
  } = state;
  const submitCode = async () => {
    try {
      const resp = await postCode(code);
      switch (resp.type) {
        case PostCodeResponseType.COURSE_SIGNUP: {
          setState({
            ...state,
            type: resp.type,
            courseSignup: resp.courseSignup,
          });
          break;
        }
        default: {
          throw new Error('unrecognized response');
        }
      }
    } catch (err) {
      setState({
        ...state,
        error: err,
      });
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!loggedIn) {
    return (
      <Jumbotron>
        <Container className="justify-content-center">
          <p>{t('CODE_VALIDATION.NOT_LOGGED_IN_0')}</p>
          <ul>
            <li>{t('CODE_VALIDATION.NOT_LOGGED_IN_1')}</li>
            <li>{t('CODE_VALIDATION.NOT_LOGGED_IN_2')}</li>
            <li>{t('CODE_VALIDATION.NOT_LOGGED_IN_3')}</li>
          </ul>
        </Container>
      </Jumbotron>
    );
  }

  if (type) {
    if (type === PostCodeResponseType.COURSE_SIGNUP && courseSignup) {
      return (
        <Jumbotron>
          <Container className="justify-content-center">
            <h1>{t('CODE_VALIDATION.SUCCESS')}</h1>
            <p>{t('CODE_VALIDATION.COURSE_SIGNUP_SUCCESS')}</p>
            <Link className="nav-link" to={`/courses/${courseSignup.courseId}`}>{courseSignup.courseName || t('CODE_VALIDATION.GOTO_COURSE')}</Link>
          </Container>
        </Jumbotron>
      );
    }
    console.error('Unrecognized type', type);
  }
  return (
    <Jumbotron>
      <WarningStripComponent error={error} />
      <Container className="justify-content-center">
        <Form>
          <Form.Label>{t('CODE_VALIDATION.CODE_VALIDATION')}</Form.Label>
          <Form.Control
            type="text"
            value={code}
            onChange={(e) => setState({
              ...state,
              code: e.currentTarget.value,
            })}
          />
          <Form.Text><small>{t('CODE_VALIDATION.CAN_INPUT_ANY_KIND')}</small></Form.Text>
        </Form>
        <Button variant={error ? 'danger' : 'primary'} onClick={() => submitCode()}>{error ? t('CODE_VALIDATION.ERROR') : t('CODE_VALIDATION.SUBMIT')}</Button>
      </Container>
    </Jumbotron>
  );
}

export default CodeValidationComponent;
