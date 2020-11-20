import React, { useCallback, useEffect, useState } from 'react';
import {
  Button, Container, Form, FormControl, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Student } from '../../interfaces/student';
import { getUser } from '../../services/api/user.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

function ProfileComponent() {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState<Student>(new Student());

  const getAndSetAll = useCallback(async () => {
    try {
      setLoading(true);
      const { user: _student } = await getUser();
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

  return (
    <Container>
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
            {t('ADMIN.STUDENT.NAME')}
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
            {t('ADMIN.STUDENT.EMAIL')}
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
            {t('ADMIN.STUDENT.USOSID')}
          </InputGroup.Text>
        </InputGroup>
        <InputGroup>
          <Button>
            {t('ADMIN.STUDENT.SAVE_CHANGES')}
          </Button>
        </InputGroup>
      </Form>
    </Container>
  );
}

export default ProfileComponent;
