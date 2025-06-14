import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  const { name, email, message } = data;
  
  try {
    const result = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || 'noreply@yourdomain.com',
      to: process.env.CONTACT_EMAIL_TO || 'contact@example.com',
      subject: `【ポートフォリオサイト】お問い合わせ - ${name}様より`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            新しいお問い合わせが届きました
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">お問い合わせ内容</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold; width: 120px;">
                  お名前:
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">
                  メールアドレス:
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">
                  <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">
                    ${email}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; vertical-align: top;">
                  お問い合わせ内容:
                </td>
                <td style="padding: 10px;">
                  <div style="white-space: pre-wrap; line-height: 1.6;">
                    ${message}
                  </div>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              このメールはポートフォリオサイトのお問い合わせフォームから送信されました。<br>
              返信する場合は、上記のメールアドレス（${email}）に直接返信してください。
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #adb5bd;">
            <p>Portfolio Site - お問い合わせシステム</p>
          </div>
        </div>
      `,
      // テキスト版も提供
      text: `
新しいお問い合わせが届きました

お名前: ${name}
メールアドレス: ${email}

お問い合わせ内容:
${message}

---
このメールはポートフォリオサイトのお問い合わせフォームから送信されました。
返信する場合は、${email} に直接返信してください。
      `.trim(),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('メール送信エラー:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'メール送信に失敗しました' 
    };
  }
} 