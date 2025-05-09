import type { Driver } from 'unstorage'
import { BlobServiceClient } from '@azure/storage-blob'
const { Buffer } = require('buffer')

export default defineNitroPlugin(() => {
  const { azure } = useRuntimeConfig()

  // Debug logging
  console.log('Environment Variables:', {
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING ? 'Set' : 'Not Set',
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME ? 'Set' : 'Not Set',
  })

  console.log('Azure Config:', {
    hasConnectionString: !!azure.connectionString,
    connectionStringLength: azure.connectionString?.length,
    containerName: azure.containerName,
    rawConfig: azure
  })

  if (!azure.connectionString) {
    console.error('Azure Storage connection string is missing')
    throw new Error('Azure Storage connection string is required')
  }

  if (!azure.containerName) {
    console.error('Azure Storage container name is missing')
    throw new Error('Azure Storage container name is required')
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(azure.connectionString)
    const containerClient = blobServiceClient.getContainerClient(azure.containerName)

    const driver: Driver = {
      async getItem(key: string) {
        const blobClient = containerClient.getBlobClient(key)
        try {
          const downloadResponse = await blobClient.download()
          const content = await streamToBuffer(downloadResponse.readableStreamBody)
          return JSON.parse(content.toString())
        } catch {
          return null
        }
      },

      async setItem(key: string, value: any) {
        const blockBlobClient = containerClient.getBlockBlobClient(key)
        const content = JSON.stringify(value)
        const buffer = Buffer.from(content)
        await blockBlobClient.upload(buffer, buffer.length, {
          blobHTTPHeaders: {
            blobContentType: 'application/json',
          },
        })
      },

      async setItemRaw(key: string, value: Buffer) {
        const blockBlobClient = containerClient.getBlockBlobClient(key)
        await blockBlobClient.upload(value, value.length, {
          blobHTTPHeaders: {
            blobContentType: 'application/octet-stream',
          },
        })
      },

      async removeItem(key: string) {
        const blobClient = containerClient.getBlobClient(key)
        await blobClient.deleteIfExists()
      },

      async hasItem(key: string) {
        const blobClient = containerClient.getBlobClient(key)
        return await blobClient.exists()
      },

      async getKeys() {
        const keys: string[] = []
        for await (const blob of containerClient.listBlobsFlat()) {
          keys.push(blob.name)
        }
        return keys
      },
    }

    useStorage().mount('s3', driver)
  } catch (error) {
    console.error('Failed to initialize Azure Storage:', error)
    throw error
  }
})

async function streamToBuffer(readableStream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    readableStream.on('data', (data: any) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}
