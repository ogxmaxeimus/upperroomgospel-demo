import images from '../data/images.json'

export const imageMeta = (name) => images[name]

export default function Img({ name, alt, priority = false, className, ...rest }) {
  const img = images[name]
  if (!img) return null
  return (
    <img
      src={img.src}
      width={img.width}
      height={img.height}
      alt={alt ?? img.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
      {...rest}
    />
  )
}
