import { config } from '../../config';
import {
  IApiPostResponse, IGetArticleResponse, IGetArticlesResponse, IPutArticleResponse,
} from '../../interfaces/api';
import { Article, ArticleMeta, IArticle } from '../../interfaces/article';
import {
  deleteArticleMockResponse,
  getArticleMockResponse,
  getArticlesMockResponse,
  putArticleMockResponse,
} from '../mocks/in-memory-article-mocks';
import { axiosInstance } from './request.service';

/**
 * /public/articles GET
 */
export async function getArticles(): Promise<IGetArticlesResponse> {
  if (config.useMocks) {
    const { articles } = await getArticlesMockResponse();
    return { articles: articles.map((x) => ArticleMeta(x)) };
  }
  const { articles } = (await axiosInstance.get('/public/articles')).data as IGetArticlesResponse;
  return { articles: articles.map((x) => ArticleMeta(x)) };
}

/**
 * /articles GET
 */
export async function getAdminArticles(): Promise<IGetArticlesResponse> {
  if (config.useMocks) {
    const { articles } = await getArticlesMockResponse();
    return { articles: articles.map((x) => ArticleMeta(x)) };
  }
  const { articles } = (await axiosInstance.get('/articles')).data as IGetArticlesResponse;
  return { articles: articles.map((x) => ArticleMeta(x)) };
}

/**
 * /public/articles/:id GET
 */
export async function getArticle(id: string): Promise<IGetArticleResponse> {
  if (config.useMocks) {
    const { article } = await getArticleMockResponse(id);
    return { article: Article(article) };
  }
  const { article } = (await axiosInstance.get(`/public/articles/${id}`)).data as IGetArticleResponse;
  return { article: Article(article) };
}

/**
 * /articles/:id GET
 */
export async function getAdminArticle(id: string): Promise<IGetArticleResponse> {
  if (config.useMocks) {
    const { article } = await getArticleMockResponse(id);
    return { article: Article(article) };
  }
  const { article } = (await axiosInstance.get(`/articles/${id}`)).data as IGetArticleResponse;
  return { article: Article(article) };
}

/**
 * /articles/:id PUT
 */
export async function putArticle(id: string, article: IArticle): Promise<IPutArticleResponse> {
  if (config.useMocks) {
    return putArticleMockResponse(id, article);
  }
  const { ok, article: _article } = (await axiosInstance.put(`/articles/${id}`, article)).data as IPutArticleResponse;
  return { ok, article: Article(_article) };
}

/**
 * /articles/:id DELETE
 */
export async function deleteArticle(id: string): Promise<IApiPostResponse> {
  if (config.useMocks) {
    return deleteArticleMockResponse(id);
  }
  const { ok } = (await axiosInstance.delete(`/articles/${id}`)).data as IApiPostResponse;
  return { ok };
}
