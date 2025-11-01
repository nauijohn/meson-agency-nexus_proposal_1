import "./index.css";

import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App.tsx";
import { Navbar05 } from "./components/ui/shadcn-io/navbar-05/index.tsx";
import store from "./store/index.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Navbar05 onNavItemClick={(item) => console.log(item)} />
          <App />
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
