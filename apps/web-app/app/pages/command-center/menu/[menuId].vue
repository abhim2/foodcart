<template>
  <CommandCenterHeader :title="menu?.name ?? t('center.menu.menu-page')">
    <FormUpdateMenuActivity :menu-id="menu?.id ?? ''" :is-active="menu?.isActive ?? false" />

    <template #submenu>
      <UNavigationMenu
        :items="categoryItems"
        highlight
        class="flex-1 -ml-2.5"
      />
    </template>
  </CommandCenterHeader>

  <NuxtPage />
</template>

<script setup lang="ts">
const { params } = useRoute('command-center-menu-menuId')
const channel = useChannelStore()
const menu = channel.getMenu(params.menuId)
if (!menu.value) {
  throw createError({ statusCode: 404, statusMessage: 'Menu not found' })
}

const { t, locale } = useI18n()

const categoryItems = computed(() => menu.value?.categories.map((category) => {
  return {
    label: getLocaleValue({ values: category.name, locale: locale.value, defaultLocale: channel.defaultLocale }),
    to: `/command-center/menu/${menu.value?.id}/category/${category.id}`,
    icon: category.icon ?? 'food:bookmark',
  }
}))
</script>
