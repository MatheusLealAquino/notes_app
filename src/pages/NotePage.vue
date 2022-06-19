<template>
  <q-page class="items-center q-ma-sm">
    <q-input bottom-slots v-model="noteTitle" label="Nota">
      <template v-slot:after>
        <q-btn @click="toggleModal" round dense flat icon="delete" />
      </template>
    </q-input>

    <q-editor v-model="note" min-height="20rem" min-width="100%" />

    <q-dialog v-model="modalOpen" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Notas</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Tem certeza que deseja deletar essa nota?
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Deletar nota" color="red" @click="deleteNote" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNoteStore } from '../stores/note';

export default defineComponent({
  name: 'NotePage',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const noteStore = useNoteStore();

    const note = ref('');
    const noteTitle = ref('');
    const modalOpen = ref(false);

    let id: string;

    onMounted(() => {
      id = route.params.id as string;

      const foundNote = noteStore.getNoteById({
        id,
      });
      note.value = foundNote?.noteData || '';
      noteTitle.value = foundNote?.title || '';
    });

    watch(note, (newValue) => {
      if (id) {
        noteStore.updateText({
          id,
          text: newValue,
        });
      }
    });

    watch(noteTitle, (newValue) => {
      if (id) {
        noteStore.updateTitle({
          id,
          title: newValue,
        });
      }
    });

    async function deleteNote() {
      noteStore.removeNote({
        id,
      });
      modalOpen.value = false;
      await router.push('/');
    }

    return {
      note,
      noteTitle,
      modalOpen,
      deleteNote,
      toggleModal() {
        modalOpen.value = !modalOpen.value;
      },
    };
  },
});
</script>
