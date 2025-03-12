import { render } from "@testing-library/react";
import { getSizedImage, SizedImageParams } from "../image-helpers";

describe("getSizedImage", () => {
  const defaultParams: SizedImageParams = {
    src: "/test-image.jpg",
    alt: "Test image",
    containerWidth: 200,
    imageWidth: 400,
    imageHeight: 300,
  };

  it("should render an image with correct container dimensions", () => {
    const { container } = render(getSizedImage(defaultParams));
    const div = container.firstChild as HTMLElement;

    expect(div.style.width).toBe("200px");
    expect(div.style.aspectRatio).toBe("400/300");
    expect(div.style.position).toBe("relative");
  });

  it("should render an image with correct alt text", () => {
    const { container } = render(getSizedImage(defaultParams));
    const img = container.querySelector("img");

    expect(img).toHaveAttribute("alt", "Test image");
  });

  it("should use default alt text when not provided", () => {
    const paramsWithoutAlt: SizedImageParams = {
      ...defaultParams,
      alt: undefined,
    };
    const { container } = render(getSizedImage(paramsWithoutAlt));
    const img = container.querySelector("img");

    expect(img).toHaveAttribute("alt", "Default alt text");
  });

  it("should handle different aspect ratios", () => {
    const wideImage: SizedImageParams = {
      ...defaultParams,
      imageWidth: 1000,
      imageHeight: 500,
    };
    const { container: wideContainer } = render(getSizedImage(wideImage));
    const wideDiv = wideContainer.firstChild as HTMLElement;
    expect(wideDiv.style.aspectRatio).toBe("1000/500");

    const tallImage: SizedImageParams = {
      ...defaultParams,
      imageWidth: 500,
      imageHeight: 1000,
    };
    const { container: tallContainer } = render(getSizedImage(tallImage));
    const tallDiv = tallContainer.firstChild as HTMLElement;
    expect(tallDiv.style.aspectRatio).toBe("500/1000");
  });

  it("should handle different container widths", () => {
    const largeContainer: SizedImageParams = {
      ...defaultParams,
      containerWidth: 500,
    };
    const { container: largeContainerEl } = render(
      getSizedImage(largeContainer)
    );
    const largeDiv = largeContainerEl.firstChild as HTMLElement;
    expect(largeDiv.style.width).toBe("500px");

    const smallContainer: SizedImageParams = {
      ...defaultParams,
      containerWidth: 100,
    };
    const { container: smallContainerEl } = render(
      getSizedImage(smallContainer)
    );
    const smallDiv = smallContainerEl.firstChild as HTMLElement;
    expect(smallDiv.style.width).toBe("100px");
  });
});
