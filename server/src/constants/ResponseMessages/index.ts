export const ResponseMessages = {
  AUTH: {
    SIGNUP: {
      SUCCESS: "Your account has been created successfully.",
      EMAIL_EXISTS: "An account with this email already exists.",
      EMAIL_NOT_VERIFIED:
        "Your email is not verified. A new verification link has been sent.",
      TERMS_NOT_AGREED:
        "You must agree to the terms and conditions to continue.",
    },
    LOGIN: {
      SUCCESS: "Login successful.",
      INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
      EMAIL_NOT_VERIFIED:
        "Your account is not verified. Please check your email for verification.",
    },
    EMAIL_VERIFICATION: {
      SENT: "We have sent a verification email. Please check your inbox.",
      ALREADY_VERIFIED: "This email has already been verified.",
      SUCCESS: "Your email has been verified successfully.",
      LINK_EXPIRED:
        "The verification link has expired. Please request a new one.",
      LINK_USED: "This verification link has already been used.",
      INVALID_LINK: "The verification link is invalid or expired.",
      OTP_SENT: "An OTP has been sent to your email for verification.",
      OTP_INVALID: "The OTP you entered is invalid. Please try again.",
      OTP_EXPIRED: "The OTP has expired. Please request a new one.",
      OTP_VERIFIED: "OTP verified successfully. Your email is now confirmed.",
    },
    PASSWORD: {
      RESET_LINK_SENT:
        "We have sent a link to reset your password. Please check your email.",
      RESET_SUCCESS: "Your password has been reset successfully.",
      RESET_LINK_EXPIRED:
        "The reset link has expired. Please request a new one.",
      RESET_LINK_USED: "This reset link has already been used.",
      FORGOT_EMAIL_NOT_VERIFIED:
        "Please verify your email before attempting to reset your password.",
      PASSWORD_SAME_AS_OLD:
        "New password cannot be the same as your old password.",
      OTP_SENT: "An OTP has been sent to your email to reset your password.",
      OTP_INVALID: "The password reset OTP is invalid. Please try again.",
      OTP_EXPIRED:
        "The password reset OTP has expired. Please request a new one.",
      PASSWORD_NOT_SET:
        "You have not set a password yet. Please reset your password using OTP.",
      CURRENT_INCORRECT: "Your current password is incorrect.",
      RESET_LINK_INVALID: "No password reset request found or link is invalid.",
      OTP_VERIFIED:
        "OTP verified successfully. You can now reset your password.",
    },
    TOKEN: {
      MISSING: "No refresh token provided. Please login again.",
      INVALID: "Invalid token. Please login again.",
      REFRESH_SUCCESS: "Access token has been refreshed successfully.",
    },
  },

  USER: {
    NOT_FOUND: "User not found.",
    NOT_FOUND_WITH_EMAIL: "User not found with the provided email.",
    CREATED: "User has been created successfully.",
    UPDATED: "User information has been updated successfully.",
    DELETED: "User has been deleted successfully.",
  },

  GENERAL: {
    UNAUTHORIZED: "You are not authorized to perform this action.",
    FORBIDDEN: "You do not have permission to access this resource.",
    BAD_REQUEST: "The request is invalid or malformed.",
    SERVER_ERROR: "Something went wrong. Please try again later.",
    SUCCESS: "Operation completed successfully.",
  },
};
