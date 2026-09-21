export default function BigText({ text }) {
  return (
    <h3
      className="m-0 eitai text-center text-[60px] max-w-[500px]"
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
