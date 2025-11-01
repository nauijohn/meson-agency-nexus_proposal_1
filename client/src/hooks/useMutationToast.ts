import { useEffect } from "react";

import { toast } from "sonner"; // or your toast lib

type UseMutationToastOptions = {
  isError: boolean;
  isSuccess: boolean;
  reset: () => void;
  form?: { reset: () => void };
  successMessage?: string;
  errorMessage?: string;
};

function useMutationToast({
  isError,
  isSuccess,
  reset,
  form,
  successMessage = "Operation completed successfully!",
  errorMessage = "An error occurred. Please try again.",
}: UseMutationToastOptions) {
  useEffect(() => {
    if (isError) {
      toast.error(errorMessage, { richColors: true });
    }

    if (isSuccess) {
      toast.success(successMessage, { richColors: true });
      form?.reset?.();
    }

    if (isError || isSuccess) {
      reset();
    }
  }, [isError, isSuccess, reset, form, successMessage, errorMessage]);
}

export default useMutationToast;
