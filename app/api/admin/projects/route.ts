import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { debugLog, errorLog, safeAsync, removeUndefined } from '@/lib/utils';

/**
 * プロジェクト一覧取得API
 * GET /api/admin/projects
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const featured = url.searchParams.get('featured') === 'true';
  const category = url.searchParams.get('category');
  const limit = url.searchParams.get('limit');
  
  debugLog('GET /api/admin/projects', { featured, category, limit });
  
  const [error, result] = await safeAsync(async () => {
    const supabase = await createClient();
    
    let query = supabase
      .from('projects')
      .select('*')
      .order('project_year', { ascending: false })
      .order('created_at', { ascending: false });

    if (featured) {
      query = query.eq('is_featured', true);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum);
      }
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data || [];
  });

  if (error) {
    errorLog('GET /api/admin/projects failed', error, { featured, category, limit });
    return NextResponse.json(
      { error: 'プロジェクトの取得に失敗しました', details: error.message },
      { status: 500 }
    );
  }

  debugLog('GET /api/admin/projects success', { count: result?.length });
  return NextResponse.json(result);
}

/**
 * プロジェクト作成API
 * POST /api/admin/projects
 */
export async function POST(request: Request) {
  debugLog('POST /api/admin/projects called');
  
  const [parseError, data] = await safeAsync(async () => {
    const body = await request.json();
    
    // 必須フィールドの検証
    if (!body.title || typeof body.title !== 'string') {
      throw new Error('タイトルは必須です');
    }
    
    if (!body.description || typeof body.description !== 'string') {
      throw new Error('説明は必須です');
    }
    
    if (!body.category || typeof body.category !== 'string') {
      throw new Error('カテゴリは必須です');
    }
    
    if (!Array.isArray(body.technologies)) {
      throw new Error('技術スタックは配列である必要があります');
    }

    return body;
  });

  if (parseError) {
    errorLog('POST /api/admin/projects validation failed', parseError);
    return NextResponse.json(
      { error: 'リクエストデータが無効です', details: parseError.message },
      { status: 400 }
    );
  }

  const [error, result] = await safeAsync(async () => {
    const supabase = await createClient();
    
    // データをサニタイズ
    const sanitizedData = removeUndefined({
      title: data.title.trim(),
      description: data.description.trim(),
      image_url: data.image_url?.trim() || '',
      images: Array.isArray(data.images) ? data.images : [],
      image_paths: Array.isArray(data.image_paths) ? data.image_paths : [],
      project_url: data.project_url?.trim() || '',
      github_url: data.github_url?.trim() || '',
      technologies: data.technologies,
      category: data.category.trim(),
      is_featured: Boolean(data.is_featured),
      project_year: data.project_year ? parseInt(data.project_year, 10) : new Date().getFullYear(),
      project_scale: data.project_scale || 'medium',
      updated_at: new Date().toISOString()
    });

    const { data: project, error } = await supabase
      .from('projects')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      throw new Error(`Database insert failed: ${error.message}`);
    }

    return project;
  });

  if (error) {
    errorLog('POST /api/admin/projects failed', error, data);
    return NextResponse.json(
      { error: 'プロジェクトの作成に失敗しました', details: error.message },
      { status: 500 }
    );
  }

  debugLog('POST /api/admin/projects success', { id: result?.id, title: result?.title });
  return NextResponse.json(result, { status: 201 });
} 