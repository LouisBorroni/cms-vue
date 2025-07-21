<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center w-full">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-primary-600 mb-6 text-center">Inscription</h2>
      <form @submit.prevent="register" class="space-y-6">
        <div>
          <label class="block text-gray-700 mb-1 font-semibold">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1 font-semibold">Mot de passe</label>
          <input v-model="password" type="password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" />
          <div class="text-xs text-gray-500 mt-1">8 caractères, majuscule, minuscule, chiffre, spécial</div>
        </div>
        <button type="submit" class="w-full py-3 bg-primary-600 text-primary-50 rounded-full font-semibold shadow hover:bg-primary-400 hover:text-primary-700 flex items-center justify-center gap-2 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          S'inscrire
        </button>
      </form>
      <div class="mt-6 text-center">
        <span class="text-gray-600">Déjà un compte ?</span>
        <button @click="goLogin" class="ml-2 text-primary-600 font-semibold hover:underline">Se connecter</button>
      </div>
    </div>
  </div>
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

const register = async () => {
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
