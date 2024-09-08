import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Form,
  useSubmit,
} from "@remix-run/react";
import "./tailwind.css";

import { json, type LoaderFunctionArgs } from "@vercel/remix";

import type { City } from "./cities";
import { getCity } from "./data";

const initialCityIDs = [3451190, 1816670, 5368361];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cities: City[] = [];

  for (let i = 0; i < initialCityIDs.length; i++) {
    const city = await getCity(initialCityIDs[i]);
    if (city) cities.push(city);
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  return json({ cities, q });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { cities, q } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-[100svh] flex flex-col bg-slate-100">
        <div className="flex-grow-0 h-16 flex items-center justify-between bg-slate-300/50 shadow-lg">
          <h1 className="px-4 xl:px-6 text-2xl">Weather App</h1>
          <div className="px-4 xl:px-6">
            <Form
              id="search-form"
              role="search"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, { replace: !isFirstSearch });
              }}
            >
              <input
                type="search"
                placeholder="Search cities..."
                className="p-2 rounded-md"
                defaultValue={q || ""}
                id="q"
                name="q"
                aria-label="Search cities"
              />
            </Form>
          </div>
        </div>
        <div className="flex-grow lg:w-[720px] my-2 mx-auto overflow-y-auto">
          <div className="grid grid-cols-3 gap-2">
            {cities.map((city) => (
              <NavLink key={city.city_id} to={`/city/${city.city_id}`}>
                <div className="p-2 text-center">{city.city_name}</div>
              </NavLink>
            ))}
          </div>
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
