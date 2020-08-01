import { Spinner, Container, Jumbotron } from "react-bootstrap"
import React from "react"
// import { useTranslation } from "react-i18next";

function LoadingSpinner(): JSX.Element {
  // const [t] = useTranslation();

  return (
    <Jumbotron>
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" />
      </Container>
    </Jumbotron>
  )
}

export default LoadingSpinner