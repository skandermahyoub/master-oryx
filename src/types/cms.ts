export type CategoryType = 'news' | 'offer' | 'announcement' | 'marketing' | 'uncategorized';

export interface HeaderConfig {
  logoUrl: string;
  appName: string;
  slogan: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  bgImageUrl: string;
  ctaText: string;
  ctaUrl: string;
  showInHero: boolean;
}

export interface SlideItem {
  id: string;
  bgImageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  badge: string;
}

export interface SliderConfig {
  autoPlayInterval: number;
  slides: SlideItem[];
}

export interface TickerItem {
  id: string;
  text: string;
  category: CategoryType;
  link: string;
}

export interface TickerConfig {
  speed: number;
  direction?: 'leftToRight' | 'rightToLeft';
  items: TickerItem[];
}

export interface TabItem {
  id: string;
  title: string;
  icon: string;
  content: string;
}

export interface AboutConfig {
  paragraph: string;
  ceoPhotoUrl: string;
  ceoName: string;
  ceoTitle: string;
  tabsLayoutMode: 'carousel' | 'accordion'; // Internal Admin option for Carousel vs Accordion
  tabs: TabItem[];
  downloadPdfLabel: string;
  downloadPdfUrl: string;
  learnMoreLabel: string;
  learnMoreUrl: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeOrStat: string;
  isDigitalCard: boolean;
}

export interface FeaturesConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  layoutMode: 'grid' | 'carousel'; // Internal Admin option
  items: FeatureItem[];
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  clientPhoto: string;
  reviewText: string;
  rating: number;
  status: 'approved' | 'pending';
  date: string;
}

export interface TestimonialsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  layoutMode: 'carousel' | 'grid'; // Internal Admin option
  layoutStyle: 'rating_photo' | 'photo_name_text' | 'name_text_only';
  showForm: boolean;
  items: TestimonialItem[];
}

export interface BrandItem {
  id: string;
  name: string;
  logoUrl: string;
  label: string;
  text: string;
  rating: number;
}

export interface BrandsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  layoutMode: 'carousel' | 'grid'; // Internal Admin option
  isGrayscale: boolean;
  displayMode: 'logo_only' | 'logo_label' | 'logo_rating' | 'logo_text_rating' | 'logo_text';
  logoCardShape?: 'rectangular' | 'square';
  imageFit?: 'cover' | 'contain';
  items: BrandItem[];
}

export interface OfferItem {
  id: string;
  title: string;
  subtitle: string;
  bgImageUrl: string;
  linkUrl: string;
  badge: string;
}

export interface OffersConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  layoutType: 'carousel' | 'grid_4' | 'horizontal_2' | 'vertical_2' | 'split_3';
  items: OfferItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  readTime: string;
  featured: boolean;
}

export interface BlogConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  postsToShow: number;
  layoutMode: 'carousel_horizontal' | 'carousel_vertical' | 'grid'; // Internal Admin option
  categories: string[];
  posts: BlogPost[];
}

export interface ContactConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  whatsappNumber: string;
  messengerUrl: string;
  directPhone: string;
  officialEmail: string;
  bgImageUrl: string;
  address: string;
  branches: string[];
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface SocialLinks {
  tiktok: string;
  facebook: string;
  youtube: string;
  instagram: string;
  whatsappChannel: string;
  telegram: string;
  snapchat: string;
}

export interface FooterConfig {
  logoUrl: string;
  appName: string;
  slogan: string;
  aboutText: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  branches: string[];
  quickLinks: FooterLink[];
  policies: FooterLink[];
  socialLinks: SocialLinks;
  copyrightText: string;
  poweredByText: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
}

export interface GalleryConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  layoutMode: 'grid' | 'carousel' | 'masonry';
  columns: number;
  categories: string[];
  ctaButtonText?: string;
  showCtaButton?: boolean;
  items: GalleryItem[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface StatsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  badge?: string;
  layoutStyle: 'grid_4' | 'cards' | 'banner' | 'glow';
  items: StatItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  badge?: string;
  categories: string[];
  ctaText?: string;
  ctaUrl?: string;
  items: FAQItem[];
}

export type ModuleKey =
  | 'header'
  | 'slider'
  | 'ticker'
  | 'about'
  | 'stats'
  | 'features'
  | 'offers'
  | 'testimonials'
  | 'brands'
  | 'store'
  | 'gallery'
  | 'faq'
  | 'blog'
  | 'contact'
  | 'footer';

export interface ModuleMeta {
  key: ModuleKey;
  nameAr: string;
  iconName: string;
  description: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface CustomPaletteItem {
  id: string;
  nameAr: string;
  primaryColor: string;
  primaryHover: string;
  secondaryColor: string;
  accentColor: string;
  cardBgColor: string;
  glowIntensity: number;
  fontFamily: 'Cairo' | 'Tajawal' | 'Readex Pro';
  cardStyle: 'glass' | 'solid' | 'gradient' | 'bordered';
  bgPattern: 'grid' | 'dots' | 'mesh' | 'none';
}

export interface ThemeConfig {
  primaryColor: string;
  primaryHover: string;
  secondaryColor: string;
  accentColor: string;
  presetName: string;
  colorMode?: 'dark' | 'light' | 'system';
  cardBgColor?: string;
  glowIntensity?: number;
  fontFamily?: 'Cairo' | 'Tajawal' | 'Readex Pro';
  cardStyle?: 'glass' | 'solid' | 'gradient' | 'bordered';
  bgPattern?: 'grid' | 'dots' | 'mesh' | 'none';
  customPresets?: CustomPaletteItem[];
}

export type PageBlockType =
  | 'hero'
  | 'stats'
  | 'ticker'
  | 'slider'
  | 'features'
  | 'team'
  | 'timeline'
  | 'faq'
  | 'gallery'
  | 'offers'
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'quote'
  | 'video'
  | 'image'
  | 'audio'
  | 'pricing_table'
  | 'cta_button';

export interface BlockItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  value?: string;
  date?: string;
  linkUrl?: string;
  linkText?: string;
}

export interface CustomPageBlock {
  id: string;
  type: PageBlockType;
  badge?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  mediaUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  alignment?: 'center' | 'right' | 'left';
  layoutStyle?: 'split' | 'centered' | 'grid' | 'cards' | 'timeline';
  items?: BlockItem[];
  customData?: any;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'published' | 'draft';
  showInNavbar: boolean;
  showInFooter: boolean;
  createdAt: string;
  updatedAt: string;
  blocks: CustomPageBlock[];
}

export interface CMSData {
  theme?: ThemeConfig;
  customPages?: CustomPage[];
  modulesOrder: ModuleKey[];
  moduleVisibility: Record<ModuleKey, boolean>;
  header: HeaderConfig;
  slider: SliderConfig;
  ticker: TickerConfig;
  about: AboutConfig;
  stats: StatsConfig;
  features: FeaturesConfig;
  testimonials: TestimonialsConfig;
  brands: BrandsConfig;
  store?: any;
  offers: OffersConfig;
  gallery: GalleryConfig;
  faq: FAQConfig;
  blog: BlogConfig;
  contact: ContactConfig;
  footer: FooterConfig;
}
