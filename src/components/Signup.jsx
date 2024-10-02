/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/util";
import { toast } from "react-toastify";
import { authenticationService, userService, restApp, authCookieName, cookieStorage } from "../api/rest.app";
import Loading from "./Loading";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const createUser = async (data) => {
    try {
      // const userData = await authserivce.createAccount(data);
      setLoading(true);
      const userData = await userService.create(data);

      // console.log("userData ::", userData);

      if (userData) {
        // const uData = await authserivce.getCurrentUser();

        const session = await authenticationService.create({
          email: data.email,
          password: data.password,
          strategy: "local"
        });


        // const uData = await userService.get(userData._id);

        if (session) {
          localStorage.setItem(authCookieName, session.accessToken);
          cookieStorage.setItem(authCookieName, session.accessToken);
          await restApp.reAuthenticate();
          toast("Account created successfully", { type: "success" });
          const userData = session.user;
          dispatch(login({ userData }));
          setLoading(false);
          navigate("/");
        }
      }
    } catch (e) {
      setLoading(false);
      toast(e.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to SwapNShare
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to SwapNShare if you can because we don&apos;t have a login flow
        yet
      </p>

      <form className="my-8" onSubmit={handleSubmit(createUser)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Enter Your Full Name" type="text" {...register("name", { required: true })} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="example@domin.com" type="email" {...register("email", { required: true })} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" {...register("password", { required: true })} />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="text-center text-neutral-600 dark:text-neutral-300">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </div>
      </form>
    </div>
  );

};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Signup;
