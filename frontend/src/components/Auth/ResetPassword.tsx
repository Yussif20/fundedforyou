'use client'

import { useState } from "react"
import { Eye, EyeClosed, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import CustomForm from "../Forms/CustomForm"
import CustomInput from "../Forms/CustomInput"
import AuthContainer from "./AuthContainer"
import { FieldValues } from "react-hook-form"
import { toast } from "sonner"
import { useResetPasswordMutation } from "@/redux/api/userApi"
import { useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

const defaultValues = {
    newPassword: "",
    confirmPassword: "",
}

export default function ResetPassword() {
    const t = useTranslations('Auth.ResetPassword')
    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (data: FieldValues) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error(t('errors.passwordMismatch'))
            return
        }

        if (!token) {
            toast.error(t('errors.invalidToken'))
            return
        }

        const formData = {
            newPassword: data.newPassword,
            resetToken: token,
        }

        const toastId = toast.loading(t('toast.resetting'))
        try {
            const result = await resetPassword(formData).unwrap()
            toast.success(result?.message || t('toast.success'), { id: toastId })
            router.push('/auth/sign-in')
        } catch (error: any) {
            toast.error(error?.data?.message || t('toast.error'), { id: toastId })
        }
    }

    return (
        <AuthContainer
            title={t('title')}
            subtitle={t('subtitle')}
        >
            <CustomForm
                onSubmit={handleSubmit}
                defaultValues={defaultValues}
                className="space-y-6"
            >
                <div className="space-y-4">
                    <CustomInput
                        required
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        label={t('fields.newPassword.label')}
                        placeholder={t('fields.newPassword.placeholder')}
                        Icon={<LockKeyhole size={16} />}
                        RightIcon={showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                        onRightIconClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    />

                    <CustomInput
                        required
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        label={t('fields.confirmPassword.label')}
                        placeholder={t('fields.confirmPassword.placeholder')}
                        Icon={<LockKeyhole size={16} />}
                        RightIcon={showConfirmPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                    />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? t('submit.resetting') : t('submit.default')}
                </Button>

                <div className="text-center">
                    <p className="text-sm text-foreground/80">
                        {t('backToSignIn')}{' '}
                        <Link href="/auth/sign-in">
                            <Button variant="link" className="px-0 text-sm text-primary" disabled={isLoading}>
                                {t('signInLink')}
                            </Button>
                        </Link>
                    </p>
                </div>
            </CustomForm>
        </AuthContainer>
    )
}
