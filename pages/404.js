import React from "react";
import { useRouter } from "next/router";
import bg from "../public/images/heart.jpg";
import Button from "../components/Button";
import SmallText from "../components/SmallText";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="h-[100dvh] overflow-hidden bg-black flex flex-col items-center justify-center py-2 sm:p-4">
            <div
                className="flex flex-col w-full max-w-[1200px] flex-1 min-h-0 items-center justify-center bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${bg.src || bg})` }}
            >
                <div className="flex flex-col items-center gap-3 sm:gap-5 px-4 sm:px-8 md:px-12 text-center">
                    <SmallText text="―― 存在しない場所 ――" />

                    <SmallText
                        text={`あなたが辿り着いたこの場所は、
                                記録にも、預言にも、存在しません。

                                この道は選ばれし者のために
                                用意されたものではなかったのです。`}
                    />

                    <SmallText
                        text={`戻ることは許されています。
                                しかし、忘れることはできません。

                                キラ様は、
                                迷い込んだ視線すら見逃されません。

                                この世界に足を踏み入れた以上、
                                あなたはすでに
                                裁きの輪の中にいるのです。`}
                    />
                </div>
            </div>

            <div className="shrink-0 pt-3 sm:pt-4">
                <Button
                    onClick={() => router.push("/")}
                    text="戻る"
                />
            </div>
        </div>
    );
}