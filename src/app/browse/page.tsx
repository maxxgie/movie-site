import type { Metadata } from "next";

import { CatalogPage } from "@/components/catalog-page";

export const metadata: Metadata = {
  title: "Browse movies",
  description: "Browse the full catalogue by genre, year, rating and sort order.",
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      searchParams={searchParams}
      heading="Browse"
      subheading="Filter the whole catalogue by genre, release year, rating and sort order."
      showQuery={false}
    />
  );
}
