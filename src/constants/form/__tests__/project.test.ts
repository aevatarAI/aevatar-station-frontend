import { describe, expect, it } from "vitest";
import { ProjectEditForm } from "../project";

describe("ProjectEditForm - name validation", () => {
  describe("Positive Test Cases", () => {
    it("should accept valid project names with letters and numbers", () => {
      const validNames = [
        "My Project",
        "Project-2024",
        "AI Chat Bot",
        "Test123",
        "Hello World",
        "Project-Name-123",
        "A B C",
        "123Project",
        "Project123",
      ];

      validNames.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe(name.trim());
        }
      });
    });

    it("should accept project names with only letters", () => {
      const validNames = ["Project", "MyProject", "A", "HelloWorld"];

      validNames.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe(name.trim());
        }
      });
    });

    it("should accept project names with only numbers", () => {
      const validNames = ["123", "2024", "1", "999"];

      validNames.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe(name.trim());
        }
      });
    });

    it("should accept project names with hyphens", () => {
      const validNames = ["Project-Name", "My-Project", "A-B-C", "-Project-"];

      validNames.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe(name.trim());
        }
      });
    });

    it("should accept project names with spaces", () => {
      const validNames = ["My Project", "A B C", "Project Name", "  Project  "];

      validNames.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe(name.trim());
        }
      });
    });
  });

  describe("Negative Test Cases", () => {
    it("should reject empty strings", () => {
      const result = ProjectEditForm.safeParse({ name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Project name cannot be empty or contain only whitespace",
        );
      }
    });

    it("should reject strings with only whitespace", () => {
      const invalidNames = [" ", "  ", "\t", "\n", "   "];

      invalidNames.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Project name cannot be empty or contain only whitespace",
          );
        }
      });
    });

    it("should reject names with only hyphens and spaces", () => {
      const invalidNames = ["---", "--- ", " - - ", "   -   "];

      invalidNames.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Project name must contain at least one ASCII letter or number for domain generation",
          );
        }
      });
    });

    it("should reject names with only special characters", () => {
      const invalidNames = ["@#$%", "!@#", "&*()", "[]{}"];

      invalidNames.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Project name must contain at least one ASCII letter or number for domain generation",
          );
        }
      });
    });
  });

  describe("Invalid Character Test Cases", () => {
    it("should reject names with underscores", () => {
      const result = ProjectEditForm.safeParse({ name: "Project_Name" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Project name contains invalid characters: [_]",
        );
      }
    });

    it("should reject names with Chinese characters", () => {
      const result = ProjectEditForm.safeParse({ name: "测试项目" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Project name must contain at least one ASCII letter or number for domain generation",
        );
      }
    });

    it("should reject names with other special characters", () => {
      const testCases = [
        { name: "Project@Name", expectedChars: ["@"] },
        { name: "Project#Name", expectedChars: ["#"] },
        { name: "Project$Name", expectedChars: ["$"] },
        { name: "Project%Name", expectedChars: ["%"] },
        { name: "Project&Name", expectedChars: ["&"] },
        { name: "Project*Name", expectedChars: ["*"] },
        { name: "Project(Name", expectedChars: ["("] },
        { name: "Project)Name", expectedChars: [")"] },
        { name: "Project+Name", expectedChars: ["+"] },
        { name: "Project=Name", expectedChars: ["="] },
        { name: "Project{Name", expectedChars: ["{"] },
        { name: "Project}Name", expectedChars: ["}"] },
        { name: "Project[Name", expectedChars: ["["] },
        { name: "Project]Name", expectedChars: ["]"] },
        { name: "Project|Name", expectedChars: ["|"] },
        { name: "Project\\Name", expectedChars: ["\\"] },
        { name: "Project/Name", expectedChars: ["/"] },
        { name: "Project:Name", expectedChars: [":"] },
        { name: "Project;Name", expectedChars: [";"] },
        { name: "Project<Name", expectedChars: ["<"] },
        { name: "Project>Name", expectedChars: [">"] },
        { name: "Project,Name", expectedChars: [","] },
        { name: "Project.Name", expectedChars: ["."] },
        { name: "Project?Name", expectedChars: ["?"] },
        { name: "Project!Name", expectedChars: ["!"] },
        { name: "Project~Name", expectedChars: ["~"] },
        { name: "Project`Name", expectedChars: ["`"] },
        { name: "Project'Name", expectedChars: ["'"] },
        { name: 'Project"Name', expectedChars: ['"'] },
      ];

      testCases.forEach(({ name, expectedChars }) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(false);
        if (!result.success) {
          expectedChars.forEach((char) => {
            expect(result.error.issues[0].message).toContain(char);
          });
        }
      });
    });

    it("should reject names with multiple invalid characters", () => {
      const result = ProjectEditForm.safeParse({ name: "Project@#$%Name" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Project name contains invalid characters: [@, #, $, %]",
        );
      }
    });
  });

  describe("Boundary Test Cases", () => {
    it("should accept single character names", () => {
      const validSingleChars = ["A", "a", "1", "0", "9"];

      validSingleChars.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe(name);
        }
      });
    });

    it("should accept names with mixed valid characters", () => {
      const validNames = [
        "A1",
        "1A",
        "A-1",
        "1-A",
        "A 1",
        "1 A",
        "A-1-B",
        "A 1 B",
      ];

      validNames.forEach((name) => {
        const result = ProjectEditForm.safeParse({ name });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe(name.trim());
        }
      });
    });
  });

  describe("Transform Test Cases", () => {
    it("should trim whitespace from valid names", () => {
      const testCases = [
        { input: "  Project  ", expected: "Project" },
        { input: "Project  ", expected: "Project" },
        { input: "  Project", expected: "Project" },
        { input: "\tProject\n", expected: "Project" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = ProjectEditForm.safeParse({ name: input });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe(expected);
        }
      });
    });

    it("should preserve internal spaces and hyphens", () => {
      const testCases = [
        { input: "  My Project  ", expected: "My Project" },
        { input: "  Project-Name  ", expected: "Project-Name" },
        { input: "  A B C  ", expected: "A B C" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = ProjectEditForm.safeParse({ name: input });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe(expected);
        }
      });
    });
  });

  describe("Error Message Test Cases", () => {
    it("should provide correct error message for empty string", () => {
      const result = ProjectEditForm.safeParse({ name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Project name cannot be empty or contain only whitespace",
        );
      }
    });

    it("should provide correct error message for whitespace only", () => {
      const result = ProjectEditForm.safeParse({ name: "   " });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Project name cannot be empty or contain only whitespace",
        );
      }
    });

    it("should provide correct error message for no valid characters", () => {
      const result = ProjectEditForm.safeParse({ name: "---" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Project name must contain at least one ASCII letter or number for domain generation",
        );
      }
    });

    it("should provide correct error message for invalid characters", () => {
      const result = ProjectEditForm.safeParse({ name: "Project_Name" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Project name contains invalid characters: [_]. Only ASCII letters, numbers, hyphens and spaces are allowed",
        );
      }
    });
  });
});
