import { defineStore } from 'pinia';
import { uuidv4 } from '@/utils/helpers';
import { useTeamsStore } from '@/store/teams';

export const useTeamFieldsStore = defineStore('teamFields', {
  actions: {
    init() {},
    terminate() {},
    updateTeamFieldProps(fieldId, props) {
      const teamsStore = useTeamsStore();
      const team = teamsStore.item;
      if (!team || !team.fields) return null;
      const index = team.fields.findIndex(f => f.id === fieldId);
      if (index !== -1) {
        team.fields[index] = { ...team.fields[index], ...props };
      }
      return team.fields[index] || null;
    },
    async updateTeamField(payload) {
      this.updateTeamFieldProps(payload.fieldId, payload.props);
      const teamsStore = useTeamsStore();
      return teamsStore.updateTeam(null);
    },
    addNewField(teamId) {
      const teamsStore = useTeamsStore();
      const team = teamsStore.item;
      if (!team) return;
      if (!team.fields) team.fields = [];
      team.fields.push({
        id: uuidv4(),
        team_id: teamId,
        label: '',
        value: '',
      });
    },
    async deleteTeamField(fieldId) {
      const teamsStore = useTeamsStore();
      const team = teamsStore.item;
      if (team && team.fields) {
        team.fields = team.fields.filter(f => f.id !== fieldId);
      }
      return teamsStore.updateTeam(null);
    },
  },
});
