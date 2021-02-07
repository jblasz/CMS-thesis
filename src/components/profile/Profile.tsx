import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  Button, Card, Container, Form, FormControl, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { Student } from '../../interfaces/student';
import { getProfile, patchProfile } from '../../services/api/profile.service';
import { AppContext } from '../../services/contexts/app-context';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

function ProfileComponent() {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState<Student>(new Student());
  const { user } = useContext(AppContext);

  const getAndSetAll = useCallback(async () => {
    try {
      setLoading(true);
      const { student: _student } = await getProfile((user && user.student && user.student._id) || '');
      setStudent(_student);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getAndSetAll();
  }, [getAndSetAll]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  if (!user) {
    return <Redirect to="/404" />;
  }

  return (
    <Container>
      <Card>
        <Card.Header>
          {t('STUDENT.PROFILE.PROFILE')}
        </Card.Header>
        <Card.Body>
          <div className="box-wrapper">
            <div className="box">
              <div className="box-inner">
                <Form>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <FormControl
                        type="text"
                        onChange={(e) => {
                          student.name = e.target.value;
                          setStudent(new Student(student));
                        }}
                        value={student.name}
                      />
                    </InputGroup.Prepend>
                    <InputGroup.Text>
                      {t('STUDENT.PROFILE.NAME')}
                    </InputGroup.Text>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <FormControl
                        type="text"
                        disabled
                        value={student.email}
                      />
                    </InputGroup.Prepend>
                    <InputGroup.Text>
                      {t('STUDENT.PROFILE.EMAIL')}
                    </InputGroup.Text>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <FormControl
                        type="text"
                        onChange={(e) => {
                          student.contactEmail = e.target.value;
                          setStudent(new Student(student));
                        }}
                        value={student.contactEmail}
                      />
                    </InputGroup.Prepend>
                    <InputGroup.Text>
                      {t('STUDENT.PROFILE.CONTACT_EMAIL')}
                    </InputGroup.Text>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <FormControl
                        type="text"
                        onChange={(e) => {
                          student.usosId = e.target.value;
                          setStudent(new Student(student));
                        }}
                        value={student.usosId}
                      />
                    </InputGroup.Prepend>
                    <InputGroup.Text>
                      {t('STUDENT.PROFILE.USOSID')}
                    </InputGroup.Text>
                  </InputGroup>
                  <InputGroup>
                    <Button onClick={async () => {
                      try {
                        setLoading(true);
                        await patchProfile({
                          contactEmail: student.contactEmail || '',
                          name: student.name || '',
                          usosId: student.usosId || '',
                          studentID: student._id || '',
                        });
                        await getAndSetAll();
                      } catch (e) {
                        setError(e);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    >
                      {t('STUDENT.PROFILE.SAVE_CHANGES')}
                    </Button>
                  </InputGroup>
                  <i>
                    {t('STUDENT.PROFILE.DISCLAIMER')}
                  </i>
                </Form>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfileComponent;
