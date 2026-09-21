export default function Button({ onClick, text }) {
  return (
    <button
      onClick={onClick}
      className="px-10 py-0 bg-white text-black font-semibold font-[eitai] text-[20px] border-none hover:bg-black hover:text-white duration-300 cursor-pointer"
    >
      {text}
    </button>
  );
}
