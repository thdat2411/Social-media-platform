"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { user } from "@prisma/client";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import SignUpForm from "./form";
const FullNameCard = dynamic(() => import("./fullname-card"));
const RoleCard = dynamic(() => import("./role-card"));
const JobSeekerCard = dynamic(() => import("./job-seeker-card"));
const RecruiterCard = dynamic(() => import("./recruiter-card"));

const SignUpMainContent = () => {
  const session = useSession();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [data, setData] = useState<user | null>(null);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const array = useMemo(() => Array.from({ length: 3 }), []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleNext = async () => {
    if (api) {
      api.scrollNext();
    }
  };
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/feed");
    }
  }, [session?.status, router]);
  return (
    <>
      {!isRegister ? (
        <>
          <h1 className="mb-6 text-3xl">
            Make the most of your professional life
          </h1>
          <div className="mx-auto max-w-md rounded-lg border bg-white p-8 shadow-md">
            <SignUpForm
              setIsRegister={setIsRegister}
              setData={setData}
              data={data}
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="mb-6 text-3xl">Set up before ready to go </h1>
          <div className="mx-auto rounded-lg border bg-white p-8 shadow-md">
            <Carousel className="w-[500px]" setApi={setApi}>
              <CarouselPrevious />
              <p className="absolute -top-3 left-12">
                {current}/<span className="text-muted-foreground">{count}</span>
              </p>
              <CarouselContent className="mt-10">
                {array.map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="border-none shadow-none">
                        <CardContent className="flex aspect-square flex-col justify-around px-6 py-4 outline-none">
                          {index === 0 ? (
                            <FullNameCard
                              data={data}
                              setData={setData}
                              handleNext={handleNext}
                            />
                          ) : index === 1 ? (
                            <RoleCard
                              data={data}
                              setData={setData}
                              handleNext={handleNext}
                            />
                          ) : data?.role === "jobseeker" ? (
                            <JobSeekerCard userData={data} />
                          ) : (
                            <RecruiterCard userData={data} />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </>
      )}
    </>
  );
};

export default SignUpMainContent;
