import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function AdminCourseGroupComponent(): JSX.Element {
  const { groupID } = useParams();

  return (
    <Container>
      Course group details view for
      {' '}
      {groupID}
    </Container>
  );
}

export default AdminCourseGroupComponent;
