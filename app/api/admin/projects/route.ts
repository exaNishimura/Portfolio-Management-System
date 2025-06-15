import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const createProjectSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  project_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  github_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1, '少なくとも1つの技術を選択してください'),
  category: z.string().min(1, 'カテゴリは必須です'),
  is_featured: z.boolean().optional(),
  project_year: z.number().min(2000).max(2100).optional(),
  project_scale: z.enum(['small', 'medium', 'large']).optional(),
});

// プロジェクト一覧取得
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('プロジェクト取得エラー:', error);
      return NextResponse.json(
        { error: 'プロジェクトの取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('プロジェクト取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 新規プロジェクト作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // バリデーション
    const validatedData = createProjectSchema.parse(body);
    
    // 空文字列をnullに変換
    const processedData = {
      ...validatedData,
      description: validatedData.description || null,
      project_url: validatedData.project_url || null,
      github_url: validatedData.github_url || null,
      project_year: validatedData.project_year || null,
      project_scale: validatedData.project_scale || null,
      is_featured: validatedData.is_featured || false,
      images: validatedData.images || [],
    };

    const supabase = await createClient();
    
    const { data: project, error } = await supabase
      .from('projects')
      .insert([processedData])
      .select()
      .single();

    if (error) {
      console.error('プロジェクト作成エラー:', error);
      return NextResponse.json(
        { error: 'プロジェクトの作成に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      );
    }

    console.error('プロジェクト作成エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 