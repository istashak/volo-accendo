import BoseLogo from "@/public/bose-logo.svg";
import NuSkinLogo from "@/public/nu-skin-logo.svg";
import WhoopLogo from "@/public/whoop-logo.svg";
import WinnebagoLogo from "@/public/winnebago-logo.svg";
import { getSizedImage } from "./utils";

export default function Page() {
  return (
    <div>
      <p className="text-center text-2xl font-bold">
        Volo Accendo, a software development company that specializes in
        building custom software solutions for businesses.
      </p>
      <div className="flex items-center justify-evenly">
        {getSizedImage({
          src: "/bwell-logo.webp",
          alt: "b.well Logo",
          containerWidth: 200,
          imageWidth: 250,
          imageHeight: 150,
        })}
        {getSizedImage({
          src: "/crane-logo.png",
          alt: "Crane Logo",
          containerWidth: 200,
          imageWidth: 300,
          imageHeight: 161,
        })}
        <BoseLogo width={200} height={200} />
        <WinnebagoLogo width={200} height={200} />
      </div>
      <div className="flex items-center justify-evenly mt-0">
        {getSizedImage({
          src: "/native-voice-logo.png",
          alt: "Native Voice Logo",
          containerWidth: 200,
          imageWidth: 100,
          imageHeight: 100,
        })}
        <WhoopLogo width={200} height={50} />
        <NuSkinLogo width={200} height={200} />
      </div>
      <div className="flex items-center justify-evenly mb-4">
        {getSizedImage({
          src: "/lenel-logo.png",
          alt: "Lenel Logo",
          containerWidth: 200,
          imageWidth: 2339,
          imageHeight: 400,
        })}
        {getSizedImage({
          src: "/innr-logo.jpg",
          alt: "innr Logo",
          containerWidth: 200,
          imageWidth: 315,
          imageHeight: 145,
        })}
        {getSizedImage({
          src: "/cyber-data-logo.png",
          alt: "CyberData Logo",
          containerWidth: 200,
          imageWidth: 612,
          imageHeight: 188,
        })}
        {getSizedImage({
          src: "/fujitsu-logo.png",
          alt: "Fujitsu Logo",
          containerWidth: 200,
          imageWidth: 500,
          imageHeight: 235,
        })}
      </div>
    </div>
  );
}
