'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Database, Table, Link2, Eye } from 'lucide-react';

interface TableSchema {
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  relationships: {
    table: string;
    type: 'one-to-many' | 'many-to-one' | 'many-to-many';
    field: string;
  }[];
}

const supabaseSchemas: TableSchema[] = [
  {
    name: 'users',
    description: '사용자 기본 정보 및 인증',
    fields: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary Key, Supabase Auth 연동' },
      { name: 'email', type: 'varchar', required: true, description: '사용자 이메일' },
      { name: 'name', type: 'varchar', required: false, description: '사용자 이름' },
      { name: 'avatar_url', type: 'varchar', required: false, description: '프로필 이미지 URL' },
      { name: 'created_at', type: 'timestamp', required: true, description: '가입일시' },
      { name: 'updated_at', type: 'timestamp', required: true, description: '최종 수정일시' }
    ],
    relationships: [
      { table: 'user_tokens', type: 'one-to-many', field: 'user_id' },
      { table: 'youtube_analyses', type: 'one-to-many', field: 'user_id' },
      { table: 'user_settings', type: 'one-to-many', field: 'user_id' }
    ]
  },
  {
    name: 'user_tokens',
    description: '사용자 토큰 잔액 및 사용 내역',
    fields: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary Key' },
      { name: 'user_id', type: 'uuid', required: true, description: '사용자 ID (Foreign Key)' },
      { name: 'tokens', type: 'integer', required: true, description: '보유 토큰 수' },
      { name: 'tokens_used', type: 'integer', required: true, description: '사용된 토큰 수' },
      { name: 'created_at', type: 'timestamp', required: true, description: '생성일시' },
      { name: 'updated_at', type: 'timestamp', required: true, description: '최종 수정일시' }
    ],
    relationships: [
      { table: 'users', type: 'many-to-one', field: 'user_id' },
      { table: 'token_transactions', type: 'one-to-many', field: 'user_id' }
    ]
  },
  {
    name: 'token_transactions',
    description: '토큰 사용 및 충전 거래 내역',
    fields: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary Key' },
      { name: 'user_id', type: 'uuid', required: true, description: '사용자 ID (Foreign Key)' },
      { name: 'type', type: 'varchar', required: true, description: 'purchase, usage, refund' },
      { name: 'amount', type: 'integer', required: true, description: '토큰 수량 (음수: 사용, 양수: 충전)' },
      { name: 'description', type: 'text', required: false, description: '거래 설명' },
      { name: 'metadata', type: 'jsonb', required: false, description: '추가 메타데이터' },
      { name: 'created_at', type: 'timestamp', required: true, description: '거래일시' }
    ],
    relationships: [
      { table: 'user_tokens', type: 'many-to-one', field: 'user_id' }
    ]
  },
  {
    name: 'beta_codes',
    description: '베타 초대 코드 관리',
    fields: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary Key' },
      { name: 'code', type: 'varchar', required: true, description: '베타 코드 (유니크)' },
      { name: 'tokens', type: 'integer', required: true, description: '제공 토큰 수' },
      { name: 'used', type: 'boolean', required: true, description: '사용 여부' },
      { name: 'used_by', type: 'uuid', required: false, description: '사용한 사용자 ID' },
      { name: 'used_at', type: 'timestamp', required: false, description: '사용일시' },
      { name: 'created_at', type: 'timestamp', required: true, description: '생성일시' }
    ],
    relationships: [
      { table: 'users', type: 'many-to-one', field: 'used_by' }
    ]
  },
  {
    name: 'youtube_analyses',
    description: 'YouTube 영상 분석 결과 저장',
    fields: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary Key' },
      { name: 'user_id', type: 'uuid', required: true, description: '분석 요청자 ID' },
      { name: 'video_url', type: 'varchar', required: true, description: 'YouTube 영상 URL' },
      { name: 'video_title', type: 'text', required: false, description: '영상 제목' },
      { name: 'analysis_result', type: 'jsonb', required: true, description: '분석 결과 JSON' },
      { name: 'tokens_used', type: 'integer', required: true, description: '사용된 토큰 수' },
      { name: 'created_at', type: 'timestamp', required: true, description: '분석일시' }
    ],
    relationships: [
      { table: 'users', type: 'many-to-one', field: 'user_id' }
    ]
  },
  {
    name: 'user_settings',
    description: '사용자 API 키 및 설정',
    fields: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary Key' },
      { name: 'user_id', type: 'uuid', required: true, description: '사용자 ID (Foreign Key)' },
      { name: 'setting_key', type: 'varchar', required: true, description: '설정 키 (perplexity_api_key, claude_api_key 등)' },
      { name: 'setting_value', type: 'text', required: true, description: '암호화된 설정 값' },
      { name: 'created_at', type: 'timestamp', required: true, description: '생성일시' },
      { name: 'updated_at', type: 'timestamp', required: true, description: '최종 수정일시' }
    ],
    relationships: [
      { table: 'users', type: 'many-to-one', field: 'user_id' }
    ]
  },
  {
    name: 'channel_lessons',
    description: '채널별 개선 사항 및 교훈',
    fields: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary Key' },
      { name: 'user_id', type: 'uuid', required: true, description: '채널 소유자 ID' },
      { name: 'channel_name', type: 'varchar', required: true, description: '채널명' },
      { name: 'lessons', type: 'jsonb', required: true, description: '교훈 및 개선사항 JSON' },
      { name: 'created_at', type: 'timestamp', required: true, description: '생성일시' },
      { name: 'updated_at', type: 'timestamp', required: true, description: '최종 수정일시' }
    ],
    relationships: [
      { table: 'users', type: 'many-to-one', field: 'user_id' }
    ]
  }
];

const sqlExamples = {
  createUser: `-- 새 사용자 생성 (Supabase Auth 트리거에서 자동 실행)
INSERT INTO users (id, email, name, created_at, updated_at)
VALUES (auth.uid(), auth.email(), '', NOW(), NOW());`,
  
  getUserWithTokens: `-- 사용자와 토큰 정보 조회
SELECT 
  u.id, u.email, u.name,
  ut.tokens, ut.tokens_used,
  (ut.tokens - ut.tokens_used) as remaining_tokens
FROM users u
LEFT JOIN user_tokens ut ON u.id = ut.user_id
WHERE u.id = $1;`,
  
  recordTokenUsage: `-- 토큰 사용 기록
WITH token_usage AS (
  INSERT INTO token_transactions (user_id, type, amount, description)
  VALUES ($1, 'usage', -$2, $3)
  RETURNING user_id, amount
)
UPDATE user_tokens 
SET tokens_used = tokens_used + abs($2), updated_at = NOW()
WHERE user_id = $1;`,
  
  getBetaCode: `-- 베타 코드 사용
UPDATE beta_codes 
SET used = true, used_by = $1, used_at = NOW()
WHERE code = $2 AND used = false
RETURNING tokens;`
};

export default function DbSchemaDashboard() {
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [copiedSql, setCopiedSql] = useState<string>('');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSql(type);
    setTimeout(() => setCopiedSql(''), 2000);
  };

  const generateCreateTableSQL = (table: TableSchema) => {
    const fields = table.fields.map(field => {
      const nullable = field.required ? 'NOT NULL' : '';
      const defaultValue = field.name === 'id' ? 'DEFAULT gen_random_uuid()' : 
                          field.name.includes('created_at') ? 'DEFAULT NOW()' :
                          field.name.includes('updated_at') ? 'DEFAULT NOW()' : '';
      return `  ${field.name} ${field.type} ${defaultValue} ${nullable}`.trim();
    }).join(',\n');

    return `CREATE TABLE ${table.name} (
${fields},
  PRIMARY KEY (id)
);

-- 관계 설정
${table.relationships.map(rel => {
  if (rel.type === 'many-to-one') {
    return `ALTER TABLE ${table.name} ADD CONSTRAINT fk_${table.name}_${rel.field} 
    FOREIGN KEY (${rel.field}) REFERENCES ${rel.table}(id);`;
  }
  return '';
}).filter(Boolean).join('\n')}

-- RLS 활성화
ALTER TABLE ${table.name} ENABLE ROW LEVEL SECURITY;

-- 기본 정책 (사용자는 자신의 데이터만 접근)
CREATE POLICY "${table.name}_policy" ON ${table.name}
    FOR ALL USING (auth.uid() = user_id);`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Supabase DB 시각화 대시보드</h1>
        <Badge variant="secondary">템플릿화 완료</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 테이블 목록 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Table className="h-5 w-5" />
              <span>테이블 목록</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {supabaseSchemas.map((table) => (
                <Button
                  key={table.name}
                  variant={selectedTable === table.name ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTable(table.name)}
                >
                  <Table className="h-4 w-4 mr-2" />
                  {table.name}
                  <Badge variant="secondary" className="ml-auto">
                    {table.fields.length} 필드
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 테이블 상세 정보 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>{selectedTable} 테이블</span>
            </CardTitle>
            <CardDescription>
              {supabaseSchemas.find(t => t.name === selectedTable)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fields" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="fields">필드 구조</TabsTrigger>
                <TabsTrigger value="relationships">관계</TabsTrigger>
                <TabsTrigger value="sql">SQL 생성</TabsTrigger>
              </TabsList>

              <TabsContent value="fields" className="space-y-4">
                <div className="space-y-3">
                  {supabaseSchemas.find(t => t.name === selectedTable)?.fields.map((field) => (
                    <div key={field.name} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {field.name}
                          </code>
                          <Badge variant="outline">{field.type}</Badge>
                          {field.required && <Badge variant="destructive" className="text-xs">필수</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="relationships" className="space-y-4">
                <div className="space-y-3">
                  {supabaseSchemas.find(t => t.name === selectedTable)?.relationships.map((rel, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link2 className="h-4 w-4" />
                        <span className="font-medium">{rel.table}</span>
                        <Badge variant="secondary">{rel.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        연결 필드: <code>{rel.field}</code>
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sql" className="space-y-4">
                <div className="space-y-4">
                  <Button 
                    onClick={() => {
                      const table = supabaseSchemas.find(t => t.name === selectedTable);
                      if (table) {
                        copyToClipboard(generateCreateTableSQL(table), 'create-' + selectedTable);
                      }
                    }}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    테이블 생성 SQL 복사
                    {copiedSql === 'create-' + selectedTable && <span className="ml-2">✅</span>}
                  </Button>
                  
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                    {supabaseSchemas.find(t => t.name === selectedTable) && 
                     generateCreateTableSQL(supabaseSchemas.find(t => t.name === selectedTable)!)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* SQL 예제 */}
      <Card>
        <CardHeader>
          <CardTitle>자주 사용하는 SQL 쿼리</CardTitle>
          <CardDescription>실제 개발에서 사용할 수 있는 SQL 쿼리 템플릿</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(sqlExamples).map(([key, sql]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{key}</h4>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(sql, key)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    복사
                    {copiedSql === key && <span className="ml-1">✅</span>}
                  </Button>
                </div>
                <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-32">
                  {sql}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 전체 스키마 내보내기 */}
      <Card>
        <CardHeader>
          <CardTitle>전체 스키마 내보내기</CardTitle>
          <CardDescription>새 프로젝트에서 바로 사용할 수 있는 전체 스키마</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => {
              const fullSchema = supabaseSchemas.map(table => generateCreateTableSQL(table)).join('\n\n');
              copyToClipboard(fullSchema, 'full-schema');
            }}
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            전체 스키마 SQL 복사
            {copiedSql === 'full-schema' && <span className="ml-2">✅</span>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
