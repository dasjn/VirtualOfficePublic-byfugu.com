export default function Background() {
  return (
    <>
      <img
        src="/images/TheOnffice_Background_v01.png"
        className="absolute inset-0 w-full h-full object-cover -z-50"
        alt="background"
      />
      <div className="absolute inset-0 w-full h-full bg-[#181818] bg-opacity-90 -z-40"></div>
    </>
  );
}
