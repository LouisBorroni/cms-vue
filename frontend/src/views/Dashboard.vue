<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Bienvenue dans ton dashboard</h1>
        <v-btn color="error" @click="logout">Déconnexion</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
