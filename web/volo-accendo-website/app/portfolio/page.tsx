import React from "react";
import { getSizedImage } from "../utils";
import BoseLogo from "@/public/bose-logo.svg";
import FujitsuLogo from "@/public/fujitsu-logo.svg";
import NuSkinLogo from "@/public/nu-skin-logo.svg";
import WhoopLogo from "@/public/whoop-logo.svg";
import WinnebagoLogo from "@/public/winnebago-logo.svg";

const imageDivClass =
  "flex p-6 rounded-lg shadow-lg col-span-1 justify-center items-center max-h-[175px] min-h-[175px]";
const textClass = "text-lg text-black";
const textDivClass =
  "flex text-white p-4 rounded-lg shadow-lg col-span-3 items-center";

export default function Page() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className={imageDivClass}>
        {getSizedImage({
          src: "/bwell-logo.webp",
          alt: "b.well Logo",
          containerWidth: 200,
          imageWidth: 250,
          imageHeight: 150,
        })}
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          {`Played an integral role in the development of b.well's proprietary SDK
          that simplified the use of the Fast Healthcare Interoperability Resources API, also known as FHIR. The 
          SDK was offered in both Kotlin and TypeScript, which enable b.well's customers, developing for mobile and web, to quickly bring 
          their medical information applications to market.`}
        </p>
      </div>
      <div className={imageDivClass}>
        {getSizedImage({
          src: "/crane-logo.png",
          alt: "Crane Logo",
          containerWidth: 200,
          imageWidth: 300,
          imageHeight: 161,
        })}
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          {`Played an integral role in the development of Crane's mobile app.`}
        </p>
      </div>
      <div className={imageDivClass}>
        <BoseLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          Played an integral role in the development of Bose tech.
        </p>
      </div>
      <div className={imageDivClass}>
        <WinnebagoLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          Played an integral role in the development of Winnebago tech.
        </p>
      </div>
      <div className={imageDivClass}>
        <NuSkinLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          Played an integral role in the development of NuSkin tech.
        </p>
      </div>
      <div className={imageDivClass}>
        <WhoopLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          Played an integral role in the development of Whoop tech.
        </p>
      </div>
      <div className={imageDivClass}>
        {getSizedImage({
          src: "/native-voice-logo.png",
          alt: "Native Voice Logo",
          containerWidth: 150,
          imageWidth: 100,
          imageHeight: 100,
        })}
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          Played an integral role in the development of NuSkin tech.
        </p>
      </div>
      <div className={imageDivClass}>
        <FujitsuLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          Played an integral role in the development of Whoop tech.
        </p>
      </div>
      <div className={imageDivClass}>
        {getSizedImage({
          src: "/lenel-logo.png",
          alt: "Lenel Logo",
          containerWidth: 150,
          imageWidth: 2339,
          imageHeight: 400,
        })}
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          Played an integral role in the development of NuSkin tech.
        </p>
      </div>
      <div className={imageDivClass}>
        {getSizedImage({
          src: "/innr-logo.jpg",
          alt: "innr Logo",
          containerWidth: 150,
          imageWidth: 315,
          imageHeight: 145,
        })}
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          Played an integral role in the development of NuSkin tech.
        </p>
      </div>
      <div className={imageDivClass}>
        {getSizedImage({
          src: "/cyber-data-logo.png",
          alt: "CyberData Logo",
          containerWidth: 150,
          imageWidth: 612,
          imageHeight: 188,
        })}
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          Played an integral role in the development of NuSkin tech.
        </p>
      </div>
    </div>
  );
}
