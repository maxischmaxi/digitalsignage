import util from "util";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debug(data: any): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  if (data === null) {
    console.log("DEBUG: null");
    return;
  }

  if (!data) {
    return;
  }

  if (typeof data === "string") {
    console.log("DEBUG: " + data);
  } else if (typeof data === "object") {
    console.log(util.inspect(data, false, null, true));
  } else if (typeof data === "function") {
    console.log("DEBUG: " + data.toString());
  } else {
    console.log("DEBUG: " + data);
  }
}
