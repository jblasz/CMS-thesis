import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  useCallback, useEffect, useState,
} from 'react';
import {
  Button, Col, Container, ListGroup, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IArticleMeta } from '../../interfaces/article';
import { deleteArticle, getArticles, putArticle } from '../../services/api/articles.service';
import { formatDate } from '../../utils';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

export function AdminArticlesComponent(): JSX.Element {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [articles, setArticles] = useState<IArticleMeta[]>([]);

  const getAndSetHeaders = useCallback(async () => {
    try {
      setLoading(true);
      const { articles: _articles } = await getArticles();
      setArticles(_articles);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAndSetHeaders();
  }, [getAndSetHeaders]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container>
      <ListGroup>
        {articles.map((x) => (
          <ListGroup.Item key={x._id}>
            <Row>
              <Col>
                <Link to={`/admin/articles/${x._id}`}>{`${x.en.categoryMajor} - ${x.en.categoryMinor}`}</Link>
              </Col>
              <Col>
                <Link to={`/admin/articles/${x._id}`}>{`${x.pl.categoryMajor} - ${x.pl.categoryMinor}`}</Link>
              </Col>
              <Col>
                {x.availableFrom ? formatDate(x.availableFrom, true) : ''}
              </Col>
              <Col>
                <Button onClick={async () => {
                  try {
                    setLoading(true);
                    await deleteArticle(x._id);
                    await getAndSetHeaders();
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
            </Row>
          </ListGroup.Item>
        ))}
        <ListGroup.Item>
          <Button onClick={async () => {
            try {
              setLoading(true);
              await putArticle('', {
                _id: '',
                en: {
                  categoryMajor: 'placeholder',
                  categoryMinor: 'placeholder',
                  contents: '',
                },
                pl: {
                  categoryMajor: 'placeholder',
                  categoryMinor: 'placeholder',
                  contents: '',
                },
              });
              await getAndSetHeaders();
            } catch (e) {
              setError(e);
            } finally {
              setLoading(false);
            }
          }}
          >
            {t('ADMIN.ARTICLES.CREATE_ARTICLE')}
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Container>
  );
}
