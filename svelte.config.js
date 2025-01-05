import adapterStatic from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapterStatic({
      fallback: 'index.html',
    }),
    prerender: {
      entries: ['*'],
    },
  },
};
