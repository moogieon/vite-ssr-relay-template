import React from 'react'
import JSResource from './JSResource'

const SuspenseImage: React.FC= (
  props: React.ImgHTMLAttributes<HTMLImageElement>
) => {
  const { src } = props
  if (src != null) {
    const resource = JSResource(src, () => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          resolve(src)
        }
        img.onerror = (error) => {
          console.error(error)
          resolve(src)
        }
        img.src = src
      })
    })
    resource.load() // TODO: JSResource::read() should call load() if necessary
    resource.read() // suspends while the image is pending
  }
  return <img {...props} />
}
export default SuspenseImage
