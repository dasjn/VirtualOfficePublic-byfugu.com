import { motion } from "framer-motion";
import { useCursorHover } from "@/hooks/useCursorHover";

const WelcomeModal = ({ onAccept, setCursorHover }) => {
  const { handlePointerOver, handlePointerOut } =
    useCursorHover(setCursorHover);

  // Función para manejar el clic en el botón "Got it!"
  const handleAccept = (event) => {
    event.stopPropagation();
    onAccept();
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99] pointer-events-none">
      <motion.div
        className="flex flex-col gap-6 w-[450px] p-8 h-auto gradient-keyboard bg-opacity-40 bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow pointer-events-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Welcome to the ONFFICE</p>
          <p>
            We don&apos;t work in one place — we exist in many. This is our
            virtual space. Built to explore, connect, and collaborate — from
            anywhere.
          </p>
        </div>
        <div className="flex flex-col border-y-[1px] py-6 text-sm gap-2">
          <p className="font-bold">Disclaimer</p>
          <p>
            This is an early access version. You might run into bugs or
            performance issues — we&apos;re still refining. If you spot anything
            weird, feel free to let us know.
          </p>
          <p className="italic text-xs">·Current Release: ONFFICE_1_01.2</p>
        </div>
        <div className="flex flex-col border-b-[1px] pb-6 text-sm gap-2">
          <div className="inline-flex items-center justify-center">
            <motion.button
              className="bg-[#2364B3] py-3 px-10 rounded-full font-bold text-xl"
              onClick={handleAccept}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Got it!
            </motion.button>
          </div>
        </div>
        <div className="flex gap-2 items-center w-full justify-between text-xs px-12">
          <div className="flex flex-col items-center gap-1">
            <a
              href={"https://www.byfugu.com/"}
              target="_blank"
              className="bg-opacity-15 bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-none"
              onClick={(event) => {
                event.stopPropagation(); // Evitar que el evento se propague
              }}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              <span className="material-symbols-outlined">captive_portal</span>
            </a>
            <p>byfugu.com</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <a
              href={"https://www.instagram.com/wearefugu/"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-opacity-15 bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-none"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <g>
                  <path
                    d="M7.1783 10.1724C7.17506 8.33175 8.66483 6.83647 10.5051 6.83323C12.3458 6.82963 13.8414 8.31878 13.845 10.1598C13.8485 12.0008 12.3587 13.4957 10.5178 13.4993C8.67744 13.5028 7.18186 12.0134 7.1783 10.1724ZM5.3772 10.176C5.38271 13.012 7.68604 15.3059 10.5214 15.3004C13.357 15.2949 15.6522 12.9922 15.6467 10.1562C15.6412 7.32116 13.3376 5.02592 10.5016 5.03143C7.66623 5.03693 5.3717 7.34061 5.3772 10.176ZM14.6391 4.82084C14.6404 5.48307 15.1788 6.01932 15.8411 6.01803C16.5037 6.01674 17.0399 5.47854 17.0389 4.81631C17.0377 4.15404 16.4992 3.61748 15.8366 3.61877C15.174 3.62006 14.6378 4.15853 14.6391 4.82084ZM6.48689 18.313C5.51197 18.2706 4.98255 18.1086 4.62974 17.9729C4.16251 17.792 3.82912 17.5753 3.47822 17.227C3.12798 16.8774 2.91056 16.545 2.72814 16.0787C2.59111 15.7259 2.42618 15.1971 2.38048 14.2221C2.33091 13.1682 2.31958 12.8519 2.31474 10.1818C2.30954 7.51233 2.31927 7.19612 2.36528 6.14115C2.40704 5.16686 2.57005 4.63678 2.70548 4.28428C2.88626 3.81642 3.1024 3.48365 3.45134 3.13275C3.80091 2.78189 4.13333 2.56509 4.5999 2.38267C4.95244 2.24498 5.48119 2.08134 6.4558 2.03502C7.51041 1.98513 7.82631 1.97443 10.4958 1.96923C13.1658 1.96408 13.482 1.97345 14.537 2.01982C15.5112 2.06224 16.0413 2.22361 16.3936 2.36002C16.8611 2.5408 17.1945 2.75627 17.545 3.10588C17.8956 3.45549 18.113 3.78724 18.2954 4.25478C18.4331 4.60635 18.5968 5.13576 18.6428 6.11002C18.693 7.16467 18.7043 7.48092 18.7092 10.1504C18.7143 12.8205 18.7046 13.1368 18.6583 14.1911C18.6159 15.166 18.4542 15.6957 18.3181 16.0489C18.1373 16.5158 17.9212 16.8492 17.5719 17.2001C17.2227 17.5497 16.8902 17.7677 16.4234 17.9502C16.0714 18.0875 15.5421 18.2515 14.5681 18.2978C13.5135 18.3474 13.1976 18.3587 10.5272 18.3636C7.85772 18.3688 7.54186 18.3587 6.48689 18.313ZM6.37025 0.235521C5.30623 0.285716 4.57951 0.456146 3.94443 0.704975C3.28704 0.961264 2.72978 1.30474 2.17544 1.86138C1.6204 2.41834 1.27954 2.97658 1.0252 3.63463C0.778993 4.27131 0.612118 4.99838 0.565125 6.06307C0.518485 7.12971 0.507782 7.46991 0.512977 10.1854C0.518172 12.9005 0.530125 13.2414 0.580985 14.3083C0.631844 15.372 0.801649 16.0985 1.05048 16.7338C1.30708 17.3913 1.65021 17.9482 2.20716 18.5029C2.7638 19.0576 3.3224 19.3981 3.98076 19.6528C4.61677 19.8987 5.34412 20.0662 6.40849 20.1129C7.4751 20.1599 7.81561 20.1702 10.5304 20.165C13.2465 20.1599 13.5871 20.1479 14.6537 20.0973C15.7177 20.0464 16.4437 19.8761 17.0795 19.6279C17.7368 19.3706 18.2941 19.0281 18.8485 18.4712C19.4029 17.9145 19.7437 17.3559 19.998 16.6975C20.2443 16.0615 20.4118 15.3341 20.4581 14.2704C20.5048 13.2032 20.5158 12.8623 20.5106 10.1471C20.5054 7.43166 20.4931 7.09147 20.4426 6.02514C20.392 4.96049 20.2216 4.23435 19.9731 3.59865C19.7162 2.94127 19.3734 2.38463 18.8168 1.82962C18.2601 1.27525 17.7015 0.933725 17.0432 0.680053C16.4068 0.433763 15.6798 0.265951 14.6154 0.219935C13.5488 0.172669 13.2083 0.162279 10.4925 0.167474C7.77736 0.172669 7.43686 0.18431 6.37025 0.235521Z"
                    fill="white"
                  />
                </g>
              </svg>
            </a>
            <p>@wearefugu</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <a
              href={"https://www.behance.net/byfugu"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-opacity-15 bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-none"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <g>
                  <path
                    d="M6.95914 5.09668C7.66646 5.09668 8.3034 5.15825 8.88405 5.28448C9.46605 5.40583 9.95768 5.61268 10.3749 5.89348C10.7873 6.17518 11.1053 6.55033 11.3405 7.01807C11.5655 7.48134 11.678 8.06289 11.678 8.75165C11.678 9.49708 11.5101 10.115 11.1713 10.6128C10.8294 11.1093 10.3329 11.5128 9.66671 11.8321C10.5756 12.0944 11.2461 12.5536 11.6961 13.2056C12.1457 13.8625 12.3619 14.6495 12.3619 15.5766C12.3619 16.3264 12.2162 16.9682 11.9318 17.5121C11.6412 18.0609 11.2475 18.5056 10.7652 18.8484C10.2779 19.1948 9.71543 19.4481 9.08693 19.612C8.46285 19.775 7.82107 19.8605 7.15755 19.8605H0V5.09803L6.96004 5.09848L6.95918 5.09668H6.95914ZM15.6607 6.28768H21.6463V7.74579L15.6607 7.74534V6.28723V6.28768ZM16.9908 17.292C17.432 17.7221 18.0644 17.9382 18.89 17.9382C19.4805 17.9382 19.9969 17.7876 20.4225 17.4878C20.8482 17.1879 21.1068 16.8703 21.2056 16.5417L23.7918 16.5421C23.3746 17.8301 22.7465 18.7452 21.8846 19.2984C21.0355 19.8516 19.9965 20.1324 18.7908 20.1324C17.9462 20.1324 17.1923 19.9955 16.5124 19.7285C15.833 19.457 15.2661 19.0778 14.7877 18.5795C14.324 18.083 13.9586 17.4926 13.7004 16.7986C13.447 16.1103 13.3168 15.3454 13.3168 14.5207C13.3168 13.7194 13.4488 12.974 13.7097 12.2848C13.9767 11.5903 14.3426 10.9963 14.8298 10.4941C15.3165 9.99223 15.8884 9.59406 16.5638 9.3035C17.2344 9.01251 17.975 8.86678 18.7952 8.86678C19.6992 8.86678 20.4912 9.04085 21.1711 9.3965C21.8461 9.74732 22.4037 10.2212 22.8395 10.8121C23.2763 11.4034 23.5849 12.0824 23.7772 12.8411C23.9694 13.5998 24.035 14.3917 23.9823 15.2227H16.264C16.264 16.0611 16.5457 16.8637 16.9899 17.2889L16.9908 17.292ZM20.361 11.678C20.0146 11.294 19.4189 11.0827 18.7022 11.0827C18.2327 11.0827 17.8447 11.162 17.5356 11.3214C17.2313 11.48 16.9824 11.6767 16.7902 11.9119C16.6028 12.1462 16.4708 12.3995 16.3977 12.6657C16.3229 12.9235 16.2764 13.1622 16.2609 13.369L21.0422 13.3686C20.9718 12.6192 20.714 12.066 20.3628 11.6771L20.361 11.678H20.361ZM6.53614 11.0583C7.11195 11.0583 7.58985 10.9214 7.96455 10.6455C8.33925 10.374 8.51775 9.92402 8.51775 9.30482C8.51775 8.96334 8.45662 8.67632 8.33483 8.45574C8.20905 8.23562 8.04383 8.06154 7.83345 7.94019C7.6266 7.81438 7.3932 7.72847 7.11724 7.68197C6.85016 7.63104 6.56846 7.60757 6.28324 7.60757H3.2466V11.0566H6.53704L6.53614 11.0583ZM6.71419 17.3429C7.03399 17.3429 7.33826 17.3146 7.62218 17.2481C7.91272 17.1826 8.17095 17.0847 8.38579 16.935C8.60149 16.7893 8.78483 16.5979 8.91506 16.3446C9.04706 16.0957 9.10729 15.7777 9.10729 15.3892C9.10729 14.6305 8.89114 14.0861 8.46551 13.7575C8.03985 13.4333 7.47289 13.2747 6.76999 13.2747H3.2457V17.3372L6.71419 17.3367V17.3429V17.3429Z"
                    fill="white"
                  />
                </g>
              </svg>
            </a>
            <p>/byfugu</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeModal;
