'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Database, 
  Settings, 
  BarChart3, 
  Shield, 
  Users,
  Activity
} from 'lucide-react';

const adminMenuItems = [
  {
    title: 'DB 스키마',
    href: '/admin/db-schema',
    icon: Database,
    description: '데이터베이스 구조 시각화'
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: Users,
    description: '사용자 및 권한 관리'
  },
  {
    title: '시스템 설정',
    href: '/admin/settings',
    icon: Settings,
    description: 'API 키 및 환경설정'
  },
  {
    title: '활동 로그',
    href: '/admin/logs',
    icon: Activity,
    description: '시스템 활동 모니터링'
  }
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {adminMenuItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${
              isActive ? 'ring-2 ring-primary' : ''
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span>{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
