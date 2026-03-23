interface IconProps {
  className?: string;
  color?: string; // allow custom color, default to primary
}

const BatIcon: React.FC<IconProps> = ({
  className,
  color = "var(--primary)",
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.3419 26.6782C16.4191 26.6822 19.4022 25.6176 21.7815 23.6663L29.7395 31.6229C30.2694 32.1347 31.1138 32.12 31.6256 31.5901C32.1248 31.0732 32.1248 30.2537 31.6256 29.7367L23.669 21.7789C28.33 16.074 27.4837 7.6707 21.7789 3.00969C16.074 -1.65132 7.6707 -0.80509 3.00969 4.89979C-1.65132 10.6047 -0.80509 19.0079 4.89979 23.669C7.28254 25.6157 10.265 26.6788 13.3419 26.6782Z"
        fill={color}
      />
    </svg>
  );
};

export default BatIcon;
