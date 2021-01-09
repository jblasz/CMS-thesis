import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
  Button, Col, Container, Form, Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Article, IArticle } from '../../interfaces/article';
import { deleteArticle, getArticle, putArticle } from '../../services/api/articles.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';
import { EditorComponent } from '../editor/Editor';

export function AdminArticleComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  const [t] = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<IArticle>(Article({
    _id: '',
    en: { categoryMajor: '', categoryMinor: '', contents: '' },
    pl: { categoryMinor: '', contents: '', categoryMajor: '' },
  }));
  const [availableFrom, setAvailableFrom] = useState(false);

  const getAndSetArticle = useCallback(async () => {
    try {
      setLoading(true);
      const { article: _article } = await getArticle(id);

      setArticle(Article(_article));
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

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container>
      <Form>
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
                  setArticle(Article(article));
                }}
              />
            </Form.Group>
            <Form.Group controlId="minor en">
              <Form.Label>{t('ADMIN.ARTICLE.MINOR_EN')}</Form.Label>
              <Form.Control
                value={article.en.categoryMinor}
                onChange={(event) => {
                  article.en.categoryMinor = event.target.value;
                  setArticle(Article(article));
                }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="major pl">
              <Form.Label>{t('ADMIN.ARTICLE.MAJOR_PL')}</Form.Label>
              <Form.Control
                value={article.pl.categoryMajor}
                onChange={(event) => {
                  article.pl.categoryMajor = event.target.value;
                  setArticle(Article(article));
                }}
              />
            </Form.Group>
            <Form.Group controlId="minor pl">
              <Form.Label>{t('ADMIN.ARTICLE.MINOR_PL')}</Form.Label>
              <Form.Control
                value={article.pl.categoryMinor}
                onChange={(event) => {
                  article.pl.categoryMinor = event.target.value;
                  setArticle(Article(article));
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
                      setArticle(Article(article));
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
                      setArticle(Article(article));
                    }
                  }}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <EditorComponent
          text={article.en.contents}
          setText={(text) => {
            article.en.contents = text;
            setArticle(Article(article));
          }}
        />
        <EditorComponent
          text={article.pl.contents}
          setText={(text) => {
            article.pl.contents = text;
            setArticle(Article(article));
          }}
        />
      </Form>
    </Container>
  );
}
