import background from "../assets/Background.png";

export default function Background() {
  return (
    <>
      <img
        src={background}
        className="absolute inset-0 w-screen h-screen bg-cover bg-center -z-50"
        alt="background"
      />
      <div className="absolute w-screen h-screen bg-cover bg-center inset-0 -z-40 bg-opacity-90 bg-[#181818]"></div>
    </>
  );
}
