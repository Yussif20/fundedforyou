// utils/otp.ts
export function generateOTP(length = 4): string {
  const max = 10 ** length;
  const otp = Math.floor(Math.random() * max);
  return otp.toString().padStart(length, "0");
}

export function otpExpiryTime(minutes = 15): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function getOtpStatusMessage(expiryTime: Date): string {
  const now = Date.now();
  const remainingMs = expiryTime.getTime() - now;

  if (remainingMs > 0) {
    const totalSec = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;

    if (minutes > 0) {
      return `An OTP has already been sent. Please try again in ${minutes} minute(s) and ${seconds} second(s).`;
    }
    return `An OTP has already been sent. Please try again in ${seconds} second(s).`;
  }

  return "No active OTP found. You can request a new one.";
}
