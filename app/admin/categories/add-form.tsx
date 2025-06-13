
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function CategoryAddForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Card className="p-6 mb-6 max-w-xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">名前</label>
          <Input {...register("name", { required: true })} />
          {errors.name && <span className="text-red-500 text-xs">必須項目です</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">スラッグ</label>
          <Input {...register("slug", { required: true })} />
          {errors.slug && <span className="text-red-500 text-xs">必須項目です</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">説明</label>
          <Input {...register("description")} />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">アイコン名</label>
          <Input {...register("icon")} placeholder="例: rocket, wordpress" />
        </div>
        <Button type="submit" variant="default">追加</Button>
      </form>
    </Card>
  );
} 