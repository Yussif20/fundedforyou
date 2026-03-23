import z from "zod";

// ---------------- SIGNUP ----------------
const signupValidationSchema = z.object({
  body: z
    .object({
      fullName: z
        .string("Full name is required!")
        .min(2, "Full name must be at least 2 characters long"),
      email: z.email({ message: "Invalid email format!" }),
      password: z
        .string("Password is required!")
        .min(6, { message: "Password must be at least 6 characters long" }),
      isAggradedToTermsAndPolicies: z.boolean(
        "You must agree to the Terms of Use and Privacy Policy."
      ),
      phoneNumber: z.string().optional(),
    })
    .strict(),
});

// ---------------- LOGIN ----------------
const loginValidationSchema = z.object({
  body: z
    .object({
      email: z.email("Invalid email format!"),
      password: z.string("Password is required!"),
    })
    .strict(),
});

// ---------------- VERIFY EMAIL ----------------
const verifyEmailValidationSchema = z.object({
  body: z
    .object({
      token: z
        .string("Verification token is required!")
        .min(1, "Invalid verification token!"),
    })
    .strict(),
});

// ---------------- RESEND VERIFICATION EMAIL ----------------
const resendVerificationEmailValidationSchema = z.object({
  body: z
    .object({
      email: z.email("Invalid email format!"),
    })
    .strict(),
});

// ---------------- FORGOT PASSWORD ----------------
const forgotPasswordValidationSchema = z.object({
  body: z
    .object({
      email: z.email({ message: "Invalid email format!" }),
    })
    .strict(),
});

// ---------------- RESET PASSWORD ----------------
const resetPasswordValidationSchema = z.object({
  body: z
    .object({
      resetToken: z
        .string("Reset token is required!")
        .min(1, { message: "Invalid reset token!" }),
      newPassword: z
        .string("New password is required!")
        .min(6, { message: "Password must be at least 6 characters long" }),
    })
    .strict(),
});

// ---------------- RESET PASSWORD ----------------
const changePasswordValidationSchema = z.object({
  body: z
    .object({
      oldPassword: z
        .string("Old password is required!")
        .min(6, { message: "Invalid email or password" }),
      newPassword: z
        .string("New password is required!")
        .min(6, { message: "Password must be at least 6 characters long" }),
    })
    .strict(),
});

// ---------------- GOOGLE LOGIN ----------------
const googleLoginValidationSchema = z.object({
  body: z
    .object({
      credential: z.string().min(1, "Google credential token is required"),
    })
    .strict(),
});

// ---------------- EXPORT ----------------
export const AuthValidation = {
  signupValidationSchema,
  loginValidationSchema,
  verifyEmailValidationSchema,
  resendVerificationEmailValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
  changePasswordValidationSchema,
  googleLoginValidationSchema,
};

export type ChangePasswordValidationInput = z.infer<
  typeof changePasswordValidationSchema
>;
export type resetPasswordValidationInput = z.infer<
  typeof resetPasswordValidationSchema
>;
