<template>
    <div>
        <div class="container app__content">
            <div class="row justify-content-center">
                <div class="d-flex flex-column justify-content-between col-12 min-vh-100 pt-5 pb-2">
                    <transition name="fade" mode="out-in">
                        <router-view/>
                    </transition>
                    <TheFooter/>
                </div>
            </div>
        </div>
        <CustomizationsModal/>
        <ClientModal v-if="team"/>
        <TeamModal v-if="team"/>
        <BankAccountModal v-if="team"/>
        <ImportModal/>
    </div>
</template>

<script>
import { useTeamsStore } from '@/store/teams';
import ClientModal from '@/components/clients/ClientModal.vue';
import BankAccountModal from '@/components/bank-accounts/BankAccountModal.vue';
import TeamModal from '@/components/team/TeamModal.vue';
import TheFooter from '@/components/TheFooter.vue';
import CustomizationsModal from '@/components/invoices/CustomizationsModal.vue';
import ImportModal from '@/components/ImportModal.vue';

export default {
  components: {
    TheFooter,
    TeamModal,
    ImportModal,
    BankAccountModal,
    ClientModal,
    CustomizationsModal,
  },
  setup() {
    const teamsStore = useTeamsStore();
    return { teamsStore };
  },
  computed: {
    team() {
      return this.teamsStore.team;
    },
  },
};
</script>
