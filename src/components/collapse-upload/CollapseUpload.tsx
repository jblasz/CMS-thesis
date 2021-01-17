import React, { useState } from 'react';
import {
  Button, Col, Collapse, Form, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

interface CollapseUploadComponentProps {
  uncollapsed: boolean
  onUpload: (data: FormData, note: string) => void
}

export function CollapseUploadComponent(props: CollapseUploadComponentProps) {
  const { uncollapsed, onUpload } = props;
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<FormData>();
  const [t] = useTranslation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Collapse in={uncollapsed}>
      <Form className="m-2">
        <InputGroup className="mx-2">
          <Form.Row>
            <Col className="col-xs-8">
              <input
                className="m-2 p-1"
                type="file"
                name="file"
                onChange={(event) => {
                  if (event && event.target && event.target.files && event.target.files[0]) {
                    const f = new FormData();
                    f.append('file', event.target.files[0]);
                    setFile(f);
                  }
                }}
              />
            </Col>
            <Col className="col-xs-4">
              <Button
                disabled={!file}
                className="button btn-primary m-2"
                onClick={async (event) => {
                  try {
                    if (!file) {
                      return;
                    }
                    setLoading(true);
                    event.preventDefault();
                    onUpload(file, note);
                  } catch (e) {
                    setError(e);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {t('STUDENT.DASHBOARD.CONFIRM_UPLOAD')}
              </Button>
            </Col>
          </Form.Row>
          <Form.Row>
            <Form.Control
              as="textarea"
              rows={3}
              value={note}
              onChange={(event) => {
                event.preventDefault();
                setNote(event.target.value);
              }}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>
              {t('STUDENT.DASHBOARD.CHANGE_NOTE')}
            </Form.Label>
          </Form.Row>
        </InputGroup>
      </Form>
    </Collapse>
  );
}
