import { useEffect, useState } from "react";

import { api } from "../api";

/* ============================================
   useProducts
   --------------------------------------------
   Products come from the backend only. Nothing
   is hardcoded — whatever the admin adds under a
   category is exactly what the site shows.

   The request is shared, so several components on
   the same page do not each hit the API.
   ============================================ */

let cache = null;      /* last successful result */
let inFlight = null;   /* promise while a request is running */

const fetchProducts = () => {
  /* Already loaded, or a request is already running */
  if (cache !== null) return Promise.resolve(cache);
  if (inFlight) return inFlight;

  inFlight = api
    .get("/products")
    .then((res) => {
      cache = Array.isArray(res.data) ? res.data : [];
      return cache;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
};

/* Call after add / edit / delete so the site
   picks up the change without a reload. */
export const clearProductCache = () => {
  cache = null;
};

export const useProducts = () => {
  const [products, setProducts] = useState(cache || []);
  const [loading, setLoading] = useState(cache === null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setError(false);
      })
      .catch(() => {
        if (cancelled) return;
        setProducts([]);
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
};

export default useProducts;
