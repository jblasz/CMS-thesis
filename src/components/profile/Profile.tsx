import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  Button, Card, Container, Form, FormControl, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { Student } from '../../interfaces/student';
import { patchStudent } from '../../services/api/students.service';
import { getUser } from '../../services/api/user.service';
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
      const { student: _student } = await getUser();
      setStudent(_student);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAndSetAll();
  }, [getAndSetAll]);

  if (loading) {
    return <LoadingSpinner />;
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
                <WarningStripComponent error={error} />
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
                        onChange={(e) => {
                          student.email = e.target.value;
                          setStudent(new Student(student));
                        }}
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
                        const { student: _student } = await patchStudent(student._id, {
                          contactEmail: student.contactEmail || '',
                          name: student.name || '',
                          usosId: student.usosId || '',
                        });
                        setStudent(new Student(_student));
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
