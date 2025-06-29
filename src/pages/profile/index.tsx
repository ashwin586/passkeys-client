import React, { useState, useEffect } from "react";
import ProfileCategories from "@/components/ProfileCategories";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    if (!accessToken) {
      router.push("/home");
      return;
    }

    setToken(accessToken);
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile");
        console.log(response);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error?.response?.status === 401) {
          const message = error?.response?.data?.message;
          showToast(message, "error");
          router.push("/home");
        }
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="main">
        {token && (
          <div className="profile__main">
            <div className="account__details"></div>
            <div className="profile__sub__categories">
              <ProfileCategories
                heading={"Manage Account"}
                description={"This helps to manage account"}
              />
              <ProfileCategories
                heading={"Manage Passwords"}
                description={"This is to manage the password"}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
