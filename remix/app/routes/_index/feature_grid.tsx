import styles from "@/routes/_index/_index.module.css";

const cardData = [
  {
    id: 1,
    title: "Immersive Conversations",
    content:
      "Step into an enchanting realm of interactive storytelling, " +
      "where you can engage in deep conversations with AI-driven characters. " +
      "Flirt, connect, and experience the thrill of building unique bonds with " +
      "characters who will always be there for you.",
    source: "/images/image19.jpeg",
  },
  {
    id: 2,
    title: "Image-Chat Fusion",
    content:
      "Effortlessly generate vivid images from any chat. " +
      "Initiate engaging chats from any image. We're the first to offer this seamless integration of " +
      "image-driven chats and chat-inspired imagery, creating an unparalleled, immersive experience.",
    source: "/images/image16.jpeg",
  },
  {
    id: 3,
    title: "Images and Text",
    content:
      "Be whoever " +
      "you wish to be. Customize your digital avatar, tailoring every aspect to match your desired identity." +
      "Explore conversations from a new perspective or simply enjoy the thrill of" +
      "embodying a different persona. Our platform offers the flexibility and freedom to redefine who the AI perceives you as.",
    source: "/images/image20.jpeg",
  },
];

const FeatureGrid = () => {
  return (
    <div className="box-border grid h-full w-full columns-2 grid-cols-1 gap-[30px] px-[20px] md:grid-cols-2 lg:grid-cols-3">
      {cardData.map((card) => (
        <div
          key={card.id}
          className="flex justify-center rounded-xl border border-[var(--secondary-light)] bg-[var(--secondary-dark)] p-[10%] text-center shadow-lg transition hover:border-[var(--primary-accent)] hover:shadow-2xl"
        >
          <div className="align-center flex h-full flex-col ">
            <img src={card.source} alt="" />
            <h1 className="font-[Geist-Bold] text-2xl text-[var(--primary-light)] ">
              {card.title}
            </h1>
            <p className="pt-0 text-start text-white">{card.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureGrid;
