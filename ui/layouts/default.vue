<template>
  <v-app>
    <v-app-bar app dark color="primary">
      <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
    </v-app-bar>
    <v-main><Nuxt /></v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  computed: {
    appTitle() {
      return this.$config.appTitle;
    },
  },
};
</script>
