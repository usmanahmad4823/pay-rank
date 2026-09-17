import { PrismaClient } from '@prisma/client';
import { resolveLocationDetails, normalizeString } from '../lib/city-utils';

const prisma = new PrismaClient();

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
    name: 'Sakura Omakase',
    city: 'Karachi',
    province: 'Sindh',
    cuisine: 'Japanese / Sushi',
    description: 'Authentic Edomae 18-course sushi omakase with fresh fish flown from Tokyo.',
    logoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
    totalPaidCents: 98000, // $980
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
    name: 'CoCo Ichibanya Curry House',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    cuisine: 'Japanese Curry',
    description: 'World famous customizable spice-level Japanese katsu curry.',
    logoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
    totalPaidCents: 85000, // $850
  },
  {
    name: 'Haveli Restaurant',
    city: 'Lahore',
    province: 'Punjab',
    cuisine: 'Traditional Mughlai',
    description: 'Historic Badshahi Mosque views with heritage live sitar and authentic Lamb Handi.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    totalPaidCents: 75000, // $750
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
    name: 'Trattoria Bella Vista',
    city: 'Rawalpindi',
    province: 'Punjab',
    cuisine: 'Italian',
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
    name: 'Shekhupura Karahi House',
    city: 'Sheikhupura',
    province: 'Punjab',
    cuisine: 'Pakistani / Karahi',
    description: 'Famous Highway Mutton Karahi and fresh Tandoori Naan.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    totalPaidCents: 31000, // $310
  },
];

async function main() {
  console.log('Seeding initial verified restaurants with location metadata...');
  await prisma.payment.deleteMany();
  await prisma.restaurant.deleteMany();

  for (const r of SEED_RESTAURANTS) {
    const normalizedName = normalizeString(r.name);
    const location = resolveLocationDetails(r.city, r.province);
    const token = `tok_seed_${Math.random().toString(36).substring(2, 10)}`;

    await prisma.restaurant.create({
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
            status: 'SUCCEEDED',
          },
        },
      },
    });
  }
  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
