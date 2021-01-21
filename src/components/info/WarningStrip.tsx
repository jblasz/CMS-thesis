import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

interface WarningStripComponentProps {
  error: string
}

interface WarningStripComponentExtProps extends WarningStripComponentProps {
  warning: boolean
}

export function WarningStripComponent(
  props: WarningStripComponentExtProps | WarningStripComponentProps,
): JSX.Element {
  const { error, warning = false } = props as WarningStripComponentExtProps;

  const [{ hidden, hiddenFor }, setHidden] = useState({ hidden: false, hiddenFor: '' });
  if (error && !warning) {
    console.error(error);
  }
  return (
    error ? (
      <Row className={`justify-content-center row-auto wrapper my-2 ${hidden && hiddenFor === error ? 'hide' : ''}`}>
        <Col className={`col-auto error-strip ${warning ? 'warning' : ''}`}>
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
