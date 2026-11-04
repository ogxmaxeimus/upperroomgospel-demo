export const SITE = {
  name: 'Upper Room Church of God in Christ',
  shortName: 'Upper Room',
  tagline: 'The God First Experience',
  motto: 'Keep God First',
  url: 'https://upperroomgospel.org',
  jurisdiction: 'North Carolina Third Ecclesiastical Jurisdiction',

  address: {
    street: '3300 Idlewood Village Drive',
    city: 'Raleigh',
    state: 'NC',
    zip: '27610',
  },
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=3300+Idlewood+Village+Drive%2C+Raleigh%2C+NC+27610',
  appleMapsUrl: 'https://maps.apple.com/?daddr=3300+Idlewood+Village+Dr,+Raleigh,+NC+27610',
  mapEmbedUrl:
    'https://www.google.com/maps?q=3300+Idlewood+Village+Drive,+Raleigh,+NC+27610&z=15&output=embed',

  phone: { display: '(919) 829-6160', href: 'tel:+19198296160' },
  email: 'info@plwooden.org',
  mailing: ['Upper Room Church of God in Christ', 'P.O. Box 447', 'Garner, NC 27529'],

  officeHours: {
    days: [1, 2, 3, 4, 5],
    open: '08:30',
    close: '17:00',
    label: 'Monday – Friday · 8:30 AM – 5:00 PM ET',
  },

  booking: {
    contact: 'Evangelist Patricia Lester',
    role: 'Executive Assistant',
    phone: { display: '(919) 829-6184', href: 'tel:+19198296184' },
  },

  social: {
    youtube: 'https://www.youtube.com/@GodFirstOfficialPage',
    youtubeLive: 'https://www.youtube.com/@GodFirstOfficialPage/live',
    youtubeSubscribe: 'https://www.youtube.com/@GodFirstOfficialPage?sub_confirmation=1',
    youtubeCommunity: 'https://www.youtube.com/@GodFirstOfficialPage/posts',
    facebook: 'https://www.facebook.com/UpperRoomGospel/',
    instagram: 'https://www.instagram.com/ur_cogic/',
    x: 'https://twitter.com/UpperRoomGospel',
  },

  memberPortal: 'https://upperroom.ccbchurch.com/goto/login',

  giving: {
    textNumber: { display: '877-727-0402', raw: '+18777270402' },
    funds: [
      {
        id: 'upper-room',
        label: 'Upper Room',
        long: 'Upper Room Church of God in Christ',
        url: 'https://pushpay.com/g/upperroomgospel',
        keyword: 'Give',
      },
      {
        id: 'nc3rd',
        label: 'NC Third',
        long: 'North Carolina Third Ecclesiastical Jurisdiction',
        url: 'https://pushpay.com/g/nc3rdraleigh',
        keyword: 'NC3rd',
      },
    ],
    whyWeGiveVideo: 'https://upperroomgospel.org/wp-content/uploads/2024/09/Ministry-Impact_v5-1.mp4',
  },

  services: [
    { id: 'sun-8', day: 'Sunday', time: '8:00 AM', label: 'Morning Worship', note: '8:00 – 9:30 AM · Children’s Church' },
    { id: 'sun-11', day: 'Sunday', time: '11:00 AM', label: 'Morning Worship', note: 'Streamed live' },
    { id: 'thu-730', day: 'Thursday', time: '7:30 PM', label: 'Bible Study', note: 'Streamed live' },
  ],

  liveWindows: [
    { day: 0, start: '11:00', end: '13:15', label: 'Sunday Worship', eventId: 'sunday-worship-11am' },
    { day: 4, start: '19:30', end: '21:15', label: 'Thursday Bible Study', eventId: 'thursday-bible-study' },
  ],

  bios: {
    bishop: 'https://upperroomgospel.org/wp-content/uploads/2026/07/meet-bishop3.pdf',
    firstLady: 'https://upperroomgospel.org/wp-content/uploads/2021/07/MEET-OUR-FIRST-LADY.pdf',
  },
}

export const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}`

export const NAV = [
  { label: 'I’m New', to: '/im-new' },
  { label: 'Events', to: '/events' },
  { label: 'Watch', to: '/watch' },
  {
    label: 'Ministries',
    to: '/ministries',
    children: [
      { label: 'Impact Saturdays', desc: 'Elementary to high school · every 4th Saturday', to: '/ministries/youth', accent: '#C6FF3D' },
      { label: 'Men’s Department', desc: 'Iron sharpens iron', to: '/ministries/men', accent: '#FF7A2F' },
      { label: 'Women’s Ministry', desc: 'Discipleship, mentorship, fellowship', to: '/ministries/women', accent: '#F59BC0' },
      { label: 'Music & Fine Arts', desc: 'Choirs, praise teams, dance & drama', to: '/ministries/music-arts', accent: '#9B7BFF' },
      { label: 'Evangelism', desc: 'Raleigh and beyond', to: '/ministries/evangelism', accent: '#2DD4BF' },
      { label: 'THRIVE', desc: 'College & young professionals · 18 to 25', to: '/ministries/thrive', accent: '#F4EFE4' },
      { label: 'FOCUS', desc: 'Young adult ministry · God First', to: '/ministries/focus', accent: '#FFD400' },
      { label: 'Find Your Place', desc: 'Browse all 40+ groups', to: '/ministries', accent: '#EEC26A' },
    ],
  },
  {
    label: 'About',
    to: '/about/bishop-wooden',
    children: [
      { label: 'Bishop Patrick L. Wooden, Sr.', desc: 'Our pastor', to: '/about/bishop-wooden', accent: '#EEC26A' },
      { label: 'First Lady Pamela Wooden', desc: 'The jewel of the ministry', to: '/about/first-lady-wooden', accent: '#E7A3B8' },
      { label: 'What We Believe', desc: 'Our statement of faith', to: '/beliefs', accent: '#D9C7A0' },
      { label: 'Follow Jesus', desc: 'Start your relationship with Christ', to: '/follow-jesus', accent: '#FFE7A8' },
    ],
  },
  { label: 'Contact', to: '/contact' },
]
