import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Home } from "@/layouts/BecomeAhostLayout";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AmenityKey, iconMap } from "../general-components/AmenityIconMap";
import { ScrollArea } from "../ui/scroll-area";

interface ReceiptDailogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newHome: Home;
}

function ReceiptDailog({ isOpen, setIsOpen, newHome }: ReceiptDailogProps) {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="sm:max-w-[70%] p-10">
          <DialogHeader>
            <DialogTitle className="text-center">Full preview</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Separator />
          <main className="lg:flex gap-12 ">
            {/* image */}
            <section>
              <img
                className="rounded-lg lg:h-[550px]"
                src={newHome.imgUrls[0]}
                alt=""
              />
            </section>
            {/* listing detailes */}
            <ScrollArea className=" h-80 lg:h-[550px] ">
              <section className="space-y-8 w-full">
                <h2 className="text-2xl font-500">{newHome.name}</h2>
                <Separator />
                <div className="flex justify-between">
                  <div className="text-md font-500">
                    <h3>
                      {newHome.roomType} in a {newHome.type}
                    </h3>
                    <h3>hosted by {newHome.host.fullname}</h3>
                  </div>
                  <Avatar className="mr-4">
                    <AvatarImage src={newHome.host.imgUrl} alt="@shadcn" />
                    <AvatarFallback>{newHome.host.fullname[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <Separator />
                <div>
                  <span>{newHome.capacity} guests • </span>
                  {newHome.bedrooms > 0 ? (
                    <span>{newHome.bedrooms} bedrooms • </span>
                  ) : (
                    <span>Studio •</span>
                  )}
                  <span>{newHome.beds} beds • </span>
                  <span>{newHome.bathrooms} bathrooms</span>
                </div>
                <Separator />
                <div>{newHome.summary}</div>
                <Separator />
                {/* Amenities */}
                <div className="space-y-6">
                  <h2 className="font-500 text-lg">Amenities</h2>
                  {newHome.amenities.map((amenity) => {
                    return (
                      <div>
                        <div className="flex justify-between mr-4 mb-6">
                          <span>{amenity}</span>
                          <span className="">
                            {iconMap[amenity as AmenityKey] || (
                              <div className="w-6 h-6" />
                            )}
                          </span>
                        </div>
                        <Separator />
                      </div>
                    );
                  })}
                </div>
                {/* Location */}
                <div className="space-y-4 ">
                  <h2 className="font-500 text-lg ">Location</h2>
                  <div className="space-x-2 space-y-2">
                    <span>{newHome.loc.country}</span>
                    <span>{newHome.loc.city}</span>
                    <span>{newHome.loc.address}</span>
                    <p className="text-xs text-gray-400">
                      We’ll only share your address with guests who are booked
                      as outlined in our privacy policy.
                    </p>
                  </div>
                </div>
              </section>
            </ScrollArea>
          </main>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ReceiptDailog;
