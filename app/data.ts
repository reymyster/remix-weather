import { Cities, type City } from "./cities";

export async function getCity(id: number): Promise<City | undefined> {
    return Cities.find(city => city.city_id === id);
}