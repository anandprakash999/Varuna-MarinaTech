import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export const getRoutes = async () => (await api.get('/routes')).data;
export const setBaseline = async (id: string) => await api.post(`/routes/${id}/baseline`);
export const getComparison = async () => (await api.get('/routes/comparison')).data;
export const getCompliance = async (shipId: string, year: number) => (await api.get(`/compliance/cb?shipId=${shipId}&year=${year}`)).data;
export const bankSurplus = async (shipId: string, year: number) => await api.post('/banking/bank', { shipId, year });
export const createPool = async (shipIds: string[], year: number) => (await api.post('/pools', { shipIds, year })).data;
