"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ContactSchema = z.object({
  name: z.string().min(1, "お名前は必須です"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  message: z.string().min(1, "お問い合わせ内容は必須です")
});

type ContactFormValues = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", message: "" }
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: ContactFormValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "送信エラー", description: data.errors ? Object.values(data.errors).flat().join("\n") : data.error, variant: "destructive" });
      } else {
        toast({ title: "送信完了", description: data.message });
        form.reset();
      }
    } catch (e) {
      toast({ title: "送信エラー", description: "サーバーエラーが発生しました", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">お問い合わせ</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>お名前</FormLabel>
                <FormControl>
                  <Input placeholder="お名前" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>お問い合わせ内容</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="お問い合わせ内容を入力してください" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "送信中..." : "送信する"}
          </Button>
        </form>
      </Form>
    </main>
  );
} 