import React, { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import PasswordCard from "@/components/PasswordCard";
import AddPassword from "@/components/AddPassword";
import { addPassword, UserPasswords } from "@/types/interface";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useToast } from "@/context/ToastContext";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Skeleton from "@mui/material/Skeleton";

const App = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<UserPasswords[] | null>(null);
  const [filteredCredentials, setFilteredCredentials] = useState<
    UserPasswords[] | null
  >(null);
  const [skeletonCount, setSkeletonCount] = useState<number>(1);
  const [selectedCredential, setSelectedCredential] =
    useState<addPassword | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    const saved = localStorage.getItem("vault-count");
    if (saved) setSkeletonCount(parseInt(saved));

    if (!accessToken) {
      router.push("/home");
      return;
    }

    const storedCredentials = async () => {
      try {
        const response = await axios.get("/profile/managePasswords");
        const userPasswords = response?.data?.passwords;
        setCredentials(userPasswords);
        setFilteredCredentials(userPasswords);
      } catch (error) {
        const err = error as AxiosError;
        console.log(err);
      }
    };

    storedCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (credentials) {
      localStorage.setItem("vault-count", String(credentials.length));
    }
  }, [credentials]);

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setSelectedCredential(null);
  };

  const onSubmit: SubmitHandler<addPassword> = async (data) => {
    try {
      if (!isEdit) {
        const response = await axios.post("/profile/managePasswords", data);
        if (response.status === 200) {
          showToast(response?.data?.message, "success");
          setCredentials((prev) => [...(prev ?? []), response.data.newData]);
        }
      } else {
        const response = await axios.patch(
          `/profile/managePasswords/${selectedCredential?.id}`,
          data,
        );
        if (response.status === 200) {
          showToast(response?.data?.message, "success");
          const updatedData = response?.data?.updatedData;
          setCredentials(
            credentials?.map((cred) =>
              cred?.id === updatedData?.id ? updatedData : cred,
            ) ?? [],
          );
        }
      }
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.log(err);
    } finally {
      handleClose();
    }
  };

  const handleEditButton = (data: addPassword) => {
    setOpen(true);
    setSelectedCredential(data);
    setIsEdit(true);
  };

  const handleDeleteButton = async (data: addPassword) => {
    const id = data?.id;
    try {
      const response = await axios.delete(`/profile/managePasswords/${id}`);
      if (response?.status === 200) {
        const updatedCredentials =
          credentials?.filter((cred) => cred?.id !== id) ?? [];
        setCredentials(updatedCredentials);
        showToast(response?.data?.message, "success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (text: string) => {
    if (!text) {
      setFilteredCredentials(credentials);
      return;
    }
    const filteredSearch = credentials?.filter((cred: UserPasswords) =>
      cred.name.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredCredentials(filteredSearch ?? []);
  };

  return (
    <>
      <div className="main block!">
        <div className="h-[inherit] flex flex-col">
          {/* <div>
            <button
              onClick={() => router.back()}
              className="fixed top-4 left-4 flex items-center justify-center w-10 h-10 rounded-[12px]
             cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 
             hover:border-white/20 text-white/60 hover:text-white transition-all duration-150"
            >
              <ArrowBackIcon style={{ fontSize: "20px" }} />
            </button>
          </div> */}
          <div className=" flex justify-between gap-4 mt-8! mx-4!">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 rounded-[12px]
             cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 
             hover:border-white/20 text-white/60 hover:text-white transition-all duration-150"
              >
                <ArrowBackIcon style={{ fontSize: "20px" }} />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center w-[480px] gap-3 px-4! py-3! rounded-[14px] glossy_container">
                <SearchIcon
                  className="text-white/40 shrink-0"
                  style={{ fontSize: "22px" }}
                />
                <input
                  type="text"
                  placeholder="Search your saved passwords..."
                  className="bg-transparent border-none outline-none text-[#DCD7C9] w-full placeholder:text-white/30"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSearch(e.target.value)
                  }
                />
              </div>
              <div className="my-auto! mx-0!">
                <button
                  className="flex items-center px-3! py-3! rounded-[14px] text-sm font-medium 
               text-white/80 cursor-pointer border border-white/10 bg-white/5 
               hover:bg-white/10 hover:border-white/20 hover:text-white 
               transition-all duration-150 backdrop-blur-md"
                  id="add"
                  onClick={() => setOpen(true)}
                >
                  <AddIcon style={{ fontSize: "20px" }} />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="glossy_container text-1 px-5! py-2!">Import CSV</button>
              <button className="glossy_container text-1 px-5! py-2!">Export CSV</button>
            </div>
          </div>
          {credentials === null ? (
            // Loading state
            <div className="flex flex-wrap gap-5 mt-10! justify-center px-6">
              {[...Array(skeletonCount)].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  animation="wave"
                  width={300}
                  height={220}
                  sx={{
                    borderRadius: "20px",
                    bgcolor: "rgba(255,255,255,0.07)",
                  }}
                />
              ))}
            </div>
          ) : credentials.length > 0 ? (
            // Cards
            <div className="flex flex-wrap gap-5 mt-10! justify-center px-6">
              {filteredCredentials?.map((creds: UserPasswords) => (
                <PasswordCard
                  key={creds?.id}
                  id={creds?.id}
                  name={creds?.name}
                  url={creds?.url}
                  userName={creds?.userName}
                  password={creds?.password}
                  handleEditButton={() => handleEditButton(creds)}
                  handleDeleteButton={() => handleDeleteButton(creds)}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center text-white/30 mt-20 text-sm">
              No passwords saved yet
            </div>
          )}
        </div>
      </div>
      {/* {open && ( */}
      <AddPassword
        open={open}
        handleClose={handleClose}
        submitHandler={onSubmit}
        selectedCredential={selectedCredential}
      />
      {/* )} */}
    </>
  );
};

export default App;
