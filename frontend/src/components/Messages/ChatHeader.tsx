import { useGetUserByIdQuery } from "@/redux/api/userApi";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton"; // import Skeleton

const ChatHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("friend");

  const { data, isLoading } = useGetUserByIdQuery(id as string, {
    skip: !id,
  });

  const handleClearFriendId = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("friend");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  if (isLoading) {
    // Skeleton loader
    return (
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-24 h-3 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const friendData = data?.data;
  return (
    <div className="border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={handleClearFriendId}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="relative">
          <Avatar className="w-10 h-10 shadow-md">
            <AvatarImage src={friendData?.profile || ""} alt="profile" />
            <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground font-medium uppercase">
              {friendData?.fullName?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">
            {friendData?.fullName}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
