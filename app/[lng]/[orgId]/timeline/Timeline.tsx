"use client";

import { Prisma } from "@prisma/client";
import { TimelineRow } from "./TimelineRow";
import { useState } from "react";
import { AddTimeframe } from "./AddTimeframe";

type Props = {
  displays: Prisma.DisplayGetPayload<{
    include: {
      timeframes: {
        include: {
          Layout: true;
        };
      };
    };
  }>[];
};

export function Timeline(props: Props) {
  const { displays } = props;
  const [open, setOpen] = useState(false);
  const [selectedDisplay, setSelectedDisplay] =
    useState<Prisma.DisplayGetPayload<{
      include: { timeframes: { include: { Layout: true } } };
    }> | null>(null);

  return (
    <div className="flex flex-row flex-nowrap h-full w-full">
      <div className="timeline-container">
        <div className="timeline-sidebar">
          {displays.map((display, index) => (
            <div key={index} className="timeline-sidebar-item">
              {display.name}
            </div>
          ))}
        </div>

        {/* Rechte Timeline-Fläche (scrollbar) */}
        <div className="timeline-content">
          {displays.map((display, rowIndex) => (
            <TimelineRow
              key={rowIndex}
              display={display}
              onRowDblClick={() => {
                setOpen(true);
                setSelectedDisplay(display);
              }}
            />
          ))}
        </div>
      </div>
      {open && selectedDisplay && (
        <div className="w-[600px] border-l border-t flex flex-col">
          <AddTimeframe display={selectedDisplay} />
        </div>
      )}
    </div>
  );
}
