'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { SiteSetting } from '@/lib/types/database';

interface SettingsFormProps {
  settings: SiteSetting[];
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const data: Record<string, string> = {};
    settings.forEach(setting => {
      data[setting.key] = setting.value || '';
    });
    return data;
  });
  const router = useRouter();

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('設定の保存に失敗しました');
      }

      toast.success('設定を保存しました');
      router.refresh();
    } catch (error) {
      console.error('設定保存エラー:', error);
      toast.error('設定の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const getSettingByKey = (key: string) => {
    return settings.find(setting => setting.key === key);
  };

  const renderSettingInput = (setting: SiteSetting) => {
    const value = formData[setting.key] || '';

    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={setting.key}
              checked={value === 'true'}
              onCheckedChange={(checked) => 
                handleInputChange(setting.key, checked ? 'true' : 'false')
              }
            />
            <Label htmlFor={setting.key}>{setting.description}</Label>
          </div>
        );
      
      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={setting.key}>{setting.description}</Label>
                         <Input
               id={setting.key}
               type="number"
               value={value}
               onChange={(e) => handleInputChange(setting.key, e.target.value)}
               placeholder={setting.description || undefined}
             />
          </div>
        );
      
      case 'text':
      default:
        if (setting.key.includes('description') || setting.key.includes('bio')) {
          return (
            <div className="space-y-2">
              <Label htmlFor={setting.key}>{setting.description}</Label>
                             <Textarea
                 id={setting.key}
                 value={value}
                 onChange={(e) => handleInputChange(setting.key, e.target.value)}
                 placeholder={setting.description || undefined}
                 rows={3}
               />
            </div>
          );
        } else {
          return (
            <div className="space-y-2">
              <Label htmlFor={setting.key}>{setting.description}</Label>
                             <Input
                 id={setting.key}
                 type={setting.key.includes('email') ? 'email' : 'text'}
                 value={value}
                 onChange={(e) => handleInputChange(setting.key, e.target.value)}
                 placeholder={setting.description || undefined}
               />
            </div>
          );
        }
    }
  };

  // 設定をカテゴリ別にグループ化
  const basicSettings = settings.filter(s => 
    ['site_title', 'site_description', 'contact_email'].includes(s.key)
  );
  
  const displaySettings = settings.filter(s => 
    ['show_github_link', 'projects_per_page'].includes(s.key)
  );
  
  const otherSettings = settings.filter(s => 
    !basicSettings.includes(s) && !displaySettings.includes(s)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本設定 */}
      <Card>
        <CardHeader>
          <CardTitle>基本設定</CardTitle>
          <CardDescription>
            サイトの基本情報を設定します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {basicSettings.map(setting => (
            <div key={setting.key}>
              {renderSettingInput(setting)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 表示設定 */}
      <Card>
        <CardHeader>
          <CardTitle>表示設定</CardTitle>
          <CardDescription>
            サイトの表示に関する設定を行います。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {displaySettings.map(setting => (
            <div key={setting.key}>
              {renderSettingInput(setting)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* その他の設定 */}
      {otherSettings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>その他の設定</CardTitle>
            <CardDescription>
              追加の設定項目です。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {otherSettings.map(setting => (
              <div key={setting.key}>
                {renderSettingInput(setting)}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : '設定を保存'}
        </Button>
      </div>
    </form>
  );
} 