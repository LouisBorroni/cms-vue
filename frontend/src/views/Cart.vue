<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <Navbar :cartCount="cart.length" @logout="logout" @go-cart="goCart" />
    <main class="py-8 px-4 w-full max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-primary-600 text-center flex items-center justify-center">🛒 Mon Panier
      </h2>
      <div v-if="cart.length === 0"
        class="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-6 rounded-lg shadow mb-8 text-center">
        Votre panier est vide.
      </div>
      <div v-else class="space-y-6">
        <div v-for="(item, index) in cart" :key="item.id"
          class="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow p-4 gap-4">
          <img :src="item.image_url || 'https://via.placeholder.com/150'"
            class="w-32 h-32 object-cover rounded-lg border" />
          <div class="flex-1 w-full">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-xl font-semibold text-gray-800">{{ item.name }}</h3>
              <button @click="removeItem(index)" class="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                title="Supprimer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-4 mb-2">
              <span class="text-lg font-bold text-primary-600">{{ formatPrice(item.price) }} €</span>
              <input type="number" min="1" v-model.number="item.quantity" @change="saveCart"
                class="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary-600" />
              <span class="text-gray-500">Quantité</span>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row justify-between items-center mt-8">
          <div class="text-2xl font-bold text-primary-600 mb-4 sm:mb-0">Total : {{ formatPrice(total) }} €</div>
          <button @click="checkout" :disabled="cart.length === 0"
            class="ml-4 px-4 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Passer commande
          </button>
        </div>
      </div>
      <div v-if="cart.length === 0" class="flex justify-center mt-8">
        <button @click="goDashboard"
          class="px-6 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition">
          Retour aux articles
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cart = ref(
  JSON.parse(localStorage.getItem('cart') || '[]').map(item => ({
    ...item,
    quantity: item.quantity || 1,
  }))
)

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

const total = computed(() =>
  cart.value.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
)

const formatPrice = (price) => Number(price).toFixed(2)

const removeItem = (index) => {
  cart.value.splice(index, 1)
  saveCart()
}

const checkout = async () => {
  if (cart.value.length === 0) return

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Vous devez être connecté pour passer commande.')
      router.push('/login')
      return
    }

    const res = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.value,
        total: total.value,
      }),
    })

    if (!res.ok) {
      const errData = await res.json()
      alert('Erreur lors de la commande : ' + (errData.error || 'Erreur inconnue'))
      return
    }

    alert(`Commande passée pour un total de ${formatPrice(total.value)} € !`)
    cart.value = []
    saveCart()
    router.push('/dashboard')
  } catch (err) {
    alert('Erreur réseau lors de la commande')
    console.error(err)
  }
}

const goDashboard = () => {
  router.push('/dashboard')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const goCart = () => {
  router.push('/cart')
}
</script>

<style>
.bg-primary-600 {
  background-color: #16a34a;
}

.text-primary-600 {
  color: #16a34a;
}

.hover\:bg-primary-700:hover {
  background-color: #15803d;
}
</style>
