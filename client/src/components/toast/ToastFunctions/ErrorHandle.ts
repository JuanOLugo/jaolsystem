export const Errorhandle = (
  err: string,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  setError(err);
  setTimeout(() => {
    setError("");
  }, 2000);
};

export const Succeshandle = (
    err: string,
    setSuccess: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSuccess(err);
    setTimeout(() => {
      setSuccess("");
    }, 2000);
  };
  
