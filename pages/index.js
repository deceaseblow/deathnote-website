import { useRouter } from "next/router";
import Text from "../components/Text";
import BigText from "../components/BigText";
import NormalText from "../components/NormalText";
import bg from "../public/images/heart.jpg";
import Button from "../components/Button";

export default function HomePage() {
    const router = useRouter();

    return (
        <div className="h-[100dvh] overflow-hidden bg-[#000] flex flex-col items-center justify-center py-2 sm:p-4">
            <div
                className="flex flex-col w-full max-w-[1200px] flex-1 min-h-0 items-center justify-center gap-8 sm:gap-12 md:gap-20 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${bg.src})` }}
            >
                <div className="flex flex-col items-center gap-4 sm:gap-5 text-center px-4 sm:px-8">
                    <BigText text="救世主キラ伝説" />

                    <Text
                        text={`世界の犯罪者が次々と
                                    消えているのは
                                    キラ様が復活なされたからで
                                    キラ様とは世の悪を絶対に許さない
                                    地獄よりの使者です。`}
                    />

                    <NormalText
                        text={`キラ様の復活を信じる者のみ
                                    この入口からお入り下さい`}
                    />
                </div>
            </div>

            <div className="shrink-0 pt-3 sm:pt-4">
                <Button
                    onClick={() => router.push("/welcome")}
                    text="ENTER"
                />
            </div>
        </div>
    );
}