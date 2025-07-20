<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Foodland</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn icon @click="$router.push('/dashboard')" title="Accueil">
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn icon @click="$emit('go-cart')" title="Panier">
      <v-badge :content="cartCount" color="red" overlap>
        <v-icon>mdi-cart</v-icon>
      </v-badge>
    </v-btn>

    <v-btn icon @click="$router.push('/orders')" title="Mes commandes">
      <v-icon>mdi-package-variant-closed</v-icon>
    </v-btn>

    <v-btn text @click="$emit('logout')">Déconnexion</v-btn>
  </v-app-bar>

  <div style="padding-top: 64px;"></div>
</template>

<script setup>
defineProps({
  cartCount: {
    type: Number,
    default: 0,
  },
})
</script>
