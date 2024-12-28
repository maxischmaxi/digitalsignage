import { useSetDayjsLocale } from "@/hooks/use-set-dayjs-locale";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

type Props = {
  display: Prisma.DisplayGetPayload<{
    include: {
      timeframes: {
        include: {
          Layout: true;
        };
      };
    };
  }>;
  onRowClick?: () => void;
  onRowDblClick?: () => void;
};

export function TimelineRow(props: Props) {
  useSetDayjsLocale();
  const { onRowDblClick, onRowClick, display } = props;

  return (
    <div
      className="timeline-row"
      onClick={() => {
        if (onRowClick) {
          onRowClick();
        }
      }}
      onDoubleClick={() => {
        if (onRowDblClick) {
          onRowDblClick();
        }
      }}
    >
      {display.timeframes.map((frame) => (
        <div
          key={frame.id}
          className="timeline-event"
          style={{
            left: dayjs(frame.start).unix(), // Für ein einfaches Layout kannst du hier Pixel oder %
            width: dayjs(frame.end).unix() - dayjs(frame.start).unix(),
          }}
        >
          {frame.Layout.name}
        </div>
      ))}
    </div>
  );
}
