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

const linkClass = "text-volo-purple hover:text-link-hover";

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
          SDK is offered in both Kotlin and TypeScript, which enables b.well's customers, developing for mobile and web, to quickly bring 
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
          {`Developed a Bluetooth enabled mobile app that communicates with Crane Aerospace's proprietary aircraft landing gear telemetry technology. The mobile app enables 
          aircraft linemen, armed with an iPad, to quickly and accurately collect and record landing gear data, which is critical to the safe operation of the aircraft.`}
        </p>
      </div>
      <div className={imageDivClass}>
        <BoseLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          {`Worked with Bose's advanced development on multiple mobile application projects. The projects ranged from developing cross-platform mobile based chip-set engineering testing tools with 
          React Native, developing an experimental hardware device that enhanced the Voice Recognition experience for car passengers, and orientational audio capturing tools for Bose's audio engineers.`}
        </p>
      </div>
      <div className={imageDivClass}>
        <WinnebagoLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          {`Played an integral role in the development of the cross platform `}
          <a
            className={linkClass}
            href="https://play.google.com/store/search?q=winnebago+app&c=apps&pli=1"
          >
            Winnebago Mobile App
          </a>
          {` that allows RV owners to monitor and manage their RV's system via Bluetooth and Wifi connectivity.`}
        </p>
      </div>
      <div className={imageDivClass}>
        <NuSkinLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          {`Planed, speced and designed the BLE technology that enables NuSkin facial brushes to talk to 
          their cross-platform `}
          <a
            className={linkClass}
            href="https://play.google.com/store/apps/details?id=com.nuskin.vera&utm_source=na_Med"
          >
            Vera App.
          </a>
          {` This included authoring the native BLE clients, for the Android and iPhone mobile devices, 
          to facilitate communication with the React Native layer.`}
        </p>
      </div>
      <div className={imageDivClass}>
        <WhoopLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p
          className={textClass}
        >{`Played a critical role in the rearchitecturing and debugging of the Whoop Fitness Strap's BLE module for the Android mobile application. 
        Assisted in the design of a dynamic i18n textual content management solution, wrote crucial unit/integration/E2E test to ensure software integrity 
        and Gradle build scripting.`}</p>
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
          {`Authored the React code that powers `}
          <a className={linkClass} href="https://www.cyberdata.net/">
            CyberData.Net's
          </a>
          {` multi-tenant partner platform for enabling various audio hardware tools.`}
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
          {`Played a critical role in the authoring of two synergistic cross-platform security applications. The `}
          <a
            className={linkClass}
            href="https://play.google.com/store/apps/details?id=com.s2sys.mobilesecurityprofessional.qa&utm_source=na_Med"
          >
            Mobile Security Professional App
          </a>
          {` that enables the management of on-site facility security checkpoints and user access, and the `}
          <a
            className={linkClass}
            href="https://play.google.com/store/apps/details?id=com.utc.lenel.bluediamond&utm_source=na_Med"
          >
            Mobile Security User App
          </a>
          {` that enables personnel to gain access to protected facilities and areas.`}
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
          {`Lead development of the initial `}
          <a
            className={linkClass}
            href="https://play.google.com/store/search?q=innr&c=apps&utm_source=na_Med"
          >
            Innr Lighting App.
          </a>
          {` The application communicated with various IoT enabled lighting systems to control various aspects of lighting systems,
          such as timing, duration, intensity, zones and color.`}
        </p>
      </div>
    </div>
  );
}

{
  /* <div className={imageDivClass}>
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
          {`Played a crucial role in creating Native Voice's proof-of-concept and alpha 
          release proprietary custom wake-word voice recognition technology. This included intimate 
          hands-on experience with the Alexa C++ SDK, Java JNI and Google gRPC.`}
        </p>
      </div>
<div className={imageDivClass}>
        <FujitsuLogo width={150} height={150} />
      </div>
      <div className={textDivClass}>
        <p className={textClass}>
          {`Authored critical IoT software components and test for Fujitsu's Android client that \
          interfaces with Zigbee IoT controlers.`}
        </p>
      </div> */
}
