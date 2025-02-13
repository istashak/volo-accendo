import React from "react";
import { getSizedImage } from "../utils";

export default function Page() {
  return (
    <div className="flex flex-row items-center justify-center">
      {getSizedImage({
        src: "/me.jpg",
        alt: "Ivan Stashak",
        containerWidth: 200,
        imageWidth: 200,
        imageHeight: 200,
      })}
      <p className="mb-4 text-left text-xl">
        Volo Accendo Inc. is the creation of Ivan Stashak, a software developer
        that started his professional career in 2004. After working in the
        corporate world for six years, Ivan created Volo Accendo
      </p>
    </div>
  );
}
