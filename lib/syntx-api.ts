const API_BASE = process.env.NEXT_PUBLIC_SYNTX_API || 'https://dev.syntx-system.com/api/strom';

export interface FeldGewichtung {
  [topic: string]: number;
}

export interface StromParameter {
  felder_topics: FeldGewichtung;
  styles: string[];
  sprachen: string[];
  anzahl?: number;
  modell?: string;
}

export class SyntxAPI {
  // ✅ HEALTH
  static async getStatus() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  }

  // ✅ FELD - Topics (FIXED: /feld/topics instead of /kalibrierung/topics)
  static async getTopics() {
    const res = await fetch(`${API_BASE}/feld/topics`);
    if (!res.ok) throw new Error('Failed to fetch topics');
    return res.json();
  }

  // ✅ TOPIC WEIGHTS
  static async getTopicWeights() {
    const res = await fetch(`${API_BASE}/topic-weights`);
    if (!res.ok) throw new Error('Failed to fetch topic weights');
    return res.json();
  }

  static async saveTopicWeights(weights: Record<string, number>) {
    const res = await fetch(`${API_BASE}/topic-weights`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weights)
    });
    if (!res.ok) throw new Error('Failed to save topic weights');
    return res.json();
  }

  static async getTopicWeight(topicName: string) {
    const res = await fetch(`${API_BASE}/topic-weights/${encodeURIComponent(topicName)}`);
    if (!res.ok) throw new Error('Failed to fetch topic weight');
    return res.json();
  }

  static async updateTopicWeight(topicName: string, weight: number) {
    const res = await fetch(`${API_BASE}/topic-weights/${encodeURIComponent(topicName)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight })
    });
    if (!res.ok) throw new Error('Failed to update topic weight');
    return res.json();
  }

  // ✅ STROM DISPATCH
  static async dispatchStrom(params: StromParameter) {
    const res = await fetch(`${API_BASE}/strom/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to dispatch strom');
    return res.json();
  }

  // ✅ ANALYTICS
  static async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/complete-dashboard`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  }

  static async getTopicsAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/topics`);
    if (!res.ok) throw new Error('Failed to fetch topics analytics');
    return res.json();
  }

  // ✅ EVOLUTION
  static async getSyntxVsNormal() {
    const res = await fetch(`${API_BASE}/evolution/syntx-vs-normal`);
    if (!res.ok) throw new Error('Failed to fetch evolution data');
    return res.json();
  }

  // ✅ MONITORING
  static async getLiveQueue() {
    const res = await fetch(`${API_BASE}/monitoring/live-queue`);
    if (!res.ok) throw new Error('Failed to fetch live queue');
    return res.json();
  }

  // ✅ RESONANZ
  static async getResonanzSystem() {
    const res = await fetch(`${API_BASE}/resonanz/system`);
    if (!res.ok) throw new Error('Failed to fetch resonanz system');
    return res.json();
  }
}
