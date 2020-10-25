import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function AdminSubmissionComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  return (
    <Container>
      Admin submission component for
      {' '}
      {id}
    </Container>
  );
}

export default AdminSubmissionComponent;
