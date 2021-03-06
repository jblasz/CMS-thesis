export interface IArticleLocale {
  categoryMajor: string
  categoryMinor: string
}

export interface ArticleLocaleWithContents extends IArticleLocale {
  contents: string
}

export interface IArticleMeta {
  _id: string
  sortWeight: number
  availableFrom?: Date
  pl: IArticleLocale
  en: IArticleLocale
}

export function ArticleLocale(o: IArticleLocale): IArticleLocale {
  return {
    categoryMajor: o.categoryMajor || 'no_category_major',
    categoryMinor: o.categoryMinor || '',
  };
}

export function ArticleMeta(o: IArticleMeta): IArticleMeta {
  return {
    _id: o._id || '',
    en: ArticleLocale(o.en),
    pl: ArticleLocale(o.pl),
    sortWeight: o.sortWeight || 0,
    ...(o.availableFrom ? { availableFrom: new Date(o.availableFrom) } : {}),
  };
}

export interface IArticle extends IArticleMeta {
  pl: ArticleLocaleWithContents
  en: ArticleLocaleWithContents
}

export function Article(o: IArticle): IArticle {
  const root = ArticleMeta(o);
  return {
    ...root,
    en: {
      ...root.en,
      contents: (o && o.en && o.en.contents) || '',
    },
    pl: {
      ...root.pl,
      contents: (o && o.pl && o.pl.contents) || '',
    },
  };
}
