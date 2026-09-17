import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeString, resolveLocationDetails } from '@/lib/city-utils';

const SEED_RESTAURANTS = [
  {
    name: 'Le Petit Maison',
    city: 'Lahore',
    province: 'Punjab',
    cuisine: 'French Fine Dining',
    description: 'Michelin-starred classic French gastronomy & rare wine cellar in Manhattan.',
    logoUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80',
    totalPaidCents: 150000, // $1,500
  },
  {
    name: 'Monal Executive Restaurant',
    city: 'Lahore',
    province: 'Punjab',
    cuisine: 'Pakistani / BBQ',
    description: 'Panoramic roof-deck dining serving supreme Mughlai Karahi & Seekh Kebabs.',
    logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    totalPaidCents: 125000, // $1,250
  },
  {
    name: 'Sakura Omakase',
    city: 'Karachi',
    province: 'Sindh',
    cuisine: 'Japanese / Sushi',
    description: 'Authentic Edomae 18-course sushi omakase with fresh fish flown from Tokyo.',
    logoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
    totalPaidCents: 98000, // $980
  },
  {
    name: 'Osteria Francescana',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    cuisine: 'Italian Fine Dining',
    description: 'Modern Italian culinary art with fresh truffle selections.',
    logoUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80',
    totalPaidCents: 91000, // $910
  },
  {
    name: 'Pitmaster Texas BBQ',
    city: 'Rawalpindi',
    province: 'Punjab',
    cuisine: 'BBQ / Smokehouse',
    description: 'Slow-smoked 16-hour Texas brisket & St. Louis ribs.',
    logoUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80',
    totalPaidCents: 89000, // $890
  },
  {
    name: 'CoCo Ichibanya Curry House',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    cuisine: 'Japanese Curry',
    description: 'World famous customizable spice-level Japanese katsu curry.',
    logoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
    totalPaidCents: 85000, // $850
  },
  {
    name: 'Ladurée Paris Bakery',
    city: 'Karachi',
    province: 'Sindh',
    cuisine: 'Bakery & Pastry',
    description: 'World renowned French macarons, artisan pastries & high tea experience.',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
    totalPaidCents: 81000, // $810
  },
  {
    name: 'Haveli Restaurant',
    city: 'Lahore',
    province: 'Punjab',
    cuisine: 'Pakistani / Mughlai',
    description: 'Historic Badshahi Mosque views with heritage live sitar and authentic Lamb Handi.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    totalPaidCents: 75000, // $750
  },
  {
    name: 'L’Anima Fine Dining',
    city: 'Faisalabad',
    province: 'Punjab',
    cuisine: 'Fine Dining',
    description: 'Award-winning European fine dining experience with sommelier pairings.',
    logoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    totalPaidCents: 68000, // $680
  },
  {
    name: 'Kolachi BBQ & Grill',
    city: 'Karachi',
    province: 'Sindh',
    cuisine: 'BBQ / Pakistani',
    description: 'Seaside open-air BBQ serving signature Malai Tikka & Seekh Kebabs.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    totalPaidCents: 64000, // $640
  },
  {
    name: 'The Ledbury',
    city: 'Peshawar',
    province: 'KPK',
    cuisine: 'Contemporary British',
    description: 'Elegant venue featuring local game, wild mushrooms & seasonal produce.',
    logoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80',
    totalPaidCents: 62000, // $620
  },
  {
    name: 'Khyber Shinwari',
    city: 'Peshawar',
    province: 'KPK',
    cuisine: 'Pakistani / BBQ',
    description: 'Authentic Pashtun Shinwari Karahi, Dumpukht and Lamb Tikka.',
    logoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    totalPaidCents: 52000, // $520
  },
  {
    name: 'Serena Garden BBQ',
    city: 'Quetta',
    province: 'Balochistan',
    cuisine: 'Balochi / BBQ',
    description: 'Traditional Balochi Sajji & Landhi served under starlit orchard gardens.',
    logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    totalPaidCents: 48000, // $480
  },
  {
    name: 'Trattoria Bella Vista',
    city: 'Rawalpindi',
    province: 'Punjab',
    cuisine: 'Italian / Pizza',
    description: 'Wood-fired Neapolitan pizza, handmade truffle tagliatelle & classic Tiramisu.',
    logoUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&q=80',
    totalPaidCents: 45000, // $450
  },
  {
    name: 'Andaaz Restaurant',
    city: 'Lahore',
    province: 'Punjab',
    cuisine: 'Pakistani Heritage',
    description: 'Roof dining facing 400-year-old heritage architecture in the heart of Old City.',
    logoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    totalPaidCents: 35000, // $350
  },
  {
    name: 'Shekhupura Karahi House',
    city: 'Sheikhupura',
    province: 'Punjab',
    cuisine: 'Pakistani / Karahi',
    description: 'Famous Highway Mutton Karahi and fresh Tandoori Naan.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    totalPaidCents: 31000, // $310
  },
];

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const created = [];

    for (const r of SEED_RESTAURANTS) {
      const normalizedName = normalizeString(r.name);
      const location = resolveLocationDetails(r.city, r.province);
      const token = `tok_seed_${normalizedName.replace(/\s+/g, '_')}`;

      const existing = await prisma.restaurant.findFirst({
        where: { normalizedName, normalizedCity: location.normalizedCity },
      });

      if (existing) {
        await prisma.restaurant.update({
          where: { id: existing.id },
          data: {
            city: location.displayCity,
            normalizedCity: location.normalizedCity,
            province: location.province,
            normalizedProvince: location.normalizedProvince,
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
            city: location.displayCity,
            normalizedCity: location.normalizedCity,
            province: location.province,
            normalizedProvince: location.normalizedProvince,
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
      message: `Seeded ${created.length} verified listings with location metadata.`,
      count: finalCount,
    });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
