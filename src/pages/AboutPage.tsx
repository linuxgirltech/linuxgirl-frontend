import Prompt from "../components/Prompt";

export default function AboutPage() {
  const socials = [
    {name: "github", label: "github.com/linuxgirltech", href: "https://github.com/linuxgirltech"},
    {name: "bluesky", label: "@linuxgirl.tech", href: "https://bsky.app/profile/linuxgirl.tech"},
    {name: "linkedin", label: "linkedin.com/in/linuxtechgirl", href: "https://www.linkedin.com/in/linuxtechgirl/"},
  ];
  return (
    <>
      <Prompt cmd="whoami" />
      <p>Hi, I'm Autumn. This is where I write about Linux, code and a little bit of everything else.</p>
      <p>There's a good chance that I will be writing a decent bit about Rust Programming, since I have an interest in doing things 
        with the language, and I love that it's a low-level language that's memory-safe. I am a self-taught programmer and have been 
        doing it for the last 6-7 years.</p>
      <p>I currently live in Denver Colorado with my wife and service dog, Strider. When I am not at my computer I can be found in the garden
        or in the mountains.
      </p>
      
      <Prompt cmd="ls ~/socials" />
      <ul className="socials">
        {socials.map((social) => (
          <li key={social.name}>
            <span className="social-name">{social.name}</span>{" "}
            <a href={social.href} target="_blank" rel="me nooopener noreferrer">{social.label}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
