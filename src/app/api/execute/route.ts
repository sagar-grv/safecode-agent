import { executeRequestSchema } from "@/lib/contracts";
import { executeTask } from "@/lib/execution-service";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = executeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "The execution request is invalid.",
        issues: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 422 },
    );
  }

  try {
    const result = await executeTask(parsed.data);
    return Response.json(result, {
      status: result.ok ? 200 : 422,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sandbox execution failed.";

    console.error("SafeCode execution failure", {
      name: error instanceof Error ? error.name : "UnknownError",
      message,
    });

    return Response.json(
      {
        error:
          "The isolated runtime could not be started. No code was executed on the application host.",
        detail:
          process.env.NODE_ENV === "development"
            ? message
            : "Check the Vercel Sandbox runtime logs for this request.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
