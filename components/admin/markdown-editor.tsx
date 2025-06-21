'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown } from '@/lib/utils/markdown-parser';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const markdownHelp = [
  { syntax: '# 見出し1', description: '大見出し' },
  { syntax: '## 見出し2', description: '中見出し' },
  { syntax: '### 見出し3', description: '小見出し' },
  { syntax: '**太字**', description: '太字テキスト' },
  { syntax: '*斜体*', description: '斜体テキスト' },
  { syntax: '`コード`', description: 'インラインコード' },
  { syntax: '[リンク](URL)', description: 'リンク' },
  { syntax: '- リスト項目', description: 'リスト' },
  { syntax: '* リスト項目', description: 'リスト（別記法）' },
];

export default function MarkdownEditor({ value, onChange, placeholder = 'マークダウン形式で入力してください...', rows = 8 }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'help'>('edit');

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview' | 'help')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            編集
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            プレビュー
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            ヘルプ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <Card>
            <CardContent className="p-4 min-h-[200px]">
              {value ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }}
                />
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  プレビューするテキストがありません
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="mt-2">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">マークダウン記法</h4>
              <div className="space-y-3">
                {markdownHelp.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {item.syntax}
                    </code>
                    <span className="text-sm text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h5 className="font-medium mb-2">使用例:</h5>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  {`# プロジェクト概要
このプロジェクトは**Next.js**と*TypeScript*を使用して開発されました。

## 主な機能
- ユーザー認証
- データ管理
- レスポンシブデザイン

詳細は[GitHub](https://github.com)をご覧ください。`}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 