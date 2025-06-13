import { NextResponse } from "next/server";
import { z } from "zod";

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
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    // TODO: メール送信処理など
    return NextResponse.json({ message: "お問い合わせを受け付けました" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
} 