import { SitecoreConfig } from "@sitecore-content-sdk/nextjs/config";
import { writeQueryRegistry } from "./write-query-registry";

/** Writes the splash screen to the host console (stdout). */
export function splashScreen(): void {
  const lines = [
    "",
    "                          ██████████                            ",
    "                    ████████      ██████████                    ",
    "                ██████                    ██████                ",
    "            ██████                            ██████            ",
    "          ████                                    ████          ",
    "        ████                                        ████        ",
    "      ████  ██                ██████████          ██  ████      ",
    "      ██  ██████              ██████            ██████  ██      ",
    "    ████  ██████████        ████████        ██████████  ████    ",
    "    ██    ████████████      ████████      ████████████    ██    ",
    "  ████  ██  ████████████  ████████████  ████████████  ██  ████  ",
    "  ██  ████    ██████████████████████████████████████  ████  ██  ",
    "████  ██████    ██████████████████████████████████  ██████  ████",
    "██  ████████      ██████████████████████████████  ██  ██████  ██",
    "██  ██████  ████    ██████████████████████████  ██████  ████  ██",
    "██  ████  ████████  ████████████████████████  ██████████  ██  ██",
    "██      ██████████    ████████████████████    ████████████    ██",
    "██  ████████████  ██    ████████████████    ██  ████████████  ██",
    "██  ██████████  ██████    ████████████    ██████  ██████████  ██",
    "██  ████████  ██████████    ████████    ██████████  ████████  ██",
    "████  ████  ██████████    ██  ████  ██    ██████████  ████  ████",
    "  ██      ████████████  ██████    ██████  ████████████  ██  ██  ",
    "  ████  ████████████    ██████    ██████    ████████████  ████  ",
    "    ██  ██████████    ████████████████████    ██████████  ██    ",
    "    ████  ██████    ████████████████████████    ██████  ████    ",
    "      ████  ██      ██████████████████████████    ██  ████      ",
    "        ████      ████████████████████████████      ████        ",
    "          ████  ████████████████████████████████  ████          ",
    "            ██████       QUERY SHIELD         ██████            ",
    "                ██████                    ██████                ",
    "                    ████████      ██████████                    ",
    "                          ██████████                            ",
  ];
  console.log(lines.join("\n"));
}
// Thanks to https://textart.sh/topic/shield for the ASCII art.

/** GraphQL allow-list generation for sitecore-tools `project build`. */
export const writeQueryShieldRegistry = (): (({
  scConfig,
}: {
  scConfig: SitecoreConfig;
}) => Promise<void>) => {
  return async () => {
    if (process.env.NEXT_PUBLIC_SHIELD_QUERY === "true") {
      splashScreen();
      writeQueryRegistry();
      console.log();
    } else {
      console.log(
        "\n",
        "QUERY SHIELD is disabled. Run with NEXT_PUBLIC_SHIELD_QUERY=true to enable.",
        "\n",
      );
    }
    return Promise.resolve();
  };
};
