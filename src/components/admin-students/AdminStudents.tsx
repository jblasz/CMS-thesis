import React, { useState, useEffect } from 'react';
import {
  Container, Table,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Student } from '../../interfaces/student';
import { getAdminUsers } from '../../services/api/user.service';
import { formatDate } from '../../utils';

function AdminStudentsComponent(): JSX.Element {
  const [t] = useTranslation();

  const [students, setStudents] = useState<Student[]>([]);

  const getAndSetStudents = async () => {
    setStudents((await getAdminUsers()).students.map((x) => new Student(x)));
  };

  useEffect(() => {
    getAndSetStudents();
  }, []);

  return (
    <Container>
      <Table responsive>
        <thead>
          <tr>
            <th>{t('ADMIN.STUDENTS.NAME')}</th>
            <th>{t('ADMIN.STUDENTS.EMAIL')}</th>
            <th>{t('ADMIN.STUDENTS.USOSID')}</th>
            <th>{t('ADMIN.STUDENTS.REGISTEREDAT')}</th>
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
                {student.usosId}
              </td>
              <td>
                {(student.registeredAt && formatDate(student.registeredAt)) || ''}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminStudentsComponent;
