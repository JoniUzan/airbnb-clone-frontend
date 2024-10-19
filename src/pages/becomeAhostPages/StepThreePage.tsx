import  { useEffect } from "react";
import homeVideo from "../../assets/add-listing-video-3.mp4";
import { useSearchParams } from "react-router-dom";

function StepThreePage() {
  const [, setSearchParams] = useSearchParams();
  useEffect(() => setSearchParams({ step: "stepThree" }), []);
  return (
    <main className="h-screen px-10 sm:px-20 items-center justify-center">
      <div className="flex items-center justify-center mx-auto flex-col lg:flex-row ">
        <section className="space-y-8 max-w-[700px]">
          <p className="text-lg font-[500]">Step 3</p>
          <h1 className="text-5xl font-[500]">Finish up and publish</h1>
          <p className="text-lg">
            Finally, you'll choose booking settings, set up pricing, and publish
            your listing.
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

export default StepThreePage;
