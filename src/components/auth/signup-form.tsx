
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { OAuthButtons } from "./oauth-buttons";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Note: Firebase's createUserWithEmailAndPassword doesn't directly use the 'name' field.
      // You would typically update the user's profile (displayName) after successful creation.
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      // Example: updateProfile(userCredential.user, { displayName: values.name });

      toast({
        title: "Account Created",
        description: "Welcome! Redirecting to your dashboard...",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email address is already registered.";
          form.setError("email", { type: "manual", message: errorMessage });
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. It should be at least 6 characters long.";
          form.setError("password", { type: "manual", message: errorMessage });
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is not valid.";
          form.setError("email", { type: "manual", message: errorMessage });
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
        <Separator className="my-6" />
        <OAuthButtons />
      </form>
    </Form>
  );
}
