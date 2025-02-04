import { Board } from "./board";

export default async function BoardPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return (
    <div className="p-4">
      <Board id={id} />
    </div>
  );
}
