import {
  ApiPostResponse, Article, GetArticleResponse, GetArticlesResponse, PutArticleResponse,
} from '../../interfaces/api';
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
  return getArticlesMockResponse();
}

/**
 * /articles/:id GET
 */
export async function getArticle(id: string): Promise<GetArticleResponse> {
  return getArticleMockResponse(id);
}

/**
 * /articles/:id PUT
 */
export async function putArticle(id: string, article: Article): Promise<PutArticleResponse> {
  return putArticleMockResponse(id, article);
}

/**
 * /articles/:id DELETE
 */
export async function deleteArticle(id: string): Promise<ApiPostResponse> {
  return deleteArticleMockResponse(id);
}
