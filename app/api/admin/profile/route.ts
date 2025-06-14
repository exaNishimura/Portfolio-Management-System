import { NextResponse } from 'next/server';
import { z } from 'zod';
import { upsertProfile, getProfile } from '@/dal/profiles';

const profileSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  title: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email('正しいメールアドレスを入力してください').optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('正しいURLを入力してください').optional(),
  github_url: z.string().url('正しいURLを入力してください').optional(),
  linkedin_url: z.string().url('正しいURLを入力してください').optional(),
  twitter_url: z.string().url('正しいURLを入力してください').optional(),
  avatar_url: z.string().url('正しいURLを入力してください').optional(),
  skills: z.array(z.string()).default([]),
  experience_years: z.number().min(0).optional(),
});

export async function GET() {
  try {
    const profile = await getProfile();
    
    if (!profile) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile, { status: 200 });
    
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    return NextResponse.json(
      { error: 'プロフィールの取得に失敗しました' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors }, 
        { status: 400 }
      );
    }

    const profile = await upsertProfile(parsed.data);
    
    return NextResponse.json(profile, { status: 201 });
    
  } catch (error) {
    console.error('プロフィール作成エラー:', error);
    return NextResponse.json(
      { error: 'プロフィールの作成に失敗しました' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors }, 
        { status: 400 }
      );
    }

    const profile = await upsertProfile(parsed.data);
    
    return NextResponse.json(profile, { status: 200 });
    
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    return NextResponse.json(
      { error: 'プロフィールの更新に失敗しました' }, 
      { status: 500 }
    );
  }
} 