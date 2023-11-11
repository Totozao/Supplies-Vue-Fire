<template>
  <div class="center-container">
    <v-container>
      <v-row class="fill-height">
        <v-col class="d-flex justify-center align-center">
          <v-card class="rounded-rectangle">
            <v-card-text>
              <h1>Welcome to My Vue Project with Vuetify</h1>
              <template v-if="user">
                <h2>Hello, {{ user.displayName }}!</h2>
                <template v-if="loading">
                  <p>Loading...</p>
                </template>
                <template v-else>
                  <div v-if="documentData.length > 0">
                    <h2>Document Content:</h2>
                    <ul>
                      <li v-for="documentItem in documentData" :key="documentItem.id">
                        <strong>{{ documentItem.id }}</strong>:
                        {{ JSON.stringify(documentItem.data) }}
                      </li>
                    </ul>
                  </div>
                  <div v-else>
                    <p>No documents found.</p>
                  </div>
                </template>
                <h2>Add Document:</h2>
                <v-form @submit.prevent="addDocument">
                  <v-select v-model="brand" :items="brandOptions" label="Brand"></v-select>
                  <v-text-field v-model="model" label="Model"></v-text-field>
                  <v-text-field v-model="issue" label="Issue"></v-text-field>
                  <v-text-field v-model="date" label="Date" type="date"></v-text-field>
                  <v-text-field v-model="imei" label="IMEI"></v-text-field>
                  <v-text-field v-model="costPrice" label="Cost Price"></v-text-field>
                  <v-text-field v-model="fullPrice" label="Full Price"></v-text-field>
                  <v-btn type="submit">Add Document</v-btn>
                </v-form>
              </template>
              <template v-else>
                <h2>Please log in to access the content.</h2>
                <v-form @submit.prevent="login">
                  <v-text-field v-model="email" label="Email"></v-text-field>
                  <v-text-field v-model="password" label="Password" type="password"></v-text-field>
                  <v-btn type="submit">Log In</v-btn>
                </v-form>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';

export default {
  name: 'Home-page',
  setup() {
    const auth = getAuth();
    const loading = ref(true);
    const user = ref(null);
    const email = ref('');
    const password = ref('');
    const documentData = ref([]);
    const brand = ref('');
    const model = ref('');
    const issue = ref('');
    const date = ref('');
    const imei = ref('');
    const costPrice = ref('');
    const fullPrice = ref('');
    const brandOptions = ref([]); // Add this line

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

    const addDocument = async () => {
      const db = getFirestore();
      const repairsCollection = collection(db, 'Repairs');

      const documentName = `${brand.value} ${model.value}`;

      try {
        await setDoc(doc(repairsCollection, documentName), {
          Brand: brand.value,
          Model: model.value,
          Issue: issue.value,
          Date: date.value,
          IMEI: imei.value,
          'Cost Price': costPrice.value,
          'Full Price': fullPrice.value,
          Profit: fullPrice.value - costPrice.value,
        });

        console.log('Document added with name:', documentName);
      } catch (error) {
        console.error('Error adding document:', error);
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          user.value = authUser;
          loading.value = true;

          const db = getFirestore();
          const collectionRef = collection(db, 'Repairs');

          try {
            const docs = await getDocs(collectionRef);
            documentData.value = docs.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }));
          } catch (error) {
            console.error('Error fetching documents:', error);
          } finally {
            loading.value = false;
          }
        } else {
          loading.value = false;
        }
      });
      const fetchBrandOptions = async () => {
        const db = getFirestore();
        const brandCollectionRef = collection(db, 'Brands');

        try {
          const brandDocs = await getDocs(brandCollectionRef);
          brandOptions.value = brandDocs.docs.map((doc) => doc.id);
        } catch (error) {
          console.error('Error fetching brand options:', error);
        }
      };

      fetchBrandOptions();
    });

    return {
      loading,
      user,
      email,
      password,
      documentData,
      brand,
      model,
      issue,
      date,
      imei,
      costPrice,
      fullPrice,
      brandOptions,
      login,
      addDocument,
    };
  },
};
</script>

<style scoped>
.center-container {
  height: 100vh;
}

.rounded-rectangle {
  border-radius: 1rem;
  padding: 2rem;
}
</style>
