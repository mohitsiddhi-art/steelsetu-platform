export type CommunityRoomId =
  | 'mandi-rates-sentiment'
  | 'buy-rfq-exchange'
  | 'technical-qa-standards'
  | 'logistics-transport';

export interface CommunityRoom {
  id: CommunityRoomId;
  name: string;
  description: string;
  activeCount: number;
}

export interface CommunityPoll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface TechnicalQaItem {
  id: string;
  author: string;
  company: string;
  title: string;
  content: string;
  standardRef: string;
  upvotes: number;
  repliesCount: number;
  isVerifiedAnswer: boolean;
  createdAt: string;
}

export interface BuyRequirementItem {
  id: string;
  buyerName: string;
  company: string;
  companyName: string;
  requirement: string;
  location: string;
  targetPrice: string;
  quantityTons: number;
  createdAt: string;
}

export interface LogisticsUpdateItem {
  id: string;
  route: string;
  vehicleType: string;
  ratePerMt: string;
  availability: string;
  updatedAt: string;
}

const ROOMS: CommunityRoom[] = [
  {
    id: 'mandi-rates-sentiment',
    name: 'Mandi Rates & Sentiment',
    description: 'Market price trends, Burrabazar rolling margins, and supply forecasts.',
    activeCount: 142,
  },
  {
    id: 'buy-rfq-exchange',
    name: 'Buy RFQ & Spot Exchange',
    description: 'Commercial buy requirements, instant tonnage matching, and spot lifting.',
    activeCount: 89,
  },
  {
    id: 'technical-qa-standards',
    name: 'Technical QA & Standards',
    description: 'IS 1786, IS 277, gauge tolerances, MTC test certificates, and metallurgy.',
    activeCount: 64,
  },
  {
    id: 'logistics-transport',
    name: 'Logistics & Truck Freight',
    description: 'Dankuni, Durgapur, Singur trailer freight rates, yard loading & transport updates.',
    activeCount: 118,
  },
];

let MOCK_POLL: CommunityPoll = {
  id: 'poll-1',
  question: 'Where do you see TMT 12mm Fe 500D prices heading next week in Burrabazar?',
  options: [
    { id: 'opt-1', text: 'Bullish (+₹500/MT due to mill scrap hike)', votes: 84 },
    { id: 'opt-2', text: 'Range-bound / Consolidate at current levels', votes: 126 },
    { id: 'opt-3', text: 'Bearish Correction (demand softening)', votes: 35 },
  ],
  totalVotes: 245,
};

let MOCK_QAS: TechnicalQaItem[] = [
  {
    id: 'qa-1',
    author: 'Rajesh Agarwal',
    company: 'Agarwal Steel Traders',
    title: 'Allowable rolling tolerance on 0.50mm PPGL profile sheet as per IS 277',
    content: 'What is the acceptable thickness tolerance for 0.50mm color coated galvalume sheets delivered from JSW/Tata mills under IS 277 standard?',
    standardRef: 'IS 277 Clause 7.2',
    upvotes: 42,
    repliesCount: 8,
    isVerifiedAnswer: true,
    createdAt: '2 hours ago',
  },
  {
    id: 'qa-2',
    author: 'Vikram Singhi',
    company: 'Singhi Enterprises',
    title: 'How to verify MTC (Mill Test Certificate) batch numbers for Fe550D rebar?',
    content: 'Clients in Dankuni project are asking for digital MTC cross-verification against heat numbers stamped on rebar ribs.',
    standardRef: 'IS 1786:2008',
    upvotes: 29,
    repliesCount: 5,
    isVerifiedAnswer: false,
    createdAt: 'Yesterday',
  },
];

let MOCK_BUYS: BuyRequirementItem[] = [
  {
    id: 'buy-1',
    buyerName: 'Subhash Guha',
    company: 'Guha Infrastructure Ltd',
    companyName: 'Guha Infrastructure Ltd',
    requirement: 'Need 32 MT Fe 550D TMT 16mm & 12mm mixed for pile foundation at Dankuni site.',
    location: 'Dankuni, Howrah',
    targetPrice: '₹58,500/MT Delivered',
    quantityTons: 32,
    createdAt: '45 mins ago',
  },
  {
    id: 'buy-2',
    buyerName: 'Amit Jhunjhunwala',
    company: 'Jhunjhunwala Roofing Solutions',
    companyName: 'Jhunjhunwala Roofing Solutions',
    requirement: 'Urgent requirement of 18 MT PPGL Profile Sheets 0.47mm AZ150 (Castle Blue).',
    location: 'Barasat, 24 Parganas',
    targetPrice: '₹77,000/MT Ex-Yard',
    quantityTons: 18,
    createdAt: '3 hours ago',
  },
];

let MOCK_LOGISTICS: LogisticsUpdateItem[] = [
  {
    id: 'log-1',
    route: 'Burrabazar Yard → Dankuni Site',
    vehicleType: '10-Wheel Heavy Truck (16 MT)',
    ratePerMt: '₹2,100 / MT',
    availability: 'Immediate (12 trucks ready)',
    updatedAt: '30 mins ago',
  },
  {
    id: 'log-2',
    route: 'Kalinganagar Mill → Burrabazar Godown',
    vehicleType: 'Multi-Axle Trailer (25 MT)',
    ratePerMt: '₹1,850 / MT',
    availability: 'Available tomorrow morning',
    updatedAt: '2 hours ago',
  },
  {
    id: 'log-3',
    route: 'Burrabazar → Durgapur Expressway',
    vehicleType: 'Small Truck (9 MT)',
    ratePerMt: '₹2,400 / MT',
    availability: 'Immediate (5 trucks ready)',
    updatedAt: '4 hours ago',
  },
];

export async function getRooms(): Promise<CommunityRoom[]> {
  return ROOMS;
}

export async function getPoll(): Promise<CommunityPoll> {
  return MOCK_POLL;
}

export async function votePoll(optionId: string): Promise<CommunityPoll> {
  if (MOCK_POLL.userVotedOptionId) return MOCK_POLL;
  const opts = MOCK_POLL.options.map((o) => {
    if (o.id === optionId) {
      return { ...o, votes: o.votes + 1 };
    }
    return o;
  });
  MOCK_POLL = {
    ...MOCK_POLL,
    options: opts,
    totalVotes: MOCK_POLL.totalVotes + 1,
    userVotedOptionId: optionId,
  };
  return MOCK_POLL;
}

export async function getTechnicalQas(): Promise<TechnicalQaItem[]> {
  return MOCK_QAS;
}

export async function getBuyRequirements(): Promise<BuyRequirementItem[]> {
  return MOCK_BUYS;
}

export async function getLogisticsUpdates(): Promise<LogisticsUpdateItem[]> {
  return MOCK_LOGISTICS;
}
