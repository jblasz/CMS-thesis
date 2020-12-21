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
        contents: '<h3>An <strong>article</strong>!<br>With <em>html!</em>&nbsp;</h3> <ul> <li>English version!&nbsp;</li> <li>A <a href="http://www.google.com" target="_self">link</a>!</li> <li>It can even embed stuff!</li> </ul> <p></p> <iframe width="500px" height="150px" src="/dashboard" frameBorder="0"></iframe> <p></p> <p></p> ',
      },
      pl: {
        categoryMajor: 'catMajor',
        categoryMinor: 'catMinor',
        contents: '<h3>An <strong>article</strong>!<br>With <em>html!</em>&nbsp;</h3> <ul> <li>Polish version!&nbsp;</li> <li>A <a href="http://www.google.com" target="_self">link</a>!</li> <li>It can even embed stuff!</li> </ul> <p></p> <iframe width="500px" height="150px" src="/dashboard" frameBorder="0"></iframe> <p></p> <p></p> ',
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
