// Large media files stay hosted on the church's existing WordPress uploads.
const UPLOADS = 'https://upperroomgospel.org/wp-content/uploads'

export const PRAYER_TRACKS = [
  { title: 'Shift Prayer', file: '2023/06/Shift Prayer.wav', length: '28:00' },
  { title: 'Prayer With the Right “Ask”', file: '2023/06/Prayer With the Right “Ask”.wav', length: '23:06' },
  { title: 'Prayer to Deal with Reality', file: '2023/06/Prayer to Deal with Reality.mp3', length: '24:24' },
  { title: 'Prayer That Speaks Life', file: '2023/06/Prayer That Speaks Life.wav', length: '19:24' },
  { title: 'A Mother’s Prayer', file: '2023/06/A Mother’s Prayer.mp3', length: '28:45' },
  {
    title: 'Fresh Oil',
    by: 'Bishop Patrick L. Wooden, Sr.',
    file: '2023/06/Fresh Oil (Bishop Patrick L. Wooden, Sr.).wav',
    length: '5:01',
  },
].map((track) => ({ by: 'First Lady Pamela Wooden', ...track, src: encodeURI(`${UPLOADS}/${track.file}`) }))
