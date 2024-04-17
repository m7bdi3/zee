
import SettingPage from "@/components/settings/settings";
import { serverClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
const SettingsPage = async () => {
 const supabase = serverClient();
 const {data:{user}} = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  const {data:SettingsUser,error} = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!SettingsUser || error) {
    return redirect("/login");
  }
  return (
    <div className="h-full w-full flex items-center justify-center mt-12">
      <SettingPage settingsUser={SettingsUser} />
    </div>
  );
};

export default SettingsPage;
