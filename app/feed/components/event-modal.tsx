import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useRef, useState } from "react";
import CameraImage from "@/app/assets/camera.jpg";
import Image from "next/image";
import { format, toZonedTime } from "date-fns-tz";
import DateInput from "./date-input";
import TimeInput from "./time-input";
import { Button } from "@/components/ui/button";
import { Camera, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import ConfirmModal from "@/app/components/confirm-modal";
import ImageHeaderEditor from "./image-header-editor";
import PostModal, { Event } from "./post-modal";
import { defaultEvent } from "@/app/utils/utils";

interface EventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setNestedEventModal?: (open: boolean) => void;
  nestedEventModal?: boolean;
  formData: Event | undefined;
  setFormData: (data: Event | undefined) => void;
  isIn?: boolean;
}

const EventModal = ({
  open,
  setOpen,
  setNestedEventModal,
  nestedEventModal,
  formData,
  setFormData,
  isIn,
}: EventModalProps) => {
  const [isTimeDropdownVisible, setTimeDropdownVisible] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isImageEditorModalOpen, setIsImageEditorModalOpen] = useState(false);
  const [isEditImageOpen, setIsEditImageOpen] = useState(false);
  const [isEditImageDropdownOpen, setIsEditImageDropdownOpen] = useState(false);
  const [isHavingText, setIsHavingText] = useState(false);
  const [triggerReset, setTriggerReset] = useState(false);
  const [isEndDateTimeVisible, setEndDateTimeVisible] = useState(false);
  const [timeZones, setTimeZones] = useState<string[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const timezonedropdownRef = useRef<HTMLDivElement>(null);

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
  }, [isHavingText, triggerReset]);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      timezonedropdownRef.current &&
      !timezonedropdownRef.current.contains(event.target as Node)
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
      />
      {formData !== undefined && (
        <Dialog open={open} onOpenChange={handleCloseWithData}>
          <DialogContent className="p-0 bg-gray-50 w-full max-w-xl ">
            <div className="bg-white border rounded-lg flex flex-col">
              <DialogHeader className="p-6">
                <DialogTitle className="text-xl font-medium">
                  Create an event
                </DialogTitle>
              </DialogHeader>
              <Separator className="p-0" />
              <div className="flex flex-col flex-grow max-h-[80vh] overflow-auto">
                {/* Image Upload Section */}
                {formData.headerImage === "" ? (
                  <>
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer flex flex-col items-center justify-center w-full p-4 min-h-[400px] bg-[#F8F8F8]"
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
                  <div className="cursor-pointer flex flex-col items-center justify-center w-full p-4  bg-[#F8F8F8] relative">
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
                          className="rounded-full border-2  border-gray-400 hover:border-black p-3 absolute right-3 top-1"
                        >
                          <Pencil className="size-3" />
                        </Button>
                        {isEditImageDropdownOpen && (
                          <div className="z-10 bg-white border absolute right-0 top-14  rounded max-h-[150px] overflow-y-auto">
                            <div className="flex flex-col w-[220px] p-0 items-start">
                              <label
                                htmlFor="imageUpload"
                                className="bg-white flex w-full px-4 py-4 justify-start hover:bg-[#F8F8F8] cursor-pointer"
                              >
                                <div className="flex items-center space-x-2 cursor-pointer">
                                  <Camera className="size-6 " />
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
                                  setFormData({ ...formData, headerImage: "" });
                                  setIsEditImageDropdownOpen(false);
                                }}
                                variant="ghost"
                                className="bg-white  w-full justify-start"
                              >
                                <div className="flex items-center py-2 space-x-2">
                                  <Trash2 className="size-6 " />
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
                <div className="flex flex-col w-full px-6 py-4 space-y-2 justify-start text-sm ">
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
                        setFormData({ ...formData, isInPerson: false })
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
                        setFormData({ ...formData, isInPerson: true })
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
                    className="w-full border-2 border-gray-400 rounded p-2 hover:border-black "
                    value={formData.eventName}
                    onChange={(e) =>
                      setFormData({ ...formData, eventName: e.target.value })
                    }
                  />
                  <div className="text-right w-full text-gray-500 text-sm">
                    {formData.eventName.length}/75
                  </div>

                  {/* Time Zone Section */}
                  <div className=" pb-5 relative">
                    <p className="mb-2">Time zone</p>
                    <Button
                      onClick={() => setTimeDropdownVisible((prev) => !prev)}
                      variant="ghost"
                      id="Time zone"
                      className={`w-full border-2 justify-between  rounded p-2 hover:border-black ${
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
                        className="w-full z-10 bg-white border absolute border-black rounded p-2 max-h-[150px] overflow-y-auto"
                      >
                        {timeZones.map((zone, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setFormData({ ...formData, zone: zone });
                              setTimeDropdownVisible(false);
                            }}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                          >
                            {zone}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Start Date and Time Section */}
                  <div className="space-y-2 pb-5">
                    <div className="flex justify-between items-center space-x-5">
                      <div className="flex flex-col space-y-2 w-1/2">
                        <p>Start date</p>
                        <DateInput
                          date={formData.startDate}
                          setDate={(date) =>
                            setFormData({ ...formData, startDate: date })
                          }
                        />
                      </div>
                      <div className="flex flex-col space-y-2 w-1/2">
                        <p>Start time</p>
                        <TimeInput
                          selectedTime={formData.startTime}
                          setSelectedTime={(time) =>
                            setFormData({ ...formData, startTime: time })
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
                      className="size-5 checked"
                    />
                    <p>Add end date and time</p>
                  </div>
                  {isEndDateTimeVisible && (
                    <div className="space-y-2 pb-5">
                      <div className="flex justify-between items-center space-x-5">
                        <div className="flex flex-col space-y-2 w-1/2">
                          <p>End date</p>
                          <DateInput
                            date={formData.endDate}
                            setDate={(date) =>
                              setFormData({ ...formData, endDate: date })
                            }
                          />
                        </div>
                        <div className="flex flex-col space-y-2 w-1/2">
                          <p>End time</p>
                          <TimeInput
                            selectedTime={formData.endTime}
                            setSelectedTime={(time) =>
                              setFormData({ ...formData, endTime: time })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Adress and Venue Section */}
                  {formData.isInPerson && (
                    <>
                      <div className="flex flex-col pt-4 space-y-2">
                        <p>Adress</p>
                        <input
                          type="text"
                          id="eventName"
                          className="w-full border-2 border-gray-400 rounded p-2 hover:border-black "
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
                      <div className="flex flex-col pt-4 space-y-2">
                        <p>Venue</p>
                        <input
                          type="text"
                          id="eventName"
                          className="w-full border-2 border-gray-400 rounded p-2 hover:border-black "
                          placeholder="E.g., floor number, room number, etc,..."
                          value={formData.venue}
                          onChange={(e) =>
                            setFormData({ ...formData, venue: e.target.value })
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
                      className="w-full border-2 border-gray-400 hover:border-black resize-none rounded-lg px-4 py-2 h-24"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="text-right w-full text-gray-500 text-sm">
                      {formData.description.length}/5000
                    </div>
                  </div>
                  {/* Privacy Section */}
                  <p className="text-muted-foreground text-sm py-4">
                    By continuing, you agree with{" "}
                    <Link
                      href="#"
                      className="text-blue-600 cursor-pointer hover:underline"
                    >
                      {" "}
                      LinkedIn’s event policy.
                    </Link>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Make the most of LinkedIn Events.{" "}
                    <Link
                      href="#"
                      className="text-blue-600 cursor-pointer hover:underline"
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
                      className="rounded-full bg-[#0A66C2] hover:bg-blue-800 p-4"
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
