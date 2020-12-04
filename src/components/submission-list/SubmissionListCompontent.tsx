import {
  faDownload, faUpload, faClipboard, faSave, faTrash, faExclamation, faSort,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import {
  Table, Row, Col, Collapse, Form, Button, InputGroup, Container, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SubmissionGrade, ISubmissionMeta } from '../../interfaces/resource';
import { patchSubmission, deleteSubmission } from '../../services/api/submissions.service';
import { formatDate } from '../../utils';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

interface SubmissionListComponentProps {
  submissions: ISubmissionMeta[]
  onSubmit: (submissions: ISubmissionMeta[]) => void
  onUpload: () => void
  skipStudentColumn: boolean
}

export function SubmissionListComponent(props: SubmissionListComponentProps): JSX.Element {
  const {
    submissions, skipStudentColumn, onSubmit, onUpload,
  } = props;
  const [t] = useTranslation();
  const [uncollapsedIndex, setUncollapsedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!submissions.length) {
    return (
      <Container>
        <h6>{t('ADMIN.SUBMISSIONS.NO_SUBMISSIONS')}</h6>
      </Container>
    );
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container>
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
                  className={style}
                  // onClick={() => {
                  //   if (index !== uncollapsedIndex) {
                  //     setUncollapsedIndex(index);
                  //   } else {
                  //     setUncollapsedIndex(-1);
                  //   }
                  // }}
                >
                  <td>
                    <Row>
                      <Col>
                        <Button
                          variant="light"
                          onClick={() => {
                            if (index !== uncollapsedIndex) {
                              setUncollapsedIndex(index);
                            } else {
                              setUncollapsedIndex(-1);
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faSort} />
                        </Button>
                      </Col>
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
                  // onClick={() => {
                  //   setUncollapsedIndex(index);
                  // }}
                >
                  <td>
                    <Collapse in={uncollapsedIndex === index}>
                      <div>
                        <Form.Row>
                          <Col md="auto" className="m-2 text-center">
                            <ButtonGroup>
                              {
                                !submission.final
                                  ? (
                                    <Button title={t('ADMIN.SUBMISSIONS.NOT_FINAL')} disabled>
                                      <FontAwesomeIcon icon={faExclamation} />
                                    </Button>
                                  )
                                  : <></>
                              }
                              <Button><FontAwesomeIcon icon={faDownload} /></Button>
                              <Button><FontAwesomeIcon icon={faUpload} /></Button>
                              <Button title={t('ADMIN.SUBMISSIONS.COPY_LINK_TO_CLIPBOARD')}>
                                <FontAwesomeIcon
                                  icon={faClipboard}
                                  onClick={() => {
                                    navigator.clipboard.writeText('a link will exist here');
                                  }}
                                />
                              </Button>
                            </ButtonGroup>
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
                                <Button
                                  className="px-2 py-0"
                                  onClick={async () => {
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
                          <Col md="auto" className="m-2 center-block float-right">
                            <Button
                              className="float-right"
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
