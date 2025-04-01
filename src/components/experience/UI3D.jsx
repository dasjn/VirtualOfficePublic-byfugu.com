import { useExperience } from "@/hooks/useExperience";
import Key from "./Key";

export default function UI3D() {
  const { isPointerLocked, cursorHover, deviceType } = useExperience();

  // Verificar si el dispositivo es táctil
  const isTouchDevice = deviceType?.isTouchDevice;

  return (
    <div className="absolute w-screen h-screen text-white pointer-events-none">
      {/* Pointer (solo visible en dispositivos no táctiles cuando está bloqueado) */}
      {isPointerLocked && !isTouchDevice && (
        <div
          className={`z-[9999] select-none absolute top-1/2 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 border border-white bg-white bg-opacity-40 ${
            cursorHover ? "w-6 h-6" : "w-4 h-4"
          } 
        transition-[width,height] duration-300 ease-in-out`}
        />
      )}

      {/* Keyboard (para dispositivos de escritorio) */}
      {!isTouchDevice && (
        <div className="z-[9999] select-none flex flex-col p-4 absolute bottom-[2%] left-[2%] w-60 h-64 gradient-keyboard bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow pointer-events-auto">
          <div className="flex h-2/5 gap-16 self-center">
            <div className="flex gap-2 flex-col">
              <Key
                keyName="escapeKeyPressed"
                keyLetter="Esc"
                keyTitle="Stop"
                keyIcon="AddIcon"
              />
            </div>
            <div className="flex gap-1 flex-col">
              <Key
                keyName="muteKeyPressed"
                keyLetter="M"
                keyTitle="Mute"
                keyIcon="AddIcon"
              />
            </div>
          </div>
          <div className="flex flex-col h-3/5 gap-1 justify-end">
            <Key
              keyName="forwardKeyPressed"
              keyLetter="W"
              keyTitle="Move"
              keyIcon="AddIcon"
            />
            <div className="flex flex-row gap-1 self-center">
              <Key keyName="leftKeyPressed" keyLetter="A" />
              <Key keyName="backwardKeyPressed" keyLetter="S" />
              <Key keyName="rightKeyPressed" keyLetter="D" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
