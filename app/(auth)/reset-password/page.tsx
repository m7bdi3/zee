import { PassowrdResetForm } from "@/components/auth/reset-password-form";
import { serverClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const ResetPasswordPage = async () => {
  const supabase = serverClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }
  return (
    <div className="h-full w-full flex justify-center items-center">
      <PassowrdResetForm />
    </div>
  );
};

export default ResetPasswordPage;
