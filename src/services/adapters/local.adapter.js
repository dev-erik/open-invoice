import storage from 'localforage';
import { removeVuexORMFlags } from '@/utils/helpers';
import { toRaw } from 'vue';

function toPlain(obj) {
  return JSON.parse(JSON.stringify(toRaw(obj)));
}

class LocalAdapter {
  async get(uri) {
    const parts = uri.split('/');

    if (parts.length === 1) {
      if (parts[0] === 'team') {
        return storage.getItem(parts[0]);
      }
      return (await storage.getItem(parts[0])) || [];
    }

    if (parts.length === 2) {
      const items = (await storage.getItem(parts[0])) || [];
      return items.find(it => it.id === parts[1]) || null;
    }

    return null;
  }

  async post(uri, data) {
    const items = await this.get(uri);

    const plain = toPlain(data);
    removeVuexORMFlags(plain);
    items.push(plain);

    await storage.setItem(uri, items);

    return plain;
  }

  async patch(uri, data) {
    const parts = uri.split('/');

    if (parts.length === 2) {
      const items = (await this.get(parts[0])) || [];

      const index = items.findIndex(it => it.id === parts[1]);
      if (index === -1) return null;
      const plain = toPlain(data);
      removeVuexORMFlags(plain);
      items[index] = plain;

      await storage.setItem(parts[0], items);

      return plain;
    }

    return null;
  }

  async put(uri, data) {
    return storage.setItem(uri, toPlain(data));
  }

  async delete(uri) {
    const parts = uri.split('/');

    if (parts.length === 2) {
      const items = (await this.get(parts[0])) || [];

      const index = items.findIndex(it => it.id === parts[1]);
      if (index === -1) return null;
      items.splice(index, 1);

      return storage.setItem(parts[0], items);
    }

    return null;
  }
}

export default new LocalAdapter();
