export interface ArticleLocale {
  categoryMajor: string
  categoryMinor: string
}

export interface ArticleLocaleWithContents extends ArticleLocale {
  contents: string
}

export interface ArticleMeta {
  _id: string
  availableFrom?: Date
  pl: ArticleLocale
  en: ArticleLocale
}

export interface IArticle extends ArticleMeta {
  pl: ArticleLocaleWithContents
  en: ArticleLocaleWithContents
}

export class Article implements IArticle {
  _id = ''

  availableFrom?: Date

  en: ArticleLocaleWithContents = {
    categoryMajor: '',
    categoryMinor: '',
    contents: '',
  }

  pl: ArticleLocaleWithContents = {
    categoryMajor: '',
    categoryMinor: '',
    contents: '',
  }

  constructor(o?: IArticle) {
    if (o) {
      this._id = o._id || '';
      if (o.availableFrom) {
        this.availableFrom = new Date(o.availableFrom);
      }
      if (o.en) {
        this.en = {
          categoryMajor: o.en.categoryMajor || '',
          categoryMinor: o.en.categoryMinor || '',
          contents: o.en.contents || '',
        };
      }
      if (o.pl) {
        this.pl = {
          categoryMajor: o.pl.categoryMajor || '',
          categoryMinor: o.pl.categoryMinor || '',
          contents: o.pl.contents || '',
        };
      }
    }
  }
}
