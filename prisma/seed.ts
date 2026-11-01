import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding EventSense celebration database with 3 rich demo events...");

  // Clear existing records
  await prisma.auditLog.deleteMany();
  await prisma.ideaItem.deleteMany();
  await prisma.vendorQuote.deleteMany();
  await prisma.vendorCategory.deleteMany();
  await prisma.timelineTask.deleteMany();
  await prisma.budgetItem.deleteMany();
  await prisma.event.deleteMany();

  // 1. Royal Jaipur Heritage Wedding (150 Guests, INR 12,00,000)
  const weddingDate = new Date();
  weddingDate.setDate(weddingDate.getDate() + 150); // 150 days out

  const wedding = await prisma.event.create({
    data: {
      id: "demo-wedding-jaipur",
      title: "Royal Rajputana Palace Wedding",
      eventType: "WEDDING",
      eventDate: weddingDate,
      guestCount: 150,
      totalBudget: 1200000,
      currency: "INR",
      location: "Chomu Palace, Jaipur, Rajasthan",
      notes: "Intimate heritage wedding with 3-day festivities: Mehendi, Sangeet & Royal Varmala. Emphasis on authentic Rajasthani hospitality and candlelit open courtyard staging.",
      theme: "Royal Marigold & Crimson Velvet",
      shareToken: "jaipur-wedding-demo-token-128a",
      shareTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      budgetItems: {
        create: [
          {
            category: "CATERING",
            allocatedAmount: 420000,
            spentAmount: 150000,
            notes: "Dal Baati Churma, Ker Sangri, live chaat galli, and royal dessert buffet.",
          },
          {
            category: "VENUE",
            allocatedAmount: 300000,
            spentAmount: 300000,
            notes: "Heritage courtyard, banquet hall, and poolside for Mehendi (Fully locked deposit).",
          },
          {
            category: "DECOR",
            allocatedAmount: 156000,
            spentAmount: 45000,
            notes: "Marigold floral arches, brass diyas, antique jharokha mandap backdrop.",
          },
          {
            category: "PHOTO",
            allocatedAmount: 144000,
            spentAmount: 50000,
            notes: "2 Candid photographers, 1 drone operator, traditional family portrait studio.",
          },
          {
            category: "ATTIRE",
            allocatedAmount: 96000,
            spentAmount: 40000,
            notes: "Bridal lehenga custom fitting and family safa/turban tying artist.",
          },
          {
            category: "ENTERTAINMENT",
            allocatedAmount: 48000,
            spentAmount: 20000,
            notes: "Dhol ensemble, Rajasthani folk dancers for welcome, Sangeet sound mixer.",
          },
          {
            category: "CONTINGENCY",
            allocatedAmount: 36000,
            spentAmount: 0,
            notes: "Buffer cash float for tips, transport contingencies, and emergency guest requests.",
          },
        ],
      },
      timelineTasks: {
        create: [
          {
            title: "Confirm Auspicious Date & Royal Palace Booking",
            category: "VENUE",
            dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            offsetDays: -180,
            status: "COMPLETED",
            priority: "HIGH",
            isCriticalPath: true,
            notes: "Palace courtyard locked with 50% advance.",
          },
          {
            title: "Tasting Session with Maharaja Caterers",
            category: "CATERING",
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            offsetDays: -148,
            status: "PENDING",
            priority: "HIGH",
            isCriticalPath: true,
            notes: "Sample saffron rabdi, kachori live counter, and mocktail pairings.",
          },
          {
            title: "Finalize Mandap Floral Blueprint & Lighting Plan",
            category: "DECOR",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            offsetDays: -145,
            status: "PENDING",
            priority: "MEDIUM",
            isCriticalPath: false,
            notes: "Approve 3D render of the poolside floral canopy.",
          },
          {
            title: "Dispatch Digital Video Invites & Courier Boxes",
            category: "GUESTS",
            dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            offsetDays: -130,
            status: "PENDING",
            priority: "HIGH",
            isCriticalPath: true,
            notes: "Send WhatsApp video link and track RSVPs through digital portal.",
          },
          {
            title: "Lock Catering Guaranteed Headcount (14 Days Prior)",
            category: "CATERING",
            dueDate: new Date(weddingDate.getTime() - 14 * 24 * 60 * 60 * 1000),
            offsetDays: -14,
            status: "PENDING",
            priority: "HIGH",
            isCriticalPath: true,
            notes: "Lock 150 plates with a 10% contingency tolerance.",
          },
          {
            title: "Day-of-Event Run of Show Briefing",
            category: "PLANNING",
            dueDate: new Date(weddingDate.getTime() - 2 * 24 * 60 * 60 * 1000),
            offsetDays: -2,
            status: "PENDING",
            priority: "HIGH",
            isCriticalPath: true,
            notes: "Distribute coordinator badges and emergency contact directory.",
          },
        ],
      },
      vendorCategories: {
        create: [
          {
            category: "Feast Caterer",
            checklistJson: JSON.stringify([
              "Do they provide live cooking station sneeze guards and sanitized hot plates?",
              "What is their policy on last-minute 10-15% plate additions on the wedding night?",
              "Are mineral water dispensers, dessert ice setups, and cutlery included in per-plate quote?",
              "Can they prepare Jain / strictly garlic-onion-free meals separately?",
              "Do they handle waste segregation and leftover meal donations to local shelters?",
            ]),
            quotes: {
              create: [
                {
                  vendorName: "Maharaja Royal Banquets & Feasts",
                  contactPerson: "Vikramaditya Rathore",
                  contactInfo: "+91-98290-XXXXX",
                  quotedAmount: 410000,
                  status: "SHORTLISTED",
                  weightedScore: 9.1,
                  criteriaScores: JSON.stringify({ pricing: 8.5, quality: 9.8, responsiveness: 9.0 }),
                  notes: "Includes 4 signature live counters, organic Rajasthani clay crockery, and complimentary welcome sharbat bar.",
                },
                {
                  vendorName: "Heritage Spice Catering Co.",
                  contactPerson: "Dinesh Sharma",
                  contactInfo: "+91-94140-XXXXX",
                  quotedAmount: 380000,
                  status: "DRAFT",
                  weightedScore: 8.2,
                  criteriaScores: JSON.stringify({ pricing: 9.2, quality: 7.8, responsiveness: 8.0 }),
                  notes: "Competitive pricing; live counters limited to 2 stations.",
                },
              ],
            },
          },
          {
            category: "Photographer & Cinematographer",
            checklistJson: JSON.stringify([
              "Will the lead photographer personally attend the Sangeet and Varmala?",
              "What is the turnaround time for the 3-minute cinematic teaser?",
              "Are drone flight permits over the venue secured in writing?",
              "How many raw backup drives are maintained on site?",
            ]),
            quotes: {
              create: [
                {
                  vendorName: "Katha Candid Visuals",
                  contactPerson: "Aanya Verma",
                  contactInfo: "+91-99880-XXXXX",
                  quotedAmount: 140000,
                  status: "SHORTLISTED",
                  weightedScore: 9.3,
                  criteriaScores: JSON.stringify({ pricing: 8.8, quality: 9.7, responsiveness: 9.4 }),
                  notes: "Includes teaser within 72 hours and handcrafted leather photo album.",
                },
              ],
            },
          },
        ],
      },
      ideas: {
        create: [
          {
            type: "THEME",
            title: "Candlelit Courtyard & Mogra Bloom",
            description: "Replace synthetic electric lights with 500 brass oil diyas, floating lotus bowls, and fragrant fresh white mogra garlands.",
            category: "DECOR",
            minCost: 25000,
            maxCost: 40000,
            isAdded: true,
          },
          {
            type: "MENU",
            title: "Royal Rajasthani Chaat Galli",
            description: "Interactive street-food galli serving piping hot Dal Kachori with tamarind chutney, Mirchi Vada, and saffron Kulhad Lassi.",
            category: "CATERING",
            minCost: 35000,
            maxCost: 55000,
            isAdded: true,
          },
          {
            type: "ACTIVITY",
            title: "Heritage Block-Printing Stole Station",
            description: "Guests create their own custom block-printed handloom scarves as festive souvenirs with local artisans.",
            category: "ENTERTAINMENT",
            minCost: 15000,
            maxCost: 25000,
            isAdded: false,
          },
          {
            type: "INVITATION",
            title: "Animated Scroll Invitation with Local Folk Raga",
            description: "Personalized WhatsApp web invitation featuring traditional miniature painting animations and flute backdrop score.",
            category: "DECOR",
            minCost: 8000,
            maxCost: 15000,
            isAdded: false,
          },
        ],
      },
    },
  });

  // 2. Aarav's 7th Space Explorer Birthday (45 Guests, INR 45,000)
  const bdayDate = new Date();
  bdayDate.setDate(bdayDate.getDate() + 25); // 25 days out

  const bday = await prisma.event.create({
    data: {
      id: "demo-bday-aarav",
      title: "Aarav's 7th Space Explorer Adventure",
      eventType: "BIRTHDAY",
      eventDate: bdayDate,
      guestCount: 45,
      totalBudget: 45000,
      currency: "INR",
      location: "FunZone Club House, Koramangala, Bengaluru",
      notes: "Cosmic space theme with astronaut gear, glow-in-the-dark galaxy room, and planetarium cake.",
      theme: "Galactic Navy & Neon Starlight",
      shareToken: "aarav-bday-demo-token-128b",
      shareTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      budgetItems: {
        create: [
          {
            category: "CATERING",
            allocatedAmount: 15750,
            spentAmount: 5000,
            notes: "Custom 3kg rocket cake, mini burger sliders, fruit skewers, galaxy mocktails.",
          },
          {
            category: "VENUE",
            allocatedAmount: 13500,
            spentAmount: 13500,
            notes: "3-hour hall rental with soft play equipment access.",
          },
          {
            category: "DECOR",
            allocatedAmount: 6750,
            spentAmount: 2000,
            notes: "Planetary balloon arch, solar system backdrop, LED astronaut cutout.",
          },
          {
            category: "ENTERTAINMENT",
            allocatedAmount: 5400,
            spentAmount: 0,
            notes: "Science experiment entertainer with dry ice rockets and space trivia quiz.",
          },
          {
            category: "CONTINGENCY",
            allocatedAmount: 3600,
            spentAmount: 0,
            notes: "Extra food boxes and emergency battery packs.",
          },
        ],
      },
      timelineTasks: {
        create: [
          {
            title: "Confirm Play Arena Slot & Hall Booking",
            category: "VENUE",
            dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            offsetDays: -30,
            status: "COMPLETED",
            priority: "HIGH",
            isCriticalPath: true,
            notes: "Deposit paid for 4pm - 7pm slot on Saturday.",
          },
          {
            title: "Finalize Science Entertainer & Magic Show",
            category: "ENTERTAINMENT",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            offsetDays: -22,
            status: "PENDING",
            priority: "HIGH",
            isCriticalPath: true,
            notes: "Ensure 45-minute interactive dry ice show.",
          },
          {
            title: "Assemble Astronaut Return Gift Hampers",
            category: "DECOR",
            dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
            offsetDays: -7,
            status: "PENDING",
            priority: "MEDIUM",
            isCriticalPath: false,
            notes: "Pack DIY telescope kit, space stickers, and galactic cookies.",
          },
        ],
      },
      vendorCategories: {
        create: [
          {
            category: "Custom Baker",
            checklistJson: JSON.stringify([
              "Is eggless chocolate truffle available for all tiers?",
              "Does the price include secure temperature-controlled delivery to the venue?",
              "Are edible fondant rocket toppers handcrafted or printed?",
            ]),
            quotes: {
              create: [
                {
                  vendorName: "The Sugar Planet Bakery",
                  contactPerson: "Kavita Rao",
                  contactInfo: "+91-97420-XXXXX",
                  quotedAmount: 4500,
                  status: "SHORTLISTED",
                  weightedScore: 9.4,
                  criteriaScores: JSON.stringify({ pricing: 9.0, quality: 9.8, responsiveness: 9.5 }),
                  notes: "Includes LED glowing Saturn ring on top tier.",
                },
              ],
            },
          },
        ],
      },
      ideas: {
        create: [
          {
            type: "ACTIVITY",
            title: "DIY Water Bottle Rocket Launch",
            description: "Kids assemble and launch high-flying paper and vinegar rockets on the outdoor lawn.",
            category: "ENTERTAINMENT",
            minCost: 1500,
            maxCost: 2500,
            isAdded: true,
          },
          {
            type: "MENU",
            title: "Meteorite Brownie Bites & Galaxy Soda",
            description: "Dark chocolate brownies dusted with edible silver glitter and blue butterfly pea sparkling lemonades.",
            category: "CATERING",
            minCost: 2000,
            maxCost: 3500,
            isAdded: false,
          },
        ],
      },
    },
  });

  // 3. Gulmohar Society Grand Diwali Mela (400 Guests / Families, INR 3,50,000)
  const diwaliDate = new Date();
  diwaliDate.setDate(diwaliDate.getDate() + 45); // 45 days out

  const diwali = await prisma.event.create({
    data: {
      id: "demo-community-diwali",
      title: "Gulmohar Enclave Grand Diwali Mela",
      eventType: "COMMUNITY",
      eventDate: diwaliDate,
      guestCount: 400,
      totalBudget: 350000,
      currency: "INR",
      location: "Central Amphitheatre & Gardens, Gulmohar Enclave, New Delhi",
      notes: "Annual residential festival with community cultural dance, food stalls, eco-friendly laser show, and resident awards.",
      theme: "Royal Saffron, Deep Teal & Brass Diya Radiance",
      shareToken: "diwali-mela-demo-token-128c",
      shareTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      budgetItems: {
        create: [
          {
            category: "VENUE",
            allocatedAmount: 122500,
            spentAmount: 40000,
            notes: "Amphitheatre sound setup, LED backdrop wall, 500m fairy-light canopy.",
          },
          {
            category: "CATERING",
            allocatedAmount: 105000,
            spentAmount: 30000,
            notes: "Festive sweets box for 400 families and hot chai/snack counters.",
          },
          {
            category: "PERMITS_SECURITY",
            allocatedAmount: 52500,
            spentAmount: 15000,
            notes: "Fire station NOC, 6 additional security marshals, clean-up crew.",
          },
          {
            category: "ACTIVITIES",
            allocatedAmount: 35000,
            spentAmount: 8000,
            notes: "Rangoli competition hampers, tambola prizes, trophies for cultural performers.",
          },
          {
            category: "CONTINGENCY",
            allocatedAmount: 35000,
            spentAmount: 0,
            notes: "Backup diesel generator fuel and rain canopy tarpaulins.",
          },
        ],
      },
      timelineTasks: {
        create: [
          {
            title: "Submit Local Police & Fire Safety NOC Application",
            category: "PERMITS_SECURITY",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            offsetDays: -42,
            status: "IN_PROGRESS",
            priority: "HIGH",
            isCriticalPath: true,
            notes: "Documents submitted to district office for sound curfew clearance until 10 PM.",
          },
          {
            title: "Contract Amphitheatre Staging & Fairy Light Vendor",
            category: "VENUE",
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            offsetDays: -35,
            status: "PENDING",
            priority: "HIGH",
            isCriticalPath: true,
            notes: "Ensure tree illumination throughout compound perimeter.",
          },
          {
            title: "Publish Resident Performance Registration Link",
            category: "ACTIVITIES",
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            offsetDays: -30,
            status: "PENDING",
            priority: "MEDIUM",
            isCriticalPath: false,
            notes: "Kids and elders cultural dance slots registration.",
          },
        ],
      },
      vendorCategories: {
        create: [
          {
            category: "Sound & Stage Lighting",
            checklistJson: JSON.stringify([
              "Is sound calibrated to strictly adhere to residential 55 dB limits at boundaries?",
              "Does the vendor supply dedicated on-site sound engineer and backup mixer?",
              "Are cables weatherproofed and taped down to prevent tripping hazards?",
            ]),
            quotes: {
              create: [
                {
                  vendorName: "Sur Taal Audio Visuals",
                  contactPerson: "Harpreet Singh",
                  contactInfo: "+91-98110-XXXXX",
                  quotedAmount: 95000,
                  status: "SHORTLISTED",
                  weightedScore: 9.0,
                  criteriaScores: JSON.stringify({ pricing: 8.9, quality: 9.3, responsiveness: 8.8 }),
                  notes: "Includes 4 wireless mics, stage wash lighting, and silent DG set.",
                },
              ],
            },
          },
        ],
      },
      ideas: {
        create: [
          {
            type: "ACTIVITY",
            title: "Eco-Friendly Laser & Diya Synchronized Show",
            description: "Zero-smoke digital laser show synchronized with community earthen diya lighting across central lawns.",
            category: "VENUE",
            minCost: 20000,
            maxCost: 35000,
            isAdded: true,
          },
          {
            type: "MENU",
            title: "Artisanal Mithai Tasting Pavilion",
            description: "Curated sweet stalls featuring regional Indian specialties: Ghewar, Kaju Katli, and Mysore Pak.",
            category: "CATERING",
            minCost: 25000,
            maxCost: 40000,
            isAdded: true,
          },
        ],
      },
    },
  });

  console.log(`Seed completed successfully!`);
  console.log(`- Created Wedding: ${wedding.title} (ID: ${wedding.id})`);
  console.log(`- Created Birthday: ${bday.title} (ID: ${bday.id})`);
  console.log(`- Created Community: ${diwali.title} (ID: ${diwali.id})`);
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
