/**
 * Mock QuarantineDB for demonstration purposes with in-memory storage.
 * In a real application, this would connect to a secure, isolated database.
 */
const quarantineStore = new Map();

export class QuarantineDB {
  static async create(record) {
    const newRecord = { ...record, id: record.id || `quarantine_${Date.now()}` };
    quarantineStore.set(newRecord.id, newRecord);
    console.log(`[Mock QuarantineDB] Record ${newRecord.id} created. Total items: ${quarantineStore.size}`);
    return newRecord;
  }

  static async find(criteria) {
    console.log('[Mock QuarantineDB] Finding records with criteria:', criteria);
    // Simple mock filtering for demonstration
    const results = Array.from(quarantineStore.values()).filter(record => {
        if (criteria.threatLevel && record.threatAnalysis.threatLevel !== criteria.threatLevel) {
            return false;
        }
        if (criteria.timestamp && new Date(record.timestamp) < new Date(criteria.timestamp.$gte)) {
            return false;
        }
        return true;
    });
    return results;
  }

  static async get(id) {
    return quarantineStore.get(id);
  }

  static async clear() {
      quarantineStore.clear();
  }
}