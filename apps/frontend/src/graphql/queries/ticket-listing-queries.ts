import { graphql } from "@/graphql/generated";

export const GET_TICKET_LISTINGS = graphql(`
  query GetTicketListings(
    $limit: Int
    $offset: Int
    $where: ticket_listings_bool_exp
    $order_by: [ticket_listings_order_by!]
  ) {
    ticket_listings(
      limit: $limit
      offset: $offset
      where: $where
      order_by: $order_by
    ) {
      id
      name
      location
      address
      bedrooms
      bathrooms
      price
      status
      promoted
      created_at
      updated_at
      listing_offers_aggregate {
        aggregate {
          count
        }
      }
    }
    ticket_listings_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`);

export const GET_TICKET_LISTING_BY_ID = graphql(`
  query GetTicketListingById($id: Int!) {
    ticket_listings_by_pk(id: $id) {
      id
      name
      location
      address
      bedrooms
      bathrooms
      price
      status
      promoted
      created_at
      updated_at
    }
  }
`);

export const GET_LISTING_OFFERS = graphql(`
  query GetListingOffers(
    $listing_id: Int!
    $limit: Int
    $offset: Int
    $order_by: [rental_offers_order_by!]
  ) {
    listing_offers(
      where: { listing_id: { _eq: $listing_id } }
      limit: $limit
      offset: $offset
      order_by: $order_by
    ) {
      id
      buyer_name
      buyer_phone
      buyer_wallet_address
      offer_date
      bid_status
      created_at
    }
    listing_offers_aggregate(where: { listing_id: { _eq: $listing_id } }) {
      aggregate {
        count
      }
    }
  }
`);
