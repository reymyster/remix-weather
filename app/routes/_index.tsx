import {
  MetaFunction,
  redirect,
  LoaderFunctionArgs,
  json,
} from "@vercel/remix";

import { getCity } from "~/data";

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
    return json({ q });
  }
  return redirect("/city/3451190", 302); // for now hard code redirect to rio
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
    </div>
  );
}
