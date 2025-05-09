import { useStorage } from '#imports'

export default defineEventHandler(async () => {
  const storage = useStorage()
  const keys = await storage.getKeys('s3')

  // Filter out non-image files
  const imageKeys = keys.filter(key => 
    key.endsWith('.jpg') || 
    key.endsWith('.jpeg') || 
    key.endsWith('.png') || 
    key.endsWith('.webp'),
  )

  console.log('Found image keys:', imageKeys)

  // Delete each image
  const deletePromises = imageKeys.map(async (key) => {
    try {
      await storage.removeItem(key)
      console.log('Deleted:', key)
      return { key, success: true }
    } catch (error) {
      console.error('Failed to delete:', key, error)
      return { key, success: false, error }
    }
  })

  const results = await Promise.all(deletePromises)
  const successCount = results.filter(r => r.success).length
  const failureCount = results.filter(r => !r.success).length

  return {
    total: imageKeys.length,
    success: successCount,
    failed: failureCount,
    results,
  }
}) 