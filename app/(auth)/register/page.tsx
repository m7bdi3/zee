import { RegisterForm } from "@/components/auth/register-form";
import { serverClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
const RegisterPage = async() => {
  const supabase = serverClient();
  const { data:{user}, error } = await supabase.auth.getUser();
  if(user){
    redirect('/')
  }
  return (
    <div className="h-full w-full flex justify-center items-center">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
