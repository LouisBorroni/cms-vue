<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center w-full">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-primary-600 mb-6 text-center">Connexion</h2>
      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label class="block text-gray-700 mb-1 font-semibold">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1 font-semibold">Mot de passe</label>
          <input v-model="password" type="password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" />
        </div>
        <button type="submit" class="w-full py-3 bg-primary-600 text-primary-50 rounded-full font-semibold shadow hover:bg-primary-400 hover:text-primary-700 flex items-center justify-center gap-2 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Se connecter
        </button>
      </form>
      <div class="mt-6 text-center">
        <span class="text-gray-600">Pas de compte ?</span>
        <button @click="goRegister" class="ml-2 text-primary-600 font-semibold hover:underline">Créer un compte</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode';

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await res.json();

    if (res.ok) {
      const decoded = jwtDecode(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', decoded.role);
      router.push('/dashboard');
    } else {
      alert(data.error);
    }
  } catch {
    alert('Erreur réseau');
  }
};

const goRegister = () => router.push('/register')
</script>
