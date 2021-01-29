import {
  Jumbotron, Container, Button, Form,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../loading-spinner';
import { postCode } from '../../services/api/codes.service';
import { PostCodeResponseType } from '../../interfaces/api';
import { AppContext } from '../../services/contexts/app-context';
import { ICourseGroupMeta } from '../../interfaces/misc';

function CodeValidationComponent(): JSX.Element {
  const { user } = useContext(AppContext);
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [course, setCourse] = useState<ICourseGroupMeta>();
  const submitCode = async () => {
    try {
      if (!user || !user.student) {
        return;
      }
      setLoading(true);
      const resp = await postCode(user.student._id, code);
      switch (resp.type) {
        case PostCodeResponseType.COURSE_SIGNUP: {
          setCourse(resp.courseSignup);
          break;
        }
        default: {
          throw new Error('unrecognized response');
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
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

  if (course) {
    return (
      <Jumbotron>
        <Container className="justify-content-center">
          <h1>{t('CODE_VALIDATION.SUCCESS')}</h1>
          <p>{t('CODE_VALIDATION.COURSE_SIGNUP_SUCCESS')}</p>
          <Link className="nav-link" to={`/courses/${course.courseId}`}>{course.courseName || t('CODE_VALIDATION.GOTO_COURSE')}</Link>
        </Container>
      </Jumbotron>
    );
  }

  return (
    <Jumbotron>
      <Container className="justify-content-center">
        <Form>
          <Form.Label>{t('CODE_VALIDATION.CODE_VALIDATION')}</Form.Label>
          <Form.Control
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Form.Text><small>{t('CODE_VALIDATION.CAN_INPUT_ANY_KIND')}</small></Form.Text>
        </Form>
        <Button variant={error ? 'danger' : 'primary'} onClick={() => submitCode()}>{error ? t('CODE_VALIDATION.ERROR') : t('CODE_VALIDATION.SUBMIT')}</Button>
      </Container>
    </Jumbotron>
  );
}

export default CodeValidationComponent;
