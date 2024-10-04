import React from "react";
import { Event } from "./post-modal";
import Image from "next/image";
import moment from "moment";
interface EventPostFieldProps {
  event: Event;
}

const EventPostField = ({ event }: EventPostFieldProps) => {
  function formatDate(inputDate: string): string {
    return moment(inputDate, "MM/DD/YYYY").format("ddd/MMM D/YYYY");
  }
  return (
    <div className="w-full flex flex-col items-start justify-start mt-2 rounded-xl border space-y-1">
      {event.headerImage && (
        <Image src={event.headerImage} alt="" width={600} height={300} />
      )}
      <div className="py-4 px-6 space-y-1">
        <p className="text-sm text-orange-700 mb-2">
          {formatDate(event.startDate)}, {event.startTime}- {event.endTime}
        </p>
        <p className="font-semibold text-sm">{event.eventName}</p>
        <p className="text-xs">Event by {/*user*/}</p>
        {!event.isInPerson ? (
          <p className="text-xs">Online</p>
        ) : (
          <p className="text-xs">{event.address}</p>
        )}
      </div>
    </div>
  );
};

export default EventPostField;
