import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

export function WarningStripComponent(props: {error: string}): JSX.Element {
  const { error } = props;
  const [{ hidden, hiddenFor }, setHidden] = useState({ hidden: false, hiddenFor: '' });
  if (error) {
    console.error({ error });
  }
  return (
    error ? (
      <Row className={`justify-content-center row-auto wrapper my-2 ${hidden && hiddenFor === error ? 'hide' : ''}`}>
        <Col className="col-auto error-strip">
          <Row className="row-auto p-2">
            <p className="mr-2">{`${error}`}</p>
            <div className="float-right">
              <Button
                className="close-button"
                onClick={() => {
                  setHidden({
                    hidden: true,
                    hiddenFor: error,
                  });
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
          </Row>
        </Col>
      </Row>
    ) : <></>
  );
}
