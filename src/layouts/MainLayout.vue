<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-2">
      <q-toolbar>
        <q-btn
          color="dark"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-dark" @click="$router.push('/')">
          {{ userName }} <b class="text-amber-5">Notes</b>
        </q-toolbar-title>

        <q-btn
          v-if="!isLogged"
          @click="authenticateUser"
          flat
          round
          dense
          icon="login"
          color="black"
        >
          Entrar
        </q-btn>

        <q-btn
          v-if="isLogged"
          @click="logoutUser"
          flat
          round
          dense
          icon="logout"
          color="black"
        >
          Sair
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Notas </q-item-label>

        <q-item v-if="isLogged" @click="toggleModal" clickable>
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Adicionar nota</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <div v-for="note in notes" :key="note.id">
          <NoteMenu v-bind="note" />
          <q-separator />
        </div>
      </q-list>
    </q-drawer>

    <q-dialog v-model="modalOpen" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nome da nota</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="noteName"
            autofocus
            @keyup.enter="createFolder"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Adicionar nota" @click="createFolder" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useNoteStore } from '../stores/note';
import { useUserStore } from '../stores/user';

import NoteMenu from 'components/NoteMenu.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    NoteMenu,
  },

  setup() {
    const noteStore = useNoteStore();
    const userStore = useUserStore();
    const router = useRouter();

    const leftDrawerOpen = ref(false);
    const modalOpen = ref(false);
    const noteName = ref('');

    function createFolder() {
      noteStore.addNote({
        userId: userStore.user.id,
        title: noteName.value,
      });

      noteName.value = '';
      modalOpen.value = false;
    }

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    function toggleModal() {
      modalOpen.value = !modalOpen.value;
    }

    async function authenticateUser() {
      await userStore.authenticateWithGoogle();
      await noteStore.syncNotes({
        userId: userStore.user.id,
      });
    }

    async function logoutUser() {
      userStore.logoutUser();
      noteStore.clearLocalNotes();
      await router.push('/');
    }

    return {
      userName: computed(() => {
        const userName = userStore.user.name;
        return userName ? userName.split(' ')[0] : '';
      }),
      isLogged: computed(() => userStore.isLogged),
      notes: computed(() => noteStore.getAllNotes),
      leftDrawerOpen,
      modalOpen,
      noteName,
      createFolder,
      toggleLeftDrawer,
      toggleModal,
      authenticateUser,
      logoutUser,
    };
  },
});
</script>
