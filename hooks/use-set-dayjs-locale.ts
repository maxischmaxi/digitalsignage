import { useEffect } from "react";
import dayjs from "dayjs";
import de from "dayjs/locale/de";
import en from "dayjs/locale/en";
import { useLocale } from "next-intl";

export function useSetDayjsLocale() {
  const locale = useLocale();

  useEffect(() => {
    if (locale === "de") {
      dayjs.locale(de);
    } else {
      dayjs.locale(en);
    }
  }, [locale]);
  return null;
}
