export interface Order {
  no: number;
  stockId: string;
  invoiceNo: string;
  invoiceDate: string;
  makeModel: string;
  chassisNumber: string;
  term: string;
  cost: number;
  status: 'In Transit' | 'Customs Cleared' | 'Delivered' | 'Auction Secured';
}

export interface Payment {
  id: string;
  invoiceOrPayment: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface Bid {
  id: string;
  lotNo: string;
  makeModel: string;
  bidAmount: number;
  maxBid: number;
  bidDate: string;
  auctionDate: string;
  auctionHall: string;
  status: 'Won' | 'Outbid' | 'Pending' | 'Cancelled';
}

export interface NegotiationMessage {
  sender: 'User' | 'Agent';
  timestamp: string;
  text: string;
}

export interface Negotiation {
  id: string;
  referenceNo: string;
  invoiceNo: string;
  makeModel: string;
  image: string;
  latestDate: string;
  location: string;
  originalPrice: number;
  offeredPrice: number;
  transactionStatus: 'Active' | 'Approved' | 'Rejected' | 'Expired';
  paymentStatus: 'Unpaid' | 'Deposit Paid' | 'Paid';
  unreadMessagesCount: number;
  category: 'Order' | 'Item' | 'Payment Notification' | 'Documents Received' | 'Item Received' | 'Expired';
  messages: NegotiationMessage[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  modelCode: string;
  year: number;
  month: number;
  price: number;
  mileage: number; // in km
  engineCC: number;
  fuel: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  color: string;
  steering: 'Right' | 'Left';
  drivetrain: '2WD' | '4WD' | 'AWD';
  transmission: 'Automatic' | 'Manual' | 'CVT';
  image: string;
  grade: string;
  lotNo?: string;
}

// Stats summary data
export const dashboardStats = {
  totalOrders: 14,
  totalInvoiceAmount: 245000,
  totalPayments: 198500,
  currentBalance: 46500,
  pendingBids: 8,
  activeNegotiations: 3,
};

// Orders Dummy Data
export const mockOrders: Order[] = [
  {
    no: 1,
    stockId: "TK-2950",
    invoiceNo: "INV-2026-001",
    invoiceDate: "2026-05-12",
    makeModel: "Toyota Land Cruiser Prado 2022",
    chassisNumber: "GDJ150-019842",
    term: "CIF",
    cost: 38500,
    status: "In Transit",
  },
  {
    no: 2,
    stockId: "TK-8491",
    invoiceNo: "INV-2026-002",
    invoiceDate: "2026-05-10",
    makeModel: "Nissan Skyline GT-R R34 1999",
    chassisNumber: "BNR34-002931",
    term: "FOB",
    cost: 89000,
    status: "Auction Secured",
  },
  {
    no: 3,
    stockId: "TK-1102",
    invoiceNo: "INV-2026-003",
    invoiceDate: "2026-04-28",
    makeModel: "Subaru Impreza WRX STI Type R 1998",
    chassisNumber: "GC8-062831",
    term: "CIF",
    cost: 29500,
    status: "Customs Cleared",
  },
  {
    no: 4,
    stockId: "TK-7382",
    invoiceNo: "INV-2026-004",
    invoiceDate: "2026-04-15",
    makeModel: "Mitsubishi Lancer Evolution IX 2006",
    chassisNumber: "CT9A-0401948",
    term: "CIF",
    cost: 42000,
    status: "Delivered",
  },
  {
    no: 5,
    stockId: "TK-3482",
    invoiceNo: "INV-2026-005",
    invoiceDate: "2026-04-02",
    makeModel: "Honda Civic Type R FL5 2023",
    chassisNumber: "FL5-1002341",
    term: "FOB",
    cost: 46000,
    status: "Delivered",
  },
];

// Payments Dummy Data
export const mockPayments: Payment[] = [
  {
    id: "PAY-101",
    invoiceOrPayment: "INV-2026-001",
    date: "2026-05-12",
    description: "Invoice issued: Toyota Land Cruiser Prado 2022",
    debit: 38500,
    credit: 0,
    balance: 38500,
  },
  {
    id: "PAY-102",
    invoiceOrPayment: "TXN-902384",
    date: "2026-05-13",
    description: "Telegraphic Transfer Deposit — Received",
    debit: 0,
    credit: 15000,
    balance: 23500,
  },
  {
    id: "PAY-103",
    invoiceOrPayment: "INV-2026-002",
    date: "2026-05-10",
    description: "Invoice issued: Nissan Skyline GT-R R34 1999",
    debit: 89000,
    credit: 0,
    balance: 112500,
  },
  {
    id: "PAY-104",
    invoiceOrPayment: "TXN-902401",
    date: "2026-05-11",
    description: "Wire Transfer Full Payment BNR34 — Received",
    debit: 0,
    credit: 89000,
    balance: 23500,
  },
  {
    id: "PAY-105",
    invoiceOrPayment: "INV-2026-003",
    date: "2026-04-28",
    description: "Invoice issued: Subaru Impreza WRX STI Type R 1998",
    debit: 29500,
    credit: 0,
    balance: 53000,
  },
  {
    id: "PAY-106",
    invoiceOrPayment: "TXN-901988",
    date: "2026-04-30",
    description: "Telegraphic Transfer Full Payment GC8 — Received",
    debit: 0,
    credit: 29500,
    balance: 23500,
  },
];

// Bids Dummy Data
export const mockBids: Bid[] = [
  {
    id: "BID-8910",
    lotNo: "4019",
    makeModel: "Toyota Supra RZ 1997",
    bidAmount: 62000,
    maxBid: 68000,
    bidDate: "2026-05-20",
    auctionDate: "2026-05-22",
    auctionHall: "USS Tokyo",
    status: "Pending",
  },
  {
    id: "BID-8911",
    lotNo: "1192",
    makeModel: "Mazda RX-7 Spirit R 2002",
    bidAmount: 71000,
    maxBid: 75000,
    bidDate: "2026-05-19",
    auctionDate: "2026-05-21",
    auctionHall: "USS Yokohama",
    status: "Won",
  },
  {
    id: "BID-8912",
    lotNo: "8041",
    makeModel: "Nissan Silvia S15 Spec-R 2001",
    bidAmount: 31500,
    maxBid: 32000,
    bidDate: "2026-05-18",
    auctionDate: "2026-05-19",
    auctionHall: "CAA Chubu",
    status: "Outbid",
  },
  {
    id: "BID-8913",
    lotNo: "2941",
    makeModel: "Toyota Chaser JZX100 Tourer V 1999",
    bidAmount: 22000,
    maxBid: 24000,
    bidDate: "2026-05-15",
    auctionDate: "2026-05-16",
    auctionHall: "JU Gifu",
    status: "Won",
  },
  {
    id: "BID-8914",
    lotNo: "5081",
    makeModel: "Porsche 911 GT3 (997) 2008",
    bidAmount: 110000,
    maxBid: 120000,
    bidDate: "2026-05-14",
    auctionDate: "2026-05-17",
    auctionHall: "USS Tokyo",
    status: "Cancelled",
  },
];

// Negotiations Dummy Data
export const mockNegotiations: Negotiation[] = [
  {
    id: "NEG-001",
    referenceNo: "REF-29402",
    invoiceNo: "INV-2026-008",
    makeModel: "Nissan Skyline GT-R R32 1993",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&auto=format&fit=crop&q=60",
    latestDate: "2026-05-20",
    location: "USS Nagoya",
    originalPrice: 51000,
    offeredPrice: 48500,
    transactionStatus: "Active",
    paymentStatus: "Deposit Paid",
    unreadMessagesCount: 2,
    category: "Item",
    messages: [
      {
        sender: "Agent",
        timestamp: "2026-05-20 10:14",
        text: "The seller at USS Nagoya has rejected the initial ¥4.5M bid, but offered a counter of ¥4.85M. Would you like to lock this down? Chassis inspections are clear.",
      },
      {
        sender: "User",
        timestamp: "2026-05-20 11:30",
        text: "Are there any issues with the rear subframe rust? R32s usually have them.",
      },
      {
        sender: "Agent",
        timestamp: "2026-05-20 11:45",
        text: "Our field team checked it. Very clean, minor surface rust which can be treated before container loading. Will upload photos in a minute.",
      },
    ],
  },
  {
    id: "NEG-002",
    referenceNo: "REF-91048",
    invoiceNo: "INV-2026-002",
    makeModel: "Toyota Supra RZ 1994",
    image: "https://images.unsplash.com/photo-1605558158359-18c1480b868e?w=600&auto=format&fit=crop&q=60",
    latestDate: "2026-05-18",
    location: "USS Tokyo",
    originalPrice: 78000,
    offeredPrice: 78000,
    transactionStatus: "Approved",
    paymentStatus: "Paid",
    unreadMessagesCount: 0,
    category: "Order",
    messages: [
      {
        sender: "User",
        timestamp: "2026-05-17 14:00",
        text: "Negotiation settled. I have wired the outstanding ¥7.8M. Please check.",
      },
      {
        sender: "Agent",
        timestamp: "2026-05-18 09:12",
        text: "Payment received in full. We are moving this vehicle to the Yokohama port for the June shipping schedule. Tracking documents will follow.",
      },
    ],
  },
  {
    id: "NEG-003",
    referenceNo: "REF-40194",
    invoiceNo: "INV-2026-012",
    makeModel: "Honda NSX 1992",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=60",
    latestDate: "2026-05-12",
    location: "USS Yokohama",
    originalPrice: 95000,
    offeredPrice: 90000,
    transactionStatus: "Expired",
    paymentStatus: "Unpaid",
    unreadMessagesCount: 0,
    category: "Expired",
    messages: [
      {
        sender: "Agent",
        timestamp: "2026-05-10 09:00",
        text: "Negotiation window for this Lot is closing in 2 hours. Seller has agreed to 90,000 USD.",
      },
      {
        sender: "Agent",
        timestamp: "2026-05-10 11:00",
        text: "This negotiation has now expired due to inactivity. The vehicle is returning to the general auction loop.",
      },
    ],
  },
];

// Wishlist vehicles
export const mockWishlist: Vehicle[] = [
  {
    id: "WISH-001",
    make: "Nissan",
    model: "Skyline GT-R R34 V-Spec II",
    modelCode: "GF-BNR34",
    year: 2001,
    month: 6,
    price: 185000,
    mileage: 62000,
    engineCC: 2600,
    fuel: "Petrol",
    color: "Bayside Blue",
    steering: "Right",
    drivetrain: "4WD",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&auto=format&fit=crop&q=60",
    grade: "4.5",
    lotNo: "3028",
  },
  {
    id: "WISH-002",
    make: "Toyota",
    model: "Supra RZ Twin Turbo",
    modelCode: "E-JZA80",
    year: 1998,
    month: 3,
    price: 74500,
    mileage: 89000,
    engineCC: 3000,
    fuel: "Petrol",
    color: "Super White",
    steering: "Right",
    drivetrain: "2WD",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1605558158359-18c1480b868e?w=600&auto=format&fit=crop&q=60",
    grade: "4",
    lotNo: "8041",
  },
  {
    id: "WISH-003",
    make: "Mazda",
    model: "RX-7 Spirit R Type A",
    modelCode: "GF-FD3S",
    year: 2002,
    month: 8,
    price: 89000,
    mileage: 41000,
    engineCC: 1308,
    fuel: "Petrol",
    color: "Titanium Grey",
    steering: "Right",
    drivetrain: "2WD",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=60",
    grade: "4.5 B",
  },
];

// Favourites vehicles
export const mockFavourites: Vehicle[] = [
  ...mockWishlist,
  {
    id: "FAV-001",
    make: "Subaru",
    model: "Impreza 22B STI",
    modelCode: "GC8 Modified",
    year: 1998,
    month: 12,
    price: 295000,
    mileage: 18000,
    engineCC: 2200,
    fuel: "Petrol",
    color: "Sonic Blue Mica",
    steering: "Right",
    drivetrain: "4WD",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&auto=format&fit=crop&q=60",
    grade: "5",
    lotNo: "0022",
  },
  {
    id: "FAV-002",
    make: "Honda",
    model: "Integra Type R DC5",
    modelCode: "LA-DC5",
    year: 2004,
    month: 9,
    price: 19800,
    mileage: 114000,
    engineCC: 2000,
    fuel: "Petrol",
    color: "Championship White",
    steering: "Right",
    drivetrain: "2WD",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1605558158359-18c1480b868e?w=600&auto=format&fit=crop&q=60",
    grade: "3.5",
  },
  {
    id: "FAV-003",
    make: "Nissan",
    model: "Fairlady Z 240Z",
    modelCode: "S30",
    year: 1972,
    month: 5,
    price: 65000,
    mileage: 154000,
    engineCC: 2400,
    fuel: "Petrol",
    color: "Safari Gold",
    steering: "Left",
    drivetrain: "2WD",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=60",
    grade: "3.5 C",
  },
];

// Importer portfolio (public listing for customer inquiries)
export interface PortfolioProduct {
  id: string;
  title: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  status: 'Available' | 'Reserved' | 'Sold';
  image: string;
  description: string;
}

export interface PortfolioSeller {
  id: string;
  name: string;
  title: string;
  company: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  bio: string;
  memberSince: string;
  verified: boolean;
  products: PortfolioProduct[];
}

export const portfolioSellers: PortfolioSeller[] = [
  {
    id: 'dharshini-kumar',
    name: 'Dharshini Kumar',
    title: 'Gold Importer',
    company: 'XorCodes Automotive Ltd.',
    city: 'Tokyo',
    country: 'Japan',
    email: 'importer@xorcodes.com',
    phone: '+81 90-8841-2940',
    bio: 'Specialist in JDM performance and classic imports. All vehicles are auction-verified with export documentation support.',
    memberSince: '2019',
    verified: true,
    products: [
      {
        id: 'P-001',
        title: 'Nissan Skyline GT-R R34 V-Spec II',
        year: 2001,
        price: 185000,
        mileage: 62000,
        location: 'USS Tokyo',
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&auto=format&fit=crop&q=60',
        description: 'Bayside Blue, manual, 4WD. Auction grade 4.5. Ready for container booking.',
      },
      {
        id: 'P-002',
        title: 'Toyota Supra RZ Twin Turbo',
        year: 1998,
        price: 74500,
        mileage: 89000,
        location: 'USS Nagoya',
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1605558158359-18c1480b868e?w=600&auto=format&fit=crop&q=60',
        description: 'Super White, 6-speed manual. Full service history available on request.',
      },
      {
        id: 'P-003',
        title: 'Mazda RX-7 Spirit R Type A',
        year: 2002,
        price: 89000,
        mileage: 41000,
        location: 'USS Yokohama',
        status: 'Reserved',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=60',
        description: 'Titanium Grey, low mileage Spirit R. Currently reserved — inquiries welcome for waitlist.',
      },
      {
        id: 'P-004',
        title: 'Subaru Impreza 22B STI',
        year: 1998,
        price: 295000,
        mileage: 18000,
        location: 'CAA Chubu',
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&auto=format&fit=crop&q=60',
        description: 'Sonic Blue Mica, wide-body 22B. Rare stock — serious buyers only.',
      },
    ],
  },
];

export function getPortfolioSeller(sellerId: string): PortfolioSeller | undefined {
  return portfolioSellers.find((s) => s.id === sellerId);
}

// Profile Details
export const mockProfile = {
  title: "Mr.",
  name: "Dharshini Kumar",
  company: "XorCodes Automotive Ltd.",
  address: "15 Shinagawa Ledger Way, Block C",
  city: "Tokyo",
  province: "Kanto",
  postCode: "108-0075",
  country: "Japan",
  email: "importer@xorcodes.com",
  telMobile: "+81 90-8841-2940",
  fax: "+81 3-5582-9011",
  skype: "xorcodes.automotive",
  newsletterSubscription: true,
};
