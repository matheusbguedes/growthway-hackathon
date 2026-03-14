import { Suspense } from "react";
import Form from "./(components)/form";
import FormSkeleton from "./(components)/form-skeleton";

export default function SignIn() {
  return (
    <div className="flex w-full h-svh bg-background">
      <Suspense fallback={<FormSkeleton />}>
        <Form />
      </Suspense>
    </div>
  );
}