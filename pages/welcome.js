import { useRouter } from "next/router";
import Link from "next/link";
import BigText from "../components/BigText";
import GlowingText from "../components/GlowingText";
import Button from "../components/Button";
import bg from "../public/images/heart.jpg";
import AuthModal from "../components/AuthModal";
import { useState } from "react";

export default function WelcomePage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-[#000] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[1600px] bg-[#000]">
        <div className="bg-[#000] flex flex-col gap-6 md:gap-3">

          {/* Title */}
          <div className="w-full flex justify-center md:justify-start md:pl-80 font-bold">
            <BigText text="ようこそ 救世主キラ伝説へ" />
          </div>

          {/* Main content */}
          <div className="flex flex-col md:flex-row justify-center md:justify-between px-4 md:px-20 items-center gap-8 md:gap-10">

            {/* Desktop image only */}
            <div
              className="hidden md:flex flex-col w-[1000px] h-[600px] bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: `url(${bg.src})` }}
            >
              <div className="bg-black/30 w-full h-full flex items-center justify-center rounded-lg" />
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-6 w-full md:w-[550px] items-center justify-center">
              <Link href="/about">
                <GlowingText text="について" />
              </Link>

              <Link href="/blogs">
                <GlowingText text="ブログ" />
              </Link>

              <Link href="/news">
                <GlowingText text="ニュース" />
              </Link>

              <Link href="/how-to-support">
                <GlowingText text="サポート方法" />
              </Link>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col gap-3 items-center justify-center mt-4 md:mt-6 pb-4">
            <Button
              onClick={() => router.push("/")}
              text="戻る"
            />

            <AuthModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
            />
          </div>

        </div>
      </div>
    </div>
  );
} 