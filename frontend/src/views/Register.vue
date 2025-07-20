<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Inscription</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                label="Email"
                v-model="email"
                :rules="emailRules"
                required
              />
              <v-text-field
                label="Mot de passe"
                v-model="password"
                type="password"
                :rules="passwordRules"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="register">S'inscrire</v-btn>
            <v-spacer></v-spacer>
            <v-btn text @click="goLogin">J'ai déjà un compte</v-btn>
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
const form = ref(null)
const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/dashboard')
  }
})

const emailRules = [
  v => !!v || 'Email requis',
  v => /.+@.+\..+/.test(v) || 'Email invalide',
]

const passwordRules = [
  v => !!v || 'Mot de passe requis',
  v => v.length >= 8 || 'Au moins 8 caractères',
  v => /[A-Z]/.test(v) || 'Une majuscule',
  v => /[a-z]/.test(v) || 'Une minuscule',
  v => /[0-9]/.test(v) || 'Un chiffre',
  v => /[^A-Za-z0-9]/.test(v) || 'Un caractère spécial',
]

const register = async () => {
  const isValid = form.value?.validate()
  if (!isValid) return

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const data = await res.json()
    if (res.ok) {
      alert('Compte créé, connectez-vous !')
      router.push('/login')
    } else {
      alert(data.error || 'Erreur lors de la création du compte')
    }
  } catch {
    alert('Erreur réseau')
  }
}

const goLogin = () => router.push('/login')
</script>
