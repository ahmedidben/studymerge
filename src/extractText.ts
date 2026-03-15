import Tesseract from 'tesseract.js'

// This describes the result we get back for each image
type ExtractResult = {
  imageId: number
  text: string
}

// This function takes an array of image URLs and returns the text from each one
// We use Promise<ExtractResult[]> because OCR takes time — it's async
export async function extractTextFromImages(
  images: { id: number; url: string }[]
): Promise<ExtractResult[]> {

  // Process all images at the same time using Promise.all
  // This is faster than doing them one by one
  const results = await Promise.all(
    images.map(async (image) => {

      // Tesseract.recognize reads the image and returns the text it finds
      // 'eng' means we are reading English text
      const result = await Tesseract.recognize(image.url, 'eng')

      // Return the image id and the extracted text
      // .trim() removes any extra spaces or empty lines
      return {
        imageId: image.id,
        text: result.data.text.trim()
      }
    })
  )

  return results
}