import { query } from '../../lib/serverDb';

export const dynamic = 'force-dynamic';

interface Comment {
  id: number;
  comment: string;
}

export default async function Page() {
  const response = await query('select * from comments');
  const comments = response.rows as Comment[];

  return (
    <main className="p-8 bg-slate-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Next.js + Aurora PostgreSQL</h1>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-200">{comment.comment}</p>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">ID: {comment.id}</div>
          </div>
         ))}
      </div>
    </main>
  );
}
