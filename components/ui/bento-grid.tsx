import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-md group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-card  justify-around flex flex-col space-y-4",
        className
      )}
    >
      <div className="h-full w-full object-cover flex items-center justify-center relative">
        {header}
      </div>
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans text-2xl font-bold mb-2 mt-2">{title}</div>
        <div className="font-normal text-xs text-accent flex justify-end">
          {description}
        </div>
      </div>
    </div>
  );
};
