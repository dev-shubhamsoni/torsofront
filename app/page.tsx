"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EyeClosed, EyeClosedIcon } from "lucide-react";
import { usePostAdminLoginMutation } from "@/redux/authApi";
import { toast } from "sonner";
import { APIError } from "@/lib/types";

// ✅ Define Schema
const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long." }),
});

export default function Home() {
  const router = useRouter();
  const [trigger, { data: emailData, isError, isSuccess, error }] =
    usePostAdminLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (emailData && isSuccess && emailData?.status) {
      toast.success(emailData?.message);
      const token = emailData?.data[0]?.token;

      if (token) {
        document.cookie = `tokenMADMIN=${token}; path=/;`;
        setTimeout(() => {
          toast.success("re-routing, please wait!");
        }, 1000);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        console.log("UID or Token is null");
        router.push("/");
      }
    }

    // ✅ Handle API response errors (status: false in API response)
    if (emailData && isSuccess && !emailData?.status) {
      toast.error(emailData?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isError && error) {
      let errorMessage = "An error occurred";

      // ✅ Ensure error is of type APIError
      if ((error as APIError)?.data) {
        const apiError = error as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, emailData, isError, error, trigger]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    trigger(data);
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* ✅ Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password..."
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeClosed className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeClosedIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ Submit Button */}
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
