import React from "react";
import { getSizedImage } from "../utils";

const pClassName = "mb-4 text-left text-xl";
export default function Page() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div>
        {getSizedImage({
          src: "/me.jpg",
          alt: "Ivan Stashak",
          containerWidth: 200,
          imageWidth: 200,
          imageHeight: 200,
        })}
      </div>
      <div className="col-span-3">
        <p className={pClassName}>
          {`Hi, I'm Ivan Stashak the founder and sole proprietor of Volo Accendo Inc. I started my software development 
        career in 2004 creating mobile apps for a small startup, 9 Squared, out of Denver CO. In the old days, 
        prior to Android devices and the iPhone, we wrote C/C++ code for Qualcomm's 
        Binary Runtime Environment for Wireless (BREW) chips, which was the platform for most of the phones at the time.`}
        </p>
        <p className={pClassName}>
          {`Within a few years though, a whole new mobile device experience blossomed with the release of Android and iOS devices.
        Embracing these new platforms, and leveraging my expertise of coding for small devices, my career took a
        turn from corporate code monkey, to mobile contract software developer. Thusly, Volo Accendo Inc was born!`}
        </p>
        <p className={pClassName}>
          {`Over the years I've created a multitude of mobile applications for both Android and iOS, and have gained hands on experience 
        working teams large and small. Aside from the UI/UX aspects of mobile development, developing the technology behind the
        scenes that brings functionality to life has been a great joy. Bluetooth, Voice Recognition, hardware integration, R-n-D, 
        along with Database and API integration and a solid test driven approach have been the sources of intellectual fulfillment 
        that have enriched my career.
        `}
        </p>
      </div>
    </div>
  );
}
