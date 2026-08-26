import { MOCK_LISTINGS, TicketListing } from "@/lib/mockData/listings";

interface UseTicketListingsOptions {
  limit: number;
  offset: number;
  search?: string;
}

interface UseTicketListingsResult {
  data: {
    ticket_listings: TicketListing[];
    ticket_listings_aggregate: { aggregate: { count: number } };
  };
  loading: boolean;
  error: undefined;
}

/**
 * Drop-in replacement for Apollo's useQuery(GET_TICKET_LISTINGS, ...)
 * Returns the SAME shape so components don't need to change.
 */
export function useTicketListings({
  limit,
  offset,
  search = "",
}: UseTicketListingsOptions): UseTicketListingsResult {
  const query = search.trim().toLowerCase();

  const filtered = query
    ? MOCK_LISTINGS.filter(
        (apartment) =>
          apartment.name.toLowerCase().includes(query) ||
          apartment.location.toLowerCase().includes(query),
      )
    : MOCK_LISTINGS;

  const paged = filtered.slice(offset, offset + limit);

  return {
    data: {
      ticket_listings: paged,
      ticket_listings_aggregate: {
        aggregate: { count: filtered.length },
      },
    },
    loading: false,
    error: undefined,
  };
}