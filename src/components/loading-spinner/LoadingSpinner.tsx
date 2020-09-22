import { Spinner, Container, Jumbotron } from 'react-bootstrap';
import React from 'react';

function LoadingSpinner(): JSX.Element {
  return (
    <Jumbotron>
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" />
      </Container>
    </Jumbotron>
  );
}

export default LoadingSpinner;
