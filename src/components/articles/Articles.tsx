import React, { useCallback, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { IArticle } from '../../interfaces/article';
import { getArticle } from '../../services/api/articles.service';
import { WarningStripComponent } from '../info/WarningStrip';
import { LoadingSpinner } from '../loading-spinner';

function ArticlesComponent(): JSX.Element {
  const { id } = useParams<{id: string}>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [article, setArticle] = useState<IArticle>();
  const [, { language }] = useTranslation();

  const loadArticle = useCallback(async () => {
    try {
      setLoading(true);
      const { article: _article } = await getArticle(id);
      setArticle(_article);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <WarningStripComponent error={error} />;
  }

  return (
    <Container>
      <div
        className="text-center"
        // eslint-disable-next-line react/no-danger-with-children, react/no-danger
        dangerouslySetInnerHTML={{ __html: `<div>${(article && (language === 'en' ? article.en.contents : article.pl.contents)) || ''}</div>` }}
      />
    </Container>
  );
}

export default ArticlesComponent;
