import { Metadata } from 'next';
import AdminNavigation from '@/components/AdminNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin 대시보드 | 소셜미디어 분석센터',
  description: '시스템 관리 및 모니터링 대시보드',
};

const systemStats = {
  totalUsers: 42,
  activeUsers: 28,
  totalTokens: 50000,
  usedTokens: 12500,
  dbSize: '2.3GB',
  lastBackup: '2시간 전'
};

export default function AdminPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin 대시보드</h1>
          <p className="text-muted-foreground">소셜미디어 분석센터 시스템 관리</p>
        </div>
        <Badge variant="secondary" className="text-sm">실시간 모니터링</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              총 사용자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">활성 사용자: {systemStats.activeUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              토큰 사용률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((systemStats.usedTokens / systemStats.totalTokens) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {systemStats.usedTokens.toLocaleString()} / {systemStats.totalTokens.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="h-4 w-4 mr-2" />
              DB 사용량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.dbSize}</div>
            <p className="text-xs text-muted-foreground">백업: {systemStats.lastBackup}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              시스템 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">정상</div>
            <p className="text-xs text-muted-foreground">모든 서비스 운영중</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>관리 메뉴</CardTitle>
          <CardDescription>시스템 관리를 위한 주요 기능들에 빠르게 접근하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminNavigation />
        </CardContent>
      </Card>
    </div>
  );
}
