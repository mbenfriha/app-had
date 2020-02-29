import {Category} from './category';

export class Translate {
  lang: string;
  flag: string;
  text: string;
}

export class Hadith {
  _id: string;
  title: string;
  number: number;
  collections: {_id: string, name: string};
  createdBy: string;
  category: Category[];
  translate: Translate[];

}
