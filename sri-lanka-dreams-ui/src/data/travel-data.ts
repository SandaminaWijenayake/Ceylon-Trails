import ellaImg from "@/assets/ella-bridge.jpg";
import galleImg from "@/assets/galle-fort.jpg";
import mirissaImg from "@/assets/mirissa-beach.jpg";
import kandyImg from "@/assets/kandy-temple.jpg";
import sigiriyaImg from "@/assets/sigiriya-rock.jpg";
import safariImg from "@/assets/safari-leopard.jpg";
import teaImg from "@/assets/tea-plantation.jpg";

export interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  type: string;
  groupType: string;
  includes: string[];
  image: string;
  description: string;
  status?: "active" | "inactive";
}

export interface Destination {
  name: string;
  image: string;
  tourCount: number;
  tagline: string;
}

export const destinations: Destination[] = [
  { name: "Ella", image: ellaImg, tourCount: 24, tagline: "Mountain railways & misty trails" },
  { name: "Galle", image: galleImg, tourCount: 18, tagline: "Colonial charm meets coastal beauty" },
  { name: "Mirissa", image: mirissaImg, tourCount: 15, tagline: "Whale watching & golden beaches" },
  { name: "Kandy", image: kandyImg, tourCount: 22, tagline: "Sacred temples & hill country" },
  { name: "Sigiriya", image: sigiriyaImg, tourCount: 12, tagline: "Ancient fortress in the sky" },
];

export const tours: Tour[] = [
  {
    id: "1",
    title: "Nine Arches Bridge Railway Adventure",
    location: "Ella",
    price: 89,
    rating: 4.8,
    reviewCount: 342,
    duration: "1 day",
    type: "Adventure",
    groupType: "Group",
    includes: ["Transport", "Guide", "Meals"],
    image: ellaImg,
    description: "Journey through tea-draped highlands aboard Sri Lanka's most scenic railway. Cross the legendary Nine Arches Bridge, hike Little Adam's Peak, and sip freshly brewed Ceylon tea at a hilltop plantation.",
    status: "active",
  },
  {
    id: "2",
    title: "Galle Fort Heritage Walking Tour",
    location: "Galle",
    price: 65,
    rating: 4.7,
    reviewCount: 218,
    duration: "1 day",
    type: "Cultural",
    groupType: "Couple",
    includes: ["Guide", "Meals"],
    image: galleImg,
    description: "Stroll through 400 years of colonial history within the ramparts of Galle Fort. Visit artisan workshops, the Maritime Museum, and end with sunset on the lighthouse promontory.",
    status: "active",
  },
  {
    id: "3",
    title: "Mirissa Whale Watching Expedition",
    location: "Mirissa",
    price: 120,
    rating: 4.9,
    reviewCount: 456,
    duration: "1 day",
    type: "Wildlife Safari",
    groupType: "Family",
    includes: ["Transport", "Guide", "Meals"],
    image: mirissaImg,
    description: "Set out at dawn for the deep Indian Ocean where blue whales, sperm whales, and spinner dolphins cruise past the southern coast. Afternoon free for beach relaxation.",
    status: "active",
  },
  {
    id: "4",
    title: "Kandy Temple & Tea Country Retreat",
    location: "Kandy",
    price: 195,
    rating: 4.6,
    reviewCount: 189,
    duration: "2-3 days",
    type: "Cultural",
    groupType: "Family",
    includes: ["Transport", "Hotel", "Guide", "Meals"],
    image: kandyImg,
    description: "Visit the sacred Temple of the Tooth, experience a traditional Kandyan dance performance, and stay at a boutique tea estate in the surrounding hills.",
    status: "active",
  },
  {
    id: "5",
    title: "Sigiriya Rock Fortress & Dambulla Caves",
    location: "Sigiriya",
    price: 145,
    rating: 4.8,
    reviewCount: 378,
    duration: "2-3 days",
    type: "Adventure",
    groupType: "Group",
    includes: ["Transport", "Hotel", "Guide"],
    image: sigiriyaImg,
    description: "Climb the 1,200 steps to the summit of Sigiriya, marvel at the ancient frescoes, and explore the five cave temples of Dambulla filled with centuries-old Buddhist murals.",
    status: "active",
  },
  {
    id: "6",
    title: "Yala National Park Safari",
    location: "Colombo",
    price: 175,
    rating: 4.7,
    reviewCount: 293,
    duration: "2-3 days",
    type: "Wildlife Safari",
    groupType: "Family",
    includes: ["Transport", "Hotel", "Guide", "Meals"],
    image: safariImg,
    description: "Track leopards, elephants, and sloth bears in Asia's most wildlife-dense park. Camp under starlit skies and wake to the calls of painted storks.",
    status: "active",
  },
  {
    id: "7",
    title: "Hill Country Tea Trail Hike",
    location: "Ella",
    price: 110,
    rating: 4.5,
    reviewCount: 167,
    duration: "4-7 days",
    type: "Hiking",
    groupType: "Solo",
    includes: ["Transport", "Hotel", "Guide", "Meals"],
    image: teaImg,
    description: "Multi-day trekking through emerald tea estates, misty peaks, and hidden waterfalls. Stay in colonial-era bungalows and taste single-origin tea at each stop.",
    status: "active",
  },
  {
    id: "8",
    title: "Luxury Southern Coast Escape",
    location: "Mirissa",
    price: 450,
    rating: 4.9,
    reviewCount: 84,
    duration: "4-7 days",
    type: "Luxury",
    groupType: "Couple",
    includes: ["Transport", "Hotel", "Guide", "Meals"],
    image: mirissaImg,
    description: "Five nights at an oceanfront villa with private pool, couples spa treatments, sunset catamaran cruise, and personal chef dinner on the beach.",
    status: "active",
  },
];

export const testimonials = [
  {
    name: "Amara Hendricks",
    location: "Melbourne, Australia",
    text: "The train ride through Ella was the single most breathtaking experience of my life. Our guide knew every hidden waterfall along the route.",
    rating: 5,
    initials: "AH",
  },
  {
    name: "Tobias Lindqvist",
    text: "We saw three blue whales on our Mirissa trip — an absolutely unforgettable morning. The crew were professional and genuinely passionate.",
    location: "Stockholm, Sweden",
    rating: 5,
    initials: "TL",
  },
  {
    name: "Priya Sharma",
    text: "Sigiriya at sunrise, with barely anyone else around — pure magic. The itinerary was perfectly paced and our hotel exceeded expectations.",
    location: "Toronto, Canada",
    rating: 5,
    initials: "PS",
  },
];

export const bookings = [
  { id: "BK-2847", user: "Amara Hendricks", tour: "Nine Arches Bridge Railway Adventure", date: "2026-04-12", status: "confirmed" as const, amount: 178 },
  { id: "BK-2848", user: "Tobias Lindqvist", tour: "Mirissa Whale Watching Expedition", date: "2026-04-15", status: "pending" as const, amount: 240 },
  { id: "BK-2849", user: "Priya Sharma", tour: "Sigiriya Rock Fortress & Dambulla Caves", date: "2026-04-18", status: "confirmed" as const, amount: 290 },
  { id: "BK-2850", user: "Chen Wei", tour: "Yala National Park Safari", date: "2026-04-20", status: "cancelled" as const, amount: 350 },
  { id: "BK-2851", user: "Sarah Mitchell", tour: "Luxury Southern Coast Escape", date: "2026-04-22", status: "confirmed" as const, amount: 900 },
  { id: "BK-2852", user: "Raj Patel", tour: "Hill Country Tea Trail Hike", date: "2026-04-25", status: "pending" as const, amount: 220 },
];

export const adminUsers = [
  { id: "1", name: "Amara Hendricks", email: "amara@example.com", role: "user" as const, bookings: 3, lastActive: "2 hours ago", initials: "AH" },
  { id: "2", name: "Tobias Lindqvist", email: "tobias@example.com", role: "user" as const, bookings: 1, lastActive: "1 day ago", initials: "TL" },
  { id: "3", name: "Priya Sharma", email: "priya@example.com", role: "admin" as const, bookings: 5, lastActive: "Just now", initials: "PS" },
  { id: "4", name: "Chen Wei", email: "chen@example.com", role: "user" as const, bookings: 2, lastActive: "3 days ago", initials: "CW" },
  { id: "5", name: "Sarah Mitchell", email: "sarah@example.com", role: "user" as const, bookings: 4, lastActive: "5 hours ago", initials: "SM" },
];
