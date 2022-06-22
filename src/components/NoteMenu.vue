<template>
  <q-item clickable @click="movePage">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NoteMenu',

  props: {
    title: {
      type: String,
      required: true,
    },

    id: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const router = useRouter();

    const newName = ref(props.title);

    async function movePage() {
      await router.push(`/note/${props.id}`);
      location.reload();
    }

    return {
      newName,
      movePage,
    };
  },
});
</script>
