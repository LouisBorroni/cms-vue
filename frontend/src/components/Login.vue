<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Connexion</v-card-title>
          <v-card-text>
            <v-text-field label="Email" v-model="email" />
            <v-text-field label="Mot de passe" v-model="password" type="password" />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="login">Se connecter</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/dashboard')
  }
})

const login = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } else {
      alert(data.error)
    }
  } catch {
    alert('Erreur réseau')
  }
}

const goRegister = () => router.push('/register')
</script>
