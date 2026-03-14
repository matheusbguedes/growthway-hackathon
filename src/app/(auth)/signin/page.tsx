import { Suspense } from "react";
import Form from "./(components)/form";
import FormSkeleton from "./(components)/form-skeleton";

export default function SignIn() {
  return (
    <div className="flex w-full h-svh bg-background">
      <div className="w-2/3 hidden lg:block bg-linear-to-b from-blue-50 to-blue-100" />
      <div className="w-full lg:w-1/3 flex justify-center items-center p-3 md:p-10">
        <Suspense fallback={<FormSkeleton />}>
          <Form />
        </Suspense>
      </div>
    </div>
  );
}