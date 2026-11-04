import type { DashboardCard, DashboardSection } from '@/types/platform';

/**
 * Bilingual copy for the user portal.
 *
 * The portal is the surface a Bengali-speaking contractor or a Delhi fabricator
 * is most likely to meet first, so the labels, the validation messages and the
 * dashboard tiles all carry a Hindi translation. The translation lives here
 * rather than inside the components so the same string is never spelled two
 * different ways in two places.
 *
 * The English string is always the source of truth. A Hindi string that
 * drifts from it is a translation bug, not a layout bug, and is much easier
 * to spot when both sit side by side in one file.
 */

export type PortalLang = 'en' | 'hi';

/** Pick the right side of a bilingual pair. */
export function pick<T>(lang: PortalLang, en: T, hi: T): T {
  return lang === 'hi' ? hi : en;
}

/**
 * The Devanagari font stack for Hindi text.
 *
 * `Noto Sans Devanagari` is loaded as a Next font with a CSS variable, so the
 * stack falls back gracefully if the font fails to load.
 */
export const DEVA_STACK =
  "var(--ss-deva), 'Noto Sans Devanagari', 'Nirmala UI', system-ui, sans-serif";

// ===========================================================================
// Sign-in / sign-up
// ===========================================================================

export const AUTH_COPY = {
  tagline: {
    en: 'Your steel procurement portal',
    hi: 'आपका स्टील प्रोक्योरमेंट पोर्टल',
  },
  subtitle: {
    en: 'Sign in to track inquiries, save products and get quotes from verified mills.',
    hi: 'अपनी पूछताछ, सहेजे गए उत्पादों और सत्यापित मिलों से कोटेशन पर नज़र रखें।',
  },
  signIn: { en: 'Sign In', hi: 'साइन इन करें' },
  signUp: { en: 'Create Account', hi: 'खाता बनाएँ' },
  signInTab: { en: 'Sign In', hi: 'साइन इन' },
  signUpTab: { en: 'Sign Up', hi: 'साइन अप' },
  firstName: { en: 'First Name', hi: 'पहला नाम' },
  lastName: { en: 'Last Name', hi: 'अंतिम नाम' },
  email: { en: 'Email Address', hi: 'ईमेल पता' },
  password: { en: 'Password', hi: 'पासवर्ड' },
  role: { en: 'I am a', hi: 'मैं हूँ' },
  roleBuyer: { en: 'Buyer', hi: 'खरीदार' },
  roleSeller: { en: 'Seller', hi: 'विक्रेता' },
  roleBuyerHint: {
    en: 'I buy steel for projects — contractors, fabricators, builders.',
    hi: 'मैं परियोजनाओं के लिए स्टील खरीदता हूँ — ठेकेदार, फैब्रिकेटर, बिल्डर।',
  },
  roleSellerHint: {
    en: 'I sell steel — mills, stockists and distributors.',
    hi: 'मैं स्टील बेचता हूँ — मिल, स्टॉकिस्ट और डिस्ट्रीब्यूटर।',
  },
  passwordHint: {
    en: 'At least 8 characters.',
    hi: 'कम से कम 8 अक्षर।',
  },
  submitSignIn: { en: 'Sign In', hi: 'साइन इन करें' },
  submitSignUp: { en: 'Create Account', hi: 'खाता बनाएँ' },
  signingIn: { en: 'Signing in…', hi: 'साइन इन हो रहा है…' },
  creatingAccount: { en: 'Creating account…', hi: 'खाता बन रहा है…' },
  noAccount: {
    en: "Don't have an account?",
    hi: 'खाता नहीं है?',
  },
  haveAccount: {
    en: 'Already have an account?',
    hi: 'पहले से खाता है?',
  },
  createOne: { en: 'Create one', hi: 'खाता बनाएँ' },
  signInInstead: { en: 'Sign in instead', hi: 'साइन इन करें' },
  staffEntry: {
    en: 'SteelSetu staff?',
    hi: 'स्टीलसेटु स्टाफ?',
  },
  staffEntryHint: {
    en: 'Staff members sign in at the trade desk.',
    hi: 'स्टाफ सदस्य ट्रेड डेस्क पर साइन इन करते हैं।',
  },
  tradeDesk: { en: 'Staff Trade Desk', hi: 'स्टाफ ट्रेड डेस्क' },
  securityNote: {
    en: 'Your details stay private. SteelSetu never sells your data.',
    hi: 'आपका विवरण निजी रहता है। स्टीलसेटु कभी आपका डेटा नहीं बेचता।',
  },
} as const;

/**
 * Validation messages, keyed by field.
 *
 * These are deliberately *friendly* rather than terse — the spec calls for
 * friendly validation messages, and "Password must be at least 8 characters"
 * is friendlier than "invalid password".
 */
export const VALIDATION_COPY = {
  firstNameRequired: {
    en: 'Please tell us your first name.',
    hi: 'कृपया अपना पहला नाम बताएँ।',
  },
  firstNameShort: {
    en: 'That looks a little short — please enter at least 2 characters.',
    hi: 'यह थोड़ा छोटा लग रहा है — कृपया कम से कम 2 अक्षर दर्ज करें।',
  },
  lastNameRequired: {
    en: 'Please enter your last name.',
    hi: 'कृपया अपना अंतिम नाम दर्ज करें।',
  },
  emailRequired: {
    en: 'Please enter your email address.',
    hi: 'कृपया अपना ईमेल पता दर्ज करें।',
  },
  emailInvalid: {
    en: 'That email address does not look right. Please check it.',
    hi: 'यह ईमेल पता सही नहीं लगता। कृपया इसे जाँचें।',
  },
  passwordRequired: {
    en: 'Please enter your password.',
    hi: 'कृपया अपना पासवर्ड दर्ज करें।',
  },
  passwordShort: {
    en: 'Your password needs at least 8 characters.',
    hi: 'आपके पासवर्ड में कम से कम 8 अक्षर होने चाहिए।',
  },
  roleRequired: {
    en: 'Please choose whether you are a buyer or a seller.',
    hi: 'कृपया चुनें कि आप खरीदार हैं या विक्रेता।',
  },
  credentialsRejected: {
    en: 'That email and password combination did not match. Please try again.',
    hi: 'ईमेल और पासवर्ड का यह संयोजन सही नहीं है। कृपया पुनः प्रयास करें।',
  },
  accountExists: {
    en: 'An account with that email already exists. Try signing in instead.',
    hi: 'उस ईमेल से पहले से खाता मौजूद है। साइन इन करने का प्रयास करें।',
  },
  signUpFailed: {
    en: 'We could not create your account just now. Please try again.',
    hi: 'हम अभी आपका खाता नहीं बना सके। कृपया पुनः प्रयास करें।',
  },
  signInFailed: {
    en: 'We could not sign you in just now. Please try again.',
    hi: 'हम अभी आपको साइन इन नहीं कर सके। कृपया पुनः प्रयास करें।',
  },
  emailInUse: {
    en: 'That email is already registered. Please sign in instead.',
    hi: 'यह ईमेल पहले से पंजीकृत है। कृपया साइन इन करें।',
  },
  actionFailed: {
    en: 'That did not go through. Please try again in a moment.',
    hi: 'यह काम पूरा नहीं हुआ। कृपया थोड़ी देर बाद पुनः प्रयास करें।',
  },
  subjectRequired: {
    en: 'Please give your ticket a subject.',
    hi: 'कृपया अपने टिकट के लिए एक विषय दें।',
  },
  messageRequired: {
    en: 'Please write your message.',
    hi: 'कृपया अपना संदेश लिखें।',
  },
  searchNameRequired: {
    en: 'Please name this search so you can find it later.',
    hi: 'कृपया इस सर्च को एक नाम दें ताकि बाद में मिल सके।',
  },
  gstinInvalid: {
    en: 'GSTIN must be exactly 15 characters.',
    hi: 'जीएसटीआईएन ठीक 15 अक्षर का होना चाहिए।',
  },
  tonsInvalid: {
    en: 'Please enter a tonnage greater than zero.',
    hi: 'कृपया शून्य से अधिक टन भार दर्ज करें।',
  },
  unknownProduct: {
    en: 'We could not find that product in the catalogue.',
    hi: 'हम कैटलॉग में वह उत्पाद नहीं ढूँढ सके।',
  },
  belowMoq: {
    en: 'That is below the minimum order quantity for this grade.',
    hi: 'यह इस ग्रेड की न्यूनतम ऑर्डर मात्रा से कम है।',
  },
  exceedsStock: {
    en: 'Only the spot stock available can be ordered right now.',
    hi: 'अभी केवल उपलब्ध स्पॉट स्टॉक ही ऑर्डर किया जा सकता है।',
  },
} as const;

export type ValidationKey = keyof typeof VALIDATION_COPY;

// ===========================================================================
// Dashboard
// ===========================================================================

export const DASHBOARD_COPY = {
  greeting: { en: 'Hello,', hi: 'नमस्ते,' },
  buyerRole: { en: 'Buyer', hi: 'खरीदार' },
  sellerRole: { en: 'Seller', hi: 'विक्रेता' },
  subtitleBuyer: {
    en: 'Track your inquiries, saved products and supplier quotes in one place.',
    hi: 'अपनी पूछताछ, सहेजे गए उत्पाद और सप्लायर कोटेशन एक जगह देखें।',
  },
  subtitleSeller: {
    en: 'Manage your listings, incoming inquiries and buyer conversations.',
    hi: 'अपनी लिस्टिंग, आने वाली पूछताछ और खरीदार बातचीत प्रबंधित करें।',
  },
  logout: { en: 'Logout', hi: 'लॉग आउट' },
  backToSite: { en: 'Back to site', hi: 'साइट पर वापस जाएँ' },
  emptyWishlist: {
    en: 'No saved products yet.',
    hi: 'अभी तक कोई उत्पाद सहेजा नहीं गया।',
  },
  emptyInquiries: {
    en: 'No inquiries raised yet.',
    hi: 'अभी तक कोई पूछताछ नहीं की गई।',
  },
  emptyTickets: {
    en: 'No support tickets raised yet.',
    hi: 'अभी तक कोई सहायता टिकट नहीं बनाया गया।',
  },
  emptySearches: {
    en: 'No saved searches yet.',
    hi: 'अभी तक कोई सर्च सेव नहीं है।',
  },
  emptyRfqs: {
    en: 'No RFQs raised yet.',
    hi: 'अभी तक कोई RFQ नहीं भेजा गया।',
  },
  browseCatalogue: { en: 'Browse the catalogue', hi: 'कैटलॉग देखें' },
  postRequirement: { en: 'Post a requirement', hi: 'आवश्यकता पोस्ट करें' },
  totalLabel: { en: 'Total', hi: 'कुल' },
  lastUpdated: { en: 'Last updated', hi: 'अंतिम अपडेट' },
  recentActivity: { en: 'Recent Activity', hi: 'हाल की गतिविधि' },
  quickActions: { en: 'Quick Actions', hi: 'त्वरित क्रियाएँ' },
  profileDetails: { en: 'Profile', hi: 'प्रोफ़ाइल' },
  memberSince: { en: 'Member since', hi: 'सदस्य बने' },
  whatsappUs: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें' },
  overview: { en: 'Overview', hi: 'अवलोकन' },
  saved: { en: 'Saved', hi: 'सहेजे गए' },
  status: { en: 'Status', hi: 'स्थिति' },
  reference: { en: 'Reference', hi: 'संदर्भ' },
  quantity: { en: 'Quantity', hi: 'मात्रा' },
  product: { en: 'Product', hi: 'उत्पाद' },
  raisedOn: { en: 'Raised on', hi: 'तारीख' },
  subject: { en: 'Subject', hi: 'विषय' },
  priority: { en: 'Priority', hi: 'प्राथमिकता' },
  noResults: {
    en: 'Nothing here yet.',
    hi: 'यहाँ अभी कुछ नहीं है।',
  },
  loading: { en: 'Loading…', hi: 'लोड हो रहा है…' },
} as const;

/**
 * The page-level copy for each dashboard section.
 *
 * Each section is a real page with a heading and a supporting line, so the
 * copy lives here rather than being spelled out in each route file.
 */
export const SECTION_COPY: Record<
  DashboardSection,
  {
    title: { en: string; hi: string };
    description: { en: string; hi: string };
  }
> = {
  wishlist: {
    title: { en: 'Saved Products', hi: 'सहेजे गए उत्पाद' },
    description: {
      en: 'Every product you bookmarked from the catalogue, with its live rate.',
      hi: 'कैटलॉग से बुकमार्क किए गए सभी उत्पाद, उनकी लाइव दर के साथ।',
    },
  },
  inquiries: {
    title: { en: 'My Inquiries', hi: 'मेरी पूछताछ' },
    description: {
      en: 'Quote requests you have raised and where each one stands.',
      hi: 'आपके द्वारा किए गए कोटेशन अनुरोध और उनकी वर्तमान स्थिति।',
    },
  },
  rfqs: {
    title: { en: 'My RFQs', hi: 'मेरे RFQ' },
    description: {
      en: 'Multi-mill requests sent to the Burrabazar trade desk.',
      hi: 'बराबाज़ार ट्रेड डेस्क को भेजे गए मल्टी-मिल अनुरोध।',
    },
  },
  chat: {
    title: { en: 'Chat', hi: 'चैट' },
    description: {
      en: 'Talk to the Singhi desk on WhatsApp about a live requirement.',
      hi: 'लाइव आवश्यकता पर सिंघी डेस्क से व्हाट्सएप पर बात करें।',
    },
  },
  community: {
    title: { en: 'Community Groups', hi: 'समुदाय समूह' },
    description: {
      en: 'Fabricator and contractor groups for your trade.',
      hi: 'आपके व्यवसाय के फैब्रिकेटर और ठेकेदार समूह।',
    },
  },
  tickets: {
    title: { en: 'Support Tickets', hi: 'सहायता टिकट' },
    description: {
      en: 'Raise a ticket and follow it through to resolution.',
      hi: 'टिकट बनाएँ और उसके निपटान तक देखें।',
    },
  },
  searches: {
    title: { en: 'Saved Searches & Alerts', hi: 'सर्च और अलर्ट' },
    description: {
      en: 'Rate alerts on the grades and sizes you buy most.',
      hi: 'आपकी सबसे खरीदी जाने वाली ग्रेड और साइज़ पर रेट अलर्ट।',
    },
  },
  settings: {
    title: { en: 'Profile Settings', hi: 'प्रोफ़ाइल सेटिंग्स' },
    description: {
      en: 'Company details, GSTIN, city and preferred language.',
      hi: 'कंपनी विवरण, GSTIN, शहर और पसंदीदा भाषा।',
    },
  },
};

/**
 * The eight dashboard tiles.
 *
 * Every tile is a real destination, not a placeholder — a card that goes
 * nowhere is worse than no card at all, so each one links into a section
 * that actually renders.
 *
 * The href is derived rather than stored, because the same eight sections
 * exist under both the buyer and the seller tree. See {@link dashboardHref}.
 */
export const DASHBOARD_CARDS: DashboardCard[] = [
  {
    key: 'wishlist',
    title: 'Saved Products',
    titleHi: 'सहेजे गए उत्पाद',
    description: 'Everything you bookmarked from the catalogue, in one list.',
    descriptionHi: 'कैटलॉग से बुकमार्क किए गए सभी उत्पाद, एक सूची में।',
    accent: '#2563EB',
  },
  {
    key: 'inquiries',
    title: 'My Inquiries',
    titleHi: 'मेरी पूछताछ',
    description: 'Track every quote request you have sent and where it stands.',
    descriptionHi: 'भेजे गए हर कोटेशन अनुरोध पर नज़र रखें और उसकी स्थिति जानें।',
    accent: '#F97316',
  },
  {
    key: 'rfqs',
    title: 'My RFQs',
    titleHi: 'मेरे RFQ',
    description: 'Multi-mill requests sent out for competitive quoting.',
    descriptionHi: 'प्रतिस्पर्धी कोटेशन के लिए भेजे गए मल्टी-मिल अनुरोध।',
    accent: '#0F1117',
  },
  {
    key: 'chat',
    title: 'Chat',
    titleHi: 'चैट',
    description: 'Talk to the Singhi desk on WhatsApp about a live requirement.',
    descriptionHi: 'लाइव आवश्यकता पर सिंघी डेस्क से व्हाट्सएप पर बात करें।',
    accent: '#25D366',
  },
  {
    key: 'community',
    title: 'Community Groups',
    titleHi: 'समुदाय समूह',
    description: 'Bengal fabricator and contractor groups you belong to.',
    descriptionHi: 'बंगाल के फैब्रिकेटर और ठेकेदार समूह जिनमें आप शामिल हैं।',
    accent: '#1D4ED8',
  },
  {
    key: 'tickets',
    title: 'Support Tickets',
    titleHi: 'सहायता टिकट',
    description: 'Raise a ticket and follow it through to resolution.',
    descriptionHi: 'टिकट बनाएँ और उसके निपटान तक देखें।',
    accent: '#EA580C',
  },
  {
    key: 'searches',
    title: 'Saved Searches & Alerts',
    titleHi: 'सर्च और अलर्ट',
    description: 'Rate alerts on the grades and sizes you buy most.',
    descriptionHi: 'आपकी सबसे खरीदी जाने वाली ग्रेड और साइज़ पर रेट अलर्ट।',
    accent: '#5B6478',
  },
  {
    key: 'settings',
    title: 'Profile Settings',
    titleHi: 'प्रोफ़ाइल सेटिंग्स',
    description: 'Company details, GSTIN, city and preferred language.',
    descriptionHi: 'कंपनी विवरण, GSTIN, शहर और पसंदीदा भाषा।',
    accent: '#0B1220',
  },
];

/**
 * Where a dashboard tile lives.
 *
 * The route segment is the role, so a buyer's wishlist and a seller's
 * wishlist are separate trees even though they read the same table — a
 * seller and a buyer sharing a URL would leak one another's workflow
 * assumptions.
 */
export function dashboardHref(
  role: 'buyer' | 'seller',
  section: DashboardSection
): string {
  return `/dashboard/${role}/${section}`;
}

// ===========================================================================
// Overview page
// ===========================================================================

export const OVERVIEW_COPY = {
  eyebrow: { en: 'Your Steel Desk', hi: 'आपकी स्टील डेस्क' },
  title: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  savedCount: { en: 'Saved products', hi: 'सहेजे गए उत्पाद' },
  inquiryCount: { en: 'Inquiries', hi: 'पूछताछ' },
  rfqCount: { en: 'RFQs', hi: 'RFQ' },
  ticketCount: { en: 'Tickets', hi: 'टिकट' },
  totalSaved: { en: 'Total saved', hi: 'कुल सहेजे गए' },
  totalInquiries: { en: 'Total inquiries', hi: 'कुल पूछताछ' },
  totalRfqs: { en: 'Total RFQs', hi: 'कुल RFQ' },
  totalTickets: { en: 'Total tickets', hi: 'कुल टिकट' },
  sections: { en: 'Your Sections', hi: 'आपके अनुभाग' },
  sectionsHint: {
    en: 'Eight workspaces, one account. Every tile below opens a real screen.',
    hi: 'आठ कार्यक्षेत्र, एक खाता। नीचे हर टाइल एक असली पेज खोलता है।',
  },
  activity: { en: 'Latest Activity', hi: 'नवीनतम गतिविधि' },
  activityHint: {
    en: 'The most recent things you raised with the desk.',
    hi: 'डेस्क के साथ आपकी की गई नवीनतम चीज़ें।',
  },
  noActivity: {
    en: 'Nothing yet — raise an inquiry or save a product to get started.',
    hi: 'अभी कुछ नहीं — शुरू करने के लिए पूछताछ करें या उत्पाद सहेजें।',
  },
  sellerTitle: { en: 'Seller Workspace', hi: 'विक्रेता कार्यक्षेत्र' },
  buyerTitle: { en: 'Buyer Workspace', hi: 'खरीदार कार्यक्षेत्र' },
} as const;

// ===========================================================================
// Section forms, statuses and small labels
// ===========================================================================

export const FORM_COPY = {
  raiseInquiry: { en: 'Raise an Inquiry', hi: 'पूछताछ करें' },
  raiseInquiryHint: {
    en: 'Tell us the grade, size and tonnage. The desk quotes within one working day.',
    hi: 'ग्रेड, साइज़ और टन भेजें। डेस्क एक कार्यदिवस में कोटेशन देता है।',
  },
  contactName: { en: 'Contact Person', hi: 'संपर्क व्यक्ति' },
  company: { en: 'Company / Enterprise', hi: 'कंपनी / उद्यम' },
  phone: { en: 'Phone', hi: 'फ़ोन' },
  email: { en: 'Email', hi: 'ईमेल' },
  productInterest: { en: 'Product / Grade', hi: 'उत्पाद / ग्रेड' },
  quantityMt: { en: 'Quantity (MT)', hi: 'मात्रा (मीट्रिक टन)' },
  message: { en: 'Message', hi: 'संदेश' },
  submitInquiry: { en: 'Send Inquiry', hi: 'पूछताछ भेजें' },
  inquirySent: { en: 'Inquiry sent to the desk.', hi: 'पूछताछ डेस्क को भेज दी गई।' },
  inquiryFailed: {
    en: 'We could not send that inquiry. Please try again.',
    hi: 'हम यह पूछताछ नहीं भेज सके। कृपया पुनः प्रयास करें।',
  },
  raiseTicket: { en: 'Raise a Support Ticket', hi: 'सहायता टिकट बनाएँ' },
  raiseTicketHint: {
    en: 'Delivery, quality, billing or a technical question — we answer in one working day.',
    hi: 'डिलीवरी, गुणवत्ता, बिलिंग या तकनीकी प्रश्न — हम एक कार्यदिवस में उत्तर देते हैं।',
  },
  subject: { en: 'Subject', hi: 'विषय' },
  category: { en: 'Category', hi: 'श्रेणी' },
  priority: { en: 'Priority', hi: 'प्राथमिकता' },
  submitTicket: { en: 'Submit Ticket', hi: 'टिकट जमा करें' },
  ticketSent: { en: 'Ticket raised.', hi: 'टिकट बन गया।' },
  ticketFailed: {
    en: 'We could not raise that ticket. Please try again.',
    hi: 'हम यह टिकट नहीं बना सके। कृपया पुनः प्रयास करें।',
  },
  saveSearch: { en: 'Save a Search', hi: 'सर्च सेव करें' },
  saveSearchHint: {
    en: 'Save a grade or size and ask us to alert you when the rate moves.',
    hi: 'कोई ग्रेड या साइज़ सेव करें और दर बदलने पर अलर्ट माँगें।',
  },
  searchName: { en: 'Name this search', hi: 'इस सर्च का नाम दें' },
  searchTerms: { en: 'Search terms', hi: 'खोज शब्द' },
  alertFrequency: { en: 'Alert frequency', hi: 'अलर्ट आवृत्ति' },
  noAlert: { en: 'No alert', hi: 'कोई अलर्ट नहीं' },
  daily: { en: 'Daily', hi: 'दैनिक' },
  weekly: { en: 'Weekly', hi: 'साप्ताहिक' },
  submitSearch: { en: 'Save Search', hi: 'सर्च सेव करें' },
  searchSaved: { en: 'Search saved.', hi: 'सर्च सेव हो गया।' },
  searchFailed: {
    en: 'We could not save that search. Please try again.',
    hi: 'हम यह सर्च सेव नहीं कर सके। कृपया पुनः प्रयास करें।',
  },
  remove: { en: 'Remove', hi: 'हटाएँ' },
  delete: { en: 'Delete', hi: 'मिटाएँ' },
  saveProduct: { en: 'Save', hi: 'सहेजें' },
  saved: { en: 'Saved', hi: 'सहेजा गया' },
  openWhatsApp: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें' },
  whatsappNumber: { en: '+91 98830 51500', hi: '+91 98830 51500' },
  chatHint: {
    en: 'The trade desk is on WhatsApp between 9am and 8pm, Monday to Saturday.',
    hi: 'ट्रेड डेस्क सोमवार से शनिवार, सुबह 9 से रात 8 बजे तक व्हाट्सएप पर उपलब्ध है।',
  },
  chatPromptRate: { en: 'Share today’s rate for', hi: 'आज का दर भेजें' },
  chatPromptStock: { en: 'Check spot stock for', hi: 'स्पॉट स्टॉक देखें' },
  chatPromptDelivery: { en: 'Confirm delivery to', hi: 'डिलीवरी की पुष्टि करें' },
  groups: { en: 'Groups', hi: 'समूह' },
  members: { en: 'Members', hi: 'सदस्य' },
  posts: { en: 'Posts', hi: 'पोस्ट' },
  join: { en: 'Join on WhatsApp', hi: 'व्हाट्सएप पर शामिल हों' },
  profileHeading: { en: 'Your Details', hi: 'आपका विवरण' },
  profileHint: {
    en: 'These details travel with every inquiry you raise, so the desk can quote without a follow-up call.',
    hi: 'ये विवरण हर पूछताछ के साथ जाते हैं, इसलिए डेस्क बिना फोन किए कोटेशन दे सकता है।',
  },
  firstName: { en: 'First Name', hi: 'पहला नाम' },
  lastName: { en: 'Last Name', hi: 'अंतिम नाम' },
  companyType: { en: 'Company Type', hi: 'कंपनी प्रकार' },
  gstin: { en: 'GSTIN', hi: 'जीएसटीआईएन' },
  city: { en: 'City', hi: 'शहर' },
  language: { en: 'Preferred Language', hi: 'पसंदीदा भाषा' },
  saveProfile: { en: 'Save Profile', hi: 'प्रोफ़ाइल सेव करें' },
  profileSaved: { en: 'Profile updated.', hi: 'प्रोफ़ाइल अपडेट हो गई।' },
  profileFailed: {
    en: 'We could not save your profile. Please try again.',
    hi: 'हम आपकी प्रोफ़ाइल सेव नहीं कर सके। कृपया पुनः प्रयास करें।',
  },
  english: { en: 'English', hi: 'अंग्रेज़ी' },
  hindi: { en: 'हिन्दी', hi: 'हिन्दी' },
  rate: { en: 'Rate', hi: 'दर' },
  perTon: { en: '/ MT', hi: '/ मीट्रिक टन' },
  stock: { en: 'In stock', hi: 'स्टॉक में' },
  outOfStock: { en: 'Out of stock', hi: 'स्टॉक समाप्त' },
  open: { en: 'Open', hi: 'खोलें' },
} as const;

export const STATUS_COPY = {
  submitted: { en: 'Submitted', hi: 'प्रस्तुत' },
  quoted: { en: 'Quoted', hi: 'कोटेशन दिया' },
  closed: { en: 'Closed', hi: 'बंद' },
  open: { en: 'Open', hi: 'खुला' },
  in_progress: { en: 'In Progress', hi: 'प्रगति में' },
  resolved: { en: 'Resolved', hi: 'हल हुआ' },
  PENDING: { en: 'Pending', hi: 'लंबित' },
  ALLOCATED: { en: 'Allocated', hi: 'आवंटित' },
  REJECTED: { en: 'Rejected', hi: 'अस्वीकृत' },
  low: { en: 'Low', hi: 'कम' },
  normal: { en: 'Normal', hi: 'सामान्य' },
  high: { en: 'High', hi: 'उच्च' },
  urgent: { en: 'Urgent', hi: 'अत्यावश्यक' },
  general: { en: 'General', hi: 'सामान्य' },
  order: { en: 'Order', hi: 'ऑर्डर' },
  logistics: { en: 'Logistics', hi: 'लॉजिस्टिक्स' },
  quality: { en: 'Quality', hi: 'गुणवत्ता' },
  billing: { en: 'Billing', hi: 'बिलिंग' },
  technical: { en: 'Technical', hi: 'तकनीकी' },
} as const;

export type StatusKey = keyof typeof STATUS_COPY;

// ===========================================================================
// Wishlist
// ===========================================================================

export const WISHLIST_COPY = {
  savedOn: { en: 'Saved on', hi: 'सहेजा गया' },
  viewProduct: { en: 'View product', hi: 'उत्पाद देखें' },
  requestQuote: { en: 'Request a quote', hi: 'कोटेशन माँगें' },
  removeConfirm: {
    en: 'Remove this product from your saved list?',
    hi: 'क्या इस उत्पाद को अपनी सहेजी सूची से हटाएँ?',
  },
  emptyHint: {
    en: 'Save a product from the catalogue and it will show up here with its live rate.',
    hi: 'कैटलॉग से कोई उत्पाद सहेजें और वह यहाँ अपनी लाइव दर के साथ दिखेगा।',
  },
} as const;

// ===========================================================================
// RFQ (the trade-desk pipeline request)
// ===========================================================================

export const RFQ_COPY = {
  pickProduct: { en: 'Product', hi: 'उत्पाद' },
  quantity: { en: 'Quantity (MT)', hi: 'मात्रा (मीट्रिक टन)' },
  pincode: { en: 'Delivery PIN code', hi: 'डिलीवरी पिन कोड' },
  gstin: { en: 'GSTIN', hi: 'जीएसटीआईएन' },
  gstinHint: {
    en: 'Exactly 15 characters — it lets the desk quote GST-inclusive rates.',
    hi: 'ठीक 15 अक्षर — इससे डेस्क GST सहित दर बता सकता है।',
  },
  submit: { en: 'Send to the trade desk', hi: 'ट्रेड डेस्क को भेजें' },
  sending: { en: 'Sending…', hi: 'भेजा जा रहा है…' },
  success: {
    en: 'Your request is in the trade desk pipeline. We will call you within one working day.',
    hi: 'आपका अनुरोध ट्रेड डेस्क पाइपलाइन में है। हम एक कार्यदिवस में आपको कॉल करेंगे।',
  },
  failure: {
    en: 'We could not register that request. Please check the fields and try again.',
    hi: 'हम यह अनुरोध दर्ज नहीं कर सके। कृपया फ़ील्ड जाँचें और पुनः प्रयास करें।',
  },
  emptyHint: {
    en: 'Requests you send from here reach the Burrabazar desk directly and stay linked to your account.',
    hi: 'यहाँ से भेजे गए अनुरोध सीधे बराबाज़ार डेस्क तक पहुँचते हैं और आपके खाते से जुड़े रहते हैं।',
  },
  reference: { en: 'Reference', hi: 'संदर्भ' },
  productName: { en: 'Product', hi: 'उत्पाद' },
  tons: { en: 'Tonnage', hi: 'टन भार' },
  pincodeLabel: { en: 'Delivering to', hi: 'डिलीवरी स्थान' },
  raisedOn: { en: 'Raised on', hi: 'तारीख' },
} as const;

// ===========================================================================
// Community & chat
// ===========================================================================

export const COMMUNITY_COPY = {
  members: { en: 'members', hi: 'सदस्य' },
  posts: { en: 'posts', hi: 'पोस्ट' },
  joinHint: {
    en: 'Groups run on WhatsApp. We add you to the next open batch for your trade.',
    hi: 'समूह व्हाट्सएप पर चलते हैं। हम आपको आपके व्यवसाय का अगला खुला बैच जोड़ते हैं।',
  },
  openGroup: { en: 'Open group', hi: 'समूह खोलें' },
} as const;

export const CHAT_COPY = {
  promptRate: { en: 'Share today’s rate for', hi: 'आज का दर भेजें' },
  promptStock: { en: 'Check spot stock for', hi: 'स्पॉट स्टॉक देखें' },
  promptDelivery: { en: 'Confirm delivery to', hi: 'डिलीवरी की पुष्टि करें' },
  hours: {
    en: 'Monday to Saturday, 9am – 8pm IST',
    hi: 'सोमवार से शनिवार, सुबह 9 – रात 8 बजे (IST)',
  },
} as const;
