<template>
  <div class="bg-elevated/50 rounded-lg px-4 md:px-6 py-5 space-y-6">
    <div>
      <div class="mb-2 flex flex-row gap-3 items-center">
        <img
          :src="randomAvatar"
          width="40"
          height="40"
          alt=""
          class="size-12 rounded-full"
        >
        <h3 class="text-xl font-semibold">
          {{ checkout?.deliveryMethod === 'WAREHOUSE' ? $t('app.cart.pickup') : $t('app.cart.delivery') }}
        </h3>
      </div>

      <p class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('center.checkout.name') }}:</span> {{ checkout?.name }}
      </p>
      <p class="font-medium mb-2">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('center.checkout.phone') }}:</span> {{ checkout?.phone }}
      </p>

      <p v-if="checkout?.time" class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('app.checkout.time-title') }}:</span> {{ checkout?.timeType === 'ASAP' ? $t('app.checkout.as-soon-as-possible') : new Date(checkout?.time).toLocaleString(undefined, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) }}
      </p>

      <div class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal pr-1">{{ $t('app.checkout.address.title') }}:</span>
        <p v-if="warehouse?.address" class="inline">
          {{ warehouse?.address }}
        </p>
        <p v-if="checkout?.street" class="inline">
          <span>{{ checkout?.street }} {{ checkout?.flat }}</span>
          <span v-if="checkout?.intercom" class="lowercase">, {{ $t('app.checkout.address.intercom') }} {{ checkout?.intercom }}</span>
          <span v-if="checkout?.entrance" class="lowercase">, {{ $t('app.checkout.address.entrance') }} {{ checkout?.entrance }}</span>
          <span v-if="checkout?.floor" class="lowercase">, {{ $t('app.checkout.address.floor') }} {{ checkout?.floor }}</span>
          <span v-if="checkout?.addressNote">. {{ checkout?.addressNote }}</span>
        </p>
      </div>

      <p class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('app.checkout.payment-title') }}:</span> {{ paymentMethod }}
      </p>
      <p v-if="checkout?.change" class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('app.checkout.change-label') }}:</span> {{ checkout?.change }} {{ channel.currencySign }}
      </p>
      <p v-if="checkout?.note" class="font-medium">
        <span class="text-neutral-500 dark:text-neutral-400 font-normal">{{ $t('app.checkout.order-note') }}:</span> {{ checkout?.note }}
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <CommandCenterCheckoutLine
        v-for="line in checkout?.items"
        :key="line.id"
        :line-id="line.id"
      />
    </div>

    <div class="flex flex-row justify-between">
      <div class="text-neutral-500 dark:text-neutral-400">
        {{ $t('app.checkout.cost.products') }}
      </div>
      <div class="tracking-tight text-lg">
        {{ checkout?.totalPrice }} <span class="text-sm">{{ channel.currencySign }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRandInteger } from '@nextorders/core/shared/random'

const { id } = defineProps<{
  id: string
}>()

const { locale } = useI18n()
const channel = useChannelStore()
const { checkouts } = await useCheckoutList()
const checkout = computed(() => checkouts.value?.find((c) => c.id === id))
const warehouse = computed(() => channel.warehouses.find((w) => w.id === checkout.value?.warehouseId))

const paymentMethod = computed(() => getLocaleValue({ values: channel.paymentMethods.find((p) => p.id === checkout.value?.paymentMethodId)?.name, locale: locale.value, defaultLocale: channel.defaultLocale }))

const randomAvatar = computed(() => `/img/avatar/${getRandInteger(1, 10)}.svg`)
</script>
