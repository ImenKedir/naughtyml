import { Character } from "drizzle/model";
import { useSubmit } from "@remix-run/react";
import { formatS3ImageUrl } from "@/utils/s3";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

export function CharacterCard({
  id,
  name,
  title,
  greeting,
  image,
  bucket,
}: Character & { bucket: string }) {
  const submit = useSubmit();

  function handleClick() {
    const formData = new FormData();

    formData.append("characterId", id);
    formData.append("name", name);
    formData.append("greeting", greeting);

    submit(formData, { method: "post" });
  }

  return (
    <div
      className=" flex w-full flex-col items-center justify-center"
      onClick={handleClick}
    >
      <div className="aspect-w-1 aspect-h-1 w-full">
        <Card
          className="px-auto flex h-auto w-full flex-col justify-center border border-[var(--quadrary-dark)] bg-[var(--primary-dark)]  pb-0 text-white "
          key={id}
        >
          <CardHeader className="px-0 py-0">
            <img
              src={formatS3ImageUrl(image, bucket, "md")}
              alt=""
              className="max-h-[350px] rounded-t-xl object-cover"
            />
          </CardHeader>
          <CardContent className="flex h-36 flex-col items-start justify-start px-3 pt-2 text-left">
            <CardTitle className="flex w-full flex-row items-center justify-between pt-2">
              <div className=" ">{name}</div>
              <div className="rounded-xl border border-slate-600 px-2 py-1 font-[Geist-Thin] text-xs">
                25.4k
              </div>
            </CardTitle>
            <p className="pt-3 text-xs text-gray-300">{title}</p>
            <p className="pt-5 text-xs sm:pb-1">@creator </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
