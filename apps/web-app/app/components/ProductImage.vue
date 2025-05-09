<template>
  <picture v-if="media?.items?.length">
    <source type="image/webp" :srcset="srcWebp">
    <img
      :loading="lazy ? 'lazy' : 'eager'"
      :src="src"
      alt=""
      class="rounded-lg w-full"
      @error="handleImageError"
    >
  </picture>

  <NuxtImg
    v-else
    alt=""
    class="w-full opacity-20"
    src="/img/no-image.png"
  />
</template>

<script setup lang="ts">
import type { MediaWithItems } from '@nextorders/core/types/food'
import type { MediaItem } from '@nextorders/schema'

const { media, lazy = true, size = 'sm' } = defineProps<{
  media?: MediaWithItems | null
  lazy?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>()

const sizesMap = {
  xs: 120,
  sm: 300,
  md: 600,
  lg: 800,
}

const src = computed(() => {
  const url = getNearestImageBySizeAndFormat(sizesMap[size], 'jpg', media?.items ?? [])?.url
  return url ? replaceLastTwoSlashes(url) : undefined
})

const srcWebp = computed(() => {
  const url = getNearestImageBySizeAndFormat(sizesMap[size], 'webp', media?.items ?? [])?.url
  return url ? replaceLastTwoSlashes(url) : undefined
})

function getNearestImageBySizeAndFormat(size: number, format: 'jpg' | 'webp', items: MediaItem[]): MediaItem | undefined {
  if (!items?.length) {
    return
  }

  const filteredByFormat = items.filter((item) => item.format === format)
  return filteredByFormat.reduce((prev, curr) => {
    return Math.abs(curr.size - size) < Math.abs(prev.size - size) ? curr : prev
  })
}

function replaceLastTwoSlashes(str: string): string {
  // Find the indices of the last two occurrences of '/'
  let lastSlashIndex = -1
  let secondLastSlashIndex = -1

  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] === '/') {
      if (lastSlashIndex === -1) {
        lastSlashIndex = i
      } else if (secondLastSlashIndex === -1) {
        secondLastSlashIndex = i
        break // Found the second last, no need to continue
      }
    }
  }

  // If we found at least one '/', perform the replacements
  if (lastSlashIndex !== -1) {
    let newStr = str
    if (secondLastSlashIndex !== -1) {
      newStr = `${newStr.substring(0, secondLastSlashIndex)}:${newStr.substring(secondLastSlashIndex + 1)}`
      newStr = `${newStr.substring(0, lastSlashIndex)}:${newStr.substring(lastSlashIndex + 1)}`
    } else {
      // Only one '/' found, replace it
      newStr = `${newStr.substring(0, lastSlashIndex)}:${newStr.substring(lastSlashIndex + 1)}`
    }
    return newStr
  }

  // If no '/' found, return the original string
  return str
}

function handleImageError(e: Event) {
  console.error('Image failed to load:', e)
}
</script>
