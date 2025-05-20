import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as clientAPI from "../api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/AppContext";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SIgnUp = () => {
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, RegisterFormData>({
    mutationFn: clientAPI.registerAPI,
    onSuccess: async () => {
      showToast({ message: "Registration Successfull", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      navigate("/");
    },
    onError: (error: any) => {
      showToast({ message: error.message, type: "FAILURE" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  return (
    <form
      onSubmit={onSubmit}
      className="container flex flex-col gap-5 mx-auto p-5"
    >
      <h2 className="text-3xl font-bold">Create Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
          FirstName
          <input
            className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
            type="text"
            {...register("firstName", {
              required: "First Name is Required",
            })}
          />
          {errors.firstName && (
            <span className="text-red-600 text-sm font-normal">
              {errors.firstName.message}
            </span>
          )}
        </label>
        <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
          LastName
          <input
            className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
            type="text"
            {...register("lastName", {
              required: "Last Name is Required",
            })}
          />
          {errors.lastName && (
            <span className="text-red-600 text-sm font-normal">
              {errors.lastName.message}
            </span>
          )}
        </label>
      </div>
      <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
        Email
        <input
          className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
          type="email"
          {...register("email", {
            required: "Email is Required",
          })}
        />
        {errors.email && (
          <span className="text-red-600 text-sm font-normal">
            {errors.email.message}
          </span>
        )}
      </label>
      <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
        Password
        <input
          className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
          type="password"
          {...register("password", {
            required: "Password is Required",
            minLength: {
              value: 6,
              message: "Password must be atleast 6 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
              message:
                "Password must include uppercase, lowercase, number, and special character",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-600 text-sm font-normal">
            {errors.password.message}
          </span>
        )}
      </label>
      <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
        Confirm Password
        <input
          className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
          type="password"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "Confirm Password is Required";
              } else if (watch("password") !== val) {
                return "Your Password do not match";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-600 text-sm font-normal">
            {errors.confirmPassword.message}
          </span>
        )}
      </label>
      <span className="flex justify-between">
        <p className="text-black font-normal">
          Already Registered?{" "}
          <span className="font-semibold underline cursor-pointer">
            <Link to="/sign-in">SignIn</Link>
          </span>
        </p>
        <button
          type="submit"
          className="py-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 font-bold cursor-pointer"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default SIgnUp;
