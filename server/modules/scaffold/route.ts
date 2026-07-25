export function moduleUnavailable(module: string) {
  return Response.json(
    { error: { code: "MODULE_NOT_AVAILABLE", message: `The ${module} module is contracted but not implemented in the Vaxa platform.` } },
    { status: 501 },
  );
}
