// This function takes an array of image URLs and returns one merged image URL
// "Promise<string>" means this function is async and will return a string (the final image URL)
export async function mergeImages(imageUrls: string[]): Promise<string> {

  // Step 1 — Load all images into the browser memory
  const images = await Promise.all(
    imageUrls.map((url) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image()
        img.src = url
        // Wait until the image is fully loaded before continuing
        img.onload = () => resolve(img)
      })
    })
  )

  // Step 2 — Decide the grid size
  // 4 images or less = 2 columns, more than 4 = 3 columns
  const columns = images.length <= 4 ? 2 : 3
  const rows = Math.ceil(images.length / columns)

  // Step 3 — Set the size of each cell in the grid
  const cellWidth = 800
  const cellHeight = 600
  const labelHeight = 32

  // Step 4 — Create an invisible canvas the exact size of our grid
  const canvas = document.createElement('canvas')
  canvas.width = cellWidth * columns
  canvas.height = (cellHeight + labelHeight) * rows

  // Step 5 — Get the drawing tool for the canvas
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Step 6 — Fill the background with dark color
  ctx.fillStyle = '#0f0f0f'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Step 7 — Draw each image into its grid position
  images.forEach((img, index) => {
    // Calculate which column and row this image belongs to
    const col = index % columns
    const row = Math.floor(index / columns)

    // Calculate the x and y position on the canvas
    const x = col * cellWidth
    const y = row * (cellHeight + labelHeight)

    // Draw the image
    ctx.drawImage(img, x, y, cellWidth, cellHeight)

    // Step 8 — Draw the label bar at the bottom of each image
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
    ctx.fillRect(x, y + cellHeight - labelHeight, cellWidth, labelHeight)

    // Step 9 — Write the label text
    ctx.fillStyle = '#ffffff'
    ctx.font = '500 18px Inter, sans-serif'
    ctx.fillText(`Image ${index + 1}`, x + 12, y + cellHeight - 10)
  })

  // Step 10 — Convert the canvas to a single image URL and return it
  return canvas.toDataURL('image/png')
}