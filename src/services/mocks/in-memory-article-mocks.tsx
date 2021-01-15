import { v4 } from 'uuid';
import {
  IApiPostResponse, IGetArticleResponse, IGetArticlesResponse, IPutArticleResponse,
} from '../../interfaces/api';
import {
  Article, ArticleMeta, IArticle, IArticleMeta,
} from '../../interfaces/article';
import { getIMArticles, setIMArticles } from './in-memory-database';

export function getArticlesMockResponse(): Promise<IGetArticlesResponse> {
  return Promise.resolve({
    articles: getIMArticles().map((x): IArticleMeta => (ArticleMeta(x))),
  });
}

export function getArticleMockResponse(id: string): Promise<IGetArticleResponse> {
  const a = getIMArticles().find((x) => x._id === id);
  if (!a) {
    throw new Error('404 not found');
  }
  return Promise.resolve({
    article: Article(a),
  });
}

export async function putArticleMockResponse(
  id: string, article: IArticle,
): Promise<IPutArticleResponse> {
  const articles = getIMArticles();
  if (id) {
    const i = articles.findIndex((x) => x._id === id);
    if (i < 0) {
      throw new Error('404 not found');
    }
    articles[i] = Article(article);
  } else {
    articles.push(Article({
      ...article,
      _id: v4(),
    }));
  }
  setIMArticles(articles);
  return Promise.resolve({
    ok: true,
    article,
  });
}

export async function deleteArticleMockResponse(
  id: string,
): Promise<IApiPostResponse> {
  const articles = getIMArticles();
  if (id) {
    const i = articles.findIndex((x) => x._id === id);
    if (i < 0) {
      throw new Error('404 not found');
    }
    articles.splice(i, 1);
    setIMArticles(articles);
  } else {
    throw new Error('404 not found');
  }
  return Promise.resolve({
    ok: true,
  });
}
