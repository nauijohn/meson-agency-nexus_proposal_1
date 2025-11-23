const H1 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
      {children}
    </h1>
  );
};

const Typography = {
  H1,
};

export default Typography;
