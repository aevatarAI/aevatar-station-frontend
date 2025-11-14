import { z } from "zod";

export const ProjectEditForm = z.object({
  name: z
    .string()
    .refine(
      (value) => {
        const trimmed = value.trim();

        // Check if empty or only contains whitespace
        if (!trimmed) {
          return false;
        }

        // Check if contains at least one ASCII letter or number
        if (!/[a-zA-Z0-9]/.test(trimmed)) {
          return false;
        }

        // Check if contains only allowed characters
        if (!/^[a-zA-Z0-9\-\s]+$/.test(trimmed)) {
          return false;
        }

        return true;
      },
      (value) => {
        const trimmed = value.trim();

        // Empty or whitespace only
        if (!trimmed) {
          return {
            message: "Project name cannot be empty or contain only whitespace",
          };
        }

        // No valid characters (letters or numbers)
        if (!/[a-zA-Z0-9]/.test(trimmed)) {
          return {
            message:
              "Project name must contain at least one ASCII letter or number for domain generation",
          };
        }

        // Invalid characters
        const invalidChars = trimmed
          .split("")
          .filter((char) => !/^[a-zA-Z0-9\-\s]$/.test(char))
          .filter((char, index, arr) => arr.indexOf(char) === index);

        if (invalidChars.length > 0) {
          return {
            message: `Project name contains invalid characters: [${invalidChars.join(
              ", ",
            )}]. Only ASCII letters, numbers, hyphens and spaces are allowed`,
          };
        }

        return { message: "Project name format is incorrect" };
      },
    )
    .transform((value) => value.trim()),
});

export type TProjectEditForm = z.infer<typeof ProjectEditForm>;
