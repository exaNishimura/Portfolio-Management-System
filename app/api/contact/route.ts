import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";

const ContactSchema = z.object({
  name: z.string().min(1, "お名前は必須です"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  message: z.string().min(1, "お問い合わせ内容は必須です")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors }, 
        { status: 400 }
      );
    }

    // メール送信処理
    const emailResult = await sendContactEmail(parsed.data);
    
    if (!emailResult.success) {
      console.error('メール送信失敗:', emailResult.error);
      return NextResponse.json(
        { error: "メール送信に失敗しました。しばらく時間をおいて再度お試しください。" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "お問い合わせを受け付けました。ご連絡いただきありがとうございます。"
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" }, 
      { status: 500 }
    );
  }
} 