<template>
  <v-app>
    <Navbar :cartCount="0" @logout="logout" @go-cart="goCart" />

    <v-main class="pa-6">
      <v-container>
        <h2 class="my-6 text-center">Administration des Articles</h2>

        <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

        <v-btn color="primary" class="mb-4" @click="openDialog()"
          >Ajouter un article</v-btn
        >

        <table class="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix (€)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in articles" :key="article.id">
              <td>{{ article.name }}</td>
              <td>{{ article.description }}</td>
              <td>
                {{
                  isNaN(parseFloat(article.price))
                    ? "N/A"
                    : Number(article.price).toFixed(2)
                }}
              </td>
              <td>
                <v-btn
                  icon
                  color="blue"
                  @click="openDialog(article)"
                  title="Modifier"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="red"
                  @click="deleteArticle(article.id)"
                  title="Supprimer"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
            <tr v-if="articles.length === 0">
              <td colspan="4" class="text-center">Aucun article disponible.</td>
            </tr>
          </tbody>
        </table>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline"
                >{{ isEdit ? "Modifier" : "Ajouter" }} un article</span
              >
            </v-card-title>

            <v-card-text>
              <v-form ref="formRef" v-model="valid">
                <v-text-field
                  label="Nom"
                  v-model="form.name"
                  :rules="[(v) => !!v || 'Le nom est requis']"
                  required
                />
                <v-textarea
                  label="Description"
                  v-model="form.description"
                  :rules="[(v) => !!v || 'La description est requise']"
                  required
                />
                <v-text-field
                  label="Prix (€)"
                  v-model="form.price"
                  :rules="[
                    (v) =>
                      (!!v && !isNaN(parseFloat(v))) || 'Prix valide requis',
                  ]"
                  required
                />
                <v-text-field
                  label="URL image"
                  v-model="form.image_url"
                  :rules="[(v) => !!v || 'URL image requise']"
                  required
                />
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeDialog">Annuler</v-btn>
              <v-btn color="primary" :disabled="!valid" @click="saveArticle">
                {{ isEdit ? "Modifier" : "Ajouter" }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const articles = ref([]);
const error = ref("");
const dialog = ref(false);
const valid = ref(false);
const isEdit = ref(false);
const formRef = ref(null);
const form = reactive({
  id: null,
  name: "",
  description: "",
  price: "",
  image_url: "",
});

const token = localStorage.getItem("token");

const fetchArticles = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/articles");
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
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  error.value = "";
  if (formRef.value) formRef.value.resetValidation();
};

const saveArticle = async () => {
  try {
    if (!valid.value) return;

    const method = isEdit.value ? "PUT" : "POST";
    const url = isEdit.value
      ? `http://localhost:3000/api/articles/${form.id}`
      : "http://localhost:3000/api/articles";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  localStorage.removeItem("token");
  router.push("/login");
};

const goCart = () => {
  router.push("/cart");
};

onMounted(() => {
  fetchArticles();
});
</script>

<style scoped>
.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.admin-table th {
  background-color: #f2f2f2;
  font-weight: 600;
  font-size: 16px;
}

.admin-table tr:hover {
  background-color: #f1f1f1;
}

.admin-table td > button {
  margin-right: 8px;
}
</style>
