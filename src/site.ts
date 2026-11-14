// اطلاعات اصلی سایت — هر تغییری اینجا در کل سایت اعمال می‌شود
export const SITE = {
  url: 'https://ddszeinali.ir',
  name: 'دکتر محمد رضا زینلی',
  nameAlt: 'دکتر محمدرضا زینلی',
  title: 'دکتر محمد رضا زینلی | دندانپزشکی زیبایی',
  description:
    'وب‌سایت شخصی دکتر محمد رضا زینلی، دندانپزشک زیبایی. نمونه‌کارهای کامپوزیت ونیر، طراحی لبخند، زیبایی لبخند و بلیچینگ، به همراه یادداشت‌هایی درباره‌ی زیبایی‌شناسی در دندانپزشکی.',
  email: 'info@ddszeinali.ir',
  instagram: 'https://instagram.com/ddszeinali', // TODO: آدرس دقیق
  telegram: '', // TODO
  phone: '', // TODO: شماره تماس
  // TODO: پس از مشخص شدن مطب، این بخش را پر کنید
  clinic: null as null | { city: string; street: string; lat: number; lng: number; hours: string },
};

export const SERVICES = [
  { slug: 'composite-veneers', title: 'کامپوزیت ونیر', en: 'Composite Veneers', color: 'red' },
  { slug: 'smile-design', title: 'طراحی لبخند', en: 'Smile Design', color: 'blue' },
  { slug: 'smile-aesthetics', title: 'زیبایی لبخند', en: 'Smile Aesthetics', color: 'yellow' },
  { slug: 'whitening', title: 'بلیچینگ و سفید کردن دندان', en: 'Whitening', color: 'red' },
] as const;

export const NAV = [
  { href: '/portfolio/', label: 'نمونه‌کارها' },
  { href: '/thoughts/', label: 'یادداشت‌ها' },
  { href: '/aesthetics/', label: 'زیبایی‌شناسی' },
  { href: '/about/', label: 'درباره' },
  { href: '/contact/', label: 'تماس' },
];

export const faNum = (n: number | string) =>
  String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);

export const faDate = (d: Date) =>
  new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
