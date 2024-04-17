import { ResetForm } from "@/components/auth/reset-form";
import { serverClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const AuthResetPage = async () => {
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
      <ResetForm />
    </div>
  );
};

export default AuthResetPage;
