import {
  ApiPostResponse, GetArticleResponse, GetArticlesResponse, PutArticleResponse,
} from '../../interfaces/api';
import { Article, ArticleMeta, IArticle } from '../../interfaces/article';
import {
  deleteArticleMockResponse,
  getArticleMockResponse,
  getArticlesMockResponse,
  putArticleMockResponse,
} from '../mocks/in-memory-article-mocks';

/**
 * /articles GET
 */
export async function getArticles(): Promise<GetArticlesResponse> {
  const { articles } = await getArticlesMockResponse();
  return { articles: articles.map((x) => ArticleMeta(x)) };
}

/**
 * /articles/:id GET
 */
export async function getArticle(id: string): Promise<GetArticleResponse> {
  const { article } = await getArticleMockResponse(id);
  return { article: Article(article) };
}

/**
 * /articles/:id PUT
 */
export async function putArticle(id: string, article: IArticle): Promise<PutArticleResponse> {
  return putArticleMockResponse(id, article);
}

/**
 * /articles/:id DELETE
 */
export async function deleteArticle(id: string): Promise<ApiPostResponse> {
  return deleteArticleMockResponse(id);
}
