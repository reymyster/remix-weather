import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@vercel/remix";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
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
  // const weather = getSampleWeather();

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

function getSampleWeather(): Weather {
  const initial = {
    lat: -22.9028,
    lon: -43.2075,
    timezone: "America/Sao_Paulo",
    timezone_offset: -10800,
    hourly: [
      {
        dt: 1725807600,
        temp: 85.62,
        feels_like: 89.08,
        pressure: 1018,
        humidity: 56,
        dew_point: 68.13,
        uvi: 8.87,
        clouds: 0,
        visibility: 10000,
        wind_speed: 8.25,
        wind_deg: 127,
        wind_gust: 5.46,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725811200,
        temp: 86.02,
        feels_like: 90.09,
        pressure: 1018,
        humidity: 57,
        dew_point: 69.01,
        uvi: 7.99,
        clouds: 0,
        visibility: 10000,
        wind_speed: 9.17,
        wind_deg: 132,
        wind_gust: 8.19,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725814800,
        temp: 85.57,
        feels_like: 88.99,
        pressure: 1018,
        humidity: 56,
        dew_point: 68.07,
        uvi: 5.79,
        clouds: 0,
        visibility: 10000,
        wind_speed: 9.15,
        wind_deg: 127,
        wind_gust: 8.81,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725818400,
        temp: 84.79,
        feels_like: 88,
        pressure: 1018,
        humidity: 57,
        dew_point: 67.87,
        uvi: 3.26,
        clouds: 1,
        visibility: 10000,
        wind_speed: 9.13,
        wind_deg: 125,
        wind_gust: 10.98,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725822000,
        temp: 83.3,
        feels_like: 86.14,
        pressure: 1017,
        humidity: 59,
        dew_point: 67.48,
        uvi: 1.3,
        clouds: 1,
        visibility: 10000,
        wind_speed: 9.73,
        wind_deg: 122,
        wind_gust: 14.27,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725825600,
        temp: 80.62,
        feels_like: 83.1,
        pressure: 1018,
        humidity: 64,
        dew_point: 67.32,
        uvi: 0.23,
        clouds: 2,
        visibility: 10000,
        wind_speed: 9.31,
        wind_deg: 115,
        wind_gust: 17.13,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725829200,
        temp: 77.32,
        feels_like: 78.04,
        pressure: 1018,
        humidity: 70,
        dew_point: 66.58,
        uvi: 0,
        clouds: 2,
        visibility: 10000,
        wind_speed: 8.7,
        wind_deg: 105,
        wind_gust: 15.84,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725832800,
        temp: 76.32,
        feels_like: 77.04,
        pressure: 1019,
        humidity: 72,
        dew_point: 66.61,
        uvi: 0,
        clouds: 2,
        visibility: 10000,
        wind_speed: 8.03,
        wind_deg: 101,
        wind_gust: 13.53,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725836400,
        temp: 74.89,
        feels_like: 75.61,
        pressure: 1019,
        humidity: 75,
        dew_point: 66.76,
        uvi: 0,
        clouds: 1,
        visibility: 10000,
        wind_speed: 8.28,
        wind_deg: 99,
        wind_gust: 13.06,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725840000,
        temp: 73.72,
        feels_like: 74.52,
        pressure: 1020,
        humidity: 79,
        dew_point: 66.78,
        uvi: 0,
        clouds: 1,
        visibility: 10000,
        wind_speed: 8.19,
        wind_deg: 95,
        wind_gust: 12.35,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725843600,
        temp: 72.81,
        feels_like: 73.63,
        pressure: 1020,
        humidity: 82,
        dew_point: 66.97,
        uvi: 0,
        clouds: 1,
        visibility: 10000,
        wind_speed: 7.09,
        wind_deg: 91,
        wind_gust: 10.54,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725847200,
        temp: 71.91,
        feels_like: 72.75,
        pressure: 1020,
        humidity: 84,
        dew_point: 67.05,
        uvi: 0,
        clouds: 1,
        visibility: 10000,
        wind_speed: 6.22,
        wind_deg: 84,
        wind_gust: 8.81,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725850800,
        temp: 71.22,
        feels_like: 72.09,
        pressure: 1020,
        humidity: 86,
        dew_point: 66.9,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 5.75,
        wind_deg: 81,
        wind_gust: 8.1,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725854400,
        temp: 70.48,
        feels_like: 71.33,
        pressure: 1019,
        humidity: 87,
        dew_point: 66.63,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 5.55,
        wind_deg: 79,
        wind_gust: 7.38,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725858000,
        temp: 69.84,
        feels_like: 70.61,
        pressure: 1019,
        humidity: 87,
        dew_point: 66.06,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 5.23,
        wind_deg: 80,
        wind_gust: 6.31,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725861600,
        temp: 69.33,
        feels_like: 70.05,
        pressure: 1018,
        humidity: 87,
        dew_point: 65.53,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 4.76,
        wind_deg: 70,
        wind_gust: 5.77,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725865200,
        temp: 68.7,
        feels_like: 69.37,
        pressure: 1018,
        humidity: 87,
        dew_point: 65.03,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 4.07,
        wind_deg: 56,
        wind_gust: 5.19,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725868800,
        temp: 68.32,
        feels_like: 68.95,
        pressure: 1019,
        humidity: 87,
        dew_point: 64.53,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 3.78,
        wind_deg: 51,
        wind_gust: 5.21,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725872400,
        temp: 68.16,
        feels_like: 68.72,
        pressure: 1019,
        humidity: 86,
        dew_point: 64.13,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 3.83,
        wind_deg: 49,
        wind_gust: 5.06,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725876000,
        temp: 69.58,
        feels_like: 70,
        pressure: 1020,
        humidity: 80,
        dew_point: 63.52,
        uvi: 0.43,
        clouds: 0,
        visibility: 10000,
        wind_speed: 3.98,
        wind_deg: 39,
        wind_gust: 5.03,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725879600,
        temp: 72.88,
        feels_like: 73.2,
        pressure: 1020,
        humidity: 71,
        dew_point: 63.1,
        uvi: 1.7,
        clouds: 0,
        visibility: 10000,
        wind_speed: 3.83,
        wind_deg: 34,
        wind_gust: 5.44,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725883200,
        temp: 76.66,
        feels_like: 76.89,
        pressure: 1020,
        humidity: 61,
        dew_point: 62.6,
        uvi: 3.92,
        clouds: 0,
        visibility: 10000,
        wind_speed: 3.49,
        wind_deg: 39,
        wind_gust: 5.91,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725886800,
        temp: 80.35,
        feels_like: 81.43,
        pressure: 1020,
        humidity: 53,
        dew_point: 61.68,
        uvi: 6.6,
        clouds: 1,
        visibility: 10000,
        wind_speed: 2.95,
        wind_deg: 70,
        wind_gust: 5.21,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725890400,
        temp: 82.69,
        feels_like: 83.21,
        pressure: 1019,
        humidity: 48,
        dew_point: 60.82,
        uvi: 8.69,
        clouds: 1,
        visibility: 10000,
        wind_speed: 4.45,
        wind_deg: 110,
        wind_gust: 5.26,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725894000,
        temp: 83.19,
        feels_like: 83.77,
        pressure: 1018,
        humidity: 48,
        dew_point: 60.58,
        uvi: 9.33,
        clouds: 1,
        visibility: 10000,
        wind_speed: 6.69,
        wind_deg: 122,
        wind_gust: 6.44,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725897600,
        temp: 83.66,
        feels_like: 84.31,
        pressure: 1017,
        humidity: 48,
        dew_point: 60.96,
        uvi: 8.31,
        clouds: 0,
        visibility: 10000,
        wind_speed: 8.37,
        wind_deg: 129,
        wind_gust: 6.73,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725901200,
        temp: 83.14,
        feels_like: 84.25,
        pressure: 1016,
        humidity: 51,
        dew_point: 61.84,
        uvi: 6.04,
        clouds: 0,
        visibility: 10000,
        wind_speed: 9.82,
        wind_deg: 128,
        wind_gust: 7.07,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725904800,
        temp: 81.97,
        feels_like: 83.35,
        pressure: 1015,
        humidity: 54,
        dew_point: 62.47,
        uvi: 3.41,
        clouds: 0,
        visibility: 10000,
        wind_speed: 9.51,
        wind_deg: 122,
        wind_gust: 8.03,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725908400,
        temp: 80.85,
        feels_like: 82.33,
        pressure: 1015,
        humidity: 56,
        dew_point: 63.09,
        uvi: 1.35,
        clouds: 0,
        visibility: 10000,
        wind_speed: 9.33,
        wind_deg: 119,
        wind_gust: 12.5,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725912000,
        temp: 79.14,
        feels_like: 79.14,
        pressure: 1015,
        humidity: 59,
        dew_point: 63.18,
        uvi: 0.28,
        clouds: 0,
        visibility: 10000,
        wind_speed: 9.08,
        wind_deg: 109,
        wind_gust: 15.82,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725915600,
        temp: 77.38,
        feels_like: 77.77,
        pressure: 1015,
        humidity: 63,
        dew_point: 63.66,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 8.43,
        wind_deg: 102,
        wind_gust: 15.19,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725919200,
        temp: 76.53,
        feels_like: 76.89,
        pressure: 1016,
        humidity: 64,
        dew_point: 63.46,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 8.3,
        wind_deg: 94,
        wind_gust: 14.54,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725922800,
        temp: 75.81,
        feels_like: 76.1,
        pressure: 1016,
        humidity: 64,
        dew_point: 62.89,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 7.65,
        wind_deg: 90,
        wind_gust: 13.51,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725926400,
        temp: 74.77,
        feels_like: 75,
        pressure: 1017,
        humidity: 65,
        dew_point: 62.24,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 5.84,
        wind_deg: 90,
        wind_gust: 8.95,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725930000,
        temp: 73.89,
        feels_like: 74.03,
        pressure: 1017,
        humidity: 65,
        dew_point: 61.65,
        uvi: 0,
        clouds: 5,
        visibility: 10000,
        wind_speed: 4.38,
        wind_deg: 94,
        wind_gust: 5.41,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725933600,
        temp: 73.11,
        feels_like: 73.22,
        pressure: 1017,
        humidity: 66,
        dew_point: 61.43,
        uvi: 0,
        clouds: 18,
        visibility: 10000,
        wind_speed: 3.94,
        wind_deg: 97,
        wind_gust: 3.71,
        weather: [
          {
            id: 801,
            main: "Clouds",
            description: "few clouds",
            icon: "02n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725937200,
        temp: 72.52,
        feels_like: 72.66,
        pressure: 1017,
        humidity: 68,
        dew_point: 61.32,
        uvi: 0,
        clouds: 11,
        visibility: 10000,
        wind_speed: 4.79,
        wind_deg: 83,
        wind_gust: 4.88,
        weather: [
          {
            id: 801,
            main: "Clouds",
            description: "few clouds",
            icon: "02n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725940800,
        temp: 71.78,
        feels_like: 71.85,
        pressure: 1016,
        humidity: 68,
        dew_point: 60.94,
        uvi: 0,
        clouds: 8,
        visibility: 10000,
        wind_speed: 4.59,
        wind_deg: 73,
        wind_gust: 5.14,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725944400,
        temp: 71.17,
        feels_like: 71.19,
        pressure: 1015,
        humidity: 68,
        dew_point: 60.01,
        uvi: 0,
        clouds: 7,
        visibility: 10000,
        wind_speed: 3.87,
        wind_deg: 56,
        wind_gust: 4.56,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725948000,
        temp: 70.61,
        feels_like: 70.47,
        pressure: 1015,
        humidity: 66,
        dew_point: 59.09,
        uvi: 0,
        clouds: 6,
        visibility: 10000,
        wind_speed: 3.36,
        wind_deg: 47,
        wind_gust: 3.91,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725951600,
        temp: 70.29,
        feels_like: 70.12,
        pressure: 1015,
        humidity: 66,
        dew_point: 58.59,
        uvi: 0,
        clouds: 0,
        visibility: 10000,
        wind_speed: 3.53,
        wind_deg: 43,
        wind_gust: 3.87,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725955200,
        temp: 69.84,
        feels_like: 69.62,
        pressure: 1016,
        humidity: 66,
        dew_point: 58.24,
        uvi: 0,
        clouds: 2,
        visibility: 10000,
        wind_speed: 3.58,
        wind_deg: 38,
        wind_gust: 4.16,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725958800,
        temp: 69.62,
        feels_like: 69.39,
        pressure: 1016,
        humidity: 66,
        dew_point: 57.97,
        uvi: 0,
        clouds: 3,
        visibility: 10000,
        wind_speed: 3.83,
        wind_deg: 35,
        wind_gust: 4.43,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725962400,
        temp: 71.26,
        feels_like: 71.01,
        pressure: 1016,
        humidity: 62,
        dew_point: 57.88,
        uvi: 0.46,
        clouds: 3,
        visibility: 10000,
        wind_speed: 4.36,
        wind_deg: 34,
        wind_gust: 5.55,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725966000,
        temp: 74.91,
        feels_like: 74.7,
        pressure: 1017,
        humidity: 55,
        dew_point: 57.74,
        uvi: 1.8,
        clouds: 4,
        visibility: 10000,
        wind_speed: 4.36,
        wind_deg: 29,
        wind_gust: 5.93,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725969600,
        temp: 79.18,
        feels_like: 79.18,
        pressure: 1017,
        humidity: 47,
        dew_point: 57.51,
        uvi: 4.12,
        clouds: 5,
        visibility: 10000,
        wind_speed: 4.23,
        wind_deg: 30,
        wind_gust: 6.73,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725973200,
        temp: 83.08,
        feels_like: 82.54,
        pressure: 1016,
        humidity: 41,
        dew_point: 57.34,
        uvi: 6.81,
        clouds: 8,
        visibility: 10000,
        wind_speed: 3.94,
        wind_deg: 52,
        wind_gust: 6.8,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
      {
        dt: 1725976800,
        temp: 85.42,
        feels_like: 84.6,
        pressure: 1015,
        humidity: 39,
        dew_point: 57.33,
        uvi: 8.81,
        clouds: 8,
        visibility: 10000,
        wind_speed: 4.72,
        wind_deg: 92,
        wind_gust: 6.53,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        pop: 0,
      },
    ],
    daily: [
      {
        dt: 1725804000,
        sunrise: 1725785774,
        sunset: 1725828292,
        moonrise: 1725796380,
        moonset: 1725845400,
        moon_phase: 0.17,
        summary: "There will be clear sky today",
        temp: {
          day: 85.01,
          min: 71.87,
          max: 86.02,
          night: 71.91,
          eve: 80.62,
          morn: 72.27,
        },
        feels_like: {
          day: 88.07,
          night: 72.75,
          eve: 83.1,
          morn: 72.86,
        },
        pressure: 1018,
        humidity: 56,
        dew_point: 67.57,
        wind_speed: 9.73,
        wind_deg: 122,
        wind_gust: 17.13,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        clouds: 0,
        pop: 0,
        uvi: 8.87,
      },
      {
        dt: 1725890400,
        sunrise: 1725872114,
        sunset: 1725914710,
        moonrise: 1725885120,
        moonset: 1725935220,
        moon_phase: 0.2,
        summary:
          "You can expect clear sky in the morning, with partly cloudy in the afternoon",
        temp: {
          day: 82.69,
          min: 68.16,
          max: 83.66,
          night: 73.11,
          eve: 79.14,
          morn: 68.32,
        },
        feels_like: {
          day: 83.21,
          night: 73.22,
          eve: 79.14,
          morn: 68.95,
        },
        pressure: 1019,
        humidity: 48,
        dew_point: 60.82,
        wind_speed: 9.82,
        wind_deg: 128,
        wind_gust: 15.82,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        clouds: 1,
        pop: 0,
        uvi: 9.33,
      },
      {
        dt: 1725976800,
        sunrise: 1725958454,
        sunset: 1726001127,
        moonrise: 1725974100,
        moonset: 0,
        moon_phase: 0.23,
        summary: "There will be partly cloudy until morning, then clearing",
        temp: {
          day: 85.42,
          min: 69.62,
          max: 86.72,
          night: 75.79,
          eve: 81.5,
          morn: 69.84,
        },
        feels_like: {
          day: 84.6,
          night: 75.79,
          eve: 82.94,
          morn: 69.62,
        },
        pressure: 1015,
        humidity: 39,
        dew_point: 57.33,
        wind_speed: 9.13,
        wind_deg: 114,
        wind_gust: 11.95,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        clouds: 8,
        pop: 0,
        uvi: 9.24,
      },
      {
        dt: 1726063200,
        sunrise: 1726044793,
        sunset: 1726087544,
        moonrise: 1726063560,
        moonset: 1726025100,
        moon_phase: 0.25,
        summary: "There will be clear sky until morning, then partly cloudy",
        temp: {
          day: 90.95,
          min: 73.78,
          max: 92.7,
          night: 82.15,
          eve: 82.06,
          morn: 74.01,
        },
        feels_like: {
          day: 88.81,
          night: 81.46,
          eve: 82.83,
          morn: 73.42,
        },
        pressure: 1013,
        humidity: 29,
        dew_point: 54.09,
        wind_speed: 7.36,
        wind_deg: 355,
        wind_gust: 11.59,
        weather: [
          {
            id: 804,
            main: "Clouds",
            description: "overcast clouds",
            icon: "04d",
          },
        ],
        clouds: 92,
        pop: 0,
        uvi: 8.53,
      },
      {
        dt: 1726149600,
        sunrise: 1726131133,
        sunset: 1726173961,
        moonrise: 1726153380,
        moonset: 1726114980,
        moon_phase: 0.3,
        summary: "Expect a day of partly cloudy with clear spells",
        temp: {
          day: 93.34,
          min: 74.37,
          max: 93.34,
          night: 82.09,
          eve: 83.71,
          morn: 74.37,
        },
        feels_like: {
          day: 90.95,
          night: 81,
          eve: 83.82,
          morn: 73.53,
        },
        pressure: 1012,
        humidity: 26,
        dew_point: 52.97,
        wind_speed: 7.67,
        wind_deg: 1,
        wind_gust: 11.79,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        clouds: 0,
        pop: 0,
        uvi: 4.4,
      },
      {
        dt: 1726236000,
        sunrise: 1726217472,
        sunset: 1726260378,
        moonrise: 1726243500,
        moonset: 1726204740,
        moon_phase: 0.33,
        summary: "There will be clear sky today",
        temp: {
          day: 86.97,
          min: 72.32,
          max: 86.97,
          night: 72.32,
          eve: 75.16,
          morn: 74.66,
        },
        feels_like: {
          day: 86.85,
          night: 73,
          eve: 75.81,
          morn: 74.26,
        },
        pressure: 1012,
        humidity: 41,
        dew_point: 57.81,
        wind_speed: 11.39,
        wind_deg: 187,
        wind_gust: 12.35,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        clouds: 0,
        pop: 0,
        uvi: 5,
      },
      {
        dt: 1726322400,
        sunrise: 1726303811,
        sunset: 1726346795,
        moonrise: 1726333860,
        moonset: 1726294320,
        moon_phase: 0.37,
        summary: "Expect a day of partly cloudy with clear spells",
        temp: {
          day: 78.03,
          min: 71.6,
          max: 79.59,
          night: 72.86,
          eve: 73.42,
          morn: 72.43,
        },
        feels_like: {
          day: 78.53,
          night: 73.27,
          eve: 73.89,
          morn: 72.1,
        },
        pressure: 1014,
        humidity: 64,
        dew_point: 63.64,
        wind_speed: 14.05,
        wind_deg: 222,
        wind_gust: 14.56,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        clouds: 10,
        pop: 0,
        uvi: 5,
      },
      {
        dt: 1726408800,
        sunrise: 1726390150,
        sunset: 1726433211,
        moonrise: 1726424280,
        moonset: 1726383600,
        moon_phase: 0.4,
        summary: "There will be partly cloudy today",
        temp: {
          day: 79.86,
          min: 69.39,
          max: 79.86,
          night: 72.82,
          eve: 73.9,
          morn: 69.39,
        },
        feels_like: {
          day: 79.86,
          night: 73.53,
          eve: 74.61,
          morn: 70.02,
        },
        pressure: 1016,
        humidity: 58,
        dew_point: 63.03,
        wind_speed: 8.84,
        wind_deg: 160,
        wind_gust: 9.01,
        weather: [
          {
            id: 803,
            main: "Clouds",
            description: "broken clouds",
            icon: "04d",
          },
        ],
        clouds: 75,
        pop: 0,
        uvi: 5,
      },
    ],
  };

  return {
    hourly: initial.hourly.map(({ dt, temp, humidity, weather }) => ({
      dt,
      temp,
      humidity,
      weather: weather.map(({ icon, description }) => ({ icon, description })),
    })),
    daily: initial.daily.map(
      ({ dt, summary, temp: { min, max }, weather }) => ({
        dt,
        summary,
        temp: { min, max },
        weather: weather.map(({ icon, description }) => ({
          icon,
          description,
        })),
      }),
    ),
  };
}
