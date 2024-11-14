import CameraImage from "@/app/assets/camera.jpg";
import { defaultEvent } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import { format, toZonedTime } from "date-fns-tz";
import { Camera, ChevronDown, Pencil, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DateInput from "./date-input";
import { Event } from "./post-modal";
import TimeInput from "./time-input";

const ConfirmModal = dynamic(() => import("@/app/components/confirm-modal"), {
  ssr: false,
});
const ImageHeaderEditor = dynamic(() => import("./image-header-editor"), {
  ssr: false,
});
const PostModal = dynamic(() => import("./post-modal"), { ssr: false });

interface EventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setNestedEventModal?: (open: boolean) => void;
  nestedEventModal?: boolean;
  formData: Event | undefined;
  setFormData: (data: Event | undefined) => void;
  isIn?: boolean;
  user: user;
}

const EventModal = ({
  open,
  setOpen,
  nestedEventModal,
  formData,
  setFormData,
  isIn,
  user,
}: EventModalProps) => {
  const [isTimeDropdownVisible, setTimeDropdownVisible] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isImageEditorModalOpen, setIsImageEditorModalOpen] = useState(false);
  const [isEditImageOpen, setIsEditImageOpen] = useState(false); // TODO: Fix "'setIsEditImageOpen' is assigned a value but never used."
  const [isEditImageDropdownOpen, setIsEditImageDropdownOpen] = useState(false);
  const [isHavingText, setIsHavingText] = useState(false);
  const [triggerReset, setTriggerReset] = useState(false);
  const [isEndDateTimeVisible, setEndDateTimeVisible] = useState(false);
  const [timeZones, setTimeZones] = useState<string[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const timezoneDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zones = Intl.supportedValuesOf("timeZone");
    const groupedTimeZones: Map<string, string[]> = new Map();

    zones.forEach((zone) => {
      const utcDate = new Date();
      const zonedDate = toZonedTime(utcDate, zone);
      const formatted = format(zonedDate, "XXX", { timeZone: zone });
      const cityName = zone.split("/")[1];

      if (!groupedTimeZones.has(formatted)) {
        groupedTimeZones.set(formatted, []);
      }
      const cities = groupedTimeZones.get(formatted)!;

      if (cities.length < 6) {
        cities.push(cityName.replace("_", " "));
      }
    });

    const formattedTimeZones = Array.from(groupedTimeZones.entries()).map(
      ([utcOffset, cities]) => {
        const displayCities =
          cities.length > 5 ? cities.slice(0, 5).join(", ") : cities.join(", ");
        return `${utcOffset} (${displayCities})`;
      }
    );

    setTimeZones(formattedTimeZones);
  }, []);

  useEffect(() => {
    if (isHavingText === false && triggerReset) {
      setFormData(defaultEvent);
      setTriggerReset(false);
    }
  }, [isHavingText, triggerReset]); // TODO: Fix "React Hook useEffect has a missing dependency: 'setFormData'."

  const handleClickOutside = (event: MouseEvent) => {
    if (
      timezoneDropdownRef.current &&
      !timezoneDropdownRef.current.contains(event.target as Node)
    ) {
      setTimeDropdownVisible(false);
    }
  };

  const handleCloseWithData = () => {
    if (
      (formData?.eventName ||
        formData?.startDate !== new Date().toLocaleDateString() ||
        formData?.startTime !== "10:00 AM" ||
        formData?.endDate !== new Date().toLocaleDateString() ||
        formData?.endTime !== "11:00 AM" ||
        formData?.description ||
        formData?.address ||
        formData?.venue ||
        formData?.zone) &&
      isIn === false
    ) {
      setIsConfirmModalOpen(true);
    } else {
      if (nestedEventModal) {
        setIsPostModalOpen(true);
      }
      setOpen(false);
      setFormData(undefined);
    }
  };

  const onClose = () => {
    setIsConfirmModalOpen(false);
    setOpen(false);
    setFormData(undefined);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setFileData: React.ChangeEventHandler<HTMLInputElement> | null = (
    e
  ) => {
    if (e?.target?.files && e.target.files.length > 0) {
      setFormData({
        ...formData!,
        headerImage: URL.createObjectURL(e.target.files[0]),
      });
      if (
        formData?.eventName ||
        formData?.startDate !== new Date().toLocaleDateString() ||
        formData.startTime !== "10:00 AM" ||
        formData.endDate !== new Date().toLocaleDateString() ||
        formData.endTime !== "11:00 AM" ||
        formData.description ||
        formData.address ||
        formData.venue ||
        formData.zone
      ) {
        setIsHavingText(true);
      }
      setIsImageEditorModalOpen(true);
      setOpen(false);
    }
  };

  const handleDisabled = () => {
    if (
      (formData?.isInPerson === false && formData.eventName && formData.zone) ||
      (formData?.isInPerson === true &&
        formData.eventName &&
        formData.zone &&
        formData.address)
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={onClose}
        title="Discard changes"
        content="Are you sure you want to discard the changes you have made?"
        cancelLabel="Cancel"
        confirmLabel="Discard"
        width={"350"}
      />
      <ImageHeaderEditor
        openImageEditor={isImageEditorModalOpen}
        setImageEditorOpen={setIsImageEditorModalOpen}
        setIsEventModalOpen={setOpen}
        image={formData?.headerImage}
        setImage={(image) => setFormData({ ...formData!, headerImage: image })}
        isHavingText={isHavingText}
        setIsHavingText={setIsHavingText}
        setTriggerReset={setTriggerReset}
      />
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        setIsEventModalOpen={setOpen}
        event={formData}
        setEvent={setFormData}
        setIsHavingText={setIsHavingText}
        setTriggerReset={setTriggerReset}
        user={user}
      />
      {formData !== undefined && (
        <Dialog open={open} onOpenChange={handleCloseWithData}>
          <DialogContent className="w-full max-w-xl bg-gray-50 p-0">
            <div className="flex flex-col rounded-lg border bg-white">
              <DialogHeader className="p-6">
                <DialogTitle className="text-xl font-medium">
                  Create an event
                </DialogTitle>
              </DialogHeader>
              <Separator className="p-0" />
              <div className="flex max-h-[80vh] flex-grow flex-col overflow-auto">
                {/* Image Upload Section */}
                {formData.headerImage === "" ? (
                  <>
                    <label
                      htmlFor="imageUpload"
                      className="flex min-h-[400px] w-full cursor-pointer flex-col items-center justify-center bg-[#F8F8F8] p-4"
                    >
                      <Image src={CameraImage} alt="" className="size-20" />
                      <p className="font-semibold">Upload cover image</p>
                      <p className="text-muted-foreground">
                        Minimum width 480 pixels, 16:9 recommended
                      </p>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="imageUpload"
                      className="hidden"
                      multiple={false}
                      onChange={(e) => setFileData(e)}
                    />
                  </>
                ) : (
                  <div className="relative flex w-full cursor-pointer flex-col items-center justify-center bg-[#F8F8F8] p-4">
                    <Image
                      src={formData.headerImage}
                      alt=""
                      width={400}
                      height={400}
                    />
                    {!isEditImageOpen && (
                      <>
                        <Button
                          onClick={() =>
                            setIsEditImageDropdownOpen((prev) => !prev)
                          }
                          variant="outline"
                          className="absolute right-3 top-1 rounded-full border-2 border-gray-400 p-3 hover:border-black"
                        >
                          <Pencil className="size-3" />
                        </Button>
                        {isEditImageDropdownOpen && (
                          <div className="absolute right-0 top-14 z-10 max-h-[150px] overflow-y-auto rounded border bg-white">
                            <div className="flex w-[220px] flex-col items-start p-0">
                              <label
                                htmlFor="imageUpload"
                                className="flex w-full cursor-pointer justify-start bg-white px-4 py-4 hover:bg-[#F8F8F8]"
                              >
                                <div className="flex cursor-pointer items-center space-x-2">
                                  <Camera className="size-6" />
                                  <div className="flex flex-col">
                                    <p>Upload cover image</p>
                                  </div>
                                </div>
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                id="imageUpload"
                                className="hidden"
                                multiple={false}
                                onChange={(e) => {
                                  setFileData(e);
                                  setIsEditImageDropdownOpen(false);
                                }}
                              />
                              <Button
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    headerImage: "",
                                  });
                                  setIsEditImageDropdownOpen(false);
                                }}
                                variant="ghost"
                                className="w-full justify-start bg-white"
                              >
                                <div className="flex items-center space-x-2 py-2">
                                  <Trash2 className="size-6" />
                                  <div className="flex flex-col">
                                    <p>Delete</p>
                                  </div>
                                </div>
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                <div className="flex w-full flex-col justify-start space-y-2 px-6 py-4 text-sm">
                  {/* Event Type Section */}
                  <p className="w-fit">Event type</p>
                  <div className="flex items-center pb-3">
                    <input
                      type="radio"
                      id="online"
                      name="eventType"
                      className="mr-2 size-7"
                      checked={formData.isInPerson === false}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          isInPerson: false,
                        })
                      }
                    />
                    <label htmlFor="online" className="mr-10">
                      Online
                    </label>
                    <input
                      type="radio"
                      id="inPerson"
                      name="eventType"
                      className="mr-2 size-7"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          isInPerson: true,
                        })
                      }
                      checked={formData.isInPerson === true}
                    />
                    <label htmlFor="inPerson">In person</label>
                  </div>

                  {/* Event Name Section */}
                  <p>Event name</p>
                  <input
                    type="text"
                    id="eventName"
                    className="w-full rounded border-2 border-gray-400 p-2 hover:border-black"
                    value={formData.eventName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eventName: e.target.value,
                      })
                    }
                  />
                  <div className="w-full text-right text-sm text-gray-500">
                    {formData.eventName.length}/75
                  </div>

                  {/* Time Zone Section */}
                  <div className="relative pb-5">
                    <p className="mb-2">Time zone</p>
                    <Button
                      onClick={() => setTimeDropdownVisible((prev) => !prev)}
                      variant="ghost"
                      id="Time zone"
                      className={`w-full justify-between rounded border-2 p-2 hover:border-black ${
                        isTimeDropdownVisible
                          ? "border-black"
                          : "border-gray-400"
                      }`}
                    >
                      {formData.zone || "Select a time zone"}
                      <ChevronDown size={16} />
                    </Button>
                    {isTimeDropdownVisible && (
                      <div
                        id="timeZone"
                        className="absolute z-10 max-h-[150px] w-full overflow-y-auto rounded border border-black bg-white p-2"
                      >
                        {timeZones.map((zone, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                zone: zone,
                              });
                              setTimeDropdownVisible(false);
                            }}
                            className="cursor-pointer p-2 hover:bg-gray-200"
                          >
                            {zone}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Start Date and Time Section */}
                  <div className="space-y-2 pb-5">
                    <div className="flex items-center justify-between space-x-5">
                      <div className="flex w-1/2 flex-col space-y-2">
                        <p>Start date</p>
                        <DateInput
                          date={formData.startDate}
                          setDate={(date) =>
                            setFormData({
                              ...formData,
                              startDate: date,
                            })
                          }
                        />
                      </div>
                      <div className="flex w-1/2 flex-col space-y-2">
                        <p>Start time</p>
                        <TimeInput
                          selectedTime={formData.startTime}
                          setSelectedTime={(time) =>
                            setFormData({
                              ...formData,
                              startTime: time,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add End Date and Time Section */}
                  <div className="flex items-center space-x-3 text-base">
                    <Checkbox
                      onCheckedChange={() =>
                        setEndDateTimeVisible((prev) => !prev)
                      }
                      className="checked size-5"
                    />
                    <p>Add end date and time</p>
                  </div>
                  {isEndDateTimeVisible && (
                    <div className="space-y-2 pb-5">
                      <div className="flex items-center justify-between space-x-5">
                        <div className="flex w-1/2 flex-col space-y-2">
                          <p>End date</p>
                          <DateInput
                            date={formData.endDate}
                            setDate={(date) =>
                              setFormData({
                                ...formData,
                                endDate: date,
                              })
                            }
                          />
                        </div>
                        <div className="flex w-1/2 flex-col space-y-2">
                          <p>End time</p>
                          <TimeInput
                            selectedTime={formData.endTime}
                            setSelectedTime={(time) =>
                              setFormData({
                                ...formData,
                                endTime: time,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Adress and Venue Section */}
                  {formData.isInPerson && (
                    <>
                      <div className="flex flex-col space-y-2 pt-4">
                        <p>Adress</p>
                        <input
                          type="text"
                          id="eventName"
                          className="w-full rounded border-2 border-gray-400 p-2 hover:border-black"
                          value={formData.address}
                          placeholder="E.g., street, city, pincode, etc,..."
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col space-y-2 pt-4">
                        <p>Venue</p>
                        <input
                          type="text"
                          id="eventName"
                          className="w-full rounded border-2 border-gray-400 p-2 hover:border-black"
                          placeholder="E.g., floor number, room number, etc,..."
                          value={formData.venue}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              venue: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                  {/* Description Section */}
                  <div className="flex flex-col space-y-2 pt-4">
                    <p>Description</p>
                    <textarea
                      value={formData.description}
                      placeholder="Ex: topics, schedule, etc"
                      className="h-24 w-full resize-none rounded-lg border-2 border-gray-400 px-4 py-2 hover:border-black"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="w-full text-right text-sm text-gray-500">
                      {formData.description.length}/5000
                    </div>
                  </div>
                  {/* Privacy Section */}
                  <p className="py-4 text-sm text-muted-foreground">
                    By continuing, you agree with{" "}
                    <Link
                      href="#"
                      className="cursor-pointer text-blue-600 hover:underline"
                    >
                      {" "}
                      LinkedIn’s event policy.
                    </Link>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Make the most of LinkedIn Events.{" "}
                    <Link
                      href="#"
                      className="cursor-pointer text-blue-600 hover:underline"
                    >
                      Learn more
                    </Link>
                  </p>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        setOpen(false);
                        setIsPostModalOpen(true);
                      }}
                      className="rounded-full bg-[#0A66C2] p-4 hover:bg-blue-800"
                      disabled={handleDisabled()}
                    >
                      Next
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EventModal;
