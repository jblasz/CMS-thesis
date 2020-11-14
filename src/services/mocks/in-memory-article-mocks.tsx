import { loremIpsum } from 'lorem-ipsum';
import {
  ApiPostResponse, GetArticleResponse, GetArticlesResponse, PutArticleResponse,
} from '../../interfaces/api';
import { IArticle } from '../../interfaces/article';

export function getArticlesMockResponse(): Promise<GetArticlesResponse> {
  return Promise.resolve({
    articles: [
      {
        _id: 'id1',
        en: {
          categoryMajor: 'majorCat1en',
          categoryMinor: 'minorCat1en',
        },
        pl: {
          categoryMajor: 'majorCat1pl',
          categoryMinor: 'minorCat1pl',
        },
      },
      {
        _id: 'id2',
        en: {
          categoryMajor: 'majorCat1en',
          categoryMinor: 'minorCat2en',
        },
        pl: {
          categoryMajor: 'majorCat1pl',
          categoryMinor: 'minorCat2pl',
        },
      },
      {
        _id: 'id3',
        en: {
          categoryMajor: 'majorCat2en',
          categoryMinor: 'minorCat3en',
        },
        pl: {
          categoryMajor: 'majorCat2pl',
          categoryMinor: 'minorCat3pl',
        },
      },
    ],
  });
}

export function getArticleMockResponse(id: string): Promise<GetArticleResponse> {
  return Promise.resolve({
    article: {
      _id: id,
      en: {
        categoryMajor: 'catMajor',
        categoryMinor: 'catMinor',
        contents: loremIpsum({ count: 5 }),
      },
      pl: {
        categoryMajor: 'catMajor',
        categoryMinor: 'catMinor',
        contents: loremIpsum({ count: 5 }),
      },
    },
  });
}

export async function putArticleMockResponse(
  id: string, article: IArticle,
): Promise<PutArticleResponse> {
  return Promise.resolve({
    ok: true,
    article,
  });
}

export async function deleteArticleMockResponse(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id: string,
): Promise<ApiPostResponse> {
  return Promise.resolve({
    ok: true,
  });
}
