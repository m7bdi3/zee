
interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex flex-col  items-center justify-center">
      <div className="flex items-center justify-center">
        <p className="font-extrabold text-6xl text-primary">Z</p>
      </div>
    </div>
  );
};
