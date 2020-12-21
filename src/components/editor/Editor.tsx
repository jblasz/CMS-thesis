/* eslint-disable react/no-danger */
import { faEye, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Editor } from 'react-draft-wysiwyg';
import {
  convertToRaw, EditorState, ContentState,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { useState } from 'react';
import {
  Button, ButtonGroup, Col, Container, Form, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface EditorComponentProps {
  text: string
  setText: (text: string) => void
}

export function EditorComponent(props: EditorComponentProps) {
  const { text, setText } = props;
  const draft = htmlToDraft(text);
  const [editorState, setEditorState] = useState(EditorState.createWithContent(
    ContentState.createFromBlockArray(draft.contentBlocks, draft.entityMap),
  ));
  const [viewRaw, setViewRaw] = useState(false);
  const [t] = useTranslation();
  return (
    <Container>
      <Row>
        <Col className="border">
          <Form.Group controlId="contents pl">
            <Editor
              editorState={editorState}
              onEditorStateChange={(event) => {
                setEditorState(event);
                setText(draftToHtml(convertToRaw(editorState.getCurrentContent())));
              }}
            />
          </Form.Group>
        </Col>
        <Col className="border">
          <ButtonGroup>
            <Button onClick={() => {
              setViewRaw(!viewRaw);
            }}
            >
              <FontAwesomeIcon icon={faEye} />
            </Button>
            <Button onClick={() => {
              setText(draftToHtml(convertToRaw(editorState.getCurrentContent())));
            }}
            >
              <FontAwesomeIcon icon={faRedo} />
            </Button>
          </ButtonGroup>
          {viewRaw
            ? (
              <>
                <p>{t('ADMIN.EDITOR.PREVIEW_RAW')}</p>
                <p>
                  {text}
                </p>
              </>
            )
            : (
              <>
                <p>{t('ADMIN.EDITOR.PREVIEW')}</p>
                <div dangerouslySetInnerHTML={{ __html: text || '' }} />
              </>
            )}
        </Col>
      </Row>
    </Container>
  );
}
