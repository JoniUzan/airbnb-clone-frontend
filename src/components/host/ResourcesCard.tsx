import { Card, CardContent, CardFooter } from "@/components/ui/card";
function ResourcesCard({ img, text }: { img: string; text: string }) {
  return (
    <div>
      <Card className="md:h-[420px] xl:h-[420px]">
        <CardContent className="m-0 p-0">
          <img src={img} alt="" />
        </CardContent>
        <CardFooter className="flex justify-between py-10 text-lg font-500">
          <p>{text}</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ResourcesCard;
