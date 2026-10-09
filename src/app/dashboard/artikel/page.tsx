import { getAllArticles } from "@/lib/queries";
import ArticleManager from "@/components/dashboard/ArticleManager";

export const dynamic = "force-dynamic";

export default async function ManageArticlesPage() {
  const articles = await getAllArticles();
  return <ArticleManager articles={articles} />;
}
