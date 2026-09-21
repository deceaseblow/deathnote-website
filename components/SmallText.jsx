export default function SmallText({ text }) {
  return (
    <h3
      className="eitai text-center text-[28px] max-w-[660px]"
      style={{
        color: 'white',
        WebkitTextStroke: '1px black',
        WebkitTextFillColor: 'white',
        textStroke: '1px black',
        margin: 0,
        padding:0
      }}
    >
      {text}
    </h3>
  );
}
