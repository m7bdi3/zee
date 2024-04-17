import { LoginForm } from "@/components/auth/login-form";
import { serverClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const LoginPage =async () => {
  const supabase = serverClient();
  const { data:{user}, error } = await supabase.auth.getUser();
  if(user){
    redirect('/')
  }
  return (
    <div className="h-full w-full flex justify-center items-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
