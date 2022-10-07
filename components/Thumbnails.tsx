import { ModelInfo } from "@customTypes/model";
import { AddUnit } from "@libs/client/Util";
import Image from "next/image";
import Link from "next/link";
import { increaseView } from "pages/models/[id]";
import { useState } from "react";

function Thumbnails({
  loading,
  modelInfos,
  devMode = false,
}: {
  loading: boolean;
  modelInfos?: ModelInfo[];
  devMode?: boolean;
}) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {!loading && modelInfos ? (
        modelInfos.map((info, i) => (
          <Link key={i} href={`/models/${info.id}`}>
            <div className="flex flex-col relative cursor-pointer">
              <div className="block  aspect-[4/3] relative rounded-lg shadow-md">
                <Image
                  src={info.thumbnailSrc ? info.thumbnailSrc : "/cube.png"}
                  alt={info.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col ">
                <p className="mt-2 text-gray-900 truncate">{info.name}</p>
                <div className="flex justify-between">
                  <span className="block my-auto text-gray-500 truncate">
                    {AddUnit(info.modelSize) + "B"}
                  </span>
                  <div className="flex space-x-2 truncate">
                    <IconWithCounter
                      current={info.viewed}
                      imageAttributes={{
                        src: "/views.png",
                        alt: "views",
                        layout: "responsive",
                        height: 30,
                        width: 30,
                      }}
                      devOption={{
                        devMode: devMode,
                        increaseServerCounter: () => {
                          increaseView(info.id);
                        },
                      }}
                    />
                    <IconWithCounter
                      current={info._count.Comment}
                      imageAttributes={{
                        src: "/comment.png",
                        alt: "comments",
                        layout: "responsive",
                        height: 30,
                        width: 30,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}

export default Thumbnails;

const IconWithCounter = ({
  current,
  imageAttributes,
  devOption,
}: {
  current: number;
  imageAttributes: ImageAttributes;
  devOption?: { devMode: boolean; increaseServerCounter: any };
}) => {
  const [counter, setCounter] = useState(0);
  const { alt, ...attributesWithoutAlt } = imageAttributes;
  return (
    <div
      className="flex relative space-x-1 mr-2"
      onClick={(e) => {
        if (devOption?.devMode) {
          devOption?.increaseServerCounter();
          setCounter((prev) => prev + 1);
          e.stopPropagation();
        }
      }}
    >
      <div className="w-6 mr-1">
        <Image alt={alt} {...attributesWithoutAlt}></Image>
      </div>
      <span className="my-auto text-gray-500 truncate">
        {AddUnit(current + counter) ?? 0}
      </span>
    </div>
  );
};

interface ImageAttributes {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout: "responsive" | "fill" | "fixed";
}
