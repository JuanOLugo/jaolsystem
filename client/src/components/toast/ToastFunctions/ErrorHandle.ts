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
    Success: string,
    setSuccess: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSuccess(Success);
    setTimeout(() => {
      setSuccess("");
    }, 2000);
  };
  
