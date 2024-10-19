import { useSearchParams } from "react-router-dom";
import homeVideo from "../../assets/add-listing-video-1.mp4";
import { useEffect } from "react";

function StepOnePage() {
  let [, setSearchParams] = useSearchParams();

  useEffect(() => setSearchParams({ step: "stepOne" }), []);

  return (
    <main className="h-screen p-10 sm:px-20 items-center justify-center ">
      <div className="flex items-center justify-center mx-auto flex-col lg:flex-row">
        <section className="space-y-8 max-w-[700px]">
          <p className="text-lg font-[500]">Step 1</p>
          <h1 className="text-5xl font-[500]">Tell us about your place</h1>
          <p className="text-lg">
            In this step, we'll ask you which type of property you have and if
            guests will book the entire place or just a room. Then let us know
            the location and how many guests can stay.
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

export default StepOnePage;
