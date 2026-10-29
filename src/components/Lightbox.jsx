import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function Lightbox({ items, index, onClose, onIndex }) {
  const ref = useRef(null)
  const open = index != null
  const item = open ? items[index] : null
  const many = items.length > 1

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const go = (delta) => onIndex((index + delta + items.length) % items.length)

  return (
    <dialog
      ref={ref}
      className="dialog lightbox"
      aria-label={item ? item.caption ?? item.alt : 'Image viewer'}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (!many) return
        if (event.key === 'ArrowRight') go(1)
        if (event.key === 'ArrowLeft') go(-1)
      }}
    >
      {item && (
        <figure className="lightbox__figure">
          <img src={item.src} alt={item.alt} width={item.width} height={item.height} />
          {item.caption && <figcaption>{item.caption}</figcaption>}
        </figure>
      )}
      <div className="lightbox__bar">
        {many && (
          <>
            <button type="button" className="btn btn--glass btn--icon" onClick={() => go(-1)} aria-label="Previous image">
              <ChevronLeft aria-hidden="true" />
            </button>
            <span className="lightbox__count label-font tabular">
              {index + 1} / {items.length}
            </span>
            <button type="button" className="btn btn--glass btn--icon" onClick={() => go(1)} aria-label="Next image">
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}
        <button type="button" className="btn btn--glass btn--icon lightbox__close" onClick={onClose} aria-label="Close">
          <X aria-hidden="true" />
        </button>
      </div>
    </dialog>
  )
}
