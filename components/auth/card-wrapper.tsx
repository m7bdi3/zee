"ue client";
import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth//social";
import { BackButton } from "@/components/auth//bck-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="lg:max-w-4xl lg:min-w-[400px] md:max-w-4xl md:min-w-[400px] w-full h-fit shadow-md overflow-y-auto">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  );
};
