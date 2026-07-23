import { NextResponse } from 'next/server';
import { authenticateMcpRequest } from '@/lib/mcp-auth';
import { acceptTopicSuggestionFor } from '@/lib/mcp/data';

/**
 * POST /api/mcp/topic-suggestions/[id]/accept
 *
 * Parallel REST surface for the `accept_topic_suggestion` MCP tool — same
 * data-layer function, same ownership guarantee, same status = 'new' guard
 * that keeps a repeated accept from creating a second topic.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateMcpRequest(req);
  if (auth instanceof NextResponse) return auth;

  const resolvedParams = await params;
  const suggestionId = resolvedParams.id;
  if (!suggestionId) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    const result = await acceptTopicSuggestionFor(auth, suggestionId);
    if (!result) {
      return NextResponse.json(
        { error: 'Suggestion not found, not pending, or already processed' },
        { status: 404 },
      );
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
