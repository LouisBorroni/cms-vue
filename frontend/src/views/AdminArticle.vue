<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <Navbar :cartCount="0" @logout="logout" @go-cart="goCart" />
    <main class="py-8 px-4 w-full max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-primary-600 text-center">Administration des Articles</h2>

      <div v-if="error" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg shadow mb-6 text-center">
        {{ error }}
      </div>

      <div class="flex justify-end mb-4">
        <button
          @click="openDialog()"
          class="px-4 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition"
        >
          Ajouter un article
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-xl shadow-lg">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-3 px-4 text-left font-semibold text-gray-700">Nom</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700">Description</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700">Prix (€)</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="article in articles"
              :key="article.id"
              class="border-b last:border-b-0 hover:bg-gray-50"
            >
              <td class="py-3 px-4 font-semibold">{{ article.name }}</td>
              <td class="py-3 px-4 text-gray-600">{{ article.description }}</td>
              <td class="py-3 px-4 text-primary-600 font-bold">
                {{ isNaN(parseFloat(article.price)) ? 'N/A' : Number(article.price).toFixed(2) }}
              </td>
              <td class="py-3 px-4 flex gap-2">
                <button
                  @click="openDialog(article)"
                  class="text-white bg-blue-500 hover:bg-blue-100 hover:text-blue-700 p-2 rounded-full transition"
                  title="Modifier"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteArticle(article.id)"
                  class="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                  title="Supprimer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="articles.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-500">Aucun article disponible.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="dialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      >
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
          <button
            @click="closeDialog"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 class="text-xl font-bold text-primary-600 mb-6 text-center">
            {{ isEdit ? 'Modifier' : 'Ajouter' }} un article
          </h3>
          <form @submit.prevent="saveArticle" class="space-y-4">
            <div>
              <label class="block text-gray-700 mb-1 font-semibold">Nom</label>
              <input
                v-model="form.name"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-1 font-semibold">Description</label>
              <textarea
                v-model="form.description"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              ></textarea>
            </div>
            <div>
              <label class="block text-gray-700 mb-1 font-semibold">Prix (€)</label>
              <input
                v-model="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-1 font-semibold">URL image</label>
              <input
                v-model="form.image_url"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <button
                type="button"
                @click="closeDialog"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="!form.name || !form.description || !form.price || !form.image_url"
                class="px-4 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isEdit ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const articles = ref([]);
const error = ref("");
const dialog = ref(false);
const isEdit = ref(false);
const form = reactive({
  id: null,
  name: "",
  description: "",
  price: "",
  image_url: "",
});


const fetchArticles = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/articles", {
      credentials: "include", 
    });
    if (!res.ok) throw new Error("Erreur lors du chargement des articles");
    articles.value = await res.json();
  } catch (e) {
    error.value = e.message;
  }
};

const openDialog = (article = null) => {
  if (article) {
    isEdit.value = true;
    Object.assign(form, {
      id: article.id,
      name: article.name ?? "",
      description: article.description ?? "",
      price: article.price ?? "",
      image_url: article.image_url ?? "",
    });
  } else {
    isEdit.value = false;
    Object.assign(form, {
      id: null,
      name: "",
      description: "",
      price: "",
      image_url: "",
    });
  }
  error.value = "";
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  error.value = "";
};

const saveArticle = async () => {
  try {
    if (!form.name || !form.description || !form.price || !form.image_url) return;

    const method = isEdit.value ? "PUT" : "POST";
    const url = isEdit.value
      ? `http://localhost:3000/api/articles/${form.id}`
      : "http://localhost:3000/api/articles";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        image_url: form.image_url,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Erreur lors de la sauvegarde");
    }

    await fetchArticles();
    closeDialog();
  } catch (e) {
    error.value = e.message;
  }
};

const deleteArticle = async (id) => {
  if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;
  try {
    const res = await fetch(`http://localhost:3000/api/articles/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Erreur lors de la suppression");
    }
    await fetchArticles();
  } catch (e) {
    error.value = e.message;
  }
};

const logout = () => {
  router.push("/login");
};

const goCart = () => {
  router.push("/cart");
};

onMounted(() => {
  fetchArticles();
});
</script>
