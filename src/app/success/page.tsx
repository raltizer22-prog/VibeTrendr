import { SuccessPageClient } from "@/components/success-page-client";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextPath = typeof resolvedSearchParams?.next === "string" ? resolvedSearchParams.next : "/app";

  return <SuccessPageClient nextPath={nextPath} />;
}
