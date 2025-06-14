import { createClient } from '@/utils/supabase/server';
import { Category, CategoryFormData } from '@/lib/types/database';

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('カテゴリ取得エラー:', error);
    throw new Error('カテゴリの取得に失敗しました');
  }

  return data || [];
}

export async function getCategory(id: string): Promise<Category | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('カテゴリ取得エラー:', error);
    return null;
  }

  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('カテゴリ取得エラー:', error);
    return null;
  }

  return data;
}

export async function createCategory(categoryData: CategoryFormData): Promise<Category> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select()
    .single();

  if (error) {
    console.error('カテゴリ作成エラー:', error);
    throw new Error('カテゴリの作成に失敗しました');
  }

  return data;
}

export async function updateCategory(id: string, categoryData: Partial<CategoryFormData>): Promise<Category> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('カテゴリ更新エラー:', error);
    throw new Error('カテゴリの更新に失敗しました');
  }

  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('カテゴリ削除エラー:', error);
    throw new Error('カテゴリの削除に失敗しました');
  }
}

export async function checkCategorySlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  
  let query = supabase
    .from('categories')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('スラグ重複チェックエラー:', error);
    return false;
  }

  return (data?.length || 0) > 0;
} 