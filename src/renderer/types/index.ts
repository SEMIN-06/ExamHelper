export interface IQuestion {
  [key: string]: any;
  id?: number;
  nodeRef?: any;
  subject: string;
  content: string;
  meaning: string;
  attachImage?: string;
}
