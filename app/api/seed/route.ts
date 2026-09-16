import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeString } from '@/lib/city-utils';

const SEED_RESTAURANTS = [
  {
    name: 'Le Petit Maison',
    city: 'New York',
    cuisine: 'French Fine Dining',
    description: 'Michelin-starred classic French gastronomy & rare wine cellar in Manhattan.',
    logoUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80',
    totalPaidCents: 150000, // $1,500
  },
  {
    name: 'Sakura Omakase',
    city: 'New York',
    cuisine: 'Japanese / Sushi',
    description: 'Authentic Edomae 18-course sushi omakase with fresh fish flown from Tokyo.',
    logoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
    totalPaidCents: 98000, // $980
  },
  {
    name: 'Monal Executive Restaurant',
    city: 'Lahore',
    cuisine: 'Pakistani / BBQ',
    description: 'Panoramic roof-deck dining serving supreme Mughlai Karahi & Seekh Kebabs.',
    logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    totalPaidCents: 125000, // $1,250
  },
  {
    name: 'CoCo Ichibanya Curry House',
    city: 'Tokyo',
    cuisine: 'Japanese Curry',
    description: 'World famous customizable spice-level Japanese katsu curry.',
    logoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
    totalPaidCents: 85000, // $850
  },
  {
    name: 'Haveli Restaurant',
    city: 'Lahore',
    cuisine: 'Traditional Mughlai',
    description: 'Historic Badshahi Mosque views with heritage live sitar and authentic Lamb Handi.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    totalPaidCents: 75000, // $750
  },
  {
    name: 'The Ledbury',
    city: 'London',
    cuisine: 'Contemporary British',
    description: 'Elegant Notting Hill venue featuring local game, wild mushrooms & seasonal produce.',
    logoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80',
    totalPaidCents: 62000, // $620
  },
  {
    name: 'Trattoria Bella Vista',
    city: 'New York',
    cuisine: 'Italian',
    description: 'Wood-fired Neapolitan pizza, handmade truffle tagliatelle & classic Tiramisu.',
    logoUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&q=80',
    totalPaidCents: 45000, // $450
  },
  {
    name: 'Andaaz Restaurant',
    city: 'Lahore',
    cuisine: 'Pakistani Heritage',
    description: 'Roof dining facing 400-year-old heritage architecture in the heart of Old City.',
    logoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    totalPaidCents: 35000, // $350
  },
];

export async function GET() {
  try {
    const existingCount = await prisma.restaurant.count({ where: { status: 'VERIFIED' } });

    if (existingCount > 0) {
      return NextResponse.json({ message: 'Database already has verified restaurants.', count: existingCount });
    }

    const created = [];

    for (const r of SEED_RESTAURANTS) {
      const normalizedName = normalizeString(r.name);
      const normalizedCity = normalizeString(r.city);
      const token = `tok_seed_${Math.random().toString(36).substring(2, 10)}`;

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
              status: 'SUCCEEDED',
            },
          },
        },
      });

      created.push(restaurant);
    }

    return NextResponse.json({
      message: `Successfully seeded ${created.length} restaurants!`,
      restaurants: created,
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
