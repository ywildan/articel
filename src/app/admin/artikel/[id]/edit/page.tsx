import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/queries";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function EditArticlePage({ params }: Props) {
  const id = Number(params.id);
  if (!id) notFound();
  const article = await getArticleById(id);
  if (!article) notFound();
  return <ArticleForm article={article} />;
}
