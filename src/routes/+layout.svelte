<script lang="ts">
  import { page } from '$app/stores'
  import { MetaTags } from 'svelte-meta-tags';
  import Layout from '$src/components/layout/index.svelte';
  import { loading } from '$src/lib/stores/utils';
  import config from '$src/lib/config';
  import '../styles/app.css'
  import type { LayoutData } from './$types';
  export let data: LayoutData


</script>
<MetaTags
  title="Pomodoro Timer"
  titleTemplate="%s | OSS Pomodoro"
  description="This example uses more of the available config options."
  canonical="https://www.canonical.ie/"
  openGraph={{
    url: 'https://www.url.ie/a',
    title: 'Open Graph Title',
    description: 'Open Graph Description',
    images: [
      {
        url: 'https://www.example.ie/og-image-01.jpg',
        width: 800,
        height: 600,
        alt: 'Og Image Alt'
      },
      {
        url: 'https://www.example.ie/og-image-02.jpg',
        width: 900,
        height: 800,
        alt: 'Og Image Alt Second'
      },
      { url: 'https://www.example.ie/og-image-03.jpg' },
      { url: 'https://www.example.ie/og-image-04.jpg' }
    ],
    siteName: 'SiteName'
  }}
  twitter={{
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
    title: 'Using More of Config',
    description: 'This example uses more of the available config options.',
    image: 'https://www.example.ie/twitter-image.jpg',
    imageAlt: 'Twitter image alt'
  }}
  facebook={{
    appId: '1234567890'
  }}
/>
{#if $loading}
<div class="hero h-screen">
  <div class="hero-content">
    <span class="loading loading-ring w-24 text-primary"></span>
  </div>
</div>
{:else}
  {#if config.paths.noLayout.includes($page.url.pathname)}
    <slot />
  {:else}
    <Layout user={data.profile}>
      <slot />
    </Layout>
  {/if}
{/if}