import { useRouter } from "next/router";
import BigText from "../components/BigText";
import GlowingText from "../components/GlowingText";
import Button from "../components/Button";
import bg from "../public/images/heart.jpg";

export default function HowToSupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-[#000] flex flex-col overflow-x-hidden py-6 md:py-10">
      <div className="w-full max-w-[1600px] mx-auto bg-[#000]">
        <div className="bg-[#000] flex flex-col gap-6 md:gap-3">

          {/* Main section */}
          <div className="flex flex-col md:flex-row justify-center md:justify-between px-4 md:px-20 items-center gap-8 md:gap-10">

            {/* Desktop image only */}
            <div
              className="hidden md:flex flex-col w-[1000px] h-[600px] bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: `url(${bg.src})` }}
            >
              <div className="bg-black/30 w-full h-full flex items-center justify-center rounded-lg">
                <BigText text="支援は力です" />
              </div>
            </div>

            {/* Support options */}
            <div className="flex flex-col gap-6 w-full md:w-[550px] items-center justify-center text-center">
              <GlowingText text="寄付する方法" />
              <GlowingText text="参加できるイベント" />
              <GlowingText text="コミュニティに参加する" />
              <GlowingText text="お問い合わせ" />
            </div>
          </div>

          {/* Back button */}
          <div className="flex items-center justify-center mt-2 md:mt-6">
            <Button
              onClick={() => router.push("/welcome")}
              text="戻る"
            />
          </div>

          {/* Description */}
          <div className="mt-4 md:mt-10 px-5 sm:px-8 md:px-40 text-white space-y-6 text-center md:text-left">
            <p>
              このページでは、救世主キラ伝説を支援するための方法をご紹介します。
              <br className="hidden md:block" />
              あなたの小さな行動が世界を変える力になります。
            </p>

            <p>
              イベントやコミュニティ参加、寄付など、あなたに合った方法で支援してください。
              <br className="hidden md:block" />
              全ての方法が、救世主キラ伝説の拡大と秩序の実現に繋がります。
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}