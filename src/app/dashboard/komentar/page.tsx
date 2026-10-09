import { getAllComments } from "@/lib/queries";
import CommentManager from "@/components/dashboard/CommentManager";

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
  const comments = await getAllComments();
  return <CommentManager comments={comments} />;
}
