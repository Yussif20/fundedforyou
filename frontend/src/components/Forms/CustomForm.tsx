/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FormProvider,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";

type TFormConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
  className?: string;
};

// Update the onSubmit type to accept both data and methods
type TFormProps = {
  onSubmit: (
    data: FieldValues,
    methods: UseFormReturn<any>
  ) => Promise<void> | void;
  children: ReactNode;
  defaultValues?: Record<string, any>;
} & TFormConfig;

const CustomForm = ({
  onSubmit,
  children,
  defaultValues,
  resolver,
  className,
}: TFormProps) => {
  // Configure React Hook Form with passed props
  const formConfig: TFormConfig = {};
  if (defaultValues) formConfig.defaultValues = defaultValues;
  if (resolver) formConfig.resolver = resolver;

  const methods = useForm(formConfig);

  const submit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    try {
      await onSubmit(data, methods);
    } catch {
      toast.error("Error submitting form:");
    }
  };

  const onError = (errors: any) => {
    console.log("SUBMIT BLOCKED ❌", errors);

    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      toast.error(errors[firstErrorKey]?.message || "Invalid field");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(submit, onError)}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default CustomForm;
