import type { Metadata } from "next";

import { CatalogPage } from "@/components/catalog-page";

export const metadata: Metadata = {
  title: "Search movies",
  description: "Search the catalogue by title, genre, year and rating.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      searchParams={searchParams}
      heading="Search"
      subheading="Find anything in the catalogue by title, genre, year or rating."
      showQuery
    />
  );
}
