import React from "react";

type AiTalkAnimationProps = {
  state: "idle" | "talking";
};

const AiTalkAnimation: React.FC<AiTalkAnimationProps> = ({ state }) => {
  return (
    <>
      <style>
        {`
          /* ---------------- LAYERS ---------------- */

          .motion-wrapper {
            animation: floaty 5s ease-in-out infinite;
          }

          .scale-wrapper {
            transform: scale(${state === "talking" ? 1.25 : 1});
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .loader {
            --color-one: #ffbf48;
            --color-two: #be4a1d;
            --color-three: #ffbf4780;
            --color-four: #bf4a1d80;
            --color-five: #ffbf4740;

            --time-animation: ${state === "talking" ? "1.8s" : "4s"};

            position: relative;
            width: 110px;
            height: 110px;
          }

          /* ---------------- OUTER ORB ---------------- */

          .orb {
            position: absolute;
            width: 110px;
            height: 110px;

            border-radius: 
              45% 55% 60% 40% /
              60% 40% 60% 40%;

            background: linear-gradient(
              180deg,
              rgba(255, 191, 72, 0.15),
              rgba(190, 74, 29, 0.15)
            );

            border: 1px solid rgba(255, 191, 72, 0.2);

            box-shadow:
              0 0 ${state === "talking" ? "40px" : "25px"} var(--color-three),
              0 20px ${state === "talking" ? "80px" : "50px"} var(--color-four),
              inset 0 10px 10px rgba(255, 191, 72, 0.1),
              inset 0 -10px 10px rgba(190, 74, 29, 0.1);

            animation: blobMorph var(--time-animation) linear infinite,
                       colorize 6s linear infinite;
          }

          /* ---------------- CORE ---------------- */

          .core {
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;

            animation: colorize calc(var(--time-animation) * 3) linear infinite;
          }

          .box {
            width: 100%;
            height: 100%;
            background: linear-gradient(
              180deg,
              var(--color-one) 30%,
              var(--color-two) 70%
            );

            mask: url(#clipping);
            -webkit-mask: url(#clipping);
          }

          svg {
            position: absolute;
          }

          svg #clipping {
            filter: contrast(15);
            animation: roundness calc(var(--time-animation) / 2) linear infinite;
          }

          svg #clipping polygon {
            filter: blur(7px);
          }

          svg #clipping polygon:nth-child(1) {
            transform-origin: 75% 25%;
            transform: rotate(90deg);
            }

            svg #clipping polygon:nth-child(2) {
            transform-origin: 50% 50%;
            animation: rotation var(--time-animation) linear infinite reverse;
            }

            svg #clipping polygon:nth-child(3) {
            transform-origin: 50% 60%;
            animation: rotation var(--time-animation) linear infinite;
            animation-delay: calc(var(--time-animation) / -3);
            }

            svg #clipping polygon:nth-child(4) {
            transform-origin: 40% 40%;
            animation: rotation var(--time-animation) linear infinite reverse;
            }

            svg #clipping polygon:nth-child(5) {
            transform-origin: 40% 40%;
            animation: rotation var(--time-animation) linear infinite reverse;
            animation-delay: calc(var(--time-animation) / -2);
            }

            svg #clipping polygon:nth-child(6) {
            transform-origin: 60% 40%;
            animation: rotation var(--time-animation) linear infinite;
            }

            svg #clipping polygon:nth-child(7) {
            transform-origin: 60% 40%;
            animation: rotation var(--time-animation) linear infinite;
            animation-delay: calc(var(--time-animation) / -1.5);
            }

          /* ---------------- ANIMATIONS ---------------- */

          @keyframes floaty {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          @keyframes blobMorph {
            0%, 100% {
              border-radius: 45% 55% 60% 40% / 60% 40% 60% 40%;
            }
            50% {
              border-radius: 60% 40% 45% 55% / 40% 60% 40% 60%;
            }
          }

          @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes roundness {
            0%, 60%, 100% { filter: contrast(15); }
            20%, 40% { filter: contrast(3); }
          }

          @keyframes colorize {
            0%, 100% { filter: hue-rotate(0deg); }
            20% { filter: hue-rotate(-30deg); }
            40% { filter: hue-rotate(-60deg); }
            60% { filter: hue-rotate(-90deg); }
            80% { filter: hue-rotate(-45deg); }
          }
        `}
      </style>

      <div className="motion-wrapper">
        <div className="scale-wrapper">
          <div className="loader">
            <div className="orb" />

            <div className="core">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <defs>
                  <mask id="clipping">
                    <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                    <polygon points="25,25 75,25 50,75" fill="white" />
                    <polygon points="50,25 75,75 25,75" fill="white" />
                    <polygon points="35,35 65,35 50,65" fill="white" />
                    <polygon points="35,35 65,35 50,65" fill="white" />
                    <polygon points="35,35 65,35 50,65" fill="white" />
                    <polygon points="35,35 65,35 50,65" fill="white" />
                  </mask>
                </defs>
              </svg>

              <div className="box"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiTalkAnimation;
