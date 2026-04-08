import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isTokenValid } from "@/utils/auth";

const useProtectedRoute = () => {
  const router = useRouter();
  const [allowRender, setAllowRender] = useState(false);

  useEffect(() => {
    if (isTokenValid()) {
      setAllowRender(true); 
    } else {
      localStorage.removeItem("access-token");
      router.push("/home");
    }
  }, [router]);

  return allowRender;
};

export default useProtectedRoute;
