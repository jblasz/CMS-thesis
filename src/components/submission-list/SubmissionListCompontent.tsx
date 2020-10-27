import {
  faDownload, faUpload, faClipboard, faSave, faTrash, faExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import {
  Table, Row, Col, Collapse, Form, Button, InputGroup, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SubmissionGrade, SubmissionMeta } from '../../interfaces/resource';
import { patchSubmission, deleteSubmission } from '../../services/api/submissions.service';
import { formatDate } from '../../utils';
import { LoadingSpinner } from '../loading-spinner';

interface SubmissionListComponentsProps {
  submissions: SubmissionMeta[]
  onSubmit: (submissions: SubmissionMeta[]) => void
  onUpload: () => void
  skipStudentColumn: boolean
}

export function SubmissionListComponents(props: SubmissionListComponentsProps): JSX.Element {
  const {
    submissions, skipStudentColumn, onSubmit, onUpload,
  } = props;
  const [t] = useTranslation();
  const [uncollapsedIndex, setUncollapsedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Row>
        {error ? (
          <Row className="error-strip">{`${t('COMMON.ERROR')}: ${error}`}</Row>
        ) : (
          ''
        )}
      </Row>
      <Table className="table-sm">
        <thead>
          <tr>
            <th>{t('ADMIN.SUBMISSIONS.HEADER')}</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => {
            const style = !submission.final
              ? 'table-secondary'
              : !submission.grade
                ? 'table-info'
                : submission.grade === SubmissionGrade.F
                  ? 'table-danger'
                  : 'table-success';
            return (
              <Fragment key={submission._id}>
                <tr
                  className={`clickable-row ${style}`}
                  onClick={() => {
                    if (index !== uncollapsedIndex) {
                      setUncollapsedIndex(index);
                    } else {
                      setUncollapsedIndex(-1);
                    }
                  }}
                >
                  <td>
                    <Row>
                      {skipStudentColumn ? '' : (
                        <Col>
                          <Link className="nav-link" to={`/admin/students/${submission.submittedBy._id}`}>
                            {submission.submittedBy.name}
                          </Link>
                        </Col>
                      )}
                      <Col>
                        <Link className="nav-link" to={`/admin/courses/${submission.forCourseID}`}>
                          {submission.forCourseName}
                        </Link>
                      </Col>
                      <Col>
                        <Link className="nav-link" to={`/admin/courses/${submission.forCourseID}/laboratory/${submission.forLabID}`}>
                          {submission.forLabName}
                        </Link>
                      </Col>
                      <Col>
                        <Link className="nav-link" to={`/admin/courses/${submission.forCourseID}/group/${submission.forGroupID}`}>
                          {submission.forGroupName}
                        </Link>
                      </Col>
                      <Col>
                        <p className="nav-link">
                          {formatDate(submission.submittedAt, true)}
                        </p>
                      </Col>
                    </Row>
                  </td>
                </tr>
                <tr
                  className="hide-row"
                  onClick={() => {
                    setUncollapsedIndex(index);
                  }}
                >
                  <td>
                    <Collapse in={uncollapsedIndex === index}>
                      <div>
                        <Form.Row>
                          <Col md="auto" className="m-2 text-center">
                            {
                              !submission.final
                                ? (
                                  <Button className="mx-2" title={t('ADMIN.SUBMISSIONS.NOT_FINAL')} disabled>
                                    <FontAwesomeIcon icon={faExclamation} />
                                  </Button>
                                )
                                : ''
                            }
                            <Button className="mx-2"><FontAwesomeIcon icon={faDownload} /></Button>
                            <Button className="mx-2"><FontAwesomeIcon icon={faUpload} /></Button>
                            <Button className="mx-2" title={t('ADMIN.SUBMISSIONS.COPY_LINK_TO_CLIPBOARD')}>
                              <FontAwesomeIcon
                                icon={faClipboard}
                                onClick={() => {
                                  navigator.clipboard.writeText('a link will exist here');
                                }}
                              />
                            </Button>
                          </Col>
                          <Col md="auto" className="m-2 text-center" style={{ maxWidth: 400 }}>
                            <InputGroup className="mx-2">
                              <InputGroup.Prepend>
                                <InputGroup.Text>
                                  {t('ADMIN.SUBMISSIONS.GRADE')}
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                value={submission.grade}
                                as="select"
                                onChange={(event) => {
                                  submission.grade = event.target.value as SubmissionGrade;
                                  onSubmit([...submissions]);
                                }}
                              >
                                <option value={undefined}>{' '}</option>
                                <option value={SubmissionGrade.A}>{SubmissionGrade.A}</option>
                                <option value={SubmissionGrade.B_PLUS}>
                                  {SubmissionGrade.B_PLUS}
                                </option>
                                <option value={SubmissionGrade.B}>{SubmissionGrade.B}</option>
                                <option value={SubmissionGrade.C_PLUS}>
                                  {SubmissionGrade.C_PLUS}
                                </option>
                                <option value={SubmissionGrade.C}>{SubmissionGrade.C}</option>
                                <option value={SubmissionGrade.F}>{SubmissionGrade.F}</option>
                              </Form.Control>
                              <InputGroup.Append>
                                <Button onClick={async () => {
                                  try {
                                    setLoading(true);
                                    await patchSubmission(
                                      submission,
                                    );
                                    onUpload();
                                  } catch (e) {
                                    setError(e);
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                                >
                                  <FontAwesomeIcon icon={faSave} />
                                </Button>
                              </InputGroup.Append>
                            </InputGroup>
                          </Col>
                          <Col md="auto" className="m-2 center-block">
                            <Button
                              className="mx-2"
                              variant="danger"
                              onClick={async () => {
                                try {
                                  setLoading(true);
                                  await deleteSubmission(submission._id);
                                  onUpload();
                                } catch (e) {
                                  setError(e);
                                } finally {
                                  setLoading(false);
                                }
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </Col>
                        </Form.Row>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
