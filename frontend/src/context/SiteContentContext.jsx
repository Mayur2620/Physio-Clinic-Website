import { useCallback, useEffect, useState } from "react";
import { SiteContentContext } from "./site-content-hooks";
import { fetchSiteContent } from "../api/adminApi";

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchSiteContent();
      setContent(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Standard fetch-on-mount: refresh() sets loading/content/error after the
    // await resolves, not synchronously during this effect's execution.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return (
    <SiteContentContext.Provider value={{ content, loading, error, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
};
