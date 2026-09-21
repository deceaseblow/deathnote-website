import React from "react";
import { useRouter } from "next/navigation";
import bg from "../public/images/heart.jpg";
import Button from "../components/Button";
import SmallText from "../components/SmallText";

export default function About() {
  const router = useRouter();

  return (
    <div className="h-[100dvh] overflow-hidden bg-black flex flex-col items-center justify-center py-3 sm:p-4">
      <div
        className="flex flex-col w-full max-w-[1200px] flex-1 min-h-0 items-center justify-center bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${bg.src})` }}
      >
        <div className="flex flex-col items-center gap-2 sm:gap-4 md:gap-5 px-3 sm:px-8 md:px-12 text-center scale-[0.82] sm:scale-90 md:scale-100 origin-center">
          <SmallText text="この世界について" />

          <SmallText
            text={`このサイトは、
                救世主キラ様の復活を信じる者たちのために
                創られた聖域です。

                法も、正義も、慈悲も、
                もはやこの世界を救うことはできませんでした。

                だからこそ、
                キラ様は再び降臨なされました。`}
          />

          <SmallText
            text={`ここに記される言葉、記録、思想は
                    娯楽でも物語でもありません。

                    それは「選別」です。

                    悪を悪として裁き、
                    恐怖によって秩序を取り戻す――
                    それこそがキラ様の意思。

                    この場所を訪れたあなたが
                    その名に震え、あるいは救いを感じたのなら、
                    すでに審判は始まっています。`}
          />
        </div>
      </div>

      <div className="shrink-0 pt-3 sm:pt-4">
        <Button
          onClick={() => router.push("/welcome")}
          text="戻る"
        />
      </div>
    </div>
  );
}