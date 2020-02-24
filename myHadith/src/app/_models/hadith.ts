import {Category} from './category';

export class Translate {
  lang: string;
  flag: string;
  text: string;
}

export class Hadith {
  _id: string;
  title: string;
  collections: string;
  createdBy: string;
  category: Category[];
  translate: Translate[];

}
