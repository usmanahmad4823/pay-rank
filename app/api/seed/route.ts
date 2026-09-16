import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeString } from '@/lib/city-utils';

const SEED_RESTAURANTS = [
  // Fine Dining
  {
    name: 'Le Petit Maison',
    city: 'New York',
    cuisine: 'French Fine Dining',
    description: 'Michelin-starred classic French gastronomy & rare wine cellar in Manhattan.',
    logoUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80',
    totalPaidCents: 150000, // $1,500
  },
  {
    name: 'L’Anima Fine Dining',
    city: 'London',
    cuisine: 'Fine Dining',
    description: 'Award-winning European fine dining experience with sommelier pairings.',
    logoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    totalPaidCents: 68000, // $680
  },
  // Pakistani & BBQ
  {
    name: 'Monal Executive Restaurant',
    city: 'Lahore',
    cuisine: 'Pakistani / BBQ',
    description: 'Panoramic roof-deck dining serving supreme Mughlai Karahi & Seekh Kebabs.',
    logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    totalPaidCents: 125000, // $1,250
  },
  {
    name: 'Haveli Restaurant',
    city: 'Lahore',
    cuisine: 'Pakistani / Mughlai',
    description: 'Historic Badshahi Mosque views with heritage live sitar and authentic Lamb Handi.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    totalPaidCents: 75000, // $750
  },
  {
    name: 'Andaaz Restaurant',
    city: 'Lahore',
    cuisine: 'Pakistani Heritage',
    description: 'Roof dining facing 400-year-old heritage architecture in the heart of Old City.',
    logoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    totalPaidCents: 35000, // $350
  },
  // Japanese
  {
    name: 'Sakura Omakase',
    city: 'New York',
    cuisine: 'Japanese / Sushi',
    description: 'Authentic Edomae 18-course sushi omakase with fresh fish flown from Tokyo.',
    logoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
    totalPaidCents: 98000, // $980
  },
  {
    name: 'CoCo Ichibanya Curry House',
    city: 'Tokyo',
    cuisine: 'Japanese Curry',
    description: 'World famous customizable spice-level Japanese katsu curry.',
    logoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
    totalPaidCents: 85000, // $850
  },
  // BBQ
  {
    name: 'Pitmaster Texas BBQ',
    city: 'Austin',
    cuisine: 'BBQ / Smokehouse',
    description: 'Slow-smoked 16-hour Texas brisket, St. Louis ribs & artisanal craft sides.',
    logoUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80',
    totalPaidCents: 89000, // $890
  },
  {
    name: 'Kolachi BBQ & Grill',
    city: 'Karachi',
    cuisine: 'BBQ / Pakistani',
    description: 'Seaside open-air BBQ serving signature Malai Tikka & Seekh Kebabs.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    totalPaidCents: 64000, // $640
  },
  // Italian
  {
    name: 'Trattoria Bella Vista',
    city: 'New York',
    cuisine: 'Italian / Pizza',
    description: 'Wood-fired Neapolitan pizza, handmade truffle tagliatelle & classic Tiramisu.',
    logoUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&q=80',
    totalPaidCents: 45000, // $450
  },
  {
    name: 'Osteria Francescana',
    city: 'Modena',
    cuisine: 'Italian Fine Dining',
    description: '3-Michelin-star modern Italian culinary art by Chef Massimo Bottura.',
    logoUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80',
    totalPaidCents: 91000, // $910
  },
  // Cafes
  {
    name: 'Roast & Beans Artisan Cafe',
    city: 'Seattle',
    cuisine: 'Cafes & Specialty Coffee',
    description: 'Single-origin espresso roasts, avocado sourdough toast & organic matcha lattes.',
    logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80',
    totalPaidCents: 59000, // $590
  },
  {
    name: 'Espresso Lab Cafe',
    city: 'London',
    cuisine: 'Cafes',
    description: 'Specialty pour-over coffee bar with house-baked almond croissants.',
    logoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    totalPaidCents: 38000, // $380
  },
  // Bakery
  {
    name: 'Ladurée Paris Bakery',
    city: 'Paris',
    cuisine: 'Bakery & Pastry',
    description: 'World renowned French macarons, artisan pastries & high tea experience.',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
    totalPaidCents: 81000, // $810
  },
  {
    name: 'Bakehouse Artisan Bakery',
    city: 'San Francisco',
    cuisine: 'Bakery',
    description: 'Freshly baked sourdough boules, butter croissants & cinnamon rolls.',
    logoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    totalPaidCents: 43000, // $430
  },
  // Fast Casual
  {
    name: 'Shake Shack Smashed Burgers',
    city: 'New York',
    cuisine: 'Fast Casual',
    description: '100% Angus beef smashed burgers, crinkle-cut fries & hand-spun frozen custard.',
    logoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    totalPaidCents: 54000, // $540
  },
  // Contemporary British
  {
    name: 'The Ledbury',
    city: 'London',
    cuisine: 'Contemporary British',
    description: 'Elegant Notting Hill venue featuring local game, wild mushrooms & seasonal produce.',
    logoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80',
    totalPaidCents: 62000, // $620
  },
];

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    const created = [];

    for (const r of SEED_RESTAURANTS) {
      const normalizedName = normalizeString(r.name);
      const normalizedCity = normalizeString(r.city);
      const token = `tok_seed_${normalizedName.replace(/\s+/g, '_')}`;

      const existing = await prisma.restaurant.findFirst({
        where: { normalizedName, normalizedCity },
      });

      if (existing) {
        await prisma.restaurant.update({
          where: { id: existing.id },
          data: {
            cuisine: r.cuisine,
            description: r.description,
            logoUrl: r.logoUrl,
            totalPaidCents: r.totalPaidCents,
            status: 'VERIFIED',
          },
        });
        created.push(existing.name);
      } else {
        const restaurant = await prisma.restaurant.create({
          data: {
            name: r.name,
            normalizedName,
            city: r.city,
            normalizedCity,
            cuisine: r.cuisine,
            description: r.description,
            logoUrl: r.logoUrl,
            totalPaidCents: r.totalPaidCents,
            ownerEditToken: token,
            status: 'VERIFIED',
            payments: {
              create: {
                amountCents: r.totalPaidCents,
                status: 'COMPLETED',
                stripeSessionId: `cs_seed_${normalizedName}`,
              },
            },
          },
        });
        created.push(restaurant.name);
      }
    }

    const finalCount = await prisma.restaurant.count({ where: { status: 'VERIFIED' } });

    return NextResponse.json({
      success: true,
      message: `Seeded ${created.length} new categories sample listings.`,
      count: finalCount,
    });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
