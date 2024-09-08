import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@vercel/remix';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { getCity } from '~/data';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.id && !isNaN(Number(params.id)), "Missing or invalid city id.");

    const city = await getCity(Number(params.id));

    if (!city) {
        throw new Response("Not Found", { status: 404 });
    }

    return json({ city });
}

export default function City() {
    const { city } = useLoaderData<typeof loader>();

    return (
        <div>
            {city.city_name}
        </div>
    )
}