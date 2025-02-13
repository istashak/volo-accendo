import Image from "next/image";

export type SizedImageParams = {
  src: string;
  alt?: string;
  containerWidth: number;
  imageWidth: number;
  imageHeight: number;
};

export const getSizedImage = ({
  src,
  alt,
  containerWidth,
  imageWidth,
  imageHeight,
}: SizedImageParams) => {
  return (
    <div
      style={{
        position: "relative",
        width: containerWidth,
        aspectRatio: `${imageWidth}/${imageHeight}`,
      }}
    >
      <Image
        src={src}
        alt={alt ?? "Default alt text"}
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};
