// Old WordPress slugs and where they live now (Netlify also 301s these in public/_redirects).
export const LEGACY = {
  'sermons-2': '/watch',
  giving: '/give',
  'why-we-give': '/give#why',
  'meet-bishop-wooden': '/about/bishop-wooden',
  'book-bishop-wooden': '/about/bishop-wooden#book',
  'meet-first-lady-wooden': '/about/first-lady-wooden',
  'book-first-lady-wooden': '/about/first-lady-wooden#book',
  'statement-of-faith': '/beliefs',
  'how-to-become-a-follower-of-christ': '/follow-jesus',
  'youth-ministry': '/ministries/youth',
  'join-youth-ministry': '/ministries/youth#join',
  'mens-department': '/ministries/men',
  'mens-ministry': '/ministries/men',
  'join-mens-ministry': '/ministries/men#join',
  'womens-ministry': '/ministries/women',
  'join-womens-ministry': '/ministries/women#join',
  'music-arts-ministry': '/ministries/music-arts',
  'join-music-arts-ministry': '/ministries/music-arts#join',
  evangelism: '/ministries/evangelism',
  'join-evangelism': '/ministries/evangelism#join',
  'contact-us': '/contact',
  about: '/about/bishop-wooden',
}

export function legacyUrlFor(pathname) {
  const slug = Object.keys(LEGACY).find((key) => LEGACY[key] === pathname)
  return slug ? `https://upperroomgospel.org/${slug}/` : 'https://upperroomgospel.org/'
}
