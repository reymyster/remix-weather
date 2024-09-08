import {
  json,
  type LoaderFunctionArgs,
} from "@vercel/remix";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { format } from "date-fns";
import { cn } from "~/lib/utils";

import { getCity } from "~/data";

interface WeatherIcon {
  description: string;
  icon: string;
}

interface Weather {
  hourly: {
    dt: number;
    temp: number;
    humidity: number;
    weather: WeatherIcon[];
  }[];
  daily: {
    dt: number;
    summary: string;
    temp: {
      min: number;
      max: number;
    };
    weather: WeatherIcon[];
  }[];
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(
    params.id && !isNaN(Number(params.id)),
    "Missing or invalid city id.",
  );

  const city = await getCity(Number(params.id));

  if (!city) {
    throw new Response("Not Found", { status: 404 });
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&exclude=minutely,current,alerts&units=imperial&appid=${process.env.OPENWEATHER_API_ID}`,
  );
  const weather: Weather = await res.json();

  return json({ city, weather });
};

export default function City() {
  const { city, weather } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-3 mt-8">
      <h2 className="py-4 text-3xl">
        {city.city_name}, {city.state_code}, {city.country_code}
      </h2>
      <div className="bg-slate-200 p-2 shadow-lg">
        <div className="text-xl p-2 border-b border-b-slate-400/50 mb-2">
          Next hours
        </div>
        <div className="flex flex-row flex-nowrap gap-x-1 overflow-x-auto">
          {weather.hourly
            .filter((_, idx) => idx < 12)
            .map((hour, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex flex-col items-center p-2",
                  idx > 0 && "border-l border-slate-300/50",
                )}
              >
                <div>{Math.round(hour.temp)}&deg;</div>
                <div className="text-blue-400">{hour.humidity}%</div>
                <div>
                  <img
                    alt={hour.weather[0].description}
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    className="size-16"
                  />
                </div>
                <div className="whitespace-nowrap text-black/50">
                  {format(new Date(hour.dt * 1000), "p")}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="bg-slate-200 p-2 shadow-lg">
        <div className="text-xl p-2 border-b border-b-slate-400/50 mb-2">
          Next days
        </div>
        {weather.daily
          .filter((_, idx) => idx < 7)
          .map((day, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-row flex-nowrap justify-between items-center",
                idx > 0 && "border-t border-t-slate-400/20",
              )}
            >
              <div className="flex-grow-0">
                <img
                  alt={day.weather[0].description}
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  className="size-16"
                />
              </div>
              <div className="flex flex-col items-center flex-grow">
                <div className="font-bold">
                  {format(new Date(day.dt * 1000), "ccc, MMM d")}
                </div>
                <div className="text-xs text-black/50">{day.summary}</div>
              </div>
              <div className="flex-grow-0">
                {Math.round(day.temp.min)}&deg;&nbsp;{Math.round(day.temp.max)}
                &deg;
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
