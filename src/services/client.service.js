import { validate } from '@/utils/helpers';
import data from '@/services/data.service';

class ClientService {
  async getClients() {
    return data.get('clients');
  }

  async getClient(clientId) {
    return data.get(`clients/${clientId}`);
  }

  async createClient(client) {
    const requiredFields = { name: 'Name' };
    const res = validate(requiredFields, client);
    if (Object.keys(res.errors).length > 0) {
      return Promise.reject(res);
    }
    return data.post('clients', client);
  }

  async updateClient(client) {
    const requiredFields = { name: 'Name' };
    const res = validate(requiredFields, client);
    if (Object.keys(res.errors).length > 0) {
      return Promise.reject(res);
    }
    return data.patch(`clients/${client.id}`, client);
  }

  async deleteClient(clientId) {
    return data.delete(`clients/${clientId}`);
  }
}

export default new ClientService();
