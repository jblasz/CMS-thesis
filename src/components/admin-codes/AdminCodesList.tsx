import { faClipboard, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Code } from '../../interfaces/code';
import { deleteCode } from '../../services/api/codes.service';
import { formatDate } from '../../utils';
import { LoadingSpinner } from '../loading-spinner';

interface AdminCodesListComponentProps {
  codes: Code[]
}

export function AdminCodesListComponent(props: AdminCodesListComponentProps): JSX.Element {
  const { codes } = props;
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {error ? (
        <Row className="error-strip">
          {`${t('COMMON.ERROR')}: ${error}`}
        </Row>
      ) : ''}
      <Table className="table-sm">
        <thead>
          <tr>
            <th>
              {t('ADMIN.CODES.VALID_THROUGH')}
            </th>
            <th>
              {t('ADMIN.CODES.USED_BY')}
            </th>
            <th>
              {' '}
            </th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code._id}>
              <td>
                {`${formatDate(code.validThrough, true)}, ${code.valid ? t('ADMIN.CODES.ACTIVE') : t('ADMIN.CODES.INACTIVE')}`}
              </td>
              <td>
                {code.usedBy.length}
              </td>
              <td>
                <Row>
                  <Button variant="secondary" className="mx-2" title={t('ADMIN.CODES.COPY_LINK_TO_CLIPBOARD')}>
                    <FontAwesomeIcon
                      icon={faClipboard}
                      onClick={() => {
                        navigator.clipboard.writeText(code._id);
                      }}
                    />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await deleteCode(code._id);
                        codes.splice(codes.findIndex((x) => x._id === code._id), 1);
                      } catch (e) {
                        setError(e);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </Row>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
