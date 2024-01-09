import {
  PlusIcon,
  GearIcon,
  GlobeIcon,
  ChatBubbleIcon,
  DoubleArrowLeftIcon,
} from "@radix-ui/react-icons";
import { Link, NavLink } from "@remix-run/react";
import { useNavStore } from "@/hooks/useNavStore";
import { formatISOToDayAndHour } from "@/utils/date";
import { cn } from "@/utils/cn";

function IconWrapper(Icon: typeof GearIcon) {
  return function (active: boolean) {
    return <Icon color={active ? "black" : "white"} width={25} height={25} />;
  };
}

const NavItems = [
  {
    icon: IconWrapper(GlobeIcon),
    link: "/app/explore",
  },
  {
    icon: IconWrapper(ChatBubbleIcon),
    link: "/app/chats",
  },
  {
    icon: IconWrapper(PlusIcon),
    link: "/app/create",
  },
];

export function LeftSidebar() {
  const recentChats = useNavStore((state) => state.recentChats);
  const toggleLeftSidebar = useNavStore((state) => state.toggleLeftSidebar);

  return (
    <div className="fixed z-[1] flex h-full w-full flex-col bg-[var(--primary-dark)] md:relative md:w-[320px]">
      <header className="flex h-[50px] w-full items-center border-b-2 border-[var(--secondary-dark)] bg-[var(--primary-dark)] pl-4 ">
        <Link className="font-[Geist] text-2xl text-white" to="/">
          NaughtyML
        </Link>
        <DoubleArrowLeftIcon
          className="absolute right-0 mr-4 cursor-pointer md:hidden"
          color="white"
          width={20}
          height={20}
          onClick={() => toggleLeftSidebar()}
        />
      </header>
      <div className="flex h-full w-full pt-2">
        <div className="flex h-full w-[80px] flex-col items-center gap-4">
          {NavItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) =>
                cn(
                  "flex h-[40px] w-[40px] items-center justify-center rounded-full",
                  isActive && "bg-white",
                )
              }
            >
              {({ isActive }) => item.icon(isActive)}
            </NavLink>
          ))}
        </div>
        <div className="flex h-full w-full flex-col overflow-y-scroll text-white">
          {recentChats.map((chat) => {
            return (
              <div key={chat.id} className="w-full px-4 py-2">
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "flex w-full cursor-pointer flex-col items-start rounded p-2 font-[Geist]",
                      isActive && "bg-white text-black",
                    )
                  }
                  to={`/app/chat/${chat.character}/${chat.id}`}
                >
                  <h1 className="text-lg">{chat.title}</h1>
                  <p className="text-sm text-[var(--quadrary-dark)]">
                    {formatISOToDayAndHour(chat.created)}
                  </p>
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
