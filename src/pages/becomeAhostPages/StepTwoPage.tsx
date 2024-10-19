import { useSearchParams } from "react-router-dom";
import homeVideo from "../../assets/add-listing-video-2.mp4";
import { useEffect } from "react";

function StepTwoPage() {
  const [, setSearchParams] = useSearchParams();
  useEffect(() => setSearchParams({ step: "stepTwo" }), []);
  return (
    <main className="h-screen p-10 sm:px-20 items-center justify-center">
      <div className="flex items-center justify-center mx-auto flex-col lg:flex-row">
        <section className="space-y-8 max-w-[700px]">
          <p className="text-lg font-[500]">Step 2</p>
          <h1 className="text-5xl font-[500]">Make your place stand out</h1>
          <p className="text-lg">
            In this step, you’ll add some of the amenities your place offers,
            plus 5 or more photos. Then, you’ll create a title and description.
          </p>
        </section>
        <section className="">
          <video
            src={homeVideo}
            className="h-full w-full "
            autoPlay
            muted
          ></video>
        </section>
      </div>
    </main>
  );
}

export default StepTwoPage;
