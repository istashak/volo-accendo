"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifiedUserMessage() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get("firstName");
  const email = searchParams.get("email");
  console.log({ firstName, email });

  return (
    <div>
      <p className="mb-4 font-semibold">{`Thank ${firstName}, you've successfully verified your email address. ${email}`}</p>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Suspense>
        <VerifiedUserMessage />
      </Suspense>
    </>
  );
}
