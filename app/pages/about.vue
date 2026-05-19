<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('about.seoTitle'),
  description: () => t('about.seoDescription')
})
</script>

<template>
  <section
    class="mx-auto w-full max-w-4xl px-6 py-8 text-[#1c1b1b] dark:text-[#f4f4f5]"
  >
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <img
        src="/pwa-icon.svg"
        :alt="t('app.seo.ogImageAlt')"
        class="h-16 w-16 rounded-2xl border border-default bg-default p-2"
      >

      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          {{ t("about.title") }}
        </h2>
        <p class="mt-1 text-sm text-[#4b5563] dark:text-[#d1d5db]">
          {{ t("about.subtitle") }}
        </p>
      </div>
    </div>

    <p class="mt-4 text-sm leading-6 text-[#4b5563] dark:text-[#d1d5db]">
      {{ t("about.p1") }}
    </p>

    <p class="mt-3 text-sm leading-6 text-[#4b5563] dark:text-[#d1d5db]">
      {{ t("about.p2") }}
    </p>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <article class="rounded-xl border border-default bg-default p-4">
        <h3 class="text-sm font-semibold">
          {{ t("about.goalsTitle") }}
        </h3>
        <p class="mt-2 text-sm text-[#4b5563] dark:text-[#d1d5db]">
          {{ t("about.goalsText") }}
        </p>
      </article>

      <article class="rounded-xl border border-default bg-default p-4">
        <h3 class="text-sm font-semibold">
          {{ t("about.featuresTitle") }}
        </h3>
        <p class="mt-2 text-sm text-[#4b5563] dark:text-[#d1d5db]">
          {{ t("about.featuresText") }}
        </p>
      </article>

      <article
        class="rounded-xl border border-default bg-default p-4 sm:col-span-2"
      >
        <h3 class="text-sm font-semibold">
          {{ t("about.techTitle") }}
        </h3>
        <p class="mt-2 text-sm text-[#4b5563] dark:text-[#d1d5db]">
          {{ t("about.techText") }}
        </p>
      </article>
    </div>
  </section>
</template>
