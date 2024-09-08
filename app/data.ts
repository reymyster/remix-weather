import { Cities, type City } from "./cities";

export async function getCity(id: number): Promise<City | undefined> {
  return Cities.find((city) => city.city_id === id);
}

export async function getCities(filter: string): Promise<City[] | undefined> {
  if (!filter) return;

  return Cities.filter((city) =>
    city.city_name.toLowerCase().includes(filter.toLowerCase()),
  ).toSorted((a, b) => a.city_name.localeCompare(b.city_name));
}
