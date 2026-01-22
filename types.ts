
export enum ContentType {
  ARTICLE = 'ARTICLE', // مقالات قانونية
  BOOK = 'BOOK', // كتب ومراجع
  CASE = 'CASE', // قضايا محلولة
  SUMMARY = 'SUMMARY', // ملخصات قانونية
  EXPLANATION = 'EXPLANATION', // شرح القوانين
  EDUCATION = 'EDUCATION' // محتوى تعليمي
}

export interface LegalContent {
  id: string;
  type: ContentType;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  fileUrl?: string; // For PDFs
}

export interface User {
  role: 'admin' | 'user';
  isLoggedIn: boolean;
}
