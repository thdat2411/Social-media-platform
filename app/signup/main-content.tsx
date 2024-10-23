"use client";
import React, { useEffect, useState } from "react";
import SignUpForm from "./form";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { user } from "@prisma/client";
import FullNameCard from "./fullname-card";
import RoleCard from "./role-card";
import JobSeekerCard from "./job-seeker-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RecruiterCard from "./recruiter-card";

const SignUpMainContent = () => {
  const session = useSession();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [data, setData] = useState<user | null>(null);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const array = Array.from({ length: 3 });

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
          <h1 className="text-3xl mb-6">
            Make the most of your professional life
          </h1>
          <div className="bg-white p-8 rounded-lg shadow-md border max-w-md mx-auto">
            <SignUpForm
              setIsRegister={setIsRegister}
              setData={setData}
              data={data}
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl mb-6">Set up before ready to go </h1>
          <div className="bg-white p-8 rounded-lg shadow-md border  mx-auto">
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
                        <CardContent className="flex flex-col justify-around aspect-square px-6 py-4 outline-none">
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
