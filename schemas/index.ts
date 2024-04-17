import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .transform((val) => val.toLowerCase()),
  password: z.string().min(1, "Password must be at least 8 characters long"),
});

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(5, "Username must be at least 5 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
        "Password must contain at least one lowercase, uppercase, number, and special character"
      ),
    avatar_url: z.string().min(1, "Avatar is required"),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(1, "First name is required")
      .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ResetSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .transform((val) => val.toLowerCase()),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
        "Password must contain at least one lowercase, uppercase, number, and special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    firstName: z.optional(z.string()),
    lastName: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(
      z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
          "Password must contain at least one lowercase, uppercase, number, and special character"
        )
    ),
    newPassword: z.optional(
      z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
          "Password must contain at least one lowercase, uppercase, number, and special character"
        )
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );
export const CommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  postId: z.string(),
  parentId: z.optional(z.string()),
});

export const EditCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  CommentId: z.string(),
});

export const PostSchema = z.object({
  slug: z.string().min(1, "Topic is required"),
  content: z.string().min(20, "Post content is required"),
  imageUrl: z.optional(z.string()),
});

export const EditPostSchema = z.object({
  postId: z.string(),
  title: z.optional(z.string().min(5, "Post title is required")),
  content: z.optional(z.string().min(20, "Post content is required")),
});

export const TopicSchema = z.object({
  slug: z
    .string()
    .min(2, "Topic title is required")
    .max(15, "Maximum 15 characters")
    .regex(/^[a-z]+$/, "Topic title must contain only lowercase letters"),
  description: z.string().min(10, "Description is required"),
  imageUrl: z.string().min(1, "Topic image is required"),
});

export const ProfileImage = z.object({
  imageUrl: z.string().min(1, "Profile image is required"),
});
export const ProfileCoverImage = z.object({
  imageUrl: z.string().min(1, "Cover image is required"),
});

export const ProfileBio = z.object({
  bio: z.string().min(1, "bio is required"),
});
