import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button, Col, Form, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Article } from '../../interfaces/article';
import { deleteArticle, getArticle, putArticle } from '../../services/api/articles.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

export function AdminArticleComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  const [t] = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<Article>(new Article());
  const [availableFrom, setAvailableFrom] = useState(false);

  const getAndSetArticle = useCallback(async () => {
    try {
      setLoading(true);
      const { article: _article } = await getArticle(id);
      setArticle(new Article(_article));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getAndSetArticle();
  }, [getAndSetArticle]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Form>
      <WarningStripComponent error={error} />
      <Row className="justify-content-between">
        <Button onClick={async () => {
          try {
            setLoading(true);
            await putArticle(id, article);
            await getAndSetArticle();
          } catch (e) {
            setError(e);
          } finally {
            setLoading(false);
          }
        }}
        >
          {t('ADMIN.ARTICLE.SUBMIT')}
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            try {
              setLoading(true);
              await deleteArticle(id);
              await getAndSetArticle();
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
      <Row>
        <Col>
          <Form.Group controlId="major en">
            <Form.Label>{t('ADMIN.ARTICLE.MAJOR_EN')}</Form.Label>
            <Form.Control
              value={article.en.categoryMajor}
              onChange={(event) => {
                article.en.categoryMajor = event.target.value;
              }}
            />
          </Form.Group>
          <Form.Group controlId="minor en">
            <Form.Label>{t('ADMIN.ARTICLE.MINOR_EN')}</Form.Label>
            <Form.Control
              value={article.en.categoryMinor}
              onChange={(event) => {
                article.en.categoryMinor = event.target.value;
              }}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="major pl">
            <Form.Label>{t('ADMIN.ARTICLE.MAJOR_PL')}</Form.Label>
            <Form.Control
              value={article.en.categoryMajor}
              onChange={(event) => {
                article.en.categoryMajor = event.target.value;
              }}
            />
          </Form.Group>
          <Form.Group controlId="minor pl">
            <Form.Label>{t('ADMIN.ARTICLE.MINOR_PL')}</Form.Label>
            <Form.Control
              value={article.pl.categoryMinor}
              onChange={(event) => {
                article.pl.categoryMinor = event.target.value;
              }}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="availableFrom">
            <Form.Label>{t('ADMIN.ARTICLE.AVAILABLE_FROM')}</Form.Label>
            <div>
              <BootstrapSwitchButton
                width={100}
                checked={availableFrom}
                onlabel={t('ADMIN.ARTICLE.LIMITED_AVAILABILITY')}
                offlabel={t('ADMIN.ARTICLE.NO_LIMITED_AVAILABILITY')}
                onChange={() => {
                  setAvailableFrom(!availableFrom);
                  if (!availableFrom) {
                    delete article.availableFrom;
                    setArticle(new Article(article));
                  }
                }}
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('ADMIN.ARTICLE.AVAILABLE_FROM')}</Form.Label>
            <div>
              <DatePicker
                value={(article.availableFrom && article.availableFrom.toISOString()) || ''}
                disabled={!availableFrom}
                onChange={(date) => {
                  if (date instanceof Date) {
                    article.availableFrom = new Date(date);
                    setArticle(new Article(article));
                  }
                }}
              />
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="contents en">
        <Form.Label>{t('ADMIN.ARTICLE.CONTENTS_EN')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={article.en.contents}
          onChange={(event) => {
            article.en.contents = event.target.value;
            setArticle(new Article(article));
          }}
        />
      </Form.Group>
      <Form.Group controlId="contents pl">
        <Form.Label>{t('ADMIN.ARTICLE.CONTENTS_PL')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={article.pl.contents}
          onChange={(event) => {
            article.pl.contents = event.target.value;
            setArticle(new Article(article));
          }}
        />
      </Form.Group>
    </Form>
  );
}
