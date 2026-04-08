import React, { useEffect, useState, useMemo } from "react";
import { SubmitHandler } from "react-hook-form";
import PasswordCard from "@/components/PasswordCard";
import AddPassword from "@/components/AddPassword";
import { addPassword, UserPasswords, CSVData } from "@/types/interface";
import { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Skeleton from "@mui/material/Skeleton";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import Papa from "papaparse";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Head from "next/head";
import Image from "next/image";

const App = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<UserPasswords[] | null>(null);
  const [selectedCredential, setSelectedCredential] =
    useState<addPassword | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { showToast } = useToast();
  const allowRender = useProtectedRoute();

  useEffect(() => {
    const storedCredentials = async () => {
      try {
        const response = await axios.get("/profile/managePasswords");
        const userPasswords = response?.data?.passwords;
        setCredentials(userPasswords);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err?.response?.data?.message || "Something went wrong";
        showToast(message, "error");
      }
    };

    storedCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setSelectedCredential(null);
  };

  const onSubmit: SubmitHandler<addPassword> = async (data) => {
    try {
      if (!isEdit) {
        const response = await axios.post("/profile/managePasswords", data);
        if (response.status === 201) {
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
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data?.message || "Something went wrong";
      showToast(message, "error");
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
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    }
  };

  const filteredCredentials = useMemo(() => {
    if (!searchQuery) return credentials;
    return credentials?.filter(
      (cred) =>
        cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cred.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cred.url.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [credentials, searchQuery]);

  const importCSV = (file: File | null) => {
    if (!file) {
      showToast("No file selected", "error");
      return;
    }
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const csvData = results.data as CSVData[];
        const filtered = csvData.filter(
          (creds) =>
            creds.name || creds.url || creds.username || creds.password,
        );
        try {
          const response = await axios.post("/profile/importCSV", {
            csvData: filtered,
          });
          if (response.status === 200) {
            showToast(response.data.message, "success");
            setCredentials((prev) => [
              ...(prev ?? []),
              ...response.data.newData,
            ]);
          }
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const message =
            err?.response?.data?.message || "Something went wrong";
          showToast(message, "error");
        }
      },
    });
  };

  const exportCSV = () => {
    if (!credentials || credentials.length === 0) {
      showToast("No passwords to export", "error");
      return;
    }

    const csvData = Papa.unparse(
      credentials.map((cred) => ({
        name: cred.name,
        url: cred.url,
        username: cred.userName,
        password: cred.password,
      })),
    );

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vault-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!allowRender) return null;

  return (
    <>
      <Head>
        <title>My Vault — Vault</title>
        <meta name="description" content="Manage your saved passwords" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="main block!">
        <div className="h-[inherit] flex flex-col">
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
              <div
                className="fixed top-4 left-20 cursor-pointer flex items-center gap-2"
                onClick={() => router.push("/home")}
              >
                <Image src="/vault.svg" alt="Vault" width={28} height={28} />
                <span className="font-bold text-3xl text-white">Vault</span>
              </div>
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
                    setSearchQuery(e.target.value)
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
              <label className="glossy_container text-1 px-5! py-2! cursor-pointer flex items-center gap-2 w-fit">
                <DownloadIcon style={{ fontSize: "20px" }} />
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    importCSV(selectedFile);
                  }}
                />
              </label>
              <label className="glossy_container text-1 px-5! py-2! cursor-pointer flex items-center gap-2 w-fit">
                <FileUploadIcon style={{ fontSize: "20px" }} />
                <button className="cursor-pointer" onClick={exportCSV}>
                  Export CSV
                </button>
              </label>
            </div>
          </div>
          {credentials === null ? (
            // Loading state
            <div className="flex flex-wrap gap-10 my-10! px-15!">
              {[...Array(10)].map((i) => (
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
            <div className="flex flex-wrap gap-10 my-10! px-15!">
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
            <div className="text-center text-white/30 mt-20! text-sm">
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
