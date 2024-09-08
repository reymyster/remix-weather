import {
  MetaFunction,
  redirect,
  LoaderFunctionArgs,
  json,
} from "@vercel/remix";
import { useLoaderData, Link } from "@remix-run/react";

import { getCities } from "~/data";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Weather App" },
    { name: "description", content: "Weathering with Remix" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (q) {
    const cities = await getCities(q);
    return json({ cities });
  }
  return redirect("/city/3451190", 302); // for now hard code redirect to rio
};

export default function Index() {
  const { cities } = useLoaderData<typeof loader>();

  if (!cities || cities.length === 0) {
    return <div className="text-center">No cities found.</div>;
  }

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl my-4">Choose a City:</h1>
      <ul className="list-inside">
        {cities.map((city) => (
          <li key={city.city_id} className="list-disc p-1 hover:underline">
            <Link to={`/city/${city.city_id}`}>
              {city.city_name}, {city.state_code}, {city.country_code}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
