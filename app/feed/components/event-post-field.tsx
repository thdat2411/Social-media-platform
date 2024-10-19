import moment from "moment";
import Image from "next/image";
import React from "react";
import { Event } from "./post-modal";
interface EventPostFieldProps {
  event: Event;
}

const EventPostField = ({ event }: EventPostFieldProps) => {
  function formatDate(inputDate: string): string {
    return moment(inputDate, "MM/DD/YYYY").format("ddd/MMM D/YYYY");
  }
  return (
    <div className="mt-2 flex w-full flex-col items-start justify-start space-y-1 rounded-xl border">
      {event.headerImage && (
        <Image src={event.headerImage} alt="" width={600} height={300} />
      )}
      <div className="space-y-1 px-6 py-4">
        <p className="mb-2 text-sm text-orange-700">
          {formatDate(event.startDate)}, {event.startTime}- {event.endTime}
        </p>
        <p className="text-sm font-semibold">{event.eventName}</p>
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
