import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateProject, getProjectById, deleteProject } from '@/dal/projects';
import { ProjectCategory } from '@/types';

const updateProjectSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  image_paths: z.array(z.string()).optional(), // Supabaseストレージのパス情報
  project_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  github_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1, '少なくとも1つの技術を選択してください'),
  category: z.string().min(1, 'カテゴリは必須です'),
  is_featured: z.boolean().optional(),
  project_year: z.number().min(2000).max(2100).optional(),
  project_scale: z.enum(['small', 'medium', 'large']).optional(),
});

// プロジェクト更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // バリデーション
    const validatedData = updateProjectSchema.parse(body);
    
    // 空文字列をnullに変換
    const processedData = {
      ...validatedData,
      description: validatedData.description && validatedData.description.trim() !== '' 
        ? validatedData.description 
        : null,
      project_url: validatedData.project_url && validatedData.project_url.trim() !== '' 
        ? validatedData.project_url 
        : null,
      github_url: validatedData.github_url && validatedData.github_url.trim() !== '' 
        ? validatedData.github_url 
        : null,
      category: validatedData.category as ProjectCategory,
    };

    const updatedProject = await updateProject(id, processedData);
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('プロジェクト更新エラー:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'プロジェクトの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// プロジェクト取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'プロジェクトが見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('プロジェクト取得エラー:', error);
    return NextResponse.json(
      { error: 'プロジェクトの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// プロジェクト削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // プロジェクトの存在確認
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json(
        { error: 'プロジェクトが見つかりません' },
        { status: 404 }
      );
    }
    
    // プロジェクト削除の実装
    await deleteProject(id);
    
    return NextResponse.json({ message: 'プロジェクトを削除しました' });
  } catch (error) {
    console.error('プロジェクト削除エラー:', error);
    return NextResponse.json(
      { error: 'プロジェクトの削除に失敗しました' },
      { status: 500 }
    );
  }
} 