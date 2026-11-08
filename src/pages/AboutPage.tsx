import Prompt from "../components/Prompt";

export default function AboutPage() {
  return (
    <>
      <Prompt cmd="whoami" />
      <p>Hi, I'm Autumn. This is where I write about Linux, code and whatever else.</p>
    </>
  );
}
