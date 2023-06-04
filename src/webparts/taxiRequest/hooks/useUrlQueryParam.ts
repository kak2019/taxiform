import { useMemo } from "react";
/**
 * Return 1 - the value of the param in page Url
 * Return 2 - function redirectToSourcePage()
 */

export const useUrlQueryParam = <K extends string>(
    keys: K[]
  ): readonly [{ [key in K]: string }] => {
    const searchParams = new URLSearchParams(window.location.search);
    return [
      useMemo(
        () =>
          keys.reduce((prev: { [key in K]: string }, key: string) => {
            return { ...prev, [key]: searchParams.get(key) || "" };
          }, {} as { [key in K]: string }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchParams]
      ),
    ] as const;
  };