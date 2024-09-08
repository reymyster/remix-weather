import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
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
            <input type="search" placeholder="Search cities..." className="p-2 rounded-md" />
          </div>
        </div>
        <div className="flex-grow lg:w-[720px] my-2 mx-auto overflow-y-auto">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 text-center">Rio</div>
            <div className="p-2 text-center">Beijing</div>
            <div className="p-2 text-center">Los Angeles</div>
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
