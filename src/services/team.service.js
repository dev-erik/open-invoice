import data from '@/services/data.service';
import { uuidv4 } from '@/utils/helpers';

const DEFAULT_CUSTOM_CSS = `
/* @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300&display=swap');

.invoice-box:after {
    background: linear-gradient(to bottom, #1C7CE0, #150051);
}

.invoice-box {
    font-family: 'Work Sans', sans-serif;
} */
`;

function createDefaultTeam() {
  return {
    id: uuidv4(),
    company_name: '',
    company_address: '',
    company_postal_code: '',
    company_country: '',
    company_county: '',
    company_city: '',
    website: '',
    contact_email: '',
    contact_phone: '',
    vat_code: '',
    currency: null,
    invoice_late_fee: null,
    invoice_due_days: null,
    fields: [],
    updated_at: '',
    created_at: '',
    logo_url: '',
    custom_css: DEFAULT_CUSTOM_CSS,
  };
}

class TeamService {
  async getTeam() {
    let team = await data.get('team');
    if (!team) {
      team = createDefaultTeam();
      await this.updateTeam(team);
    }

    return team;
  }

  async updateTeam(team) {
    return data.put('team', team);
  }
}

export default new TeamService();
