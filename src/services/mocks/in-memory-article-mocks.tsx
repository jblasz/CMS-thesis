import {
  IApiPostResponse, IGetArticleResponse, IGetArticlesResponse, IPutArticleResponse,
} from '../../interfaces/api';
import { IArticle } from '../../interfaces/article';

export function getArticlesMockResponse(): Promise<IGetArticlesResponse> {
  return Promise.resolve({
    articles: [
      {
        _id: 'id0',
        en: {
          categoryMajor: 'majorCat0en',
          categoryMinor: '',
        },
        pl: {
          categoryMajor: 'majorCat0pl',
          categoryMinor: '',
        },
      },
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

export function getArticleMockResponse(id: string): Promise<IGetArticleResponse> {
  return Promise.resolve({
    article: {
      _id: id,
      en: {
        categoryMajor: 'catMajor',
        categoryMinor: 'catMinor',
        contents: 'An <h3>article!</h3> <br/> With <b>html</b>! English version! A <a href="http://www.google.com">link</a>!',
      },
      pl: {
        categoryMajor: 'catMajor',
        categoryMinor: 'catMinor',
        contents: 'An <h3>article!</h3> <br/> With <b>html</b>! Polish version! A <a href="http://www.google.com">link</a>!',
      },
    },
  });
}

export async function putArticleMockResponse(
  id: string, article: IArticle,
): Promise<IPutArticleResponse> {
  return Promise.resolve({
    ok: true,
    article,
  });
}

export async function deleteArticleMockResponse(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id: string,
): Promise<IApiPostResponse> {
  return Promise.resolve({
    ok: true,
  });
}
