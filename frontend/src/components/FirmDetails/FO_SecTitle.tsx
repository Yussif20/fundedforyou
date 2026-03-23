const FO_SecTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex gap-2">
      <h2 className="font-bold text-xl md:text-2xl text-primary">{children}</h2>

    </div>
  );
};

export default FO_SecTitle;
