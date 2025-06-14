import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Portfolio settings GET error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseClient();
    const data = await request.json();
    
    const { data: result, error } = await supabase
      .from('portfolio_settings')
      .insert([{
        site_title: data.site_title,
        site_icon: data.site_icon,
        site_image_url: data.site_image_url || '',
        contact_email: data.contact_email || '',
        contact_github: data.contact_github || '',
        contact_website: data.contact_website || '',
        contact_phone: data.contact_phone || '',
        contact_address: data.contact_address || '',
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Portfolio settings POST error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await getSupabaseClient();
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      );
    }
    
    const { data: result, error } = await supabase
      .from('portfolio_settings')
      .update({
        site_title: data.site_title,
        site_icon: data.site_icon,
        site_image_url: data.site_image_url || '',
        contact_email: data.contact_email || '',
        contact_github: data.contact_github || '',
        contact_website: data.contact_website || '',
        contact_phone: data.contact_phone || '',
        contact_address: data.contact_address || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Portfolio settings PUT error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 