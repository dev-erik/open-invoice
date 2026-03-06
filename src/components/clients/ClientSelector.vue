<template>
    <div class="search-popover__container">
        <div class="editable__item"
             :class="btnClasses"
             ref="buttonEl"
             :tabindex="tabindex"
             @click="toggleOpen">
            <span v-if="!value" class="d-print-none">{{ $t('client-selector:client') }}</span>
            <span v-else>{{ value }}</span>
        </div>
        <div class="search-popover__overlay" v-if="isOpen" @click="toggleOpen"></div>
        <div class="search-popover__select" v-show="isOpen">
            <input
                ref="inputEl"
                type="text"
                class="form-control"
                :placeholder="$t('client-selector:suggest_placeholder')"
                :value="query"
                @input="onInput"
                @keydown.esc="toggleOpen"
                @keydown.tab="toggleOpen"
                @keydown.down="onKeyDown"
                @keydown.ctrl.enter="createNewClient"
            />
            <ul v-if="filteredClients.length" class="list-group mt-1">
                <li v-for="client in filteredClients"
                    :key="client.id"
                    class="list-group-item list-group-item-action pointer"
                    @click="onSelected(client)">
                    {{ client.company_name }}
                </li>
            </ul>
            <button class="btn btn-link mt-2"
                    ref="createNewButton"
                    @click="createNewClient"
                    @keydown.up="returnToSuggestions">
                <i class="material-icons material-icons-round md-18">add</i>
                {{ $t('client-selector:create') }} {{ query ? `"${query}"` : $t('client-selector:new') }}
                <code class="ms-2 badge bg-secondary">ctrl + enter</code>
            </button>
        </div>
    </div>
</template>

<script>
import { useClientsStore } from '@/store/clients';

export default {
  props: {
    value: { default: null },
    btnClass: { default: null },
  },
  emits: ['selected', 'update:value'],
  data() {
    return {
      isOpen: false,
      query: '',
      tabindex: 0,
    };
  },
  computed: {
    filteredClients() {
      const clientsStore = useClientsStore();
      const all = clientsStore.all || [];
      if (!this.query) return all;
      const q = this.query.toLowerCase();
      return all.filter(c => c.company_name && c.company_name.toLowerCase().includes(q));
    },
    btnClasses() {
      return !this.value ? `text-muted ${this.btnClass || ''}` : (this.btnClass || '');
    },
  },
  methods: {
    toggleOpen() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    open() {
      this.isOpen = true;
      setTimeout(() => {
        this.tabindex = -1;
        if (this.$refs.inputEl) {
          this.$refs.inputEl.click();
          this.$refs.inputEl.focus();
        }
      });
    },
    close() {
      this.isOpen = false;
      setTimeout(() => {
        this.tabindex = 0;
      });
      this.query = '';
    },
    onInput(event) {
      this.query = event.target.value;
    },
    onSelected(client) {
      this.$emit('selected', client);
      this.close();
    },
    async createNewClient() {
      const clientsStore = useClientsStore();
      if (this.query.length) {
        const client = await clientsStore.createNewClient({ company_name: this.query });
        this.$emit('selected', client);
      } else {
        clientsStore.openNewClientModal();
      }
      this.close();
    },
    onKeyDown() {
      if (this.filteredClients.length === 0 && this.$refs.createNewButton) {
        this.$refs.createNewButton.focus();
      }
    },
    returnToSuggestions() {
      if (this.$refs.inputEl) {
        this.$refs.inputEl.focus();
      }
    },
  },
};
</script>
