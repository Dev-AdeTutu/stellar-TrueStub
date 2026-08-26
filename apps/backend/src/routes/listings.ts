import { Router } from "express";
import { z } from "zod";
import { assessListingRisk } from "../services/listing-fraud.service";

export const listingsRouter = Router();

const listingSchema = z.object({
  id: z.string().optional(),
  eventName: z.string().min(1),
  eventDate: z.string().optional(),
  section: z.string().optional(),
  row: z.string().optional(),
  seat: z.string().optional(),
  sellerId: z.string().min(1),
  status: z.string().optional(),
});

const riskCheckSchema = z.object({
  listing: listingSchema,
  existingListings: z.array(listingSchema).default([]),
});

listingsRouter.post("/risk-check", (req, res) => {
  const parsed = riskCheckSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid listing risk-check payload",
      details: parsed.error.flatten(),
    });
  }

  return res.json(assessListingRisk(parsed.data.listing, parsed.data.existingListings));
});
