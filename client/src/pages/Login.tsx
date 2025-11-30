import {
  useEffect,
  useState,
} from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  toast,
  Toaster,
} from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignInMutation } from "@/services/auth/auth.api";
import {
  signInSchema,
  type Tokens,
} from "@/services/auth/authtype";
import { setCredentials } from "@/store/auth.slice";
import { useForm } from "@tanstack/react-form";

const Login = () => {
  const [signInResult, setSignInResult] = useState<Tokens>({
    accessToken: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value: { email, password } }) => {
      const response = await signIn({ email, password });

      if (!response.error) {
        setSignInResult(response.data);
      }
    },
  });

  const [signIn, { isError, isSuccess, reset }] = useSignInMutation();

  // ✅ Run side effects safely after render
  useEffect(() => {
    if (isError) {
      toast.error("An error occurred while creating the client.", {
        richColors: true,
      });
      form.reset();
      reset();
    }

    if (isSuccess) {
      toast.success("Signed in successfully!", { richColors: true });

      // 1️⃣ Get token from the RTK Query response
      const result = signInResult; // You may need to destructure from the mutation

      if (result?.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        dispatch(setCredentials({ accessToken: result.accessToken }));
      }

      // 2️⃣ Redirect
      navigate("/");

      form.reset();
      reset();
    }
  }, [isSuccess, isError, reset, form, dispatch, navigate, signInResult]);

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="m-4">
        {/** User Id */}
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Email"
                  autoComplete="email"
                  type="email"
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/** Client Ids */}
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Password"
                  autoComplete="current-password"
                  type="password"
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <Button type="submit">Submit</Button>
      </FieldGroup>
      <Toaster duration={3000} />
    </form>
  );
};

export default Login;
