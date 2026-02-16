import { Metadata } from 'next';
import DbSchemaDashboard from './DbSchemaDashboard';

export const metadata: Metadata = {
  title: 'DB 스키마 시각화 | 소셜미디어 분석센터',
  description: 'Supabase 데이터베이스 구조를 시각적으로 확인하고 템플릿화',
};

export default function DbSchemaPage() {
  return <DbSchemaDashboard />;
}
