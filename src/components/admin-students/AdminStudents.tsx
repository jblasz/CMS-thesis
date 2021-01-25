import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Container, Table,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Student } from '../../interfaces/student';
import { deleteAdminUser, getAdminUsers } from '../../services/api/user.service';
import { formatDate } from '../../utils';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

function AdminStudentsComponent(): JSX.Element {
  const [t] = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  const getAndSetStudents = async () => {
    try {
      setLoading(true);
      setStudents((await getAdminUsers()).students.map((x) => new Student(x)));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAndSetStudents();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container>
      <Table responsive>
        <thead>
          <tr>
            <th>{t('ADMIN.STUDENTS.NAME')}</th>
            <th>{t('ADMIN.STUDENTS.EMAIL')}</th>
            <th>{t('ADMIN.STUDENTS.USOSID')}</th>
            <th>{t('ADMIN.STUDENTS.REGISTEREDAT')}</th>
            <th>{' '}</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>
                <Link to={`/admin/students/${student._id}`}>
                  {student.name || student._id}
                </Link>
              </td>
              <td>
                {student.email}
              </td>
              <td>
                {student.usosID}
              </td>
              <td>
                {(student.registeredAt && formatDate(student.registeredAt)) || ''}
              </td>
              <td>
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await deleteAdminUser(student._id);
                      await getAndSetStudents();
                    } catch (e) {
                      setError(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminStudentsComponent;
