import { isKavachScenarioId, runSyntheticVerification } from "@/lib/kavach-runner";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a valid JSON body with a scenarioId." }, { status: 400 });
  }

  const scenarioId = typeof body === "object" && body !== null && "scenarioId" in body
    ? (body as { scenarioId?: unknown }).scenarioId
    : undefined;

  if (!isKavachScenarioId(scenarioId)) {
    return Response.json(
      { error: "scenarioId must be one of BFLA-001, BOLA-001, or MISCONFIG-001." },
      { status: 422 },
    );
  }

  try {
    const result = runSyntheticVerification(scenarioId);
    return Response.json(result, {
      headers: { "Cache-Control": "no-store" },
      status: result.status === "passed" ? 200 : 422,
    });
  } catch (error) {
    console.error("Kavach synthetic verification failed", error);
    return Response.json(
      { error: "The synthetic verification could not complete. No proof result was accepted." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
