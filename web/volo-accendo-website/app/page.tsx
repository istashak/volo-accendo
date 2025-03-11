import BoseLogo from "@/public/bose-logo.svg";
import FujitsuLogo from "@/public/fujitsu-logo.svg";
import NuSkinLogo from "@/public/nu-skin-logo.svg";
import WhoopLogo from "@/public/whoop-logo.svg";
import WinnebagoLogo from "@/public/winnebago-logo.svg";
import { getSizedImage } from "./utils";

const divClassName = "p-6 rounded-lg shadow-lg";
const pClassName = "text-center text-2xl";

export default function Page() {
  return (
    <div>
      <div className={divClassName}>
        <p className={pClassName}>
          Introducing Volo Accendo, a software development company that
          specializes in building custom software solutions. Our expertise is
          wide ranging in the areas of mobile, web and cloud. Below is a quick
          peak at some of our more high profile clients that have relied on us
          to deliver robust technological solutions.
        </p>
        <div className="flex items-center justify-evenly pt-4">
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
          <BoseLogo width={150} height={150} />
          <WinnebagoLogo width={150} height={150} />
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
          <FujitsuLogo width={200} height={200} />
        </div>
      </div>
      <div className={divClassName}>
        <p className={pClassName}>{`Areas of Expertise`}</p>
        <p className="text-center text-xl mt-5">{`Mobile`}</p>
        <p className="text-center text-lg mt-3">{`Cross Platform Mobile Development -> React Native / Turbo Modules 
        -> JavaScript / TypeScript -> Native Code -> Android / iOS -> Java / Kotlin / Objective-C / Swift -> MVVM Architectures 
        -> JetPack / SwiftUI / RetroFit / SwiftData -> Dependency Injection -> Dagger / Koin / Resolver / Swinject`}</p>
        <p className="text-center text-xl mt-5">{`Web`}</p>
        <p className="text-center text-lg mt-3">{`React -> JavaScript / TypeScript -> Next.js / React Navigation 
        -> UI / UX -> Tailwind / React Bootstrap / Daisy -> Data Stores -> Zustand / Redux / MobX`}</p>
        <p className="text-center text-xl mt-5">{`Cloud`}</p>
        <p className="text-center text-lg mt-3">{`AWS / Azure / Google Cloud -> Terraform / Serverless
        -> Lambda / S3 / Cognito / EC2 / DynamoDB / PostgreSQL / AppSync / CloudFront / CloudWatch / Active Directory`}</p>
        <p className="text-center text-xl mt-5">{`Testing`}</p>
        <p className="text-center text-lg mt-3">{`Unit Testing / Instrumentation Testing / Integration Testing / E2E Testing 
        -> Jest / React Testing Library / JUnit / Mockk / XCTest / KoinTest / React Test Renderer / Detox / Cypress / Postman`}</p>
      </div>
    </div>
  );
}
