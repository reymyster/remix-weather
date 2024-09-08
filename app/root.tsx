import { useEffect } from "react";
import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Form,
  useNavigation,
} from "@remix-run/react";
import { useDebounceSubmit } from "remix-utils/use-debounce-submit";
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
  const submit = useDebounceSubmit();
  const navigation = useNavigation();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-[100svh] flex flex-col bg-gradient-to-b from-slate-100 to-blue-500">
        <div className="flex-grow-0 h-16 flex items-center justify-between bg-slate-200 sticky top-0 py-1 z-50">
          <h1 className="px-4 xl:px-6 text-2xl">Weather App</h1>
          <div className="px-4 xl:px-6">
            <Form
              id="search-form"
              role="search"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                  debounceTimeout: 500,
                });
              }}
              className="flex flex-row items-center gap-2"
            >
              <div id="search-spinner" aria-hidden hidden={!searching} />
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
        <div className="flex-grow relative">
          <div className="grid grid-cols-3 gap-x-2 lg:w-[720px] mx-auto sticky top-16 bg-slate-100">
            {cities.map((city) => (
              <NavLink
                key={city.city_id}
                to={`/city/${city.city_id}`}
                className={({ isActive, isPending }) =>
                  isActive ? "bg-slate-400/50" : isPending ? "opacity-50" : ""
                }
              >
                <div className="p-3 text-center">{city.city_name}</div>
              </NavLink>
            ))}
            <hr className="col-span-3" />
          </div>
          <div className="lg:w-[720px] my-2 mx-auto">{children}</div>
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
