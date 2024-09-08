# Weather: My First Remix App

- [Deployed on Vercel](https://remix-weather-sigma.vercel.app)

## UI Goals / Objectives

- For each city displayed:
    - Display the next few hours of weather
    - Display the next few days of weather
- Default cities Available:
    - Rio de Janeiro
    - Beijing
    - Los Angeles
- On visiting home page:
    - redirect to Rio de Janeiro page
- On Searching in the Main Toolbar:
    - Present a filtered list of cities
    - Allow city to be clicked on to display its weather

## Dev Goals

- Do things the "Remix" way
    - no API routes
    - no calling external APIs from the UI / keep api keys hidden in the backend

## Still To-Do

- Get [prettier](https://prettier.io) to format on save
    - currently throwing an exception, but formatting this works from CLI:
```bash
    npx prettier . --write
```

## APIs Used

- [One Call API 3.0](https://openweathermap.org/api/one-call-3) by [OpenWeather](https://openweathermap.org/api/one-call-3)