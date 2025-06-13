
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const categories = [
  { value: 'Next.js', label: 'Next.js' },
  { value: 'WordPress', label: 'WordPress' },
  { value: 'React', label: 'React' },
  { value: 'Other', label: 'その他' },
];

export default function ProjectAddForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <Card className="p-6 mb-6 max-w-xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">タイトル</label>
          <Input {...register("title", { required: true })} />
          {errors.title && <span className="text-red-500 text-xs">必須項目です</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">カテゴリ</label>
          <select {...register("category", { required: true })} className="w-full border rounded px-2 py-1">
            <option value="">選択してください</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.category && <span className="text-red-500 text-xs">必須項目です</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">年度</label>
          <Input type="number" {...register("year", { required: true, min: 2000, max: 2100 })} />
          {errors.year && <span className="text-red-500 text-xs">有効な年度を入力してください</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">規模</label>
          <select {...register("scale", { required: true })} className="w-full border rounded px-2 py-1">
            <option value="">選択してください</option>
            <option value="small">小規模</option>
            <option value="medium">中規模</option>
            <option value="large">大規模</option>
          </select>
          {errors.scale && <span className="text-red-500 text-xs">必須項目です</span>}
        </div>
        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" {...register("is_featured")} id="is_featured" />
          <label htmlFor="is_featured">注目案件</label>
        </div>
        <Button type="submit" variant="default">追加</Button>
      </form>
    </Card>
  );
} 